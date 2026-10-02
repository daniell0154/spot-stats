import type { MonthlySnapshot, RankedArtist } from '../src/domain/entities/stats';

export const artists: readonly RankedArtist[] = [
  {
    rank: 1,
    id: 'a1',
    name: 'Luedji Luna',
    imageUrl: null,
    genres: ['MPB', 'Afrofuturismo'],
    popularity: 70,
    externalUrl: 'https://open.spotify.com/artist/a1',
  },
  {
    rank: 2,
    id: 'a2',
    name: 'Liniker',
    imageUrl: null,
    genres: ['MPB', 'Nova MPB'],
    popularity: 75,
    externalUrl: 'https://open.spotify.com/artist/a2',
  },
];

export const snapshot: MonthlySnapshot = {
  profile: { id: 'user', displayName: 'Dani', imageUrl: null, country: 'BR' },
  artists,
  tracks: [
    {
      rank: 1,
      id: 't1',
      name: 'Faixa Solar',
      artists: ['Artista Um'],
      albumName: 'Álbum',
      imageUrl: null,
      durationMs: 185_000,
      explicit: false,
      externalUrl: 'https://open.spotify.com/track/t1',
    },
  ],
  genres: [{ name: 'mpb', count: 2, percentage: 50 }],
  periodLabel: 'Aproximadamente as últimas 4 semanas',
};
