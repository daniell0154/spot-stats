import type { SessionRepository } from '../../application/ports/gateways';
import type { UserSession } from '../../domain/entities/stats';

const SESSION_KEY = 'spot-stats.session';
const REQUEST_KEY = 'spot-stats.authorization-request';

export class BrowserSessionRepository implements SessionRepository {
  constructor(private readonly storage: Storage = sessionStorage) {}

  getSession(): UserSession | null {
    const value = this.storage.getItem(SESSION_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as UserSession;
    } catch {
      this.storage.removeItem(SESSION_KEY);
      return null;
    }
  }

  saveSession(session: UserSession): void {
    this.storage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  saveAuthorizationRequest(state: string, verifier: string): void {
    this.storage.setItem(REQUEST_KEY, JSON.stringify({ state, verifier }));
  }

  consumeAuthorizationRequest(): { state: string; verifier: string } | null {
    const value = this.storage.getItem(REQUEST_KEY);
    this.storage.removeItem(REQUEST_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as { state: string; verifier: string };
    } catch {
      return null;
    }
  }

  clear(): void {
    this.storage.removeItem(SESSION_KEY);
    this.storage.removeItem(REQUEST_KEY);
  }
}
