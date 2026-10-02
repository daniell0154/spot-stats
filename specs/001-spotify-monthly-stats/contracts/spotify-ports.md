# Contracts: Spotify Ports

## HistoryParser and ImportListeningHistory

- `HistoryParser.parse(text)` validates extended-history arrays and returns minimal music events
  plus excluded-row counts; malformed/unsupported files throw a safe actionable error.
- `ImportListeningHistory.execute(texts)` receives an async stream of file text, combines files,
  deduplicates identical events and returns monthly summaries; no valid music rejects the import.
- UI offers multi-file JSON selection, UTC month selection, removal, in-memory-only notice and
  Spotify download instructions. Prior results survive failures; logout clears imported state.

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
- `getRecentlyPlayed(accessToken, limit=50): Promise<RecentPlay[]>` requests recent history, maps
  only track id, full duration and playback timestamp, and never returns more than 50 events.
- All methods translate 401, 403, 429 and transport/provider failures to stable application errors.

## GetMonthlyStats Use Case

- Input: none; identity derives from the authorized session.
- Output: `MonthlySnapshot`.
- Orchestration: obtain a valid token, request profile/artists/tracks/recent events concurrently,
  calculate at most five genre statistics and the optional recent-duration estimate, and return
  immutable view data. A forbidden recent-history read becomes `null` without suppressing the core snapshot.
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
- The shared header, browser icon and Spotify connection treatment use `/spotify-purple-logo.png`.
- The capsule brand reads `Spotify` beside the shared logo; the product remains named Spot Stats in
  its accessible header label and document title.
- Global chrome uses the logo-derived purple palette while editorial random palettes stay distinct.
- The capsule renders an available estimate as approximate minutes plus event count and limitation;
  otherwise it explains that recent data or reconnection is required.
- Only the capsule uses `/spotify-neutral-logo.png`; global brand placements keep the purple asset.
