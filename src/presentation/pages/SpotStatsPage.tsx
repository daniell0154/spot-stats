import type { AuthGateway } from '../../application/ports/gateways';
import type { GetMonthlyStats } from '../../application/use-cases/get-monthly-stats';
import { AppHeader } from '../components/AppHeader';
import { LoginHero } from '../components/LoginHero';
import { RankedLists } from '../components/RankedLists';
import { StatsOverview } from '../components/StatsOverview';
import { useSpotStats } from '../hooks/useSpotStats';

interface SpotStatsPageProps {
  auth: AuthGateway;
  getStats: GetMonthlyStats;
}

export function SpotStatsPage({ auth, getStats }: SpotStatsPageProps) {
  const { view, connect, retry, logout } = useSpotStats(auth, getStats);

  if (view.status === 'disconnected') {
    return (
      <>
        <AppHeader />
        <LoginHero onConnect={() => void connect()} loading={false} error={view.error} />
      </>
    );
  }

  if (view.status === 'loading') {
    return (
      <>
        <AppHeader />
        <main className="state-page" id="conteudo" aria-live="polite">
          <div className="loader" aria-hidden="true" />
          <p>Organizando seu momento musical…</p>
          <small>Isso costuma levar só alguns segundos.</small>
        </main>
      </>
    );
  }

  if (view.status === 'error') {
    return (
      <>
        <AppHeader onLogout={logout} />
        <main className="state-page" id="conteudo">
          <span className="state-code">PAUSA / 01</span>
          <h1>
            O ritmo saiu
            <br />
            do compasso.
          </h1>
          <p role="alert">{view.error}</p>
          <div className="state-actions">
            <button
              className="primary-button"
              onClick={() => void retry()}
              disabled={view.retryAfterSeconds > 0}
            >
              {view.retryAfterSeconds > 0
                ? `Tente novamente em ${view.retryAfterSeconds}s`
                : 'Tentar novamente'}
            </button>
            <button className="ghost-button" onClick={logout}>
              Reconectar
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader profile={view.snapshot.profile} onLogout={logout} />
      <main className="dashboard" id="conteudo">
        <StatsOverview snapshot={view.snapshot} />
        <RankedLists artists={view.snapshot.artists} tracks={view.snapshot.tracks} />
        <footer>
          <p>
            Os rankings refletem afinidade calculada pelo Spotify, não contagem exata de
            reproduções.
          </p>
          <span>SPOT/STATS · {new Date().getFullYear()}</span>
        </footer>
      </main>
    </>
  );
}
