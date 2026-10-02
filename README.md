# Spot Stats

Uma experiência web para visualizar artistas, faixas e gêneros de maior afinidade no Spotify nas
últimas quatro semanas. O Spotify fornece esse período como uma aproximação (`short_term`), não
como contagem exata de reproduções de um mês do calendário.

Depois do login, a interface oferece uma visão detalhada, um retrato mensal em formato de pôster e
uma cápsula sonora editorial, todos baseados no mesmo recorte de afinidade. As duas visualizações
artísticas recebem, a cada carregamento, paletas aleatórias distintas escolhidas de uma coleção com
contraste controlado. Como o campo de gêneros de artista está obsoleto no Spotify, o adapter tenta
completar respostas vazias consultando os detalhes oficiais de cada artista; quando o próprio
Spotify não classifica um artista, a interface mantém um estado vazio explícito.

A identidade global usa a logo roxa fornecida, mantida como `public/spotify-purple-logo.png`, no
cabeçalho, favicon, conexão e cápsula sonora. A paleta de navegação deriva do roxo e do branco da
imagem sem remover a variação cromática aleatória das duas composições editoriais.

Com a permissão `user-read-recently-played`, a cápsula também soma as durações integrais de até 50
reproduções recentes e apresenta o resultado como estimativa. O valor não mede faixas puladas ou
parcialmente ouvidas e não representa o total de um mês. Sessões antigas continuam funcionando sem
essa estimativa até que o usuário se reconecte e conceda o novo escopo.

O retrato musical e a cápsula sonora possuem uma ação para baixar somente a arte como PNG em
alta qualidade (escala 3x), gerado no próprio navegador. O botão não aparece na imagem baixada e,
quando não há gênero, a cápsula simplesmente omite o antigo bloco "Destaques retornados".

## Começar

### Tempo real pelo histórico importado

Na página de [privacidade da conta Spotify](https://www.spotify.com/account/privacy/), solicite
o **Histórico de streaming estendido**. Quando o Spotify disponibilizar o download, extraia o ZIP
e importe os JSONs de músicas (`Streaming_History_Audio` ou `endsong`) pelo painel do site.
Selecione todos os arquivos relevantes juntos (até 50 arquivos / 100 MB); uma nova importação
substitui a anterior. ZIPs e o formato antigo de dados da conta não são aceitos neste fluxo.

Escolha um mês em UTC para ver o tempo efetivamente registrado: 1.000 minutos aparecem como
16h 40min. A cápsula e seu PNG usam esse total, identificado separadamente dos rankings atuais.
Podcasts/registros inválidos são excluídos, eventos idênticos são deduplicados e o período observado
é informado. Arquivos faltantes deixam o mês incompleto; a importação não verifica a titularidade
da conta. Tudo fica em memória, sem upload, e é apagado ao remover, sair ou recarregar.

O Spotify precisa disponibilizar esses arquivos; o login OAuth não baixa esse histórico automaticamente.

### Configuração

1. Crie um app no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Cadastre exatamente `http://127.0.0.1:5173/callback` como Redirect URI.
3. Copie `.env.example` para `.env.local` e informe `VITE_SPOTIFY_CLIENT_ID`.
4. Execute `npm install` e `npm run dev`.
5. Abra `http://127.0.0.1:5173`.

O projeto usa Authorization Code with PKCE e não precisa de client secret.

## Publicar no Vercel

1. Importe este projeto no Vercel e confirme o framework **Vite**.
2. Em **Settings > Environment Variables**, configure para Production:
   - `VITE_SPOTIFY_CLIENT_ID`: o Client ID do app no Spotify.
   - `VITE_SPOTIFY_REDIRECT_URI`: `https://spot-stats-dw.vercel.app/callback`.
3. No Spotify Developer Dashboard, adicione estes Redirect URIs ao mesmo app:
   - `https://spot-stats-dw.vercel.app/callback`
   - `http://127.0.0.1:5173/callback` para desenvolvimento local.
4. Faça um novo deploy depois de alterar variáveis de ambiente.

O `vercel.json` reescreve `/callback` para a SPA. Use o domínio de produção estável; URLs de
Preview mudam e cada uma teria de ser cadastrada exatamente no Spotify.

## Arquitetura

```text
presentation -> application -> domain
       |              ^
       `-> infrastructure (implementa as portas)
```

- `domain`: entidades e agregação de gêneros.
- `application`: portas, erros estáveis e caso de uso do painel.
- `infrastructure`: PKCE, sessão do navegador, OAuth e Spotify Web API.
- `presentation`: componentes, estado da tela e estilos.
- `app`: composition root.

## Qualidade

- `npm test`: testes unitários e de integração.
- `npm run typecheck`: tipos estritos.
- `npm run lint`: regras estáticas.
- `npm run build`: build de produção.
- `npm run check`: todos os gates, incluindo formatação.

Os artefatos SDD ficam em `specs/001-spotify-monthly-stats/`; as skills oficiais do Spec Kit ficam
em `.agents/skills/`.

## Limitações dos dados

- O Spotify não fornece minutos ou número de reproduções mensais pelo endpoint de top items; o
  retrato usa rankings de afinidade e a cápsula identifica separadamente sua estimativa limitada.
- A estimativa da cápsula soma a duração completa de no máximo 50 eventos recentes; ela não sabe
  quanto de cada faixa foi ouvido nem cobre necessariamente quatro semanas.
- Gêneros continuam dependentes da classificação oficial do Spotify e podem permanecer vazios.
- O app não armazena histórico nem compara meses civis.
