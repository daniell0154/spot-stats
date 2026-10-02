<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Added standing user authorization for scoped commits and pushes after validation.
- Added principles: Clean Architecture; Privacy and OAuth Security; Test-First Contracts;
  Resilient Integrations; Simplicity and Traceability
- Added sections: Technical Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Follow-up TODOs: none
-->
# Spot Stats Constitution

## Core Principles

### I. Clean Architecture Is the Boundary
Domain rules and use cases MUST remain independent of frameworks, HTTP, storage, and Spotify.
Dependencies MUST point inward through explicit ports. Adapters MAY translate external data, but
MUST NOT leak provider response shapes into the domain. This keeps the service testable and makes
external API changes local to an adapter.

### II. Privacy and OAuth Security Are Non-Negotiable
The application MUST request only the `user-top-read` and minimum profile scopes it uses. It MUST
use Authorization Code with PKCE, validate OAuth state, keep refresh tokens out of logs, and avoid
committing credentials. User data MUST be held only as long as required for the active experience,
and logout MUST clear locally stored session material.

### III. Test-First Contracts
Every use case and external port MUST have automated tests written before or alongside its
implementation. Tests MUST cover successful behavior, unauthorized access, provider errors, empty
results, and input validation. A task is not complete while its relevant tests fail.

### IV. Resilient Integrations
Spotify calls MUST handle non-success responses explicitly. Rate limiting MUST honor `Retry-After`,
expired access tokens MUST be refreshed once before failing safely, and transport failures MUST be
mapped to stable application errors. The UI MUST expose useful recovery actions without revealing
tokens or sensitive provider details.

### V. Simplicity and Traceability
The smallest implementation that satisfies the approved specification MUST be preferred. Every
production change MUST trace to a requirement and a task. Source files MUST have one clear layer
responsibility; speculative abstractions and features outside the specification are prohibited.

## Technical Constraints

- The product MUST be a multi-file TypeScript web application; a single-file HTML solution is
  prohibited.
- Source code MUST be separated into domain, application, infrastructure, and presentation layers.
- Spotify's `short_term` affinity range MUST be described as approximately the last four weeks,
  never as an exact calendar-month listening history.
- Local development MUST use a loopback redirect such as `http://127.0.0.1:5173/callback`, not
  `localhost`, and production redirects MUST use HTTPS.
- Secrets, generated output, dependency folders, and coverage artifacts MUST be ignored by Git.

## Development Workflow and Quality Gates

Work MUST follow the Spec Kit sequence: specify, plan, tasks, implement, then converge. The feature
specification is the source of product intent; the plan records architecture decisions; tasks must
name concrete files and requirement links. Before completion, formatting, static analysis, unit
tests, integration tests, and a production build MUST pass. Convergence MUST compare the current
code against all approved artifacts and append any remaining work.

After requested implementation and successful validation, the agent MUST commit the scoped changes
and push the current branch to its existing origin remote under the user's standing authorization.
This does not authorize force-pushes, unrelated changes, credentials or imported listening files.
Failures MUST be reported; later explicit user instructions override this delivery preference.

## Governance

This constitution supersedes conflicting project guidance. Amendments require a documented reason,
an updated Sync Impact Report, and semantic versioning: MAJOR for incompatible governance changes,
MINOR for new or materially expanded rules, and PATCH for clarifications. Every review MUST verify
constitutional compliance; exceptions require written justification in the relevant plan. Runtime
instructions live in `AGENTS.md`, and feature delivery status lives in `TASKS.md` plus the active
Spec Kit `tasks.md`.

**Version**: 1.1.0 | **Ratified**: 2026-10-01 | **Last Amended**: 2026-10-02
