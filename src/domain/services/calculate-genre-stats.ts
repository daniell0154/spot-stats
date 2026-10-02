import type { GenreStat, RankedArtist } from '../entities/stats';

export function calculateGenreStats(
  artists: readonly RankedArtist[],
  limit = 5,
): readonly GenreStat[] {
  const counts = new Map<string, number>();

  for (const genre of artists.flatMap((artist) => artist.genres)) {
    const normalized = genre.trim().toLocaleLowerCase('pt-BR');
    if (normalized) counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  if (total === 0) return [];

  return [...counts.entries()]
    .sort(([nameA, countA], [nameB, countB]) => countB - countA || nameA.localeCompare(nameB))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }));
}
