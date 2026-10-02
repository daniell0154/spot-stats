# Quickstart: Spotify Monthly Stats

## Prerequisites

- Node.js 22+
- Spotify developer application with redirect URI `http://127.0.0.1:5173/callback`

## Configure and run

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SPOTIFY_CLIENT_ID` to the app client ID.
3. Keep `VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback`.
4. Run `npm install` and `npm run dev`.
5. Open `http://127.0.0.1:5173`.

No client secret is used or expected.

## Validate

- Run `npm run check` for formatting, lint/type checks, unit/integration tests and production build.
- Connect a Spotify account and confirm the profile, 10 artists, 10 tracks and genre summary.
- With an account whose top-artist response omits genres, confirm available per-artist metadata fills
  the summary; if Spotify has no classification, confirm the honest empty state remains.
- Switch between "Visão detalhada" and "Retrato mensal" using pointer and keyboard; confirm the
  portrait shows only affinity-based counts, top-five lists and the available leading genre.
- Open "Cápsula sonora" and confirm the leading image/fallback, edition, both top-five lists and the
  real genre or count highlight match the loaded snapshot without a second data request.
- Move repeatedly among all three tabs and confirm the portrait and capsule keep two distinct palettes
  until reload; reload and confirm the pair may change while text remains legible.
- Confirm the purple Spotify image appears without distortion in the header, browser icon, connect
  action and capsule; confirm the capsule label reads "Spotify", not "Spot/Stats".
- Confirm the global background, surfaces, actions and visible focus treatment follow the purple and
  white logo palette while the two editorial palettes remain independently randomized.
- Confirm the UI says "aproximadamente as últimas 4 semanas".
- Revoke/expire authorization and confirm the app recovers or asks to reconnect.
- Use logout and confirm refreshing the page stays disconnected.
- At 360 px width and with keyboard-only navigation, complete the login/dashboard/logout flow.

Expected domain shapes and boundary behavior are defined in [data-model.md](data-model.md) and
[contracts/spotify-ports.md](contracts/spotify-ports.md).
