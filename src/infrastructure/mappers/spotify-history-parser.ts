import type { HistoryParser } from '../../application/ports/history-parser';
import type { ListeningEvent } from '../../domain/entities/listening-history';

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class SpotifyHistoryParser implements HistoryParser {
  parse(text: string) {
    let payload: unknown;
    try {
      payload = JSON.parse(text.replace(/^\uFEFF/, ''));
    } catch {
      throw new Error(
        'JSON inválido. Extraia o ZIP e selecione os arquivos de histórico estendido.',
      );
    }
    if (
      !Array.isArray(payload) ||
      !payload.some((row: unknown) => record(row) && 'ts' in row && 'ms_played' in row)
    ) {
      throw new Error(
        'Formato não reconhecido. Use os JSONs de Histórico de streaming estendido do Spotify.',
      );
    }
    const events: ListeningEvent[] = [];
    let ignoredRows = 0;
    for (const row of payload as unknown[]) {
      if (
        !record(row) ||
        typeof row.ts !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(row.ts) ||
        !Number.isFinite(Date.parse(row.ts)) ||
        new Date(row.ts).toISOString().slice(0, 19) !== row.ts.slice(0, 19) ||
        typeof row.ms_played !== 'number' ||
        !Number.isSafeInteger(row.ms_played) ||
        row.ms_played < 0 ||
        typeof row.master_metadata_track_name !== 'string' ||
        !row.master_metadata_track_name.trim() ||
        typeof row.master_metadata_album_artist_name !== 'string' ||
        !row.master_metadata_album_artist_name.trim()
      ) {
        ignoredRows += 1;
        continue;
      }
      events.push({
        endedAt: new Date(row.ts).toISOString(),
        musicId:
          typeof row.spotify_track_uri === 'string' && row.spotify_track_uri
            ? row.spotify_track_uri
            : JSON.stringify([
                row.master_metadata_album_artist_name,
                row.master_metadata_track_name,
              ]),
        playedMs: row.ms_played,
      });
    }
    return { events, ignoredRows };
  }
}
