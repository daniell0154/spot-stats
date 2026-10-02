# Feature Specification: Spotify Monthly Stats

**Feature Branch**: `001-spotify-monthly-stats`

**Created**: 2026-10-01

**Status**: Approved

**Input**: User description: "Crie um serviço web do Spotify que pegue as estatísticas mensais dos usuários de volta, usando Clean Architecture e arquivos separados."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Conectar e visualizar o mês musical (Priority: P1)

Como ouvinte do Spotify, quero autorizar o Spot Stats e visualizar meus artistas e faixas com
maior afinidade nas últimas quatro semanas para entender rapidamente meu momento musical.

**Why this priority**: Esta é a proposta central e entrega valor mesmo sem recursos adicionais.

**Independent Test**: Um usuário pode autorizar a conta, retornar ao produto e ver rankings reais
de artistas e faixas, com nome, imagem, posição e informações essenciais.

**Acceptance Scenarios**:

1. **Given** um visitante desconectado, **When** ele escolhe conectar o Spotify e autoriza o acesso,
   **Then** retorna autenticado e visualiza seu resumo das últimas quatro semanas.
2. **Given** um usuário autenticado, **When** os dados são carregados, **Then** ele vê rankings
   separados de artistas e faixas, cada um ordenado por afinidade.
3. **Given** um usuário sem itens suficientes, **When** o resumo é exibido, **Then** o produto
   apresenta um estado vazio claro sem inventar estatísticas.

---

### User Story 2 - Entender o perfil do período (Priority: P2)

Como ouvinte, quero um resumo visual dos gêneros predominantes e indicadores do período para
perceber padrões sem precisar interpretar apenas listas.

**Why this priority**: Agrega interpretação aos rankings sem bloquear o valor central.

**Independent Test**: Com um conjunto conhecido de artistas e faixas, o resumo mostra gêneros
agregados e contagens coerentes com os rankings recebidos.

**Acceptance Scenarios**:

1. **Given** rankings carregados, **When** o painel é exibido, **Then** os cinco gêneros mais
   recorrentes aparecem com proporções calculadas a partir dos artistas retornados.
2. **Given** artistas sem gêneros, **When** o resumo é calculado, **Then** a interface informa que
   não há dados de gênero suficientes.
3. **Given** o ranking inicial sem classificações de gênero, **When** ainda existem metadados
   oficiais disponíveis para os mesmos artistas, **Then** o resumo usa esses metadados complementares
   sem atribuir gêneros por suposição.

---

### User Story 3 - Recuperar-se e encerrar a sessão (Priority: P3)

Como usuário, quero mensagens acionáveis diante de falhas e uma forma clara de desconectar para
manter controle sobre a experiência e meus dados.

**Why this priority**: Confiança e recuperação tornam o fluxo principal utilizável no mundo real.

**Independent Test**: Falhas simuladas produzem mensagem e ação de tentar novamente; desconectar
remove a sessão e retorna à tela inicial.

**Acceptance Scenarios**:

1. **Given** uma falha temporária, **When** a busca não termina, **Then** o usuário recebe uma
   explicação segura e pode tentar novamente.
2. **Given** uma sessão ativa, **When** o usuário desconecta, **Then** os dados de autorização
   locais são removidos e o painel deixa de ser acessível.

---

### User Story 4 - Ver o retrato mensal (Priority: P2)

Como ouvinte autenticado, quero alternar para um retrato visual compacto do meu período musical
para reconhecer rapidamente meus destaques em uma composição semelhante a um pôster.

**Why this priority**: Reaproveita os dados do resumo principal em uma apresentação mais memorável,
sem alegar métricas que o provedor não fornece.

**Independent Test**: Com um retrato mensal conhecido, o usuário alterna por teclado entre duas
abas e a segunda mostra identidade, imagens, cinco artistas, cinco faixas e o perfil de gêneros com
os mesmos dados da visão detalhada.

**Acceptance Scenarios**:

1. **Given** um painel carregado, **When** o usuário escolhe a aba "Retrato mensal", **Then** vê
   uma composição vertical com seu nome, ano, imagens dos destaques, top cinco artistas e faixas.
2. **Given** gêneros disponíveis, **When** o retrato mensal é exibido, **Then** o gênero predominante
   e sua proporção aparecem com linguagem de afinidade, não de reproduções.
3. **Given** gêneros ou imagens ausentes, **When** o retrato mensal é exibido, **Then** fallbacks
   legíveis preservam a composição sem inventar dados.
4. **Given** navegação por teclado ou uma tela de 360 px, **When** o usuário alterna as abas,
   **Then** foco, seleção e conteúdo permanecem perceptíveis e utilizáveis.

### Edge Cases

