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

## Decision 9: Cápsula sonora sem tempo ouvido inventado

- **Decision**: Adaptar a referência com capa do artista principal, edição atual, tops e gênero
  predominante; na ausência de gênero, omitir o bloco de destaque sem criar uma métrica substituta.
- **Rationale**: Preserva a hierarquia visual da referência usando apenas dados existentes no snapshot
  e evita um bloco de contagem que não agrega valor à composição.
- **Alternatives considered**: somar duração das faixas (não representa tempo ouvido); repetir o
  mesmo pôster anterior (não atende à nova linguagem); incorporar a marca Spotify Premium (indevido).

## Decision 10: Paletas aleatórias curadas e estáveis

- **Decision**: Sortear, uma vez por montagem da página, duas paletas distintas de um conjunto
  fechado com foregrounds de alto contraste e repassá-las às duas composições.
- **Rationale**: Entrega variedade sem cintilação entre renders, colisão de cores ou contraste imprevisível.
- **Alternatives considered**: gerar cores RGB livres (contraste inseguro); sortear dentro de cada
  componente (pode repetir e mudar ao remontar); persistir escolha (retenção desnecessária).

## Decision 11: Ativo único e paleta global derivados da logo fornecida

- **Decision**: Preservar o PNG transparente, renomeá-lo para `spotify-purple-logo.png` e reutilizar
  o mesmo arquivo público no cabeçalho, favicon, conexão e cápsula; derivar a interface global do
  roxo profundo e do branco presentes na imagem.
- **Rationale**: Um único ativo evita divergência entre marcas e o roxo cria continuidade visual sem
  interferir nas paletas aleatórias das artes editoriais.
- **Alternatives considered**: converter para outro formato (perda ou trabalho sem benefício);
  duplicar a imagem por componente (manutenção desnecessária); substituir todas as paletas editoriais
  por roxo (eliminaria a variedade pedida anteriormente).

## Decision 12: Estimativa limitada por reproduções recentes

- **Decision**: Solicitar `user-read-recently-played`, ler no máximo 50 eventos e somar a duração
  integral das faixas retornadas, arredondando para minutos e exibindo quantidade e ressalva.
- **Rationale**: É o único recorte oficial disponível para aproximar duração sem inventar um total
  mensal; o limite e o uso da duração integral ficam explícitos ao usuário.
- **Alternatives considered**: chamar o valor de minutos ouvidos (impreciso); persistir reprodução
  continuamente (maior coleta e infraestrutura); esconder a limitação (enganoso).

## Decision 13: Compatibilidade com sessões sem o novo escopo

- **Decision**: Tratar a recusa específica de acesso ao histórico recente como estimativa
  indisponível, preservando perfil e rankings e orientando reconexão.
- **Rationale**: Tokens emitidos antes da mudança não recebem automaticamente novos escopos.
- **Alternatives considered**: invalidar todas as sessões (interrupção desnecessária); falhar o
  painel inteiro (recurso secundário bloquearia o valor principal).

## Decision 14: Logo neutra exclusiva dos cards

- **Decision**: Gerar uma variante grafite transparente, manter a geometria e ondas brancas da logo
  fornecida e usá-la somente na cápsula sonora.
- **Rationale**: Grafite é estável sobre as paletas aleatórias; a variante roxa continua definindo a
  identidade global.
- **Alternatives considered**: aplicar a logo roxa em toda paleta (contraste variável); trocar a logo
  global por neutra (contraria a identidade aprovada); usar filtro CSS (resultado inconsistente).

## Decision 15: Exportação local das artes em PNG 3x

- **Decision**: Serializar no navegador apenas o elemento do retrato ou da cápsula com `html-to-image`,
  aguardando as fontes e usando escala 3x antes de iniciar o download com nome estável.
- **Rationale**: Preserva os estilos, imagens e paletas atuais em boa resolução sem enviar dados do
  usuário a um servidor; manter o controle fora do elemento impede que ele apareça no arquivo.
- **Alternatives considered**: captura de tela manual (qualidade e enquadramento variáveis); canvas
  desenhado item a item (duplica todo o layout); geração no servidor (mais infraestrutura e coleta).

## Decision 16: Extended history for actual listening duration

- **Decision**: Import extracted extended-history JSON locally, summing recorded `ms_played` for
  music, grouped by UTC ending month. Retain only monthly summaries after processing.
- **Rationale**: Spotify documents actual milliseconds played in its exported history, while recent
  API track durations are not actual listened time. Source: https://support.spotify.com/za-en/article/understanding-your-data/
- **Alternatives considered**: ongoing polling cannot recover past months; backend uploads add
  unnecessary retention; ZIP and older account-data formats deferred to keep validation explicit.
