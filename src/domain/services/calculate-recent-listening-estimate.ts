import type { RecentListeningEstimate, RecentPlay } from '../entities/stats';

const RECENT_PLAY_SAMPLE_LIMIT = 50;

export function calculateRecentListeningEstimate(
  plays: readonly RecentPlay[],
): RecentListeningEstimate | null {
  const sample = plays.slice(0, RECENT_PLAY_SAMPLE_LIMIT);
  if (sample.length === 0) return null;

  const totalDurationMs = sample.reduce((total, play) => total + Math.max(0, play.durationMs), 0);

  return {
    minutes: Math.round(totalDurationMs / 60_000),
    playCount: sample.length,
    sampleLimit: RECENT_PLAY_SAMPLE_LIMIT,
  };
}
