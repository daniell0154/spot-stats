import { AppError } from '../errors';
import type { AuthGateway, SpotifyStatsGateway } from '../ports/gateways';
import type { MonthlySnapshot } from '../../domain/entities/stats';
import { calculateGenreStats } from '../../domain/services/calculate-genre-stats';
import { calculateRecentListeningEstimate } from '../../domain/services/calculate-recent-listening-estimate';

export class GetMonthlyStats {
  constructor(
    private readonly auth: AuthGateway,
    private readonly spotify: SpotifyStatsGateway,
  ) {}

  async execute(): Promise<MonthlySnapshot> {
    const initialToken = await this.auth.getValidAccessToken();

    try {
      return await this.load(initialToken);
    } catch (error) {
      if (!(error instanceof AppError) || error.code !== 'AUTH_REQUIRED') throw error;
      const refreshedToken = await this.auth.refreshAccessToken();
      return this.load(refreshedToken);
    }
  }

  private async load(accessToken: string): Promise<MonthlySnapshot> {
    const [profile, artists, tracks, recentPlays] = await Promise.all([
      this.spotify.getProfile(accessToken),
      this.spotify.getTopArtists(accessToken, 10),
      this.spotify.getTopTracks(accessToken, 10),
      this.loadRecentPlays(accessToken),
    ]);

    return {
      profile,
      artists,
      tracks,
      genres: calculateGenreStats(artists),
      recentListeningEstimate: calculateRecentListeningEstimate(recentPlays),
      periodLabel: 'Aproximadamente as últimas 4 semanas',
    };
  }

  private async loadRecentPlays(accessToken: string) {
    try {
      return await this.spotify.getRecentlyPlayed(accessToken, 50);
    } catch (error) {
      if (error instanceof AppError && error.code === 'FORBIDDEN') return [];
      throw error;
    }
  }
}
