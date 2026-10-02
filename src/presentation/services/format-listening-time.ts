import type { ListeningMonth } from '../../domain/entities/listening-history';

export function formatListeningTime(month: ListeningMonth) {
  const minutes = Math.floor(month.playedMs / 60_000);
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;
}
