export interface UserProfile {
  readonly id: string;
  readonly displayName: string;
  readonly imageUrl: string | null;
  readonly country: string | null;
}

export interface RankedArtist {
  readonly rank: number;
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string | null;
  readonly genres: readonly string[];
  readonly popularity: number;
  readonly externalUrl: string;
}

export interface RankedTrack {
  readonly rank: number;
  readonly id: string;
  readonly name: string;
  readonly artists: readonly string[];
  readonly albumName: string;
  readonly imageUrl: string | null;
  readonly durationMs: number;
  readonly explicit: boolean;
  readonly externalUrl: string;
}

export interface GenreStat {
  readonly name: string;
  readonly count: number;
  readonly percentage: number;
}

export interface RecentPlay {
  readonly trackId: string;
  readonly durationMs: number;
  readonly playedAt: string;
}

export interface RecentListeningEstimate {
  readonly minutes: number;
  readonly playCount: number;
  readonly sampleLimit: 50;
}

export interface MonthlySnapshot {
  readonly profile: UserProfile;
  readonly artists: readonly RankedArtist[];
  readonly tracks: readonly RankedTrack[];
  readonly genres: readonly GenreStat[];
  readonly recentListeningEstimate: RecentListeningEstimate | null;
  readonly periodLabel: 'Aproximadamente as últimas 4 semanas';
}

export interface UserSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
  readonly scopes: readonly string[];
}
