# Pennywise

Pennywise is a personal expense tracker with an Express/MongoDB API and a React dashboard. It supports account sign-in, user-owned expense and monthly-budget records, spending summaries, CSV export, and a Gemini-powered adviser that retrieves relevant financial guidance and uses the signed-in user's expense history as context.

## Requirements

- Node.js 20.19 or newer (or Node.js 22.12 or newer)
- MongoDB (local or hosted)
- A Google Gemini API key for AI answers

## Local setup

1. Configure the backend:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

   Set `MONGO_URI` to your MongoDB connection string and replace `JWT_SECRET` with a cryptographically random secret of at least 32 characters. Set `CLIENT_ORIGIN` to the exact comma-separated frontend origins in production; production startup rejects missing or localhost origins. Set `GEMINI_API_KEY` to enable the AI adviser. The default `GEMINI_MODEL` is `gemini-3.8-flash`; change it only to a model enabled for your Gemini API key. Keep `.env` private.

2. Install and start the API:

   ```powershell
   npm install
   npm run dev
   ```

   The API starts on `http://localhost:3000`; `GET /api/health` checks server status.

3. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend/AI-expense-management-adviser
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite (normally `http://localhost:5173`). The Vite development server proxies `/api` requests to the backend. Set `VITE_API_URL` only when the API is hosted at a different base URL.

The API accepts `CLIENT_ORIGIN` as a comma-separated allowlist for browser origins. The default permits the local Vite development server outside production. Set `TRUST_PROXY` to the exact number of trusted reverse proxies in front of the API when deploying behind one; leave it unset otherwise. Authentication and AI-adviser routes are rate-limited per client IP. For multi-instance deployments, also configure rate limits at a shared gateway.

`GET /api/health/live` is a process liveness check; `GET /api/health/ready` returns `503` until MongoDB is connected and is suitable for readiness checks. The legacy `/api/health` endpoint remains available. The server handles `SIGINT` and `SIGTERM` with a graceful shutdown.

Production deployment checklist:

- Configure HTTPS at the hosting platform or reverse proxy, and set `CLIENT_ORIGIN` and `TRUST_PROXY` to match the deployment.
- Use a managed MongoDB deployment with network access controls, backups, and monitoring.
- Provide `MONGO_URI`, `JWT_SECRET`, and (if enabling AI) `GEMINI_API_KEY` through the host's secret manager; never commit `.env` files or API keys.
- Build the frontend with `npm run build` and deploy the generated `dist` directory behind HTTPS. Set `VITE_API_URL` at build time only when the API is not served under the same origin at `/api`.
- Store JWTs securely on the client; the current browser app uses local storage, which is exposed to successful same-origin script injection. Keep dependencies patched and monitor authentication and AI-provider usage.

## API overview

All authenticated routes use `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/signin` | Sign in |
| `GET` | `/api/auth/me` | Get the signed-in user |
| `GET`, `POST` | `/api/expenses` | List or create the user's expenses |
| `PUT`, `DELETE` | `/api/expenses/:expenseId` | Update or delete an owned expense |
| `GET`, `PUT` | `/api/budget` | Read or save the user's monthly budget |
| `POST` | `/api/insights/chat` | Ask the AI adviser a question |

The adviser uses Google's `@google/genai` SDK and Gemini Interactions API, sending a compact expense summary and relevant entries from the built-in financial-guidance corpus. If `GEMINI_API_KEY` is not set, the API returns a configuration error and the frontend displays it rather than fabricating an AI answer.

## Frontend checks

```powershell
cd frontend/AI-expense-management-adviser
npm run lint
npm run build
```

Backend checks (no database or API keys required):

```powershell
cd backend
npm test
```

The GitHub Actions workflow runs backend tests and frontend lint/build checks on pushes and pull requests.
