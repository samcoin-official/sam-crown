# Overview

SAM Drip Crown Game is a World ID-verified king-of-the-hill style mini app built for World App. Players attempt to steal and hold the "SAM Crown" to earn tokens while respecting cooldowns, with all interactions verified through World ID. The UI follows World App guidelines and surfaces live crown stats, cooldown timers, and leaderboard data to keep competition engaging.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Next.js Application
- **Framework**: Next.js 15 with TypeScript running in the `/pages` router. The root page lives at `pages/index.tsx` and renders the feature-rich experience exported from `client/src/pages/HomePage.tsx`.
- **Routing**: Next.js handles routing and API endpoints. User-facing routes are generated from files in `pages/`, while server logic is exposed through `pages/api/*` handlers.
- **Providers**: Global runtime context is defined in `src/providers/index.tsx`. `ClientProviders` wraps the tree with:
  - `MiniKitProvider` for Mini App platform APIs.
  - `SessionProvider` from `next-auth` for authentication state.
  - A development-only `ErudaProvider` to debug in the in-app webview.
- **Authentication**: `src/auth/index.ts` configures NextAuth to issue JWT sessions, and `middleware.ts` exports `auth` middleware so protected routes remain gated by session state.
- **UI Toolkit**: Components under `src/components/` combine Tailwind CSS utilities with the Worldcoin Mini Apps UI Kit to stay consistent with the World App design language.
- **World ID Actions**: MiniKit commands are triggered from client components such as `src/components/AuthButton`, which calls `MiniKit.commandsAsync.verify` and forwards proofs to server routes.

## API Layer
- **Next API Routes**: Files under `pages/api/` (for example `pages/api/game.ts`) implement REST endpoints that orchestrate crown ownership, cooldown enforcement, and World ID proof verification.
- **Shared Types**: Request and response contracts are validated with Zod schemas in `shared/`, keeping both client queries and server handlers type-safe.
- **Persistence Abstractions**: The API routes rely on `server/storage.ts` for data access. Drizzle ORM (configured via `drizzle.config.ts`) maps PostgreSQL tables that track users, crown sessions, and token distributions.

## Styling & Assets
- **Tailwind CSS**: Configured through `tailwind.config.ts` and `postcss.config.{js,mjs}` to provide the crown-themed visual system and animations.
- **Fonts**: Gaming-inspired typography is loaded with Next fonts and custom CSS to highlight timers, leaderboard rankings, and the crown call-to-action.
- **Assets**: Icons, sounds, and imagery live under `public/` and `client/src` utility folders so the Next.js asset pipeline can optimize them automatically.

# Development Workflow

## Commands
- `npm run dev` — Starts the Next.js development server on port 3000.
- `npm run build` — Creates the optimized production build (`.next/`).
- `npm run start` — Runs the compiled build locally (requires a prior `npm run build`).
- `npm run lint` — Optional lint check powered by `next lint`.

## Environment Setup
1. Copy `.env.example` to `.env.local` and populate World App, database, and NextAuth settings.
2. Generate an `AUTH_SECRET` via `npx auth secret` and paste it into `.env.local`.
3. If you use an HTTPS tunnel (e.g., ngrok), set `AUTH_URL` to the tunnel domain and list the domain in `allowedDevOrigins` inside `next.config.ts`.
4. Install dependencies with `npm install`.

# MiniKit & World App Testing

1. Run `npm run dev` to start the local server.
2. Expose port 3000 over HTTPS (e.g., `ngrok http 3000`) so World App can reach your environment.
3. In the World App Developer Portal, point your Mini App action URL to the tunnel domain and ensure the action ID matches the value used in `src/components/AuthButton`.
4. Launch World App, open the Mini App from the developer menu, and interact with the `Verify with World ID` button. Proofs are forwarded to `/api/verify`, which validates them against World ID cloud verification.
5. Use the in-app experience to test crown stealing flows, cooldown behavior, and token calculations. The MiniKit provider and Eruda console help debug directly inside the World App webview.

# Deployment

- **Vercel**: Ideal for production hosting; connect the repo, add environment variables, and Vercel will run `npm run build` automatically.
- **Database**: Provision a PostgreSQL instance (e.g., Neon) and update environment variables so Drizzle migrations can run via `npm run db:push`.
- **Monitoring**: Keep World App developer portal credentials and action configuration in sync with deployed URLs to avoid verification failures.
