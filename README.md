# Dual App Workspace

Dual App Workspace is a Next.js app for managing multiple isolated app sessions from one dashboard. It supports signup/login, light and dark mode, user-scoped app instances, MongoDB-backed profiles, and session snapshot endpoints so each app profile can keep its own cookies and storage.

## Features

- Email/password signup and login
- HTTP-only signed Dual App session cookie
- Dashboard pages for instances, monitoring, security, users, and analytics
- Light and dark mode with `next-themes`
- MongoDB/Mongoose models for users, workspaces, app instances, session profiles, and activity logs
- Isolated app profile records with `cookieStore`, `storageBucket`, and `cacheNamespace`
- Session sync API for saving and restoring app cookies/storage per user profile
- Free setup with MongoDB only. Redis is not required.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Mongoose + MongoDB
- Zustand
- Radix UI primitives
- Lucide icons

## Requirements

- Node.js 20 or newer
- npm
- MongoDB

You can use a local MongoDB container or MongoDB Atlas free tier.

## Environment

Copy the example file:

```bash
cp .env.example .env
```

Required variables:

```bash
MONGODB_URI="mongodb://dual:dual@localhost:27017/dual_workspace?authSource=admin"
MONGODB_DB="dual_workspace"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_ENCRYPTION_KEY="replace-with-a-strong-secret"
```

Use a long random value for `SESSION_ENCRYPTION_KEY`. In production, do not leave it as the example placeholder.

## Local Development

Install dependencies:

```bash
npm install
```

Start MongoDB with Docker:

```bash
docker compose up -d mongodb
```

Start the app:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

The dashboard is protected, so create an account at `/signup` first.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run check
```

## Docker / Production

Build and run the app with Docker Compose:

```bash
docker compose up --build -d
```

When using Docker Compose, the compose network connects the app to MongoDB via the service name. The `docker-compose.yml` file already configures `MONGODB_URI` to use `mongodb:27017` for container-to-container traffic.

## App Routes

- `/signup`: create a Dual App account
- `/login`: log in
- `/`: workspace dashboard
- `/instances`: create and manage app instances
- `/monitoring`: runtime and session health
- `/security`: isolation controls and risk queue
- `/users`: workspace members
- `/analytics`: app usage and distribution
- `/browser/[instanceId]`: browser container placeholder for an isolated app profile

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/instances`
- `POST /api/instances`
- `PATCH /api/instances/[id]`
- `DELETE /api/instances/[id]`
- `POST /api/instances/[id]/duplicate`
- `GET /api/profiles`
- `GET /api/profiles/[id]/session`
- `PATCH /api/profiles/[id]/session`
- `GET /api/activity`
- `GET /api/analytics`
- `GET /api/security`
- `GET /api/users`
- `POST /api/users`
- `GET /api/workspaces`

## Session Persistence

Dual App login keeps the user authenticated with a signed HTTP-only cookie. Individual app login persistence is handled through `SessionProfile` records.

Each app instance points to a profile with:

- `cookieStore`
- `storageBucket`
- `cacheNamespace`
- `encryptedMeta`
- `lastSyncedAt`

The browser/container gateway should load profile data from:

```bash
GET /api/profiles/[id]/session
```

After the user logs in to an app such as Facebook, WhatsApp, Gmail, or Instagram, the gateway should save cookies and storage back to:

```bash
PATCH /api/profiles/[id]/session
```

That is what allows the user to log in to Dual App later and return to the same isolated app session without re-entering each individual app credential.

## Free Storage Setup

This project does not require Redis. MongoDB stores durable users, workspaces, app instances, session profiles, session snapshots, and audit logs.

For a free single-node setup, keep short-lived browser worker status in memory and persist only durable state to MongoDB.

## Troubleshooting

If the dev server starts returning errors like missing `.next/routes-manifest.json`, missing `.next/server/middleware-manifest.json`, or missing chunk files, stop the dev server and clear the Next.js cache:

```bash
rm -rf .next
npm run dev
```

If database routes fail, check that `MONGODB_URI` is set and MongoDB is running.

## Project Structure

```bash
app/                  Next.js pages, API routes, and server actions
components/auth/      Login and signup UI
components/dashboard/ Dashboard shell and operational pages
components/ui/        Shared UI primitives
lib/                  Auth, DB, models, app catalog, utilities
public/icons/         App launcher icons
store/                Client workspace state
docs/                 Architecture notes
```
