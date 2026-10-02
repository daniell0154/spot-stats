import { describe, expect, it } from 'vitest';
import { calculateRecentListeningEstimate } from '../../src/domain/services/calculate-recent-listening-estimate';

describe('calculateRecentListeningEstimate', () => {
  it('soma as durações integrais e arredonda para minutos', () => {
    expect(
      calculateRecentListeningEstimate([
        { trackId: 'a', durationMs: 90_000, playedAt: '2026-10-01T10:00:00Z' },
        { trackId: 'b', durationMs: 150_000, playedAt: '2026-10-01T11:00:00Z' },
      ]),
    ).toEqual({ minutes: 4, playCount: 2, sampleLimit: 50 });
  });

  it('limita a amostra a 50 eventos e retorna null sem eventos', () => {
    const plays = Array.from({ length: 51 }, (_, index) => ({
      trackId: String(index),
      durationMs: 60_000,
      playedAt: '2026-10-01T10:00:00Z',
    }));

    expect(calculateRecentListeningEstimate(plays)).toEqual({
      minutes: 50,
      playCount: 50,
      sampleLimit: 50,
    });
    expect(calculateRecentListeningEstimate([])).toBeNull();
  });
});
