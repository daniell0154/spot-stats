import { AppError } from '../../application/errors';
import type { SpotifyStatsGateway } from '../../application/ports/gateways';
import type { RankedArtist, RankedTrack, UserProfile } from '../../domain/entities/stats';
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
    return mapArtists(page.items ?? []);
  }

  async getTopTracks(accessToken: string, limit = 10): Promise<readonly RankedTrack[]> {
    const page = await this.get<SpotifyPage<SpotifyTrackPayload>>(
      `/me/top/tracks?time_range=short_term&limit=${limit}`,
      accessToken,
    );
    return mapTracks(page.items ?? []);
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
