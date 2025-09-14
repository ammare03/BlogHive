# Post Service Testing Guide - Complete Endpoint Testing

This guide covers testing all endpoints in the post-service using Postman with the new username/password authentication system.

## Prerequisites

1. **Start all services:**
   - Auth Service: `http://localhost:8081`
   - Post Service: `http://localhost:8082`
   - API Gateway: `http://localhost:8085`

2. **Create test users first** using the auth service endpoints

## Test User Setup

### 1. Register Test Users
```json
POST http://localhost:8085/api/v1/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```

```json
POST http://localhost:8085/api/v1/auth/register
Content-Type: application/json

{
    "username": "jane_smith", 
    "email": "jane@example.com",
    "password": "password456"
}
```

Expected Response:
```json
{
    "message": "Registration successful",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "USER"
    }
}
```

## Post Service Endpoint Testing

### 1. Create Posts (POST /api/v1/posts)

#### Test Case 1: Create First Post
```json
POST http://localhost:8080/api/v1/posts
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "password123"
    },
    "title": "Introduction to Microservices",
    "content": "Microservices architecture is a method of developing software systems that are made up of small, independent services that communicate over well-defined APIs. This approach has become increasingly popular due to its scalability and flexibility benefits.",
    "excerpt": "An introduction to microservices architecture and its benefits"
}
```

#### Test Case 2: Create Second Post
```json
POST http://localhost:8080/api/v1/posts
Content-Type: application/json

{
    "auth": {
        "username": "jane_smith",
        "password": "password456"
    },
    "title": "Spring Boot Best Practices",
    "content": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications. Here are some best practices to follow when developing Spring Boot applications.",
    "excerpt": "Essential best practices for Spring Boot development"
}
```

#### Test Case 3: Create Post with Invalid Credentials
```json
POST http://localhost:8080/api/v1/posts
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "wrongpassword"
    },
    "title": "This Should Fail",
    "content": "This post should not be created due to invalid credentials"
}
```
Expected: `401 Unauthorized`

#### Test Case 4: Create Post with Missing Auth
```json
POST http://localhost:8080/api/v1/posts
Content-Type: application/json

{
    "title": "This Should Fail Too",
    "content": "This post should not be created due to missing auth"
}
```
Expected: `400 Bad Request`

### 2. Get Posts (GET /api/v1/posts) - No Auth Required

#### Test Case 1: Get All Posts with Default Pagination
```
GET http://localhost:8080/api/v1/posts
```

#### Test Case 2: Get Posts with Custom Pagination
```
GET http://localhost:8080/api/v1/posts?page=0&size=5&sortBy=title&sortDirection=asc
```

#### Test Case 3: Get Posts with Different Sort Options
```
GET http://localhost:8080/api/v1/posts?page=0&size=10&sortBy=createdAt&sortDirection=desc
```

Expected Response Format:
```json
{
    "content": [
        {
            "id": 1,
            "title": "Introduction to Microservices",
            "content": "...",
            "excerpt": "...",
            "slug": "introduction-to-microservices",
            "authorId": 1,
            "authorUsername": "john_doe",
            "createdAt": "2025-09-14T...",
            "updatedAt": "2025-09-14T..."
        }
    ],
    "pageable": {
        "pageNumber": 0,
        "pageSize": 10
    },
    "totalElements": 2,
    "totalPages": 1,
    "first": true,
    "last": true
}
```

### 3. Get Post by ID (GET /api/v1/posts/{id}) - No Auth Required

#### Test Case 1: Get Existing Post
```
GET http://localhost:8080/api/v1/posts/1
```

#### Test Case 2: Get Non-Existent Post
```
GET http://localhost:8080/api/v1/posts/999
```
Expected: `404 Not Found`

### 4. Get Post by Slug (GET /api/v1/posts/slug/{slug}) - No Auth Required

#### Test Case 1: Get Post by Valid Slug
```
GET http://localhost:8080/api/v1/posts/slug/introduction-to-microservices
```

#### Test Case 2: Get Post by Invalid Slug
```
GET http://localhost:8080/api/v1/posts/slug/non-existent-slug
```
Expected: `404 Not Found`

### 5. Get Posts by Author (GET /api/v1/posts/author/{authorId}) - No Auth Required

#### Test Case 1: Get Posts by Existing Author
```
GET http://localhost:8080/api/v1/posts/author/1
```

#### Test Case 2: Get Posts by Author with Pagination
```
GET http://localhost:8080/api/v1/posts/author/1?page=0&size=5
```

#### Test Case 3: Get Posts by Non-Existent Author
```
GET http://localhost:8080/api/v1/posts/author/999
```

### 6. Search Posts (GET /api/v1/posts/search) - No Auth Required

