import { describe, expect, it } from 'vitest';
import { calculateGenreStats } from '../../src/domain/services/calculate-genre-stats';
import { artists } from '../fixtures';

describe('calculateGenreStats', () => {
  it('normaliza, ordena e limita os gêneros', () => {
    expect(calculateGenreStats(artists)).toEqual([
      { name: 'mpb', count: 2, percentage: 50 },
      { name: 'afrofuturismo', count: 1, percentage: 25 },
      { name: 'nova mpb', count: 1, percentage: 25 },
    ]);
  });

  it('retorna vazio quando artistas não possuem gêneros', () => {
    expect(calculateGenreStats([{ ...artists[0], genres: [] }])).toEqual([]);
  });
});