- O retorno de autorização contém erro, código ausente ou estado divergente.
- O acesso expira durante a consulta e precisa ser renovado uma vez.
- O provedor limita requisições ou fica indisponível.
- Perfil, artista ou faixa não possui imagem opcional.
- O provedor omite ou retorna vazios os gêneros obsoletos de parte ou de todos os artistas.
- A conta possui menos itens que o limite ou nenhum histórico suficiente.
- O usuário recarrega a página durante ou depois do retorno de autorização.
- A lista possui menos de cinco artistas ou faixas para preencher o retrato mensal.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o visitante conecte sua conta Spotify com consentimento.
- **FR-002**: O sistema MUST solicitar somente permissões de leitura necessárias ao perfil básico
  e aos itens mais ouvidos.
- **FR-003**: O sistema MUST validar o retorno da autorização antes de criar uma sessão.
- **FR-004**: O sistema MUST obter o perfil do usuário e até dez artistas e dez faixas de maior
  afinidade no intervalo de aproximadamente quatro semanas.
- **FR-005**: O sistema MUST apresentar rankings ordenados com posição, nome, imagem disponível e
  metadados úteis de cada item.
- **FR-006**: O sistema MUST calcular os gêneros predominantes somente a partir dos dados recebidos.
- **FR-007**: O sistema MUST explicar que o período é uma aproximação de quatro semanas, e não
  estatística exata de um mês do calendário nem contagem de reproduções.
- **FR-008**: O sistema MUST apresentar estados de carregamento, ausência de dados e erro com uma
  ação de recuperação apropriada.
- **FR-009**: O sistema MUST renovar uma autorização expirada quando possível e solicitar nova
  conexão quando a renovação não for possível.
- **FR-010**: O usuário MUST conseguir desconectar, removendo os dados locais da sessão.
- **FR-011**: A interface MUST adaptar-se a telas móveis e desktop e permitir navegação por teclado.
- **FR-012**: O sistema MUST aproveitar metadados oficiais adicionais dos mesmos artistas quando a
  resposta inicial não contiver gêneros, sem inferir ou inventar classificações.
- **FR-013**: O painel autenticado MUST oferecer duas abas: uma visão detalhada e um retrato mensal
  compacto, com seleção e relação entre aba e painel comunicadas a tecnologias assistivas.
- **FR-014**: O retrato mensal MUST mostrar nome do usuário, ano atual, até três imagens de artistas,
  até cinco artistas, até cinco faixas e o principal gênero disponível com sua proporção.
- **FR-015**: O retrato mensal MUST usar somente afinidade, contagens de itens retornados e gêneros
  recebidos; MUST NOT apresentar minutos ou reproduções como se fossem fornecidos pelo provedor.

### Key Entities _(include if feature involves data)_

- **User Profile**: identidade pública do ouvinte, com nome de exibição, imagem opcional e país.
- **Ranked Artist**: artista posicionado por afinidade, com nome, imagem, gêneros e popularidade.
- **Ranked Track**: faixa posicionada por afinidade, com título, artistas, álbum, imagem e duração.
- **Monthly Snapshot**: composição transitória do perfil, rankings e gêneros para as últimas
  quatro semanas.
- **User Session**: autorização temporária necessária para consultar os dados do próprio usuário.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos usuários de teste completam conexão e chegam ao painel na primeira
  tentativa, quando o provedor está disponível.
- **SC-002**: Após o retorno da autorização, o painel completo aparece em até cinco segundos em uma
  conexão de banda larga comum.
- **SC-003**: 100% dos itens exibidos preservam a ordem recebida e correspondem ao usuário conectado.
- **SC-004**: Todos os cenários de erro testados exibem uma mensagem compreensível e uma próxima ação.
- **SC-005**: Todas as funções principais podem ser concluídas em uma tela de 360 px e por teclado.
- **SC-006**: Em 100% dos testes com gêneros disponíveis nos metadados oficiais dos artistas, pelo
  menos um gênero aparece nas duas visualizações; quando indisponível, ambas informam a ausência.
- **SC-007**: Usuários de teste alternam entre a visão detalhada e o retrato mensal em uma única
  ação, tanto com ponteiro quanto com teclado.

## Assumptions

- O Spotify fornece afinidade em `short_term`, equivalente a aproximadamente quatro semanas; ele
  não fornece uma contagem mensal exata de reproduções por esse recurso.
- O usuário possui uma conta Spotify elegível e acesso à internet.
- A primeira versão não armazena histórico, não compara meses e não publica resultados.
- O retrato mensal é uma representação visual do recorte `short_term`, não um histórico de um mês
  civil nem um relatório de minutos ou reproduções.
- O usuário configurará previamente um aplicativo no painel de desenvolvedor do Spotify.
- A interface será oferecida em português do Brasil.
