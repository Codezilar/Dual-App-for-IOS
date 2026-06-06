# Multi-App Workspace Architecture

## Folder Structure

- `app/`: Next.js 15 App Router pages, server actions, and API routes.
- `components/dashboard/`: workspace shell, launcher, manager, cards, analytics, and admin surfaces.
- `components/ui/`: shadcn/ui-compatible primitives.
- `lib/`: Mongoose connection, app catalog, utilities, mock data, and shared types.
- `lib/models/`: MongoDB/Mongoose schemas for users, workspaces, app instances, profiles, and logs.
- `store/`: Zustand workspace state for client interactions.
- `public/icons/`: app launcher assets.

## Authentication Flow

Use a production auth provider such as Auth.js, Clerk, or WorkOS:

1. User authenticates with email, SSO, or passkey.
2. Auth callback creates or updates a MongoDB `User` document.
3. Middleware resolves active `WorkspaceUser` role.
4. API routes and server actions authorize by workspace membership.
5. Admin screens require `OWNER` or `ADMIN`.

## Session Isolation Strategy

Every `AppInstance` points to one `SessionProfile`. The profile owns:

- `cookieStore`
- `storageBucket`
- `cacheNamespace`
- `profileKey`
- optional proxy and encrypted metadata

In production, do not load third-party apps directly in normal iframes because many major sites block embedding and browser cookies would not be reliably isolated. Use a container gateway:

1. Next.js requests `/browser/:instanceId`.
2. The gateway resolves the `SessionProfile`.
3. A browser worker launches a persistent context keyed by `profileKey`.
4. Cookies, localStorage, sessionStorage, IndexedDB, cache, and service workers are scoped to that context directory or remote browser profile.
5. The user connects through a streamed viewport, reverse proxy, or browser automation protocol.
6. MongoDB stores durable profile metadata, workspace documents, session snapshots, and audit logs through Mongoose models.
7. Browser workers can keep short-lived heartbeats and locks in local memory for a free single-node setup.

Recommended worker options:

- Playwright persistent contexts for self-hosted browser workers.
- Browserless, Chrome DevTools Protocol, or remote Chromium clusters for scale.
- Per-profile encrypted storage volumes for regulated customers.
- In-memory worker events for active instance tracking in the free single-node setup.
- Upgrade to a managed queue or pub/sub service only when you need multiple browser worker nodes.

## API Routes

- `GET /api/instances`: list instances with profile and folder data.
- `POST /api/instances`: create a new isolated profile and app instance.
- `PATCH /api/instances/:id`: rename, favorite, move, or update status.
- `DELETE /api/instances/:id`: remove an instance.
- `GET /api/workspaces`: list MongoDB workspaces with members, folders, and instances.

## Deployment

1. Copy `.env.example` to `.env`.
2. Run `docker compose up -d mongodb`.
3. Run `npm install`.
4. Run `npm run dev`.

For production:

1. Provision MongoDB. MongoDB Atlas has a free tier, or you can self-host with Docker.
2. Set `MONGODB_URI`, `MONGODB_DB`, `SESSION_ENCRYPTION_KEY`, and `NEXT_PUBLIC_APP_URL`.
3. Run `npm run build`.
4. Deploy the Next.js app behind TLS.
5. Deploy browser workers separately with encrypted profile volumes.
6. For a single-node free deployment, keep worker heartbeats in memory and store durable audit/session data in MongoDB.
