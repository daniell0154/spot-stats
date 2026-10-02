# Data Model: Spotify Monthly Stats

## UserProfile

| Field       | Type           | Rules                                |
| ----------- | -------------- | ------------------------------------ |
| id          | string         | required, opaque provider identifier |
| displayName | string         | non-empty fallback to "Ouvinte"      |
| imageUrl    | URL or null    | optional                             |
| country     | string or null | optional two-letter code             |

## RankedArtist

| Field       | Type        | Rules                       |
| ----------- | ----------- | --------------------------- |
| rank        | integer     | 1..10, unique in collection |
| id          | string      | required                    |
| name        | string      | required                    |
| imageUrl    | URL or null | optional                    |
| genres      | string[]    | normalized, may be empty    |
| popularity  | integer     | 0..100                      |
| externalUrl | URL         | Spotify destination         |

## RankedTrack

| Field       | Type        | Rules                       |
| ----------- | ----------- | --------------------------- |
| rank        | integer     | 1..10, unique in collection |
| id          | string      | required                    |
| name        | string      | required                    |
| artists     | string[]    | at least one display name   |
| albumName   | string      | required                    |
| imageUrl    | URL or null | optional                    |
| durationMs  | integer     | non-negative                |
| explicit    | boolean     | required                    |
| externalUrl | URL         | Spotify destination         |

## GenreStat

| Field      | Type    | Rules                           |
| ---------- | ------- | ------------------------------- |
| name       | string  | normalized display value        |
| count      | integer | positive                        |
| percentage | number  | 0..100 of all genre occurrences |

## MonthlySnapshot

Aggregates one `UserProfile`, ordered `RankedArtist[]`, ordered `RankedTrack[]`, derived
`GenreStat[]`, and the immutable period label "Aproximadamente as últimas 4 semanas". It is
created in memory for the active view and is never persisted as listening history.

The presentation may derive a monthly portrait from this same snapshot: up to three artist images,
the first five ranked artists and tracks, and the first genre statistic. This is a view projection,
not a separately stored entity.

## UserSession

Contains access token, refresh token, absolute expiry time and granted scopes. It transitions from
absent -> pending authorization -> active -> refreshing -> active/expired -> absent. A failed state
validation transitions directly to absent.
