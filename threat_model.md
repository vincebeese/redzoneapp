# Threat Model

## Project Overview

Red Zone Selling Coach is a pnpm monorepo with a React/Vite frontend (`artifacts/redzone`) and an Express/PostgreSQL backend (`artifacts/api-server`). It provides authenticated AI-assisted sales coaching, deal tracking, transcript/document analysis, admin management, and optional Stripe billing. Production traffic is assumed to run with `NODE_ENV=production` and platform-managed TLS.

The production security surface is the Express API plus the production database and third-party integrations. `artifacts/mockup-sandbox` is a development-only mockup environment and should be ignored unless production reachability is demonstrated.

## Assets

- **User accounts and sessions** — email addresses, password hashes, JWT session cookies, password-reset and magic-link flows. Compromise enables account takeover.
- **Private customer content** — deals, deal notes, AI chat history, transcripts, uploaded documents, generated artifacts, and session titles. These can contain sensitive commercial data and customer conversation content.
- **Admin capabilities** — mode configuration, user management, invite issuance, analytics, resource-center configuration, artifact-template management, and global session invalidation. Abuse of admin access has full-platform impact.
- **Billing and integration secrets** — Stripe secret/webhook credentials, Anthropic API key, Resend API key, database credentials, JWT signing secret. Exposure enables impersonation of trusted services or data access.
- **Business telemetry** — analytics events, subscription state, feature adoption, and spend data. These are sensitive operational signals.

## Trust Boundaries

- **Browser to API** — all client input is untrusted, including auth requests, chat prompts, uploads, analytics events, and identifiers like `deal_id`, `session_id`, and `messageId`.
- **API to PostgreSQL** — the API has broad read/write access to user data and admin state. Injection or broken ownership checks at the API layer can become full data compromise or cross-account tampering.
- **API to third parties** — the server calls Anthropic, Stripe, and Resend with privileged secrets. Inputs crossing this boundary must not allow spoofing, abuse, or secret leakage.
- **Public to authenticated to admin surfaces** — public auth and Stripe endpoints must remain isolated from authenticated user actions; admin routes must be enforced server-side and never rely on frontend checks.
- **Production to dev-only content boundary** — migrations, seeds, snapshots, and mockup artifacts must not import development or production snapshot data into live environments unless explicitly intended and access-controlled.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/redzone/src/main.jsx`
- **Highest-risk backend areas:** `artifacts/api-server/src/routes/auth.js`, `routes/chat.js`, `routes/admin.js`, `routes/stripe.js`, `middleware/auth.js`, `src/db/migrate.js`, `src/db/migrations/`
- **Public surfaces:** `/api/auth/*`, `/api/stripe/webhook`, `/api/stripe/seat-count`, `/api/health`
- **Authenticated user surfaces:** deals, sessions, chat, transcripts, documents, artifacts, analytics, resource-center
- **Admin-only surfaces:** `artifacts/api-server/src/routes/admin.js`
- **Usually dev-only / out of scope:** `artifacts/mockup-sandbox`, snapshot-style migrations explicitly intended only for local/dev restoration

## Threat Categories

### Spoofing

The application uses JWT cookies for authenticated API access and Stripe webhook signatures for billing events. Production must never rely on default or fallback secrets. All protected routes must verify a valid session server-side, and webhook endpoints must reject unsigned or invalid requests.

### Tampering

Users can create and update deals, messages, transcripts, documents, artifacts, and analytics records. The API must enforce ownership on every read/write path that accepts IDs from the client, including chat-related flows that create or mutate records indirectly. Client-controlled values must never be allowed to change another user’s data or alter privileged configuration.

### Information Disclosure

The system stores highly sensitive sales conversations, uploaded documents, transcript text, and generated coaching outputs. API responses, database migrations, logs, and admin tooling must not expose data across users, leak secrets, or embed real production snapshots in code paths that can reach production databases. Error handling should avoid disclosing internals.

### Denial of Service

Public auth and billing-related endpoints are exposed to unauthenticated traffic, while authenticated endpoints can trigger AI calls and in-memory file parsing. The service must constrain abusive request volume, large upload processing, and expensive third-party API invocations so a low-cost attacker cannot exhaust application, database, or vendor quotas.

### Elevation of Privilege

The highest-risk paths are admin access, JWT/session handling, migration/seed code, and any route that accepts predictable numeric IDs. The platform must ensure that normal users cannot act on other users’ resources, that admin access cannot be granted through seeded/default credentials or insecure migrations, and that database bootstrap logic cannot silently create privileged accounts or restore sensitive snapshot data in production.