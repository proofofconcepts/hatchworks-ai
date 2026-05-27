# Checkout Service

A lightweight backend MVP for a commerce checkout workflow. Exposes a single authenticated `POST /checkout` endpoint that calculates order totals, persists the transaction, and returns a breakdown of subtotal, taxes, discount, and total.

---

## Tech Stack

- **Runtime:** Node.js 20 / TypeScript
- **Framework:** NestJS 11
- **ORM:** Prisma 5
- **Database:** PostgreSQL 16
- **Auth:** JWT (passport-jwt) + bcrypt
- **Docs:** Swagger / OpenAPI (`/api/docs`)
- **Containerisation:** Docker (multi-stage) + Docker Compose

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Docker & Docker Compose | any recent version |

---

## Getting Started (Local Development)

### 1. Clone and install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if you need to change any values. The defaults match the Docker Compose database configuration and work out of the box.

```env
NODE_ENV=development
APP_PORT=3000

DATABASE_URL=postgresql://checkout_user:checkout_pass@localhost:5432/checkout_db

JWT_SECRET=super-secret-key-must-be-at-least-32-chars-long
JWT_EXPIRATION=24h
```

### 3. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port `5432` with a persistent volume.

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.  
Swagger UI is available at `http://localhost:3000/api/docs`.

---

## Running with Docker (Production-like)

### 1. Build the application image

```bash
docker build -t checkout-service .
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Run the application

Migrations run automatically on startup via `prisma migrate deploy`.

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://checkout_user:checkout_pass@localhost:5432/checkout_db \
  -e JWT_SECRET=your-secret-at-least-32-chars \
  -e JWT_EXPIRATION=24h \
  -e APP_PORT=3000 \
  checkout-service
```

---

## API Reference

### Authentication

All endpoints except the two auth routes require a `Bearer` JWT in the `Authorization` header.

#### `POST /auth/register`

Register a new user and receive a JWT.

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "securePassword123" }'
```

**Response `201`**
```json
{ "access_token": "<JWT>" }
```

---

#### `POST /auth/login`

Authenticate an existing user and receive a JWT.

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "securePassword123" }'
```

**Response `200`**
```json
{ "access_token": "<JWT>" }
```

---

#### `POST /checkout`

Process a checkout and receive calculated totals. Requires authentication.

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{
    "items": [
      { "name": "Widget", "unit_price": 60.00, "quantity": 2 }
    ]
  }'
```

**Response `201`**
```json
{
  "subtotal": 120.00,
  "taxes": 15.60,
  "discount": 12.00,
  "total": 123.60
}
```

---

### Business Rules

| Field | Formula |
|-------|---------|
| `subtotal` | sum of `unit_price × quantity` for all items |
| `taxes` | 13% of subtotal |
| `discount` | 10% of subtotal if subtotal > 100, otherwise 0 |
| `total` | subtotal + taxes − discount |

All monetary values are rounded to two decimal places.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in watch mode (development) |
| `npm run start:prod` | Start compiled output (production) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run unit tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint and auto-fix source files |
| `npm run format` | Format source files with Prettier |

---

## Project Structure

```
src/
├── config/                  # Environment configuration
├── shared/
│   ├── decorators/          # @CurrentUser, @Public
│   ├── filters/             # Global HTTP exception filter
│   ├── guards/              # Global JWT auth guard
│   └── prisma/              # Prisma client module
└── modules/
    ├── auth/                # Registration, login, JWT strategy
    └── checkout/
        ├── domain/          # Business logic and interfaces
        ├── application/     # Use-case orchestration
        ├── infrastructure/  # Prisma repository implementation
        └── presentation/    # Controller and DTOs
```

---

## Documentation

- **API (interactive):** `http://localhost:3000/api/docs`
- **Architecture decisions:** [`docs/adr/`](./docs/adr/)
- **Feature spec:** [`docs/specs/01-checkout-service-spec.md`](./docs/specs/01-checkout-service-spec.md)
