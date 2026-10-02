import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../../src/application/errors';
import type { AuthGateway, SpotifyStatsGateway } from '../../src/application/ports/gateways';
import { GetMonthlyStats } from '../../src/application/use-cases/get-monthly-stats';
import { artists, snapshot } from '../fixtures';

function makeAuth(): AuthGateway {
  return {
    createAuthorizationUrl: vi.fn(),
    completeAuthorization: vi.fn(),
    getValidAccessToken: vi.fn().mockResolvedValue('token'),
    refreshAccessToken: vi.fn().mockResolvedValue('fresh'),
    hasSession: vi.fn(),
    logout: vi.fn(),
  };
}

function makeSpotify(): SpotifyStatsGateway {
  return {
    getProfile: vi.fn().mockResolvedValue(snapshot.profile),
    getTopArtists: vi.fn().mockResolvedValue(artists),
    getTopTracks: vi.fn().mockResolvedValue(snapshot.tracks),
  };
}

describe('GetMonthlyStats', () => {
  it('combina perfil, rankings e gêneros', async () => {
    const result = await new GetMonthlyStats(makeAuth(), makeSpotify()).execute();
    expect(result.profile.displayName).toBe('Dani');
    expect(result.genres[0]).toMatchObject({ name: 'mpb', count: 2 });
    expect(result.periodLabel).toContain('4 semanas');
  });

  it('renova apenas uma vez depois de um 401', async () => {
    const auth = makeAuth();
    const spotify = makeSpotify();
    vi.mocked(spotify.getProfile)
      .mockRejectedValueOnce(new AppError('AUTH_REQUIRED', 'expired'))
      .mockResolvedValueOnce(snapshot.profile);
    const result = await new GetMonthlyStats(auth, spotify).execute();
    expect(auth.refreshAccessToken).toHaveBeenCalledOnce();
    expect(result.profile.id).toBe('user');
  });
});
