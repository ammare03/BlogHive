# Authentication Refactoring Summary

## Changes Made

### 1. Auth Service Changes
- **AuthResponse.java**: Removed JWT tokens (accessToken, refreshToken, tokenType, expiresIn) and kept only message and user info
- **AuthService.java**: 
  - Removed JWT dependencies and refresh token logic
  - Simplified login/register to return user info without tokens
  - Added simple authentication validation
- **AuthController.java**: 
  - Removed refresh and logout endpoints
  - Added `/validate` endpoint for service-to-service authentication
- **SecurityConfig.java**: Added `/validate` and `/users/**` to permitted endpoints
- **application.properties**: Removed JWT configuration
- **pom.xml**: Removed JWT dependencies

### 2. Post Service Changes
- **New DTOs Created**:
  - `AuthRequest.java`: Contains username and password for authentication
  - `CreatePostRequestWithAuth.java`: Combines post creation data with auth credentials
  - `UpdatePostRequestWithAuth.java`: Combines post update data with auth credentials
  - `DeletePostRequestWithAuth.java`: Contains auth credentials for deletion
  - `User.java`: Model for user information from auth service

- **AuthValidationService.java**: Service to validate credentials with auth service
- **PostController.java**: 
  - Updated all endpoints to accept auth credentials in request body
  - Removed JWT/SecurityContext usage
  - Added credential validation before each operation
- **AppConfig.java**: Removed security restrictions, allowing all requests
- **pom.xml**: Removed JWT dependencies

### 3. API Gateway
- No changes needed - routes remain the same

## How to Test with Postman

### 1. Register a User
```
POST http://localhost:8085/api/v1/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123"
}
```

Expected Response:
```json
{
    "message": "Registration successful",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "USER"
    }
}
```

### 2. Login
```
POST http://localhost:8085/api/v1/auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "password123"
}
```

Expected Response:
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com", 
        "role": "USER"
    }
}
```

### 3. Create a Post
```
POST http://localhost:8085/api/v1/posts
Content-Type: application/json

{
    "auth": {
        "username": "testuser",
        "password": "password123"
    },
    "title": "My First Post",
    "content": "This is the content of my first blog post.",
    "excerpt": "A brief excerpt"
}
```

### 4. Update a Post
```
PUT http://localhost:8085/api/v1/posts/1
Content-Type: application/json

{
    "auth": {
        "username": "testuser",
        "password": "password123"
    },
    "title": "Updated Post Title",
    "content": "Updated content",
    "excerpt": "Updated excerpt"
}
```

### 5. Delete a Post
```
DELETE http://localhost:8085/api/v1/posts/1
Content-Type: application/json

{
    "auth": {
        "username": "testuser",
        "password": "password123"
    }
}
```

### 6. Get Posts (No Authentication Required)
```
GET http://localhost:8085/api/v1/posts
```

## Key Changes in Authentication Flow

1. **Before**: Client sends Bearer token in Authorization header
2. **After**: Client sends username/password in request body for each operation

3. **Before**: JWT tokens validated by filters
4. **After**: Credentials validated by calling auth service for each request

5. **Before**: Token-based stateless authentication
6. **After**: Username/password authentication with each request

## Error Handling

- Invalid credentials will return `401 Unauthorized` status
- Missing auth information will return `400 Bad Request` status
- Auth service unavailable will return `401 Unauthorized` with error message

## Security Considerations

- Each request now requires username/password validation
- No tokens to expire or refresh
- Auth service becomes critical for all post operations
- Consider implementing rate limiting for credential validation
- In production, ensure HTTPS is used to protect credentials in transit