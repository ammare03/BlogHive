# BlogHive API URLs for Port 8085

Since your API Gateway runs on port **8085**, use these URLs for all your Postman testing:

## Auth Service URLs (through API Gateway)

### Register User
```
POST http://localhost:8085/api/v1/auth/register
```

### Login User  
```
POST http://localhost:8085/api/v1/auth/login
```

## Post Service URLs (through API Gateway)

### Create Post (Auth Required)
```
POST http://localhost:8085/api/v1/posts
```

### Get All Posts (Public)
```
GET http://localhost:8085/api/v1/posts
GET http://localhost:8085/api/v1/posts?page=0&size=10&sortBy=createdAt&sortDirection=desc
```

### Get Post by ID (Public)
```
GET http://localhost:8085/api/v1/posts/{id}
Example: GET http://localhost:8085/api/v1/posts/1
```

### Get Post by Slug (Public)
```
GET http://localhost:8085/api/v1/posts/slug/{slug}
Example: GET http://localhost:8085/api/v1/posts/slug/my-post-title
```

### Get Posts by Author (Public)
```
GET http://localhost:8085/api/v1/posts/author/{authorId}
Example: GET http://localhost:8085/api/v1/posts/author/1
```

### Search Posts (Public)
```
GET http://localhost:8085/api/v1/posts/search?keyword={keyword}
Example: GET http://localhost:8085/api/v1/posts/search?keyword=microservices
```

### Update Post (Auth Required)
```
PUT http://localhost:8085/api/v1/posts/{id}
Example: PUT http://localhost:8085/api/v1/posts/1
```

### Delete Post (Auth Required)  
```
DELETE http://localhost:8085/api/v1/posts/{id}
Example: DELETE http://localhost:8085/api/v1/posts/1
```

### Health Check (Public)
```
GET http://localhost:8085/api/v1/posts/health
```

## Quick Test Examples

### 1. Register and Login
```json
POST http://localhost:8085/api/v1/auth/register
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}

POST http://localhost:8085/api/v1/auth/login  
{
    "username": "testuser",
    "password": "password123"
}
```

### 2. Create a Post
```json
POST http://localhost:8085/api/v1/posts
{
    "auth": {
        "username": "testuser",
        "password": "password123"
    },
    "title": "My Test Post",
    "content": "This is test content",
    "excerpt": "Test excerpt"
}
```

### 3. Get All Posts
```
GET http://localhost:8085/api/v1/posts
```

### 4. Update Post  
```json
PUT http://localhost:8085/api/v1/posts/1
{
    "auth": {
        "username": "testuser", 
        "password": "password123"
    },
    "title": "Updated Title",
    "content": "Updated content"
}
```

### 5. Delete Post
```json
DELETE http://localhost:8085/api/v1/posts/1
{
    "auth": {
        "username": "testuser",
        "password": "password123"  
    }
}
```

## Important Notes

- **API Gateway Port**: 8085 (your configuration)
- **Auth Service Direct Port**: 8081 (for debugging only)
- **Post Service Direct Port**: 8082 (for debugging only)
- **Always use port 8085** for testing through the API Gateway
- All authenticated endpoints require `auth` object with username/password in request body
- Public endpoints (GET operations) don't require authentication

## Service Architecture
```
Client (Postman) → API Gateway (8085) → Auth Service (8081)
                                     → Post Service (8082) 
```

The API Gateway routes requests to the appropriate microservice based on the URL path.