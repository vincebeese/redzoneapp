# Red Zone Selling Coach™

## Overview

AI-powered sales coaching application with three modes: Deal Mode, Coach Mode, and Mindset Mode. Built on the Red Zone Selling™ methodology by Vince Beese.

## Stack

- **Frontend**: React (Vite) + Tailwind CSS v4 — `artifacts/redzone/`
- **Backend**: Node.js + Express (ES modules) — `artifacts/api-server/`
- **Database**: PostgreSQL (Replit built-in)
- **AI**: Anthropic Claude API
- **Auth**: Custom JWT (cookie-based)
- **Billing**: Stripe (optional)

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — start API server
- `pnpm --filter @workspace/redzone run dev` — start frontend
- `pnpm --filter @workspace/api-server run build` — rebuild API server bundle

## Environment Variables Required

- `DATABASE_URL` — PostgreSQL connection (provisioned by Replit)
- `ANTHROPIC_API_KEY` — Anthropic Claude API key
- `STRIPE_SECRET_KEY` — Stripe secret key (optional)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook secret (optional)
- `RESEND_API_KEY` — Resend email API key (optional)
- `JWT_SECRET` — JWT signing secret (defaults to dev secret if not set)

## Architecture

- **API Server** (`artifacts/api-server/`): Express server bundled with esbuild. Routes in `src/routes/`, services in `src/services/`, middleware in `src/middleware/`, DB in `src/db/`
- **Frontend** (`artifacts/redzone/`): React + React Router v6 + Tailwind v4. Pages in `src/pages/`, components in `src/components/`, auth context in `src/context/`

## Features

### Deal Mode
- Structured coaching for active sales opportunities
- Zone-based deal progression (Yellow/Green/Red)
- AI-generated artifacts (Stakeholder Maps, Business Cases, etc.)
- Context compression for long conversations
- Transcript upload and analysis

### Coach Mode
- On-demand situational coaching
- Objection handling, negotiation tactics, discovery guidance
- Session-based conversations

### Mindset Mode
- Performance and mental game coaching
- Based on the Closer Mentality framework
- Dark-themed interface for focus

## Database Schema

Core tables: `users`, `modes`, `deals`, `messages`, `sessions`, `session_messages`, `transcripts`, `analytics_events`, `resource_center_tools`, `artifact_templates`, `invites`, `app_settings`

## Custom Brand Colors

- `rzs-red`: #C62828
- `rzs-charcoal`: #212121
- `rzs-slate`: #757575
- `rzs-gold`: #F9A825
