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

## Começar

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
  retrato e a cápsula usam apenas rankings de afinidade e contagens dos itens retornados.
- Gêneros continuam dependentes da classificação oficial do Spotify e podem permanecer vazios.
- O app não armazena histórico nem compara meses civis.
