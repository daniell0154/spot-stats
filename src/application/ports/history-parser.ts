import type { ListeningEvent } from '../../domain/entities/listening-history';

export interface HistoryParser {
  parse(text: string): { events: readonly ListeningEvent[]; ignoredRows: number };
}
