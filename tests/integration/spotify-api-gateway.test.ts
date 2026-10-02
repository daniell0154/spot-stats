import { describe, expect, it, vi } from 'vitest';
import { SpotifyApiGateway } from '../../src/infrastructure/http/spotify-api-gateway';

describe('SpotifyApiGateway', () => {
  it('mapeia artistas e preserva a ordem do provedor', async () => {
    const request = vi.fn(function (this: unknown) {
      expect(this).toBeUndefined();
      return Promise.resolve(
        new Response(
          JSON.stringify({
            items: [
              {
                id: 'x',
                name: 'Artista X',
                genres: ['MPB'],
                popularity: 91,
                images: [],
                external_urls: { spotify: 'https://example.com/x' },
              },
            ],
          }),
          { status: 200 },
        ),
      );
    });
    const result = await new SpotifyApiGateway(request).getTopArtists('token');
    expect(result[0]).toMatchObject({ rank: 1, id: 'x', imageUrl: null, popularity: 91 });
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('time_range=short_term'),
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } }),
    );
  });

  it('traduz rate limit com Retry-After', async () => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 429, headers: { 'Retry-After': '8' } }));
    await expect(new SpotifyApiGateway(request).getProfile('token')).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      retryAfterSeconds: 8,
    });
  });

  it('traduz falhas genéricas do provedor sem expor o corpo', async () => {
    const request = vi.fn().mockResolvedValue(new Response('provider detail', { status: 500 }));
    await expect(new SpotifyApiGateway(request).getProfile('token')).rejects.toMatchObject({
      code: 'PROVIDER_ERROR',
    });
  });
});
