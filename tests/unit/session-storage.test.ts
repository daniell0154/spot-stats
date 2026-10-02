import { beforeEach, describe, expect, it } from 'vitest';
import { BrowserSessionRepository } from '../../src/infrastructure/storage/session-storage';

describe('BrowserSessionRepository', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('recupera o PKCE do localStorage quando a navegação perde o sessionStorage', () => {
    const repository = new BrowserSessionRepository(sessionStorage, localStorage, () => 1_000);
    repository.saveAuthorizationRequest('state', 'verifier');

    sessionStorage.clear();

    expect(repository.consumeAuthorizationRequest()).toEqual({
      state: 'state',
      verifier: 'verifier',
    });
    expect(localStorage.getItem('spot-stats.authorization-request')).toBeNull();
  });

  it('descarta um pedido PKCE expirado', () => {
    let now = 1_000;
    const repository = new BrowserSessionRepository(sessionStorage, localStorage, () => now);
    repository.saveAuthorizationRequest('state', 'verifier');

    now += 10 * 60 * 1000 + 1;

    expect(repository.consumeAuthorizationRequest()).toBeNull();
  });

  it('mantém tokens somente no sessionStorage e limpa todo o material no logout', () => {
    const repository = new BrowserSessionRepository(sessionStorage, localStorage, () => 1_000);
    repository.saveSession({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresAt: 2_000,
      scopes: ['user-top-read'],
    });
    repository.saveAuthorizationRequest('state', 'verifier');

    expect(localStorage.getItem('spot-stats.session')).toBeNull();

    repository.clear();

    expect(repository.getSession()).toBeNull();
    expect(localStorage.getItem('spot-stats.authorization-request')).toBeNull();
  });
});
