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

---

### User Story 5 - Abrir uma cápsula sonora editorial (Priority: P2)

Como ouvinte autenticado, quero alternar para uma cápsula sonora com imagem dominante, rankings e
um destaque real do período para ver meus dados em uma segunda composição editorial.

**Why this priority**: Oferece uma leitura visual alternativa baseada na nova referência sem criar
métricas que não existem no provedor.

**Independent Test**: Com um retrato conhecido, o usuário abre a terceira aba e encontra imagem do
artista principal, edição atual, top cinco artistas e faixas e gênero predominante ou fallback.

**Acceptance Scenarios**:

1. **Given** artistas e faixas disponíveis, **When** o usuário escolhe "Cápsula sonora", **Then** vê
   uma composição vertical com imagem principal, identificação da edição e os dois top cinco.
2. **Given** gênero predominante disponível, **When** a cápsula é exibida, **Then** a proporção e o
   nome do gênero aparecem como destaque sem alegar tempo ouvido.
3. **Given** imagem ou gênero ausente, **When** a cápsula é exibida, **Then** a composição usa um
   fallback legível baseado apenas nas contagens reais retornadas.
4. **Given** as abas "Retrato mensal" e "Cápsula sonora", **When** o painel é carregado, **Then** cada
   arte recebe uma paleta aleatória diferente, com contraste legível, mantida até a página recarregar.

---

### User Story 6 - Reconhecer a identidade visual Spotify (Priority: P2)

Como visitante ou ouvinte autenticado, quero reconhecer a identidade roxa fornecida em toda a
experiência e a marca Spotify na cápsula para perceber uma apresentação visual coerente.

**Why this priority**: Unifica a marca do site com o novo ativo visual sem alterar os dados ou o
fluxo de autorização.

**Independent Test**: Ao abrir a página inicial e a cápsula, o usuário encontra a mesma imagem de
marca renomeada, vê "Spotify" na cápsula e navega por uma paleta global derivada do roxo da imagem.

**Acceptance Scenarios**:

1. **Given** qualquer tela do produto, **When** o cabeçalho é exibido, **Then** a imagem de marca
   fornecida aparece como logo do site com identificação acessível do produto.
2. **Given** a cápsula sonora aberta, **When** sua identificação editorial é exibida, **Then** o texto
   mostra "Spotify" ao lado da mesma imagem, sem o rótulo anterior "Spot/Stats".
3. **Given** a página inicial ou o painel, **When** a interface é exibida, **Then** fundo, superfícies,
   destaques e estados de foco usam uma paleta roxa coerente com a logo e com contraste legível.

---

### User Story 7 - Ver uma estimativa de duração recente (Priority: P2)

Como ouvinte autenticado, quero ver na cápsula uma estimativa em minutos baseada nas reproduções
recentes retornadas para ter uma noção aproximada do tempo representado por esses eventos.

**Why this priority**: Aproxima a cápsula da referência usando um dado calculável, sem apresentar a
estimativa limitada como histórico mensal exato.

**Independent Test**: Com reproduções recentes conhecidas, a cápsula mostra a soma arredondada das
durações, quantidade de eventos usados, sinal de aproximação e ressalva sobre a limitação.

**Acceptance Scenarios**:

1. **Given** consentimento para ler reproduções recentes, **When** até 50 eventos são retornados,
   **Then** a cápsula mostra a soma aproximada das durações integrais em minutos e quantos eventos
   entraram no cálculo.
2. **Given** uma faixa pulada ou parcialmente reproduzida, **When** a estimativa é exibida, **Then** o
   texto esclarece que usa a duração integral das faixas retornadas e não representa tempo real ouvido.
3. **Given** uma sessão antiga sem a nova permissão ou nenhum evento recente, **When** o painel abre,
   **Then** os rankings continuam disponíveis e a cápsula informa que a estimativa requer reconexão
   ou dados recentes.
4. **Given** qualquer paleta da cápsula, **When** sua marca é exibida, **Then** ela usa a versão neutra
   transparente da logo com contraste perceptível sem substituir a logo roxa global.

---

### User Story 8 - Baixar as artes editoriais (Priority: P2)

Como ouvinte autenticado, quero baixar meu retrato musical e minha cápsula sonora em boa qualidade
para guardar ou compartilhar as composições fora do site.

**Why this priority**: Transforma as duas visualizações editoriais em artefatos reutilizáveis sem
alterar os dados apresentados.

**Independent Test**: Em cada aba editorial, o usuário aciona um controle identificado, recebe um
arquivo PNG em alta resolução com a arte completa e não encontra o controle dentro da imagem.

**Acceptance Scenarios**:

1. **Given** o retrato mensal aberto, **When** o usuário escolhe baixar, **Then** recebe um PNG do
   retrato em escala de alta qualidade com nome de arquivo reconhecível.
