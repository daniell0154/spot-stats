export interface ListeningEvent {
  readonly endedAt: string;
  readonly musicId: string;
  readonly playedMs: number;
}

export interface ListeningMonth {
  readonly month: string;
  readonly playedMs: number;
  readonly eventCount: number;
  readonly firstEvent: string;
  readonly lastEvent: string;
}

export interface ListeningHistory {
  readonly months: readonly ListeningMonth[];
  readonly ignoredRows: number;
  readonly duplicates: number;
}
