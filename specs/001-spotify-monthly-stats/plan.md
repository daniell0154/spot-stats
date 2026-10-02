# Implementation Plan: Spotify Monthly Stats

**Branch**: `001-spotify-monthly-stats` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-spotify-monthly-stats/spec.md`

## Summary

Entregar uma aplicação web responsiva que autentica o próprio usuário via Spotify Authorization
Code with PKCE e apresenta perfil, top 10 artistas, top 10 faixas e gêneros agregados do intervalo
`short_term` (aproximadamente quatro semanas), completa gêneros ausentes com detalhes oficiais dos
mesmos artistas e oferece uma visão detalhada e um retrato mensal inspirado em pôster. A implementação
será uma SPA React/TypeScript organizada em Clean Architecture, com domínio e casos de uso puros,
portas explícitas, adapters para OAuth/Web API e apresentação isolada. A identidade visual usa a
imagem roxa fornecida como ativo público no cabeçalho, favicon e cápsula, com paleta global derivada.
Uma leitura adicional de até 50 reproduções recentes alimenta uma estimativa opcional de duração na
cápsula, claramente separada do recorte de afinidade e sem bloquear os rankings em sessões antigas.
As duas artes editoriais podem ser exportadas localmente como PNG em escala 3x; a cápsula omite o
antigo fallback "Destaques retornados" quando não existe gênero.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 22

**Primary Dependencies**: React 19, React DOM 19, Vite 7, html-to-image 1.11

**Storage**: tokens no `sessionStorage`; pedido PKCE temporário no `localStorage`, removido no callback
ou após dez minutos; sem banco de dados

**Testing**: Vitest, Testing Library, jsdom

**Target Platform**: navegadores evergreen em desktop e mobile; desenvolvimento em Windows/Linux/macOS

**Project Type**: single-page web application

**Performance Goals**: first render local abaixo de 1 s; painel em até 5 s após callback em banda larga

**Constraints**: sem client secret; redirect local em `127.0.0.1`; somente escopos mínimos; WCAG AA

**Scale/Scope**: um usuário por sessão, três abas autenticadas, 10 artistas, 10 faixas, até 50 eventos
recentes, sem persistência

## Constitution Check

_GATE: passed before research and passed again after design._

- **Clean Architecture**: PASS. Dependências apontam de presentation/infrastructure para application/domain.
- **Privacy and OAuth Security**: PASS. PKCE, state validation, escopos mínimos e armazenamento de sessão.
- **Test-First Contracts**: PASS. Portas e casos de uso possuem testes unitários e adapters têm integração simulada.
- **Resilient Integrations**: PASS. Adapter trata 401, 403, 429, abort/transport e refresh único.
- **Simplicity and Traceability**: PASS. Uma SPA, sem backend/banco e arquivos ligados a tarefas/FRs.
- **Technical Constraints**: PASS. TypeScript multi-file e camadas explícitas; linguagem de quatro semanas.

## Project Structure

### Documentation (this feature)

```text
specs/001-spotify-monthly-stats/
|-- spec.md
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- spotify-ports.md
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- domain/
|   |-- entities/
|   `-- services/
|-- application/
|   |-- ports/
|   `-- use-cases/
|-- infrastructure/
|   |-- auth/
|   |-- http/
|   |-- mappers/
|   `-- storage/
|-- presentation/
|   |-- components/
|   |-- hooks/
|   |-- services/
|   `-- pages/
|-- app/
|   `-- composition.ts
|-- styles/
|-- main.tsx
`-- vite-env.d.ts

tests/
|-- unit/
|-- integration/
`-- setup.ts
```

**Structure Decision**: Uma SPA é suficiente porque PKCE não exige segredo no cliente. A separação
em quatro camadas torna regras, orquestração, detalhes do Spotify e React substituíveis/testáveis.

## Feature Extension Design

- `SpotifyApiGateway.getTopArtists` mantém o ranking original e consulta individualmente detalhes
  apenas para artistas cujo campo de gêneros veio vazio; falhas seguem os mesmos erros estáveis.
- `MonthlyPortrait` recebe somente `MonthlySnapshot`, limita visualmente os rankings a cinco itens e
  deriva o destaque de gênero do primeiro `GenreStat`, sem criar uma entidade ou persistência nova.
- `SpotStatsPage` controla a aba selecionada localmente com semântica `tablist`/`tab`/`tabpanel` e
  mantém a visão detalhada como seleção inicial.
- A composição usa imagens originais vinculadas aos artistas, sem overlays de marca ou números de
  minutos/reproduções não disponibilizados pelo Spotify.
- `SoundCapsule` projeta o mesmo snapshot em capa editorial com artista principal, edição atual,
  top cinco duplo e gênero predominante quando disponível, sem fallback de contagem, nova consulta
  ou persistência.
- `downloadArtworkAsPng` permanece na apresentação, aguarda fontes e serializa apenas o elemento da
  arte em PNG com `pixelRatio: 3`; o botão reutilizável fica fora do elemento capturado.
- `visual-palettes.ts` mantém um conjunto fechado de paletas acessíveis e sorteia um par de índices
  distintos uma vez por montagem da página; ambos são repassados às artes como propriedades CSS.
- A navegação de abas passa a percorrer três itens com setas, Home e End, preservando seleção e foco.
- `public/spotify-purple-logo.png` preserva a transparência do ativo fornecido e oferece um caminho
  estável para cabeçalho, favicon e cápsula, sem duplicação do arquivo.
- `AppHeader`, `LoginHero` e `SoundCapsule` reutilizam o mesmo ativo; a cápsula troca somente seu
  rótulo editorial para "Spotify", enquanto o nome do produto continua Spot Stats.
- As variáveis globais de cor derivam do roxo e branco da logo; as paletas sorteadas das artes
  permanecem distintas e independentes para preservar a variação já aprovada.
- `SpotifyStatsGateway.getRecentlyPlayed` traduz no máximo 50 eventos em `RecentPlay`; a aplicação
  soma durações integrais e arredonda o total, mantendo payloads externos na infraestrutura.
- `GetMonthlyStats` trata ausência do novo escopo como dado opcional para que sessões anteriores não
  percam rankings; outros erros continuam seguindo o contrato resiliente existente.
- `SoundCapsule` apresenta a estimativa com `≈`, contagem de eventos e ressalva de cobertura, usando
  `public/spotify-neutral-logo.png`; a logo roxa permanece no cabeçalho, favicon e login.

## Local history import design

- `HistoryParser` is an application port; `SpotifyHistoryParser` maps extracted extended-history
  JSON (`ts`, `ms_played`, music title/artist/URI) to minimal domain events. No IP/device/account
  metadata is retained. `ImportListeningHistory` deduplicates and aggregates UTC calendar months.
- UI reads at most 50 JSON files / 100 MiB sequentially, replaces imports atomically, and keeps
  summaries in a ready-state component so logout/unmount clears them, including pending reads.
- Domain stores summed milliseconds until formatting; minutes are floored only after summing.
  Capsule receives an optional selected monthly summary; imported time is visibly separated from
  live affinity and recent estimates. No storage/backend or new scope is needed.
- Composition root injects the concrete parser; presentation never handles Spotify payload shapes.
- Delivery includes the prior PNG clipping fix and automatic scoped commit/push after quality gates.

## Complexity Tracking

- Optional capsule listening block: `SpotStatsPage` owns a session-local visibility boolean, initially
  true, passed to `SoundCapsule` along with its toggle callback. A native pressed-state button outside
  the captured article controls conditional rendering of the entire listening block, including fallback.

Nenhuma violação constitucional ou complexidade excepcional foi aceita.
