# Checkout UI

A Next.js 15 frontend for the Simple Checkout Service. Allows users to register, log in, and submit item lists to the backend `POST /checkout` endpoint, displaying the persisted order summary returned by the API.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 3
- **State:** Zustand 5 (persisted auth store, form stores)
- **Unit tests:** Jest + ts-jest
- **E2E tests:** Playwright
- **Containerisation:** Docker (multi-stage, standalone output)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Docker | any recent version |

The frontend calls the backend API — have the backend running before starting the frontend.

---

## Getting Started (Local Development)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if the backend is not on the default port:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start the development server

```bash
npm run dev
```

The UI will be available at `http://localhost:3001`.

---

## Running with Docker (Production-like)

### 1. Build the image

The Dockerfile expects the **repository root** as the build context:

```bash
# Run from the repo root
docker build -f frontend/Dockerfile -t checkout-frontend .
```

### 2. Run the container

```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  -e NODE_ENV=production \
  checkout-frontend
```

The UI will be available at `http://localhost:3001`.

---

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Redirect guard — sends unauthenticated users to `/login`, authenticated users to `/checkout` |
| `/login` | Email + password login form |
| `/register` | Email + password registration form |
| `/checkout` | Protected item list builder — submits to backend and displays order summary |

---

## User Flow

1. Register or log in — the issued JWT is stored in `localStorage` via Zustand.
2. Add one or more items (name, unit price, quantity) on the `/checkout` page.
3. Click **Process checkout** — the form validates fields locally, then calls `POST /checkout`.
4. The backend calculates totals, persists the order, and returns the summary.
5. The order summary card (subtotal, taxes, discount, total, order ID) is displayed.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3001 (watch mode) |
| `npm run build` | Build production output |
| `npm run start` | Start production server on port 3001 |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:cov` | Run unit tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests (requires a running app) |
| `npm run lint` | Lint source files |
| `npm run format` | Format source files with Prettier |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Root redirect guard
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── checkout/page.tsx
├── modules/
│   ├── auth/
│   │   ├── domain/             # LoginRequest, RegisterRequest, AuthResponse types
│   │   ├── application/        # login(), register(), logout()
│   │   ├── infrastructure/     # fetch calls to /auth/register and /auth/login
│   │   └── presentation/       # LoginForm, RegisterForm components
│   └── checkout/
│       ├── domain/             # CheckoutItem, CheckoutResult types
│       ├── application/        # processCheckout()
│       ├── infrastructure/     # fetch call to /checkout
│       └── presentation/       # CheckoutForm, CheckoutResult components
└── shared/
    ├── http/http-client.ts     # fetch wrapper — injects Bearer token automatically
    ├── logger/logger.ts        # structured logger (pretty dev / JSON prod)
    └── store/
        ├── auth.store.ts       # Zustand auth store — token + email, persisted
        ├── login-form.store.ts
        ├── register-form.store.ts
        └── checkout-form.store.ts
```

---

## Documentation

- **Architecture decisions:** [`docs/adr/`](./docs/adr/)
- **Feature spec:** [`docs/specs/01-checkout-ui-spec.md`](./docs/specs/01-checkout-ui-spec.md)
- **Backend API:** [`../backend/README.md`](../backend/README.md)
