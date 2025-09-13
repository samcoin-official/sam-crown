# Overview

SAM Drip Crown Game is a World ID-verified king-of-the-hill style gaming application where verified humans compete to hold the "SAM Crown" and earn SAM tokens while maintaining possession. Built as a World App Mini App, the game implements competitive mechanics with a 1-hour cooldown system between steal attempts, sustainable token distribution, and real-time crown holder tracking. The application features a modern gaming UI with premium design elements, crown-themed components, and comprehensive leaderboard functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Library**: Radix UI primitives with shadcn/ui components for consistent, accessible interface elements
- **Styling**: Tailwind CSS with custom gaming-focused design system featuring crown gold colors, dark/light mode support, and gaming aesthetics
- **Font Strategy**: Inter for primary text and Orbitron for gaming elements (crown timer, competitive displays)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Asset Management**: Custom crown icons, character images, and programmatic sound generation via Web Audio API

## Backend Architecture  
- **Runtime**: Node.js with Express server handling API routes and middleware
- **Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
- **Session Management**: Express sessions with PostgreSQL store via connect-pg-simple
- **Development Setup**: Vite middleware integration for hot module replacement and development server

## Authentication & Verification
- **World ID Integration**: @worldcoin/minikit-js for human verification and incognito actions
- **Verification Flow**: Cloud-based verification with 'play-and-earn' action configured in World Developer Portal
- **Mini App Environment**: Designed for World App with proper viewport and mobile optimizations

## Game Logic Components
- **Crown Competition System**: King-of-the-hill mechanics with real-time crown holder tracking
- **Cooldown System**: 1-hour steal attempt restrictions with progress indicators and timers
- **Token Economics**: Sustainable distribution of 50k SAM tokens daily across active crown holders
- **Real-time Updates**: Live timer displays for crown hold duration and earning calculations
- **Leaderboard System**: Ranking by total crown time and tokens earned

## Data Schema
- **Users Table**: Basic user management with UUID primary keys, username, and password fields
- **Extensible Design**: Schema structured for future game-specific tables (crown holders, game sessions, token transactions)

## Development Tooling
- **TypeScript**: Strict type checking across shared schema, client, and server code
- **Path Aliases**: Organized imports with @ for client components, @shared for common types
- **Hot Reloading**: Vite development server with Express middleware integration
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines

# External Dependencies

## World ID Services
- **@worldcoin/minikit-js**: Mini App SDK for World ID verification and World App integration
- **World Developer Portal**: Action configuration for 'play-and-earn' verification flows
- **Cloud Verification**: Serverless human verification without requiring local World ID infrastructure

## Database Services
- **@neondatabase/serverless**: PostgreSQL database provider with connection pooling
- **Drizzle Kit**: Database migrations and schema management tooling
- **WebSocket Support**: Required for Neon serverless connections via 'ws' package

## UI Framework Dependencies
- **Radix UI**: Complete primitive component library for accessible interactions
- **Tailwind CSS**: Utility-first styling with custom design tokens and gaming theme
- **Lucide React**: Icon library for consistent gaming and UI iconography
- **React Hook Form**: Form state management with validation via @hookform/resolvers

## Development Dependencies
- **Vite**: Frontend build tool with React plugin and development server
- **ESBuild**: Fast server-side bundling for production deployments
- **PostCSS**: CSS processing pipeline with Tailwind and Autoprefixer
- **TypeScript**: Type checking and development experience enhancement

## Deployment Integration
- **Replit**: Development environment with runtime error overlay and cartographer plugins
- **Vercel**: Production deployment target with environment variable management
- **Environment Variables**: World App ID, Action ID, API keys, and database connection strings