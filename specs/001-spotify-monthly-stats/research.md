# Research: Spotify Monthly Stats

## Decision 1: GitHub Spec Kit para SDD

- **Decision**: Usar Spec Kit 1.0.13 com integração Codex em `.agents/skills`.
- **Rationale**: Integração oficial com Codex, artefatos rastreáveis e ciclo completo de convergência.
- **Alternatives considered**: BMAD (mais amplo que o necessário), OpenSpec (bom suporte a skills,
  mas menos alinhado ao pedido explícito por TASKS e fluxo completo de implementação).

## Decision 2: Authorization Code with PKCE

- **Decision**: Autorizar no navegador com challenge S256, validar `state` e renovar tokens.
- **Rationale**: É o fluxo indicado para aplicações JavaScript sem armazenamento seguro de secret.
- **Alternatives considered**: implicit grant (inseguro/legado); authorization code com secret e
  backend (infraestrutura adicional sem benefício para o escopo atual).

## Decision 3: Intervalo mensal

- **Decision**: Consultar top items com `time_range=short_term`, documentado como aproximadamente
  as últimas quatro semanas.
- **Rationale**: É o recorte mais próximo oferecido para afinidade recente.
- **Alternatives considered**: recently played (histórico limitado e não representa ranking mensal);
  armazenamento próprio de longo prazo (fora do escopo e com maior impacto de privacidade).

## Decision 4: React + TypeScript + Vite

- **Decision**: SPA com React, TypeScript estrito e Vite.
- **Rationale**: Componentização, acessibilidade testável, ferramental pequeno e suporte moderno.
- **Alternatives considered**: HTML/JS simples (contraria a organização solicitada); full-stack com
  servidor (desnecessário para PKCE); Next.js (mais superfície que uma única tela exige).

## Decision 5: Sessão transitória

- **Decision**: Guardar tokens apenas em `sessionStorage`. Guardar o `state` e o `code_verifier` do
  pedido PKCE no `localStorage` com validade máxima de dez minutos, consumo único e cópia de
  contingência no `sessionStorage`.
- **Rationale**: Preserva a sessão transitória dos tokens e torna o retorno do provedor resiliente a
  navegadores que recriam o armazenamento da aba durante a navegação OAuth.
- **Alternatives considered**: somente `sessionStorage` (pode perder o pedido durante o retorno);
  tokens no `localStorage` (retenção maior); cookie HttpOnly (exigiria backend).

## Decision 6: Resiliência do adapter

- **Decision**: Mapear erros por tipo, renovar uma vez ao receber 401 e respeitar `Retry-After` em 429.
- **Rationale**: Evita loops, fornece mensagens estáveis e atende às recomendações do provedor.
- **Alternatives considered**: repasse direto de erros HTTP (vaza detalhes e acopla camadas).

## Decision 7: Complementação de gêneros obsoletos

- **Decision**: Quando o ranking de artistas omitir gêneros, consultar o detalhe oficial de cada
  artista afetado e preservar vazio caso o próprio Spotify não forneça classificação.
- **Rationale**: O campo `genres` está obsoleto e pode vir vazio no ranking, mas ainda pertence ao
  contrato oficial do detalhe de artista; a complementação melhora cobertura sem inferir dados.
- **Alternatives considered**: classificar pelo nome do artista (não confiável); integrar uma base
  externa (nova dependência, privacidade e reconciliação); ocultar gêneros sempre (perde dados ainda
  disponíveis).

## Decision 8: Retrato mensal baseado em afinidade

- **Decision**: Reproduzir a linguagem visual da referência com identidade, colagem, tops e gênero,
  substituindo minutos/streams por contagens de itens retornados e a ressalva de afinidade.
- **Rationale**: A API de top items fornece ranking de afinidade, não contagens mensais de execução.
- **Alternatives considered**: calcular minutos a partir da duração das faixas (seria uma alegação
  falsa); coletar histórico próprio (fora do escopo e mais invasivo); usar uma imagem estática (não
  refletiria a conta autenticada nem seria acessível).
