import type { ListeningHistory, ListeningMonth } from '../../domain/entities/listening-history';
import type { HistoryParser } from '../ports/history-parser';

export class ImportListeningHistory {
  constructor(private readonly parser: HistoryParser) {}

  async execute(texts: AsyncIterable<string>): Promise<ListeningHistory> {
    const seen = new Set<string>();
    const months = new Map<string, ListeningMonth>();
    let ignoredRows = 0;
    let duplicates = 0;
    for await (const text of texts) {
      const parsed = this.parser.parse(text);
      ignoredRows += parsed.ignoredRows;
      for (const event of parsed.events) {
        const key = JSON.stringify([event.endedAt, event.musicId, event.playedMs]);
        if (seen.has(key)) {
          duplicates += 1;
          continue;
        }
        seen.add(key);
        const month = event.endedAt.slice(0, 7);
        const previous = months.get(month);
        const playedMs = (previous?.playedMs ?? 0) + event.playedMs;
        if (!Number.isSafeInteger(playedMs))
          throw new Error('O total do histórico é muito grande.');
        months.set(month, {
          month,
          playedMs,
          eventCount: (previous?.eventCount ?? 0) + 1,
          firstEvent:
            previous && previous.firstEvent < event.endedAt ? previous.firstEvent : event.endedAt,
          lastEvent:
            previous && previous.lastEvent > event.endedAt ? previous.lastEvent : event.endedAt,
        });
      }
    }
    if (!months.size)
      throw new Error('Nenhuma reprodução de música válida encontrada nos arquivos.');
    return {
      months: [...months.values()].sort((a, b) => b.month.localeCompare(a.month)),
      ignoredRows,
      duplicates,
    };
  }
}
