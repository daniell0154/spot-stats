import { useState, type KeyboardEvent } from 'react';
import type { AuthGateway } from '../../application/ports/gateways';
import type { GetMonthlyStats } from '../../application/use-cases/get-monthly-stats';
import { AppHeader } from '../components/AppHeader';
import { LoginHero } from '../components/LoginHero';
import { MonthlyPortrait } from '../components/MonthlyPortrait';
import { RankedLists } from '../components/RankedLists';
import { StatsOverview } from '../components/StatsOverview';
import { useSpotStats } from '../hooks/useSpotStats';

interface SpotStatsPageProps {
  auth: AuthGateway;
  getStats: GetMonthlyStats;
}

export function SpotStatsPage({ auth, getStats }: SpotStatsPageProps) {
  const { view, connect, retry, logout } = useSpotStats(auth, getStats);
  const [activeTab, setActiveTab] = useState<'details' | 'portrait'>('details');

  const selectTabFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextTab = event.key === 'ArrowLeft' || event.key === 'Home' ? 'details' : 'portrait';
    setActiveTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(`tab-${nextTab}`)?.focus());
  };

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
        <div className="dashboard-tabs" role="tablist" aria-label="Visualizações do período">
          <button
            id="tab-details"
            type="button"
            role="tab"
            aria-selected={activeTab === 'details'}
            aria-controls="panel-details"
            tabIndex={activeTab === 'details' ? 0 : -1}
            onClick={() => setActiveTab('details')}
            onKeyDown={selectTabFromKeyboard}
          >
            Visão detalhada
          </button>
          <button
            id="tab-portrait"
            type="button"
            role="tab"
            aria-selected={activeTab === 'portrait'}
            aria-controls="panel-portrait"
            tabIndex={activeTab === 'portrait' ? 0 : -1}
            onClick={() => setActiveTab('portrait')}
            onKeyDown={selectTabFromKeyboard}
          >
            Retrato mensal
          </button>
        </div>
        {activeTab === 'details' ? (
          <div id="panel-details" role="tabpanel" aria-labelledby="tab-details">
            <StatsOverview snapshot={view.snapshot} />
            <RankedLists artists={view.snapshot.artists} tracks={view.snapshot.tracks} />
          </div>
        ) : (
          <div id="panel-portrait" role="tabpanel" aria-labelledby="tab-portrait">
            <MonthlyPortrait snapshot={view.snapshot} />
          </div>
        )}
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
