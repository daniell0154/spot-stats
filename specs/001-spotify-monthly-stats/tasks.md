# Tasks: Spotify Monthly Stats

**Input**: Design documents from `/specs/001-spotify-monthly-stats/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Initialize React/TypeScript/Vite metadata in package.json, tsconfig.json and vite.config.ts
- [x] T002 [P] Configure quality tooling in eslint.config.js, .prettierrc.json and .gitignore
- [x] T003 [P] Create environment and shell entry files in .env.example and index.html

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 [P] Define domain entities with documented constraints in src/domain/entities/stats.ts
- [x] T005 [P] Define application ports and stable errors in src/application/ports/gateways.ts and src/application/errors.ts
- [x] T006 Implement PKCE primitives and session repository in src/infrastructure/auth/pkce.ts and src/infrastructure/storage/session-storage.ts
- [x] T007 Implement Spotify OAuth adapter in src/infrastructure/auth/spotify-auth-gateway.ts
- [x] T008 Configure test environment and shared fixtures in tests/setup.ts and tests/fixtures.ts

## Phase 3: User Story 1 - Conectar e visualizar o mês musical (Priority: P1) MVP

**Goal**: Autorizar a conta e mostrar perfil, top artistas e top faixas das últimas quatro semanas.

**Independent Test**: Com gateways simulados, conectar e renderizar rankings ordenados completos.

- [x] T009 [P] [US1] Write monthly stats use-case tests in tests/unit/get-monthly-stats.test.ts
- [x] T010 [P] [US1] Write Spotify adapter mapping tests in tests/integration/spotify-api-gateway.test.ts
- [x] T011 [US1] Implement GetMonthlyStats use case in src/application/use-cases/get-monthly-stats.ts
- [x] T012 [US1] Implement Spotify API adapter and mappers in src/infrastructure/http/spotify-api-gateway.ts and src/infrastructure/mappers/spotify-mappers.ts
- [x] T013 [P] [US1] Build login and ranking components in src/presentation/components/LoginHero.tsx and src/presentation/components/RankedLists.tsx
- [x] T014 [US1] Compose callback and dashboard flow in src/presentation/hooks/useSpotStats.ts, src/presentation/pages/SpotStatsPage.tsx and src/app/composition.ts

## Phase 4: User Story 2 - Entender o perfil do período (Priority: P2)

**Goal**: Agregar e apresentar os cinco gêneros predominantes do período.

**Independent Test**: Um conjunto conhecido de gêneros produz contagens, percentuais e estado vazio corretos.

- [x] T015 [P] [US2] Write genre aggregation tests in tests/unit/genre-stats.test.ts
- [x] T016 [US2] Implement genre aggregation in src/domain/services/calculate-genre-stats.ts
- [x] T017 [US2] Render summary and genres in src/presentation/components/StatsOverview.tsx

## Phase 5: User Story 3 - Recuperar-se e encerrar a sessão (Priority: P3)

**Goal**: Permitir retry/logout e comunicar falhas, vazio e rate limit com segurança.

**Independent Test**: Falhas simuladas mostram recuperação e logout apaga a sessão.

- [x] T018 [P] [US3] Write authentication and recovery tests in tests/unit/spotify-auth-gateway.test.ts and tests/integration/spot-stats-page.test.tsx
- [x] T019 [US3] Add loading, empty, error, retry and logout states in src/presentation/pages/SpotStatsPage.tsx
- [x] T020 [US3] Add accessible header/session controls in src/presentation/components/AppHeader.tsx

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T021 [P] Create responsive accessible visual system in src/styles/global.css
- [x] T022 [P] Document setup, architecture and limitations in README.md and AGENTS.md
- [x] T023 Validate environment, typecheck, lint, tests and build through npm run check
- [x] T024 Run convergence against spec, plan, constitution and completed tasks

## Dependencies & Execution Order

- Setup precedes Foundational; Foundational blocks every story.
- US1 is the MVP. US2 and US3 can start after Foundational but integrate into the US1 screen.
- Tests in each story precede implementation. Polish follows all selected stories.

## Parallel Opportunities

- T002/T003, T004/T005 and test tasks marked `[P]` touch independent files.
- T013 can proceed alongside T011/T012 after shared contracts exist.
- T021/T022 can proceed in parallel after component structure stabilizes.

## Implementation Strategy

Complete T001-T014 for a deployable MVP, then add the genre insight and recovery controls. Keep all
Spotify-specific shapes in infrastructure so each phase remains independently testable.

## Phase 7: Convergence

- [x] T025 CRITICAL add explicit empty-result, provider-error and invalid-configuration coverage in tests/integration/spot-stats-page.test.tsx, tests/integration/spotify-api-gateway.test.ts and tests/unit/spotify-auth-gateway.test.ts per Constitution III (partial)
- [x] T026 CRITICAL enforce the provider Retry-After delay before UI retry in src/application/errors.ts, src/presentation/hooks/useSpotStats.ts and src/presentation/pages/SpotStatsPage.tsx per Constitution IV (contradicts)
- [x] T027 [US1] Preserve the temporary PKCE request across the Spotify redirect with bounded,
      single-use browser storage in src/infrastructure/storage/session-storage.ts and cover recovery in
      tests/unit/session-storage.test.ts per FR-003 and SC-001
