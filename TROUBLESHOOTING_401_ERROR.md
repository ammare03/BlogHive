# Troubleshooting 401 Unauthorized Error

You're getting a 401 Unauthorized error when trying to create a post. Here's how to debug and fix this issue:

## Potential Issues and Solutions

### 1. **AuthValidationService URL Issue (MOST LIKELY)**

The `AuthValidationService` was calling the auth service directly on port 8081 instead of through the API Gateway on port 8085.

**Fix Applied**: Updated the URL in `AuthValidationService.java`:
```java
// OLD (incorrect)
private static final String AUTH_SERVICE_VALIDATE_URL = "http://localhost:8081/api/v1/auth/validate";

// NEW (correct) 
private static final String AUTH_SERVICE_VALIDATE_URL = "http://localhost:8085/api/v1/auth/validate";
```

### 2. **Verify Your Services Are Running**

Make sure all services are running on the correct ports:
```bash
# Check if services are running
netstat -an | findstr "8081"  # Auth Service
netstat -an | findstr "8082"  # Post Service  
netstat -an | findstr "8085"  # API Gateway
```

### 3. **Test Authentication Separately**

Before testing post creation, verify authentication works:

```json
POST http://localhost:8085/api/v1/auth/login
Content-Type: application/json

{
    "username": "user",
    "password": "password123"
}
```

Expected Response:
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "user", 
        "email": "user@example.com",
        "role": "USER"
    }
}
```

### 4. **Check User Registration**

Make sure the user was registered correctly:

```json
POST http://localhost:8085/api/v1/auth/register
Content-Type: application/json

{
    "username": "user",
    "email": "user@example.com",
    "password": "password123"
}
```

### 5. **Test the Validate Endpoint Directly**

Test if the internal validation endpoint works:

```json
POST http://localhost:8085/api/v1/auth/validate
Content-Type: application/json

{
    "username": "user",
    "password": "password123"
}
```

This should return user information if authentication is working.

### 6. **Check Service Logs**

Look at the console logs for each service to see error messages:

- **Auth Service (8081)**: Look for authentication errors
- **Post Service (8082)**: Look for validation errors
- **API Gateway (8085)**: Look for routing errors

### 7. **Verify Database Connection**

Make sure the auth service can connect to the database and the user exists:

```sql
-- Connect to your MySQL database
USE auth_db;
SELECT * FROM users WHERE username = 'user';
```

### 8. **Test Step by Step**

Follow this exact sequence:

#### Step 1: Register User
```json
POST http://localhost:8085/api/v1/auth/register
{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "password123"
}
```

#### Step 2: Login User
```json
POST http://localhost:8085/api/v1/auth/login  
{
    "username": "testuser2",
    "password": "password123"
}
```

#### Step 3: Create Post
```json
POST http://localhost:8085/api/v1/posts
{
    "auth": {
        "username": "testuser2", 
        "password": "password123"
    },
    "title": "Test Post",
    "content": "Test content"
}
```

### 9. **Common Causes of 401 Errors**

1. **Wrong password**: Double-check the password you registered with
2. **User doesn't exist**: The username might not be registered
3. **Service communication error**: Post service can't reach auth service
4. **Database connection issue**: Auth service can't access user data
5. **Typo in credentials**: Case-sensitive username/password

### 10. **Alternative Direct Testing**

If the API Gateway is causing issues, test directly:

#### Test Auth Service Direct (Port 8081):
```json
POST http://localhost:8081/api/v1/auth/login
{
    "username": "user",
    "password": "password123"  
}
```

#### Test Validation Direct (Port 8081):
```json
POST http://localhost:8081/api/v1/auth/validate
{
    "username": "user",
    "password": "password123"
}
```

## Quick Fix Summary

1. **Update AuthValidationService.java** to use port 8085
2. **Restart all services** after the change
3. **Test authentication first** before creating posts
4. **Check service logs** for detailed error messages
5. **Verify user exists** in the database

## Expected Working Flow

1. User registers → User stored in database
2. User logs in → Credentials validated, user info returned
3. Post creation → Credentials sent to auth service for validation
4. Auth service validates → Returns user info
5. Post service creates post → Associates with validated user

The issue is most likely the URL configuration in `AuthValidationService`. After updating it to use port 8085, restart your services and try again.