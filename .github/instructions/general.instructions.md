---
applyTo: "**"
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Microservice Development Instructions

This document defines how to build and structure each microservice for the blogging platform. Each microservice should exist in its **own project repository** and follow consistent standards. The goal is to ensure maintainability, scalability, and compatibility with the overall architecture.

---

## Project Setup

Each microservice should be a **Spring Boot 3.2+ application** (Java 17). Use **Maven** as build tool.

### Dependencies (baseline for all services)

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `spring-kafka`
- `spring-cloud-starter-netflix-eureka-client`
- `spring-cloud-starter-config`
- `spring-boot-starter-actuator`
- `micrometer-registry-prometheus`
- `resilience4j-spring-boot3`
- Database connector: `mysql-connector-j`
- Migration tool: **Flyway** or **Liquibase**

### Project Structure

```
com.example.<service-name>
 ├── controller     // REST Controllers
 ├── service        // Business logic
 ├── repository     // Spring Data JPA repositories
 ├── model/entity   // JPA entities
 ├── dto            // Request/response DTOs
 ├── config         // Security, Kafka, etc.
 └── event          // Kafka producers/consumers
```

### General Guidelines

- **One database schema per service** (MySQL).
- **No direct DB sharing across services.**
- Expose APIs under `/api/v1/...`.
- Implement **standard error handling** with `@ControllerAdvice`.
- Use **JWT authentication** (from Auth Service).
- Include **OpenAPI/Swagger** documentation.
- Follow **12-factor app** principles.

---

## Microservices List & Responsibilities

### 1. Auth Service (`auth-service`)

- Handles user registration, login, JWT issuance, refresh tokens.
- Entities: `User`, `RefreshToken`.
- Endpoints:

  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`

- Publishes **user events** (e.g., USER_REGISTERED).

### 2. User/Profile Service (`user-service`)

- Stores and manages profile data (bio, avatar, settings).
- Entities: `Profile`, `UserSettings`.
- Endpoints:

  - `GET /api/v1/users/{id}`
  - `PUT /api/v1/users/{id}`
  - `GET /api/v1/users/search?q=...`

- Publishes **user.updated** events.

### 3. Post Service (`post-service`)

- Core blog post domain.
- Entities: `Post`, `PostTag`, `PostStats`.
- Endpoints:

  - `GET /api/v1/posts`
  - `GET /api/v1/posts/{id}`
  - `POST /api/v1/posts`
  - `PUT /api/v1/posts/{id}`
  - `DELETE /api/v1/posts/{id}`

- Publishes **post.created**, **post.updated**, **post.deleted**.
- Implements **Outbox Pattern** for event publishing.

### 4. Comment Service (`comment-service`)

- Stores comments and moderation.
- Entities: `Comment`, `CommentVote`.
- Endpoints:

  - `POST /api/v1/comments`
  - `GET /api/v1/comments?postId=...`

- Publishes **comment.created** events.

### 5. Media Service (`media-service`)

- Handles image/file uploads and metadata.
- Entities: `Media`, `MediaProcessingJob`.
- Endpoints:

  - `POST /api/v1/media`
  - `GET /api/v1/media/{id}`

- Publishes **media.uploaded**, **media.processed** events.

### 6. Notification Service (`notification-service`)

- Manages in-app and external notifications.
- Entities: `Notification`, `EmailQueue`.
- Endpoints:

  - `GET /api/v1/notifications`
  - `POST /api/v1/notifications/mark-read`

- Consumes `post.created`, `comment.created`, `user.updated`.

---

## Communication Patterns

### Synchronous (REST)

- Use `RestTemplate` or `WebClient` for internal service calls.
- Example: Post Service → User Service to fetch profile info.

### Asynchronous (Kafka)

- Topics: `post-events`, `comment-events`, `media-events`, `user-events`, `notification-events`.
- Event format:

```json
{
  "eventType": "POST_CREATED",
  "entityId": 123,
  "payload": {...},
  "timestamp": "2025-09-11T10:00:00Z",
  "traceId": "abcd-1234"
}
```

---

## Observability & Security

- **Spring Boot Actuator** enabled (`/actuator/health`, `/actuator/metrics`).
- **Prometheus** metrics scraping.
- **Centralized logging** (JSON logs).
- **Distributed tracing** with Sleuth + Zipkin/OpenTelemetry.
- **Circuit breakers** and retries with Resilience4j.
- JWT validation in Gateway and downstream services.

---

## Database & Migration

- Each service maintains its own schema.
- Use **Flyway/Liquibase** for migrations.
- Example DB names:

  - `auth_db`
  - `user_db`
  - `post_db`
  - `comment_db`
  - `media_db`
  - `notification_db`

---

## Testing Strategy

- **Unit tests** (JUnit + Mockito).
- **Integration tests** with H2/Testcontainers.
- **Contract tests** between services (Pact).
- **Kafka tests** with embedded Kafka/Testcontainers.
- **End-to-end flows** simulated via API calls.

---

## Deployment & Config Management

- Each service registers with **Eureka Service Registry**.
- Config managed via **Spring Cloud Config Server**.
- Secrets managed outside of code (e.g., Vault, K8s Secrets).

---

## Checklist for Each Microservice

1. Scaffold Spring Boot project with required dependencies.
2. Configure application with Eureka + Config Server.
3. Define entities, repositories, DTOs, services, and controllers.
4. Add database migrations.
5. Implement CRUD operations.
6. Add Kafka producers/consumers.
7. Secure endpoints with JWT.
8. Add Actuator monitoring.
9. Write unit and integration tests.
10. Provide OpenAPI/Swagger documentation.

---

This file should be used as a blueprint by the coding agent to create each microservice project consistently.
