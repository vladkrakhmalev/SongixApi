# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Development server with hot reload (nodemon + ts-node)
npm run build            # Compile TypeScript to /dist
npm run type-check       # Check types without compilation
npm run migrate          # Run pending database migrations
npm run migrate:rollback # Revert last migration
npm run migrate:make     # Generate new migration file (creates .cjs in src/migrations/)
```

Server runs on http://localhost:3000. Swagger docs at `/docs`, AdminJS at `/admin`.

## Architecture

Express.js REST API with TypeScript, SQLite + Sequelize ORM, JWT auth (access + refresh tokens in HttpOnly cookies), and Google OAuth via Passport.js.

**Request flow:** CORS → auth middleware → route → controller → model static methods → DB

**Layers:**
- `src/routes/` — route definitions, mount validation middleware
- `src/controllers/` — business logic, static methods per resource
- `src/models/` — Sequelize models with static helper methods (`findById`, `findByOwnerId`, `createX`, etc.)
- `src/middlewares/` — auth (JWT), validation, CORS, error handler
- `src/config/` — Sequelize connection, Passport Google OAuth strategy, Swagger, AdminJS

**Models and relations:**
- `User` (id, email, password, google_id)
- `Collection` (id, title, owner_id → User, cascade delete)
- `Song` (id, title, text, collection_id → Collection, cascade delete)

## Key Conventions

**Migrations** are `.cjs` files (CommonJS), even though the rest of the project uses ESM TypeScript. The `.sequelizerc` file configures the CLI paths.

**Auth tokens:** Access token (30m), refresh token (7d), both stored as HttpOnly cookies. The `auth` middleware in `src/middlewares/auth.ts` attaches the decoded user to `req.user`.

**Resource ownership:** Controllers verify `owner_id` matches `req.user.id` before mutations. Songs are accessed via their parent collection's ownership.

**Module system:** ESM (`"type": "module"` in package.json) with `ts-node` using `--esm` flag. Import paths must include `.js` extension even for `.ts` source files.

## Environment Variables

Copy `.env.example` to `.env`. Required variables:
- `ACCESS_JWT_SECRET`, `REFRESH_JWT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `ALLOWED_ORIGINS` (comma-separated, for CORS)
- `FRONTEND_URL` (used for OAuth redirects)
