# Profile API Endpoints

This document outlines the expected API endpoints for profile management in the football talent platform.

## Current Implementation

The frontend now tries multiple endpoint patterns to fetch profile data, ensuring compatibility with different backend implementations.

### Profile Fetch Endpoints (GET)

The frontend will try these endpoints in order until one succeeds:

#### Player Profile
1. `GET /api/player/getPlayerProfile/{userId}`
2. `GET /api/player/profile/{userId}`
3. `GET /api/player/{userId}`
4. `GET /api/player/profile`

#### Coach Profile
1. `GET /api/coach/getCoach/{userId}`
2. `GET /api/coach/profile/{userId}`
3. `GET /api/coach/{userId}`
4. `GET /api/coach/profile`

#### Scout Profile
1. `GET /api/scout/getScout/{userId}`
2. `GET /api/scout/profile/{userId}`
3. `GET /api/scout/{userId}`
4. `GET /api/scout/profile`

### Profile Update Endpoints (PUT)

The frontend will try these endpoints in order until one succeeds:

#### Player Profile Update
1. `PUT /api/player/updatePlayer/{userId}`
2. `PUT /api/player/updatePlayerProfile/{userId}`
3. `PUT /api/player/profile/{userId}`
4. `PUT /api/player/{userId}`

#### Coach Profile Update
1. `PUT /api/coach/updateCoach/{userId}`
2. `PUT /api/coach/updateCoachProfile/{userId}`
3. `PUT /api/coach/profile/{userId}`
4. `PUT /api/coach/{userId}`

#### Scout Profile Update
1. `PUT /api/scout/updateScout/{userId}`
2. `PUT /api/scout/updateScoutProfile/{userId}`
3. `PUT /api/scout/profile/{userId}`
4. `PUT /api/scout/{userId}`

## Request Headers

All requests include:
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Response Format

Expected response format for profile data:
```json
{
  "id": "user-uuid",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, NY",
  "bio": "Professional description",
  "profilePicture": "url-to-image",
  // Role-specific fields...
}
```

### Player-Specific Fields
```json
{
  "position": "midfielder",
  "clubTeam": "Team Name",
  "dateOfBirth": "1995-01-01",
  "height": 180,
  "weight": 75,
  "age": 29
}
```

### Coach-Specific Fields
```json
{
  "teamName": "Team Name",
  "experienceYears": 10,
  "dob": "1980-01-01"
}
```

### Scout-Specific Fields
```json
{
  "organisation": "Organization Name",
  "experienceYears": 5
}
```

## Error Handling

The frontend handles:
- 404 errors (tries next endpoint)
- Empty responses
- Invalid JSON responses
- Network timeouts with retry logic
- Graceful fallback to cached user data

## Backend Implementation Notes

1. Implement at least one of the profile fetch endpoints for each role
2. Return proper HTTP status codes (200 for success, 404 for not found)
3. Return JSON response with profile data
4. Ensure consistent field names as documented above
5. Handle authentication via Bearer token in Authorization header