#### Test Case 1: Search Posts by Keyword
```
GET http://localhost:8080/api/v1/posts/search?keyword=microservices
```

#### Test Case 2: Search Posts with Pagination
```
GET http://localhost:8080/api/v1/posts/search?keyword=Spring&page=0&size=5
```

#### Test Case 3: Search with No Results
```
GET http://localhost:8080/api/v1/posts/search?keyword=nonexistentkeyword
```

### 7. Update Post (PUT /api/v1/posts/{id})

#### Test Case 1: Update Own Post Successfully
```json
PUT http://localhost:8080/api/v1/posts/1
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "password123"
    },
    "title": "Introduction to Microservices - Updated",
    "content": "Microservices architecture is a method of developing software systems that are made up of small, independent services. This updated content includes more details about implementation strategies.",
    "excerpt": "An updated introduction to microservices architecture"
}
```

#### Test Case 2: Try to Update Another User's Post
```json
PUT http://localhost:8080/api/v1/posts/2
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "password123"
    },
    "title": "Trying to Update Jane's Post",
    "content": "This should fail because John is trying to update Jane's post"
}
```
Expected: `400 Bad Request` or `403 Forbidden`

#### Test Case 3: Update with Invalid Credentials
```json
PUT http://localhost:8080/api/v1/posts/1
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "wrongpassword"
    },
    "title": "This Should Fail",
    "content": "Invalid credentials"
}
```
Expected: `401 Unauthorized`

#### Test Case 4: Update Non-Existent Post
```json
PUT http://localhost:8080/api/v1/posts/999
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "password123"
    },
    "title": "Non-existent Post",
    "content": "This post doesn't exist"
}
```
Expected: `404 Not Found` or `400 Bad Request`

### 8. Delete Post (DELETE /api/v1/posts/{id})

#### Test Case 1: Delete Own Post Successfully
```json
DELETE http://localhost:8080/api/v1/posts/1
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "password123"
    }
}
```
Expected: `204 No Content`

#### Test Case 2: Try to Delete Another User's Post
```json
DELETE http://localhost:8080/api/v1/posts/2
Content-Type: application/json

{
    "auth": {
        "username": "john_doe",
        "password": "password123"
    }
}
```
Expected: `400 Bad Request` or `403 Forbidden`

#### Test Case 3: Delete with Invalid Credentials
```json
DELETE http://localhost:8080/api/v1/posts/2
Content-Type: application/json

{
    "auth": {
        "username": "jane_smith",
        "password": "wrongpassword"
    }
}
```
Expected: `401 Unauthorized`

#### Test Case 4: Delete Non-Existent Post
```json
DELETE http://localhost:8080/api/v1/posts/999
Content-Type: application/json

{
    "auth": {
        "username": "jane_smith",
        "password": "password456"
    }
}
```
Expected: `404 Not Found` or `400 Bad Request`

### 9. Health Check (GET /api/v1/posts/health) - No Auth Required

#### Test Case 1: Service Health Check
```
GET http://localhost:8080/api/v1/posts/health
```
Expected Response: `"Post Service is running"`

## Testing Workflow Recommendations

### 1. Complete Test Flow
1. Register 2-3 test users
2. Create 3-4 posts with different users
3. Test all GET endpoints (no auth required)
4. Test UPDATE operations (both success and failure cases)
5. Test DELETE operations (both success and failure cases)
6. Verify data consistency

### 2. Error Testing Scenarios
- Invalid credentials for all authenticated endpoints
- Missing auth information
- Trying to modify other users' posts
- Non-existent resource access
- Malformed request bodies

### 3. Edge Cases
- Very long post titles/content
- Empty strings in required fields
- Special characters in search queries
- Large page sizes in pagination
- Invalid sort parameters

## Expected HTTP Status Codes

| Operation | Success | Auth Failure | Not Found | Bad Request |
|-----------|---------|--------------|-----------|-------------|
| POST /posts | 201 Created | 401 Unauthorized | - | 400 Bad Request |
| GET /posts | 200 OK | - | - | 400 Bad Request |
| GET /posts/{id} | 200 OK | - | 404 Not Found | - |
| PUT /posts/{id} | 200 OK | 401 Unauthorized | 404 Not Found | 400 Bad Request |
| DELETE /posts/{id} | 204 No Content | 401 Unauthorized | 404 Not Found | 400 Bad Request |

## Troubleshooting Tips

1. **401 Unauthorized**: Check username/password combination
2. **400 Bad Request**: Verify request body format and required fields
3. **404 Not Found**: Confirm the resource exists
4. **Connection Refused**: Ensure all services are running on correct ports
5. **500 Internal Server Error**: Check service logs for detailed error information

This comprehensive testing guide covers all scenarios for the post-service endpoints. Make sure to test both success and failure cases to verify the authentication system works correctly!