2. **Given** a cápsula sonora aberta, **When** o usuário escolhe baixar, **Then** recebe um PNG da
   cápsula em escala de alta qualidade com nome de arquivo reconhecível.
3. **Given** uma falha ao gerar a imagem, **When** o download não termina, **Then** a arte permanece
   visível e o usuário recebe uma mensagem para tentar novamente.
4. **Given** uma cápsula sem gênero, **When** ela é exibida ou baixada, **Then** não aparece o bloco
   substituto "Destaques retornados" nem uma contagem de itens nesse espaço.

### User Story 9 - Importar tempo real registrado (Priority: P2)

Como ouvinte, quero importar meu histórico estendido e escolher um mês para visualizar o tempo
efetivamente registrado pelo Spotify nas músicas desse período.

**Independent Test**: Importar dois arquivos sobrepostos, escolher um mês e conferir minutos,
horas, cobertura e o total na cápsula; remover ou sair apaga os dados da experiência.

**Acceptance Scenarios**:

1. **Given** arquivos válidos com 60.000.000 ms no mês, **When** importados, **Then** aparecem
   1.000 minutos e 16h40, sem contar eventos repetidos entre arquivos.
2. **Given** meses diferentes, **When** outro mês é selecionado, **Then** o total e a cobertura
   mudam na tela e na cápsula, enquanto os rankings continuam identificados como afinidade atual.
3. **Given** importação válida, **When** outro arquivo é inválido, **Then** uma mensagem acionável
   aparece e o resultado anterior é preservado.
4. **Given** histórico importado, **When** removido, a sessão é encerrada ou a página recarrega,
   **Then** os dados importados deixam de estar disponíveis.

### Edge Cases

- Imported files may overlap, contain podcasts, invalid rows or only part of a calendar month.
- Invalid/oversized imports must preserve the previous successful import.

- O retorno de autorização contém erro, código ausente ou estado divergente.
- O acesso expira durante a consulta e precisa ser renovado uma vez.
- O provedor limita requisições ou fica indisponível.
- Perfil, artista ou faixa não possui imagem opcional.
- O provedor omite ou retorna vazios os gêneros obsoletos de parte ou de todos os artistas.
- A conta possui menos itens que o limite ou nenhum histórico suficiente.
- O usuário recarrega a página durante ou depois do retorno de autorização.
- A lista possui menos de cinco artistas ou faixas para preencher o retrato mensal.
- O artista principal não possui imagem para ocupar a capa da cápsula sonora.
- O sorteio de cores seleciona paletas próximas ou inadequadas para legibilidade.
- A imagem de marca não carrega ou é ampliada em uma tela pequena.
- A lista recente contém faixas parcialmente ouvidas, repetidas, locais ou nenhum evento.
- Uma sessão criada antes da nova permissão tenta acessar reproduções recentes.
- Uma imagem externa ou fonte ainda não terminou de carregar quando o usuário inicia o download.
- O navegador não consegue gerar ou baixar o PNG e precisa preservar a arte e permitir nova tentativa.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-027**: Users MUST be able to import multiple extracted Spotify extended-history JSON files
  locally and select a calendar month (UTC) to see actual recorded music listening minutes and hours.
  Only music events with valid timestamps and non-negative integer played milliseconds count;
  duplicate events are counted once and excluded/duplicate row counts are reported.
- **FR-028**: Imported totals MUST show the selected month and observed date range, state that missing
  files can make totals incomplete, and remain separate from current affinity rankings. Capsule PNGs
  MUST include the selected imported total when available. Without an import, recent estimates remain
  explicitly limited to recent events. No automatic monthly-history retrieval is implied.
- **FR-029**: Imports MUST remain in memory, be removable, clear on logout/reload, require no new OAuth
  scopes, and never upload contents. The UI MUST explain how to request and extract the extended history.
  Malformed/unsupported/empty files and imports exceeding 50 files or 100 MiB MUST show actionable errors.

- **FR-001**: O sistema MUST permitir que o visitante conecte sua conta Spotify com consentimento.
- **FR-002**: O sistema MUST solicitar somente permissões de leitura necessárias ao perfil básico
  aos itens mais ouvidos e às reproduções recentes usadas pela estimativa.
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
- **FR-013**: O painel autenticado MUST oferecer três abas: uma visão detalhada, um retrato mensal e
  uma cápsula sonora, com seleção e relação entre aba e painel comunicadas a tecnologias assistivas.
- **FR-014**: O retrato mensal MUST mostrar nome do usuário, ano atual, até três imagens de artistas,
  até cinco artistas, até cinco faixas e o principal gênero disponível com sua proporção.
- **FR-015**: O retrato mensal MUST usar somente afinidade, contagens de itens retornados e gêneros
  recebidos; MUST NOT apresentar minutos ou reproduções como se fossem fornecidos pelo provedor.
- **FR-016**: A cápsula sonora MUST mostrar imagem ou fallback do artista principal, identificação
  da edição atual, até cinco artistas, até cinco faixas e o gênero predominante quando disponível;
  MUST NOT exibir o bloco substituto "Destaques retornados".
