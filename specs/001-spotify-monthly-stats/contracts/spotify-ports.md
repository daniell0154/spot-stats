# Contracts: Spotify Ports

## AuthGateway

- `createAuthorizationUrl(): Promise<string>` creates a PKCE request with S256, state and only
  `user-read-private user-top-read`.
- `completeAuthorization(callbackUrl): Promise<UserSession>` rejects missing code, provider error,
  state mismatch or token exchange failure.
- `getValidAccessToken(): Promise<string>` returns an active token or refreshes once.
- `logout(): void` removes session, verifier and state.

## SpotifyStatsGateway

- `getProfile(accessToken): Promise<UserProfile>` returns the current user.
- `getTopArtists(accessToken, limit=10): Promise<RankedArtist[]>` requests `short_term`, preserves
  ranking order and complements empty genres from official per-artist details when available.
- `getTopTracks(accessToken, limit=10): Promise<RankedTrack[]>` requests `short_term`.
- All methods translate 401, 403, 429 and transport/provider failures to stable application errors.

## GetMonthlyStats Use Case

- Input: none; identity derives from the authorized session.
- Output: `MonthlySnapshot`.
- Orchestration: obtain a valid token, request profile/artists/tracks concurrently, calculate at
  most five genre statistics, and return immutable view data.
- Retry: after an authorization failure, refresh at most once and repeat the failed operation.

## Authenticated Tabs UI

- The detailed view is the initially selected tab.
- The monthly portrait and sound capsule tabs receive the same `MonthlySnapshot`; they do not
  trigger another stats load.
- Tabs expose selected state, controlled panels and keyboard focus through native button behavior.
- The portrait limits lists to five and renders explicit fallbacks for missing images and genres.
- The capsule limits lists to five, uses the leading artist as its cover and never labels affinity as
  a calendar month or listening time.
- The page assigns distinct curated palette identifiers to both editorial views once per mount; tab
  changes reuse those identifiers.
