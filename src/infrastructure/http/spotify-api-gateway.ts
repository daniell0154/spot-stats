import { AppError } from '../../application/errors';
import type { SpotifyStatsGateway } from '../../application/ports/gateways';
import type {
  RankedArtist,
  RankedTrack,
  RecentPlay,
  UserProfile,
} from '../../domain/entities/stats';
import {
  mapArtists,
  mapProfile,
  mapTracks,
  type SpotifyArtistPayload,
  type SpotifyTrackPayload,
} from '../mappers/spotify-mappers';

interface SpotifyPage<T> {
  items?: T[];
}

interface SpotifyPlayHistoryPayload {
  played_at?: string;
  track?: { id?: string; duration_ms?: number };
}

export class SpotifyApiGateway implements SpotifyStatsGateway {
  constructor(private readonly request: typeof fetch = fetch) {}

  async getProfile(accessToken: string): Promise<UserProfile> {
    return mapProfile(await this.get<Record<string, unknown>>('/me', accessToken));
  }

  async getTopArtists(accessToken: string, limit = 10): Promise<readonly RankedArtist[]> {
    const page = await this.get<SpotifyPage<SpotifyArtistPayload>>(
      `/me/top/artists?time_range=short_term&limit=${limit}`,
      accessToken,
    );
    const artists = mapArtists(page.items ?? []);

    return Promise.all(
      artists.map(async (artist) => {
        if (artist.genres.length > 0) return artist;

        const details = await this.get<SpotifyArtistPayload>(
          `/artists/${encodeURIComponent(artist.id)}`,
          accessToken,
        );
        return { ...artist, genres: details.genres ?? [] };
      }),
    );
  }

  async getTopTracks(accessToken: string, limit = 10): Promise<readonly RankedTrack[]> {
    const page = await this.get<SpotifyPage<SpotifyTrackPayload>>(
      `/me/top/tracks?time_range=short_term&limit=${limit}`,
      accessToken,
    );
    return mapTracks(page.items ?? []);
  }

  async getRecentlyPlayed(accessToken: string, limit = 50): Promise<readonly RecentPlay[]> {
    const safeLimit = Math.min(50, Math.max(1, Math.trunc(limit)));
    const page = await this.get<SpotifyPage<SpotifyPlayHistoryPayload>>(
      `/me/player/recently-played?limit=${safeLimit}`,
      accessToken,
    );

    return (page.items ?? []).flatMap((item) => {
      const trackId = item.track?.id;
      const playedAt = item.played_at;
      if (!trackId || !playedAt) return [];
      return [
        {
          trackId,
          durationMs: Math.max(0, item.track?.duration_ms ?? 0),
          playedAt,
        },
      ];
    });
  }

  private async get<T>(path: string, accessToken: string): Promise<T> {
    let response: Response;
    try {
      // Native browser fetch throws when the adapter instance is passed as its receiver.
      const request = this.request;
      response = await request(`https://api.spotify.com/v1${path}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      throw new AppError('PROVIDER_ERROR', 'Spotify is unreachable.');
    }

    if (response.status === 401) throw new AppError('AUTH_REQUIRED', 'Access token rejected.');
    if (response.status === 403) throw new AppError('FORBIDDEN', 'Spotify scope denied.');
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After') ?? '0') || undefined;
      throw new AppError('RATE_LIMITED', 'Spotify rate limit reached.', retryAfter);
    }
    if (!response.ok) throw new AppError('PROVIDER_ERROR', `Spotify returned ${response.status}.`);
    return (await response.json()) as T;
  }
}
