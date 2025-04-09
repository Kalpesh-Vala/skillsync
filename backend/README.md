# SkillSync Backend

A robust Node.js/Express backend for the SkillSync application, featuring user authentication, skill management, and progress tracking.

## Features

- JWT-based authentication with refresh token rotation
- Secure password hashing with bcrypt
- MongoDB integration with Mongoose
- RESTful API endpoints for skill management
- Progress tracking with time-series data
- Rate limiting and security middleware
- Error handling and logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/skillsync
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   COOKIE_SECRET=your-cookie-secret
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Skills

- `POST /api/skills` - Create new skill
- `GET /api/skills` - Get all skills (with pagination)
- `GET /api/skills/:id` - Get single skill
- `PATCH /api/skills/:id` - Update skill
- `POST /api/skills/:id/progress` - Update skill progress
- `DELETE /api/skills/:id` - Delete skill

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```
2. The server will run on `http://localhost:3000`

## Security Features

- HTTP-only cookies for tokens
- Helmet security headers
- Rate limiting
- CORS configuration
- Password hashing
- Input validation

## Error Handling

The API uses a centralized error handling system with:
- Operational vs Programming error distinction
- Development vs Production error responses
- Structured error messages

## API Response Format

Success Response:
```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

Error Response:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC