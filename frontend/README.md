# Banking Frontend

This Vite + React + TypeScript application provides the user interface for the banking system.
It consumes the FastAPI backend at `http://127.0.0.1:8000/api/v1` by default.

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API running locally (FastAPI on port 8000)

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.sample .env.local
```

Then update `.env.local` with your API base URL. Example:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Running the App

Start the development server:

```bash
npm run dev
```

Open the UI at [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the backend API | `http://127.0.0.1:8000/api/v1` |

## Backend prerequisites

Make sure the FastAPI server is running with the latest migrations and configuration:

- CORS is enabled for the React dev origin (`http://localhost:5173`) in `app/main.py`.
- The `user` table was normalized so all seeded users use `@demo.bank` emails and uppercase roles, and the enum now enforces `CUSTOMER`/`ADMIN` only:

  ```sql
  UPDATE user
  SET email = CONCAT(SUBSTRING_INDEX(email, '@', 1), '@demo.bank')
  WHERE email LIKE '%@demo.local%';

  UPDATE user
  SET role = UPPER(role)
  WHERE role IN ('customer', 'admin');

  ALTER TABLE user
    MODIFY role ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER';
  ```

Restart `uvicorn` after applying the SQL above so SQLAlchemy picks up the constraint change.

## Authentication flow

- Sign in with the designated admin account: `enatan10712@gmail.com` / `yoniman`.
- Successful login stores both `accessToken` and `refreshToken` in `localStorage`.
- The shared Axios client (`src/lib/api.ts`) automatically:
  1. Injects the Bearer token on every request.
  2. Removes stored tokens and redirects to `/login` if the backend returns 401.

If you ever need to seed a fresh token manually, you can run this helper in the browser console:

```js
(async () => {
  const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "enatan10712@gmail.com", password: "yoniman" })
  });
  const data = await res.json();
  localStorage.setItem("accessToken", data.access_token);
  localStorage.setItem("refreshToken", data.refresh_token);
})();
```

## Admin Users Page

- Displays live data from `/api/v1/users` (admin-only endpoint).
- Role dropdown writes to `PATCH /api/v1/users/{id}`.
- Activate/Deactivate button hits `PATCH /api/v1/users/{id}/status`.
- React Query automatically refetches the table after each mutation.

> Tip: If the page ever says "Failed to load users", sign in again so the JWT is refreshed.
