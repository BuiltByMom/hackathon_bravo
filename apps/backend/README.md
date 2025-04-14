# Sophon Backend

A Node.js Express backend with TypeScript, PostgreSQL, and JWT authentication.

## Features

- User authentication (signup, login, logout)
- Required unique user tags (@username)
- Asset sending between users
- JWT-based authentication
- PostgreSQL database with Prisma ORM
- TypeScript support
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Bun package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials and JWT secret.

4. Run database migrations:

   ```bash
   bunx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

## API Endpoints

### Authentication

#### POST /api/auth/signup

Create a new user account.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "tag": "@username" // Required, must start with @ and contain 3-20 lowercase letters, numbers, or underscores
}
```

Response:

```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "tag": "@username"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login

Login with email and password.

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "tag": "@username"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/logout

Logout the current user.

Headers:

```
Authorization: Bearer jwt-token
```

Response:

```json
{
  "message": "Logged out successfully"
}
```

### Assets

#### POST /api/assets/send

Send an asset to a user by email or tag.

Headers:

```
Authorization: Bearer jwt-token
```

Request body:

```json
{
  "recipient": "user@example.com", // or "@username"
  "asset": {
    "type": "file",
    "url": "https://example.com/file.pdf"
  }
}
```

Response:

```json
{
  "message": "Asset sent to user@example.com",
  "asset": {
    "type": "file",
    "url": "https://example.com/file.pdf"
  }
}
```

## Tag Format Rules

- Must start with @
- Can contain lowercase letters, numbers, and underscores
- Length: 3-20 characters (excluding @)
- Must be unique across all users
- Required for all users
- Examples:
  - ✅ @john_doe
  - ✅ @user123
  - ❌ @User (uppercase not allowed)
  - ❌ @ab (too short)
  - ❌ @user# (special characters not allowed)
  - ❌ (missing tag)

## Testing

Run the test suite:

```bash
bun test
```

## Development

- `bun run dev`: Start development server with hot reload
- `bun run build`: Build for production
- `bun run start`: Start production server
- `bun run test`: Run tests
- `bun run lint`: Run linter
- `bun run format`: Format code with Prettier

## License

MIT
