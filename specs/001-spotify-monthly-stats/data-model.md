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
`GenreStat[]`, optional `RecentListeningEstimate`, and the immutable period label
"Aproximadamente as últimas 4 semanas". It is created in memory for the active view and is never
persisted as listening history. A missing estimate does not invalidate profile, rankings or genres.

The presentation may derive a monthly portrait from this same snapshot: up to three artist images,
the first five ranked artists and tracks, and the first genre statistic. This is a view projection,
not a separately stored entity.

The presentation may also derive a sound capsule from the same snapshot: the leading artist image,
the first five artists and tracks, current edition label, and either the first genre statistic or the
real number of returned highlights. Visual palette identifiers are ephemeral presentation state,
distinct for both editorial projections and never persisted.

## RecentPlay

| Field      | Type    | Rules                          |
| ---------- | ------- | ------------------------------ |
| trackId    | string  | non-empty provider identifier  |
| durationMs | integer | non-negative full duration     |
| playedAt   | string  | valid provider date-time value |

## RecentListeningEstimate

| Field       | Type    | Rules                             |
| ----------- | ------- | --------------------------------- |
| minutes     | integer | non-negative rounded duration sum |
| playCount   | integer | 1..50 returned events used        |
| sampleLimit | integer | literal 50                        |

This is an approximation over returned recent events, not actual listened time or a calendar month.

## UserSession

Contains access token, refresh token, absolute expiry time and granted scopes. It transitions from
absent -> pending authorization -> active -> refreshing -> active/expired -> absent. A failed state
validation transitions directly to absent.
