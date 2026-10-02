import { describe, expect, it } from 'vitest';
import { ImportListeningHistory } from '../../src/application/use-cases/import-listening-history';
import { SpotifyHistoryParser } from '../../src/infrastructure/mappers/spotify-history-parser';

const parser = new SpotifyHistoryParser();
const row = {
  ts: '2026-09-30T23:59:59Z',
  ms_played: 60_000_000,
  master_metadata_track_name: 'Music',
  master_metadata_album_artist_name: 'Artist',
  spotify_track_uri: 'spotify:track:one',
};
async function* texts(...rows: unknown[][]) {
  for (const value of rows) yield JSON.stringify(value);
}

describe('imported listening history', () => {
  it('sums actual milliseconds, deduplicates overlapping files and groups UTC months', async () => {
    const result = await new ImportListeningHistory(parser).execute(
      texts([row], [row, { ...row, ts: '2026-10-01T00:00:00Z', ms_played: 10_000 }]),
    );
    expect(result.duplicates).toBe(1);
    expect(result.months.map((m) => [m.month, m.playedMs, m.eventCount])).toEqual([
      ['2026-10', 10_000, 1],
      ['2026-09', 60_000_000, 1],
    ]);
  });
  it('excludes podcasts, invalid dates and invalid durations, while preserving zero and partial plays', () => {
    const result = parser.parse(
      JSON.stringify([
        row,
        { ...row, ms_played: 0 },
        { ...row, ms_played: 500 },
        { ...row, master_metadata_track_name: null },
        { ...row, ts: '2026-02-30T00:00:00Z' },
        { ...row, ms_played: -1 },
        { ...row, ms_played: '500' },
        { ...row, ms_played: 0.5 },
      ]),
    );
    expect(result.events.map((e) => e.playedMs)).toEqual([60_000_000, 0, 500]);
    expect(result.ignoredRows).toBe(5);
    expect(result.events[0]).not.toHaveProperty('ip_addr');
  });
  it('rejects malformed and unsupported files without leaking their contents', () => {
    expect(() => parser.parse('secret data')).toThrow('JSON inválido');
    expect(() => parser.parse('[{"msPlayed": 10}]')).toThrow('Formato não reconhecido');
    expect(() => parser.parse('[]')).toThrow('Formato não reconhecido');
  });
  it('rejects an import with no valid music', async () => {
    await expect(
      new ImportListeningHistory(parser).execute(
        texts([{ ...row, master_metadata_track_name: null }]),
      ),
    ).rejects.toThrow('Nenhuma reprodução');
  });
});
