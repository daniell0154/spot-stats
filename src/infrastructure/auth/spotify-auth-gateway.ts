import { AppError } from '../../application/errors';
import type { AuthGateway, SessionRepository } from '../../application/ports/gateways';
import type { UserSession } from '../../domain/entities/stats';
import { createCodeChallenge, createRandomValue } from './pkce';

interface SpotifyTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
}

export interface SpotifyAuthConfig {
  clientId: string;
  redirectUri: string;
}

export class SpotifyAuthGateway implements AuthGateway {
  constructor(
    private readonly config: SpotifyAuthConfig,
    private readonly sessions: SessionRepository,
    private readonly request: typeof fetch = fetch,
    private readonly now: () => number = Date.now,
  ) {}

  async createAuthorizationUrl(): Promise<string> {
    this.assertConfigured();
    const verifier = createRandomValue();
    const state = createRandomValue(32);
    const challenge = await createCodeChallenge(verifier);
    this.sessions.saveAuthorizationRequest(state, verifier);

    const url = new URL('https://accounts.spotify.com/authorize');
    url.search = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: 'user-read-private user-top-read',
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state,
    }).toString();
    return url.toString();
  }

  async completeAuthorization(callbackUrl: string): Promise<UserSession> {
    const callback = new URL(callbackUrl);
    const authorizationRequest = this.sessions.consumeAuthorizationRequest();
    const code = callback.searchParams.get('code');
    const state = callback.searchParams.get('state');
    const providerError = callback.searchParams.get('error');

    if (providerError) throw new AppError('AUTH_FAILED', `Authorization failed: ${providerError}`);
    if (!authorizationRequest || !code || state !== authorizationRequest.state) {
      throw new AppError('AUTH_FAILED', 'Invalid OAuth callback.');
    }

    // Native browser fetch must not receive the gateway instance as its `this` value.
    const request = this.request;
    const response = await request('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        code_verifier: authorizationRequest.verifier,
      }),
    });
    const session = await this.readSession(response);
    this.sessions.saveSession(session);
    return session;
  }

  async getValidAccessToken(): Promise<string> {
    const session = this.sessions.getSession();
    if (!session) throw new AppError('AUTH_REQUIRED', 'No active session.');
    if (session.expiresAt - this.now() > 30_000) return session.accessToken;
    return this.refreshAccessToken();
  }

  async refreshAccessToken(): Promise<string> {
    const current = this.sessions.getSession();
    if (!current?.refreshToken) throw new AppError('AUTH_REQUIRED', 'No refresh token.');
    const request = this.request;
    const response = await request('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        grant_type: 'refresh_token',
        refresh_token: current.refreshToken,
      }),
    });
    const refreshed = await this.readSession(response, current.refreshToken);
    this.sessions.saveSession(refreshed);
    return refreshed.accessToken;
  }

  hasSession(): boolean {
    return this.sessions.getSession() !== null;
  }

  logout(): void {
    this.sessions.clear();
  }

  private async readSession(response: Response, fallbackRefreshToken = ''): Promise<UserSession> {
    if (!response.ok) throw new AppError('AUTH_FAILED', 'Spotify token exchange failed.');
    const token = (await response.json()) as SpotifyTokenResponse;
    if (!token.access_token || !token.expires_in) {
      throw new AppError('AUTH_FAILED', 'Spotify returned an invalid token response.');
    }
    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? fallbackRefreshToken,
      expiresAt: this.now() + token.expires_in * 1000,
      scopes: token.scope?.split(' ').filter(Boolean) ?? [],
    };
  }

  private assertConfigured(): void {
    if (!this.config.clientId || this.config.clientId === 'your_spotify_client_id') {
      throw new AppError('CONFIGURATION_ERROR', 'Missing Spotify client ID.');
    }
  }
}
