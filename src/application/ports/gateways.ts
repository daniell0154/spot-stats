import type {
  RankedArtist,
  RankedTrack,
  UserProfile,
  UserSession,
} from '../../domain/entities/stats';

export interface AuthGateway {
  createAuthorizationUrl(): Promise<string>;
  completeAuthorization(callbackUrl: string): Promise<UserSession>;
  getValidAccessToken(): Promise<string>;
  refreshAccessToken(): Promise<string>;
  hasSession(): boolean;
  logout(): void;
}

export interface SpotifyStatsGateway {
  getProfile(accessToken: string): Promise<UserProfile>;
  getTopArtists(accessToken: string, limit?: number): Promise<readonly RankedArtist[]>;
  getTopTracks(accessToken: string, limit?: number): Promise<readonly RankedTrack[]>;
}

export interface SessionRepository {
  getSession(): UserSession | null;
  saveSession(session: UserSession): void;
  clear(): void;
  saveAuthorizationRequest(state: string, verifier: string): void;
  consumeAuthorizationRequest(): { state: string; verifier: string } | null;
}
