# Sophon

A modern web application for sending digital assets (Crypto, NFT, Access Tokens) via email using magic links.

## Project Structure

```
sophon/
├── apps/
│   ├── frontend/     # Next.js frontend application
│   └── backend/      # Go backend application
├── packages/
│   ├── shared/       # Shared TypeScript utilities and types
│   └── config/       # Shared configuration files
```

## Prerequisites

- [Bun](https://bun.sh) (v1.0.26 or later)
- Go 1.22 or later
- SQLite3

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   ```bash
   # Frontend (.env.local)
   NEXTPUBLIC_API_URL=http://localhost:8080

   # Backend (.env)
   PORT=8080
   DATABASE_URL=sophon.db
   ```

3. Start development servers:
   ```bash
   bun turbo run dev
   ```

4. Build the project:
   ```bash
   bun turbo run build
   ```

## Available Scripts

- `bun turbo run dev` - Start development servers
- `bun turbo run build` - Build all applications
- `bun turbo run lint` - Run linting
- `bun turbo run format` - Format code
- `bun turbo run test` - Run tests

## Features

- Send digital assets (Crypto, NFT, Access Tokens) via email
- Magic link-based asset claiming
- Modern UI with Tailwind CSS and shadcn/ui
- Type-safe API communication
- SQLite database for data persistence
- Mock blockchain interactions for simplicity

## Development

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Testing

```bash
# Run all tests
bun turbo run test

# Run frontend tests
cd apps/frontend && bun test

# Run backend tests
cd apps/backend && go test ./...
```

## License

MIT 