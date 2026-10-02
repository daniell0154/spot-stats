import type { SessionRepository } from '../../application/ports/gateways';
import type { UserSession } from '../../domain/entities/stats';

const SESSION_KEY = 'spot-stats.session';
const REQUEST_KEY = 'spot-stats.authorization-request';
const AUTHORIZATION_REQUEST_TTL_MS = 10 * 60 * 1000;

interface StoredAuthorizationRequest {
  state: string;
  verifier: string;
  createdAt: number;
}

export class BrowserSessionRepository implements SessionRepository {
  constructor(
    private readonly sessionStore: Storage = sessionStorage,
    private readonly authorizationStore: Storage = localStorage,
    private readonly now: () => number = Date.now,
  ) {}

  getSession(): UserSession | null {
    const value = this.read(this.sessionStore, SESSION_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as UserSession;
    } catch {
      this.remove(this.sessionStore, SESSION_KEY);
      return null;
    }
  }

  saveSession(session: UserSession): void {
    this.sessionStore.setItem(SESSION_KEY, JSON.stringify(session));
  }

  saveAuthorizationRequest(state: string, verifier: string): void {
    const value = JSON.stringify({ state, verifier, createdAt: this.now() });
    let persisted = this.write(this.authorizationStore, REQUEST_KEY, value);

    // Keep a same-tab fallback for browsers that restrict persistent storage.
    persisted = this.write(this.sessionStore, REQUEST_KEY, value) || persisted;
    if (!persisted) throw new Error('Browser storage is unavailable.');
  }

  consumeAuthorizationRequest(): { state: string; verifier: string } | null {
    const value =
      this.read(this.authorizationStore, REQUEST_KEY) ?? this.read(this.sessionStore, REQUEST_KEY);
    this.remove(this.authorizationStore, REQUEST_KEY);
    this.remove(this.sessionStore, REQUEST_KEY);
    if (!value) return null;

    try {
      const request = JSON.parse(value) as Partial<StoredAuthorizationRequest>;
      if (
        typeof request.state !== 'string' ||
        typeof request.verifier !== 'string' ||
        typeof request.createdAt !== 'number' ||
        this.now() - request.createdAt > AUTHORIZATION_REQUEST_TTL_MS
      ) {
        return null;
      }
      return { state: request.state, verifier: request.verifier };
    } catch {
      return null;
    }
  }

  clear(): void {
    this.remove(this.sessionStore, SESSION_KEY);
    this.remove(this.sessionStore, REQUEST_KEY);
    this.remove(this.authorizationStore, REQUEST_KEY);
  }

  private read(storage: Storage, key: string): string | null {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  private write(storage: Storage, key: string, value: string): boolean {
    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  private remove(storage: Storage, key: string): void {
    try {
      storage.removeItem(key);
    } catch {
      // A blocked storage area has no locally accessible value to clear.
    }
  }
}
