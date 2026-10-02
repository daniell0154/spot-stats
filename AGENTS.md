# AGENTS.md

## Project

Spot Stats is a React/TypeScript web app that shows a user's Spotify affinity for approximately the
last four weeks. It uses GitHub Spec Kit 1.0.13 and Clean Architecture.

## Required workflow

1. Read `.specify/memory/constitution.md` before changing product code.
2. Read the active feature artifacts in `specs/001-spotify-monthly-stats/`.
3. Use the project skills in `.agents/skills/` in this order when changing feature scope:
   `$speckit-specify`, `$speckit-plan`, `$speckit-tasks`, `$speckit-implement`, `$speckit-converge`.
4. Mark completed work in `specs/001-spotify-monthly-stats/tasks.md`; keep root `TASKS.md` as the
   human-readable delivery summary.
5. Run `npm run check` before declaring implementation complete.

## Architecture boundaries

- `src/domain`: pure entities and calculations; imports no outer layer.
- `src/application`: use cases and ports; imports only domain.
- `src/infrastructure`: Spotify OAuth/API, browser storage and provider mapping.
- `src/presentation`: React components/hooks/pages; no raw Spotify response shapes.
- `src/app`: composition root; the only place concrete adapters are wired to ports.

Dependencies point inward. Keep external payloads, browser APIs and React out of domain/application
logic. Do not create a single-file implementation.

## Spotify rules

- Use Authorization Code with PKCE (S256); never use implicit grant or a client secret in browser code.
- Request only `user-read-private user-top-read`.
- For local redirects use `http://127.0.0.1:5173/callback`, never `localhost`.
- Describe `short_term` as approximately four weeks, not an exact calendar month or play count.
- Never log or commit access tokens, refresh tokens, verifiers, states or credentials.
- Handle 401 with at most one refresh and 429 according to `Retry-After`.

## Code quality

- TypeScript strict mode; descriptive names; small cohesive modules.
- Tests cover domain calculations, use cases, adapter mappings, callback validation and UI recovery.
- Preserve keyboard navigation, visible focus, semantic landmarks and reduced-motion behavior.
- Do not weaken tests to make a change pass.
