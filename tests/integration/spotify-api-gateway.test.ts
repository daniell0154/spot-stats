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

  it('completa gêneros ausentes com os detalhes oficiais do artista', async () => {
    const request = vi.fn((input: string | URL | Request) => {
      const url = String(input);
      if (url.includes('/me/top/artists')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              items: [
                { id: 'sem-genero', name: 'Artista A', genres: [], popularity: 80 },
                { id: 'com-genero', name: 'Artista B', genres: ['rock'], popularity: 70 },
              ],
            }),
            { status: 200 },
          ),
        );
      }

      return Promise.resolve(
        new Response(
          JSON.stringify({ id: 'sem-genero', name: 'Artista A', genres: ['MPB', 'Soul'] }),
          { status: 200 },
        ),
      );
    });

    const result = await new SpotifyApiGateway(request).getTopArtists('token');

    expect(result.map((artist) => artist.id)).toEqual(['sem-genero', 'com-genero']);
    expect(result.map((artist) => artist.genres)).toEqual([['MPB', 'Soul'], ['rock']]);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenLastCalledWith(
      'https://api.spotify.com/v1/artists/sem-genero',
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } }),
    );
  });

  it('preserva o estado vazio quando o detalhe oficial também não tem gêneros', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [{ id: 'x', name: 'Artista X' }] }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'x', name: 'Artista X', genres: [] }), { status: 200 }),
      );

    const result = await new SpotifyApiGateway(request).getTopArtists('token');

    expect(result[0]?.genres).toEqual([]);
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