- **FR-017**: O retrato mensal e a cápsula sonora MUST receber paletas aleatórias distintas entre si,
  estáveis durante a visualização e escolhidas apenas entre combinações com contraste legível.
- **FR-018**: O cabeçalho e o ícone do navegador MUST usar a imagem de marca fornecida, renomeada
  com um nome estável e armazenada como ativo público do produto.
- **FR-019**: A identificação editorial da cápsula sonora MUST mostrar a imagem de marca e o texto
  "Spotify"; MUST NOT manter o rótulo "Spot/Stats" nesse local.
- **FR-020**: A paleta global do site MUST derivar do roxo e do branco da imagem de marca, mantendo
  contraste legível, foco visível e as paletas aleatórias distintas das duas artes editoriais.
- **FR-021**: O consentimento MUST incluir leitura das reproduções recentes para calcular a nova
  estimativa, sem solicitar permissões de alteração ou controle de reprodução.
- **FR-022**: O sistema MUST calcular a estimativa somando a duração integral de no máximo 50 eventos
  recentes retornados, arredondar para minutos e informar a quantidade de eventos considerada.
- **FR-023**: A cápsula MUST identificar o valor com sinal de aproximação e explicar que ele não é
  tempo real ouvido nem histórico mensal completo; ausência da permissão ou de eventos MUST NOT
  impedir a exibição dos rankings.
- **FR-024**: A marca dentro da cápsula MUST usar uma variante neutra transparente da logo; a logo
  roxa global MUST permanecer inalterada nos demais pontos da interface.
- **FR-025**: O retrato mensal e a cápsula sonora MUST oferecer controles acessíveis para baixar
  somente a respectiva arte como arquivo PNG, sem incluir o próprio controle na imagem.
- **FR-026**: Cada download MUST gerar a arte em escala três vezes superior à exibida, usar nome de
  arquivo estável e comunicar uma falha sem remover ou bloquear permanentemente a visualização.

### Key Entities _(include if feature involves data)_

- **User Profile**: identidade pública do ouvinte, com nome de exibição, imagem opcional e país.
- **Ranked Artist**: artista posicionado por afinidade, com nome, imagem, gêneros e popularidade.
- **Ranked Track**: faixa posicionada por afinidade, com título, artistas, álbum, imagem e duração.
- **Monthly Snapshot**: composição transitória do perfil, rankings e gêneros para as últimas
  quatro semanas.
- **Recent Play**: evento recente transitório com faixa, duração integral e horário de reprodução.
- **Recent Listening Estimate**: soma aproximada em minutos, quantidade de eventos usados e estado
  de disponibilidade; não representa tempo efetivamente ouvido.
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
- **SC-008**: Em 100% dos carregamentos testados, as duas composições editoriais usam paletas
  diferentes, preservam contraste legível e não mudam durante a navegação entre abas.
- **SC-009**: Em 100% das telas verificadas, a logo fornecida aparece sem distorção, a cápsula usa o
  texto "Spotify" e os controles continuam legíveis e perceptíveis por teclado em 360 px ou mais.
- **SC-010**: Em 100% dos conjuntos de teste com eventos recentes, a estimativa corresponde à soma
  arredondada das durações de até 50 eventos e aparece com ressalva de aproximação; sem acesso ou
  eventos, o painel principal permanece utilizável.
- **SC-011**: Em 100% dos testes das duas abas editoriais, um único acionamento gera o PNG correto em
  escala 3x, e nenhuma imagem gerada inclui o controle de download ou "Destaques retornados".

## Assumptions

- Extended-history JSON files are imported after ZIP extraction; account-data JSON and ZIP import are
  outside this increment. Monthly grouping uses each event's ending timestamp in UTC; totals cover only
  music events present in selected files, not podcasts, videos or a guaranteed complete month.

- O Spotify fornece afinidade em `short_term`, equivalente a aproximadamente quatro semanas; ele
  não fornece uma contagem mensal exata de reproduções por esse recurso.
- O usuário possui uma conta Spotify elegível e acesso à internet.
- A primeira versão não armazena histórico, não compara meses e não publica resultados.
- O retrato mensal é uma representação visual do recorte `short_term`, não um histórico de um mês
  civil nem um relatório de minutos ou reproduções.
- A edição exibida usa o mês e ano atuais apenas como identidade visual; todos os dados continuam
  representando aproximadamente quatro semanas de afinidade.
- O usuário configurará previamente um aplicativo no painel de desenvolvedor do Spotify.
- A interface será oferecida em português do Brasil.
- A estimativa recente considera a duração integral das faixas retornadas; o provedor não informa
  quanto de cada faixa foi efetivamente ouvido, e o limite recente não equivale a um mês completo.
- Os PNGs são gerados localmente no navegador, sem envio ou armazenamento das artes em um servidor.
