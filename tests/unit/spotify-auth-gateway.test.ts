import { describe, expect, it, vi } from 'vitest';
import type { SessionRepository } from '../../src/application/ports/gateways';
import { SpotifyAuthGateway } from '../../src/infrastructure/auth/spotify-auth-gateway';

function repository(requestState = { state: 'expected', verifier: 'verifier' }): SessionRepository {
  return {
    getSession: vi.fn().mockReturnValue(null),
    saveSession: vi.fn(),
    clear: vi.fn(),
    saveAuthorizationRequest: vi.fn(),
    consumeAuthorizationRequest: vi.fn().mockReturnValue(requestState),
  };
}

describe('SpotifyAuthGateway', () => {
  it('rejeita login sem client ID configurado', async () => {
    const gateway = new SpotifyAuthGateway(
      { clientId: '', redirectUri: 'http://127.0.0.1:5173/callback' },
      repository(),
    );
    await expect(gateway.createAuthorizationUrl()).rejects.toMatchObject({
      code: 'CONFIGURATION_ERROR',
    });
  });

  it('rejeita callback com state divergente sem trocar token', async () => {
    const fetcher = vi.fn();
    const gateway = new SpotifyAuthGateway(
      { clientId: 'client', redirectUri: 'http://127.0.0.1:5173/callback' },
      repository(),
      fetcher,
    );
    await expect(
      gateway.completeAuthorization('http://127.0.0.1:5173/callback?code=abc&state=wrong'),
    ).rejects.toMatchObject({ code: 'AUTH_FAILED' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('salva uma sessão válida depois do callback', async () => {
    const sessions = repository();
    const fetcher = vi.fn(function (this: unknown) {
      expect(this).toBeUndefined();
      return Promise.resolve(
        new Response(
          JSON.stringify({
            access_token: 'access',
            refresh_token: 'refresh',
            expires_in: 3600,
            scope: 'user-top-read',
          }),
          { status: 200 },
        ),
      );
    });
    const gateway = new SpotifyAuthGateway(
      { clientId: 'client', redirectUri: 'http://127.0.0.1:5173/callback' },
      sessions,
      fetcher,
      () => 1_000,
    );
    const session = await gateway.completeAuthorization(
      'http://127.0.0.1:5173/callback?code=abc&state=expected',
    );
    expect(session).toMatchObject({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresAt: 3_601_000,
    });
    expect(sessions.saveSession).toHaveBeenCalledWith(session);
  });
});
