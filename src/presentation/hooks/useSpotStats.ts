import { useCallback, useEffect, useRef, useState } from 'react';
import { AppError, friendlyError } from '../../application/errors';
import type { AuthGateway } from '../../application/ports/gateways';
import type { GetMonthlyStats } from '../../application/use-cases/get-monthly-stats';
import type { MonthlySnapshot } from '../../domain/entities/stats';

export type ViewState =
  | { status: 'disconnected'; error: string | null }
  | { status: 'loading'; error: null }
  | { status: 'ready'; snapshot: MonthlySnapshot; error: null }
  | { status: 'error'; error: string; retryAfterSeconds: number };

export function useSpotStats(auth: AuthGateway, getStats: GetMonthlyStats) {
  const [view, setView] = useState<ViewState>({ status: 'disconnected', error: null });
  const initialized = useRef(false);

  const load = useCallback(async () => {
    setView({ status: 'loading', error: null });
    try {
      setView({ status: 'ready', snapshot: await getStats.execute(), error: null });
    } catch (error) {
      setView({
        status: 'error',
        error: friendlyError(error),
        retryAfterSeconds: error instanceof AppError ? (error.retryAfterSeconds ?? 0) : 0,
      });
    }
  }, [getStats]);

  useEffect(() => {
    if (view.status !== 'error' || view.retryAfterSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setView((current) =>
        current.status === 'error'
          ? { ...current, retryAfterSeconds: Math.max(0, current.retryAfterSeconds - 1) }
          : current,
      );
    }, 1_000);
    return () => window.clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const params = new URLSearchParams(window.location.search);
    const hasCallback = params.has('code') || params.has('error');

    if (hasCallback) {
      setView({ status: 'loading', error: null });
      auth
        .completeAuthorization(window.location.href)
        .then(() => {
          window.history.replaceState({}, '', '/');
          return load();
        })
        .catch((error: unknown) => {
          window.history.replaceState({}, '', '/');
          setView({ status: 'disconnected', error: friendlyError(error) });
        });
    } else if (auth.hasSession()) {
      void load();
    }
  }, [auth, load]);

  const connect = useCallback(async () => {
    setView({ status: 'loading', error: null });
    try {
      window.location.assign(await auth.createAuthorizationUrl());
    } catch (error) {
      setView({ status: 'disconnected', error: friendlyError(error) });
    }
  }, [auth]);

  const logout = useCallback(() => {
    auth.logout();
    setView({ status: 'disconnected', error: null });
  }, [auth]);

  return { view, connect, retry: load, logout };
}
