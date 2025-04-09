# SkillSync API Testing Guide with Postman

## Environment Setup

1. Create a new environment in Postman:
   - Click on "Environments" in the sidebar
   - Create "SkillSync Development"
   - Add the following variables:
     ```
     BASE_URL: http://localhost:3000
     ACCESS_TOKEN: [leave empty initially]
     REFRESH_TOKEN: [leave empty initially]
     ```

2. Import the collection:
   - Create a new collection named "SkillSync API"
   - Set the base URL to `{{BASE_URL}}`

## Authentication Testing

### 1. Register User
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

Body:
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#"
}

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "user": {
            "id": "user_id",
            "username": "testuser",
            "email": "test@example.com"
        }
    }
}
```

### 2. Login User
```
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

Body:
{
    "email": "test@example.com",
    "password": "Test123!@#"
}

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "accessToken": "eyJhbG..."
    }
}

Note: The response will include HTTP-only cookies for refresh token
```

### 3. Refresh Token
```
POST {{BASE_URL}}/api/auth/refresh
Note: No body needed, refresh token is sent via HTTP-only cookie

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "accessToken": "eyJhbG..."
    }
}
```

### 4. Logout
```
POST {{BASE_URL}}/api/auth/logout
Authorization: Bearer {{ACCESS_TOKEN}}

Expected Response (200 OK):
{
    "status": "success",
    "message": "Logged out successfully"
}
```

## Skills Management

### 1. Create Skill
```
POST {{BASE_URL}}/api/skills
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

Body:
{
    "name": "JavaScript",
    "category": "Programming",
    "initialRating": 3
}

Expected Response (201 Created):
{
    "status": "success",
    "data": {
        "skill": {
            "name": "JAVA",
            "category": "Programming",
            "initialRating": 5,
            "progress": [
                {
                    "rating": 5,
                    "timestamp": "2025-04-09T17:40:07.046Z",
                    "_id": "67f6b0f74b01a9489540c394"
                }
            ],
            "userId": "67f6ab0b521fdbb3410db5e9",
            "_id": "67f6b0f74b01a9489540c393",
            "createdAt": "2025-04-09T17:40:07.048Z",
            "updatedAt": "2025-04-09T17:40:07.048Z",
            "__v": 0,
            "currentRating": 5,
            "id": "67f6b0f74b01a9489540c393"
        }
    }
}
```

### 2. Get All Skills
```
GET {{BASE_URL}}/api/skills?page=1&limit=10
Authorization: Bearer {{ACCESS_TOKEN}}

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "skills": [
            {
                "_id": "67f6b0f74b01a9489540c393",
                "name": "JAVA",
                "category": "Programming",
                "initialRating": 5,
                "progress": [
                    {
                        "rating": 5,
                        "timestamp": "2025-04-09T17:40:07.046Z",
                        "_id": "67f6b0f74b01a9489540c394"
                    }
                ],
                "userId": "67f6ab0b521fdbb3410db5e9",
                "createdAt": "2025-04-09T17:40:07.048Z",
                "updatedAt": "2025-04-09T17:40:07.048Z",
                "__v": 0,
                "currentRating": 5,
                "id": "67f6b0f74b01a9489540c393"
            }
        ],
        "pagination": {
            "current": 1,
            "pages": 1,
            "total": 2
        }
    }
}
```

### 3. Get Single Skill
```
GET {{BASE_URL}}/api/skills/:id
Authorization: Bearer {{ACCESS_TOKEN}}

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "skill": {
            "_id": "67f6b0704b01a9489540c38e",
            "name": "JavaScript",
            "category": "Programming",
            "initialRating": 3,
            "progress": [
                {
                    "rating": 3,
                    "timestamp": "2025-04-09T17:37:52.746Z",
                    "_id": "67f6b0704b01a9489540c38f"
                }
            ],
            "userId": "67f6ab0b521fdbb3410db5e9",
            "createdAt": "2025-04-09T17:37:52.752Z",
            "updatedAt": "2025-04-09T17:37:52.752Z",
            "__v": 0,
            "currentRating": 3,
            "id": "67f6b0704b01a9489540c38e"
        },
        "progressData": [
            {
                "date": "2025-04-09",
                "level": 3
            }
        ]
    }
}
```

### 4. Update Skill
```
PATCH {{BASE_URL}}/api/skills/:id
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

Body:
{
    "name": "Advanced JavaScript",
    "category": "Web Development"
}

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "skill": {
            "_id": "67f6b0f74b01a9489540c393",
            "name": "Spring Boot",
            "category": "Web Development",
            "initialRating": 5,
            "progress": [
                {
                    "rating": 5,
                    "timestamp": "2025-04-09T17:40:07.046Z",
                    "_id": "67f6b0f74b01a9489540c394"
                }
            ],
            "userId": "67f6ab0b521fdbb3410db5e9",
            "createdAt": "2025-04-09T17:40:07.048Z",
            "updatedAt": "2025-04-09T17:44:34.278Z",
            "__v": 0,
            "currentRating": 5,
            "id": "67f6b0f74b01a9489540c393"
        }
    }
}
```

### 5. Update Skill Progress
```
POST {{BASE_URL}}/api/skills/:id/progress
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

Body:
{
    "rating": 4
}

Expected Response (200 OK):
{
    "status": "success",
    "data": {
        "skill": {
            "_id": "67f6b0704b01a9489540c38e",
            "name": "JavaScript",
            "category": "Programming",
            "initialRating": 3,
            "progress": [
                {
                    "rating": 3,
                    "timestamp": "2025-04-09T17:37:52.746Z",
                    "_id": "67f6b0704b01a9489540c38f"
                },
                {
                    "rating": 4,
                    "timestamp": "2025-04-09T17:46:30.262Z",
                    "_id": "67f6b2764b01a9489540c3a7"
                }
            ],
            "userId": "67f6ab0b521fdbb3410db5e9",
            "createdAt": "2025-04-09T17:37:52.752Z",
            "updatedAt": "2025-04-09T17:46:30.264Z",
            "__v": 1,
            "currentRating": 4,
            "id": "67f6b0704b01a9489540c38e"
        },
        "progressData": [
            {
                "date": "2025-04-09",
                "level": 3
            },
            {
                "date": "2025-04-09",
                "level": 4
            }
        ]
    }
}
```

### 6. Delete Skill
```
DELETE {{BASE_URL}}/api/skills/:id
Authorization: Bearer {{ACCESS_TOKEN}}

Expected Response (200 OK):
{
    "status": "success",
    "message": "Skill deleted successfully"
}
```

## Testing Tips

1. **Authentication Flow**:
   - After successful login, copy the access token to the environment variable
   - The refresh token will be automatically handled via cookies

2. **Error Handling**:
   - Test with invalid tokens
   - Test with missing required fields
   - Test with invalid data types
   - Check rate limiting behavior

3. **Collection Variables**:
   - Create variables for frequently used IDs
   - Use environment variables for different stages (dev/prod)

4. **Request Headers**:
   - Always include `Content-Type: application/json` for POST/PATCH requests
   - Include `Authorization: Bearer {{ACCESS_TOKEN}}` for protected routes

5. **Response Validation**:
   - Check status codes
   - Verify response format matches API documentation
   - Validate data types and required fields