# Implementation Plan: Spotify Monthly Stats

**Branch**: `001-spotify-monthly-stats` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-spotify-monthly-stats/spec.md`

## Summary

Entregar uma aplicação web responsiva que autentica o próprio usuário via Spotify Authorization
Code with PKCE e apresenta perfil, top 10 artistas, top 10 faixas e gêneros agregados do intervalo
`short_term` (aproximadamente quatro semanas). A implementação será uma SPA React/TypeScript
organizada em Clean Architecture, com domínio e casos de uso puros, portas explícitas, adapters para
OAuth/Web API e apresentação isolada.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 22

**Primary Dependencies**: React 19, React DOM 19, Vite 7

**Storage**: tokens no `sessionStorage`; pedido PKCE temporário no `localStorage`, removido no callback
ou após dez minutos; sem banco de dados

**Testing**: Vitest, Testing Library, jsdom

**Target Platform**: navegadores evergreen em desktop e mobile; desenvolvimento em Windows/Linux/macOS

**Project Type**: single-page web application

**Performance Goals**: first render local abaixo de 1 s; painel em até 5 s após callback em banda larga

**Constraints**: sem client secret; redirect local em `127.0.0.1`; somente escopos mínimos; WCAG AA

**Scale/Scope**: um usuário por sessão, uma tela principal, 10 artistas, 10 faixas, sem persistência

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

## Complexity Tracking

Nenhuma violação constitucional ou complexidade excepcional foi aceita.
