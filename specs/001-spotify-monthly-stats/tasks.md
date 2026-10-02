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
- T030 precedes T031; T032 precedes T033-T035. T033 can proceed in parallel with page wiring after
  the integration expectations are fixed.

## Implementation Strategy

Complete T001-T014 for a deployable MVP, then add the genre insight and recovery controls. Keep all
Spotify-specific shapes in infrastructure so each phase remains independently testable.

## Phase 7: Convergence

- [x] T025 CRITICAL add explicit empty-result, provider-error and invalid-configuration coverage in tests/integration/spot-stats-page.test.tsx, tests/integration/spotify-api-gateway.test.ts and tests/unit/spotify-auth-gateway.test.ts per Constitution III (partial)
- [x] T026 CRITICAL enforce the provider Retry-After delay before UI retry in src/application/errors.ts, src/presentation/hooks/useSpotStats.ts and src/presentation/pages/SpotStatsPage.tsx per Constitution IV (contradicts)
- [x] T027 [US1] Preserve the temporary PKCE request across the Spotify redirect with bounded,
      single-use browser storage in src/infrastructure/storage/session-storage.ts and cover recovery in
      tests/unit/session-storage.test.ts per FR-003 and SC-001
- [x] T028 [US1] Invoke the native browser fetch without an adapter receiver during token exchange
      in src/infrastructure/auth/spotify-auth-gateway.ts and prevent regression in
      tests/unit/spotify-auth-gateway.test.ts per FR-001 and SC-001
- [x] T029 [US1] Invoke the native browser fetch without an adapter receiver for Spotify Web API
      reads in src/infrastructure/http/spotify-api-gateway.ts and prevent regression in
      tests/integration/spotify-api-gateway.test.ts per FR-004 and SC-001

## Phase 8: User Story 2 - Recuperar gêneros disponíveis (Priority: P2)

**Goal**: Preencher gêneros que não vieram no ranking usando somente detalhes oficiais dos mesmos artistas.

**Independent Test**: Uma resposta de top artists sem gêneros seguida de detalhes classificados
produz artistas enriquecidos na mesma ordem; detalhes também vazios preservam o estado sem dados.

- [x] T030 [US2] Add genre enrichment and empty-detail adapter tests in tests/integration/spotify-api-gateway.test.ts
- [x] T031 [US2] Enrich empty top-artist genres through individual official artist reads in src/infrastructure/http/spotify-api-gateway.ts

## Phase 9: User Story 4 - Ver o retrato mensal (Priority: P2)

**Goal**: Alternar para um pôster mensal responsivo com colagem, tops e gênero derivados do snapshot.

**Independent Test**: Usuários alternam por teclado entre as abas e encontram nome, ano, até cinco
artistas/faixas e gênero ou fallback, sem minutos nem contagens de reproduções.

- [x] T032 [US4] Add accessible tab, monthly portrait and fallback tests in tests/integration/spot-stats-page.test.tsx
- [x] T033 [P] [US4] Build the snapshot-only monthly portrait in src/presentation/components/MonthlyPortrait.tsx
- [x] T034 [US4] Add accessible authenticated tabs and panels in src/presentation/pages/SpotStatsPage.tsx
- [x] T035 [US4] Style the responsive reference-inspired tabs and portrait in src/styles/global.css

## Phase 10: Extension Polish & Quality Gates

- [x] T036 Update implementation status and limitations in TASKS.md and README.md
- [x] T037 Run formatting, static analysis, tests and production build through npm run check

## Phase 11: User Story 5 - Abrir uma cápsula sonora editorial (Priority: P2)

**Goal**: Oferecer uma terceira aba inspirada na nova referência e variar as duas artes com paletas distintas.

**Independent Test**: Um snapshot conhecido produz cápsula com capa, edição, top cinco e destaque
real; ao alternar entre três abas por teclado, as duas artes mantêm paletas diferentes e estáveis.

- [x] T038 [US5] Add capsule, three-tab keyboard and stable distinct palette tests in tests/integration/spot-stats-page.test.tsx
- [x] T039 [P] [US5] Define curated random pair selection in src/presentation/styles/visual-palettes.ts and cover it in tests/unit/visual-palettes.test.ts
- [x] T040 [US5] Apply the assigned palette contract to src/presentation/components/MonthlyPortrait.tsx
- [x] T041 [P] [US5] Build the snapshot-only editorial capsule in src/presentation/components/SoundCapsule.tsx
- [x] T042 [US5] Wire the third accessible tab and cyclic keyboard navigation in src/presentation/pages/SpotStatsPage.tsx
- [x] T043 [US5] Style responsive capsule and palette variables in src/styles/global.css

## Phase 12: Capsule Polish & Quality Gates

- [x] T044 Update feature status and data limitations in TASKS.md and README.md
- [x] T045 Run formatting, static analysis, tests and production build through npm run check

## Extension Dependencies

- T038 fixes integration expectations before T040-T043.
- T039 blocks palette application in T040-T043; T041 can proceed in parallel with T039.
- T042 integrates T040 and T041; T043 follows the component markup; T044-T045 finish the extension.
