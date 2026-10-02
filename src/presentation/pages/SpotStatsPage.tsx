import { useState, type KeyboardEvent } from 'react';
import type { AuthGateway } from '../../application/ports/gateways';
import type { GetMonthlyStats } from '../../application/use-cases/get-monthly-stats';
import { AppHeader } from '../components/AppHeader';
import { LoginHero } from '../components/LoginHero';
import { MonthlyPortrait } from '../components/MonthlyPortrait';
import { RankedLists } from '../components/RankedLists';
import { SoundCapsule } from '../components/SoundCapsule';
import { StatsOverview } from '../components/StatsOverview';
import { useSpotStats } from '../hooks/useSpotStats';
import { createRandomPalettePair } from '../styles/visual-palettes';
import type { ImportListeningHistory } from '../../application/use-cases/import-listening-history';
import { ListeningHistoryExperience } from '../components/ListeningHistoryExperience';

interface SpotStatsPageProps {
  auth: AuthGateway;
  getStats: GetMonthlyStats;
  historyImporter?: ImportListeningHistory;
}

type DashboardTab = 'details' | 'portrait' | 'capsule';

const TAB_ORDER: readonly DashboardTab[] = ['details', 'portrait', 'capsule'];
const TAB_LABELS: Record<DashboardTab, string> = {
  details: 'Visão detalhada',
  portrait: 'Retrato mensal',
  capsule: 'Cápsula sonora',
};

export function SpotStatsPage({ auth, getStats, historyImporter }: SpotStatsPageProps) {
  const { view, connect, retry, logout } = useSpotStats(auth, getStats);
  const [activeTab, setActiveTab] = useState<DashboardTab>('details');
  const [palettes] = useState(() => createRandomPalettePair());
  const [showListening, setShowListening] = useState(true);

  const selectTabFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    let nextTab: DashboardTab;
    if (event.key === 'Home') nextTab = TAB_ORDER[0];
    else if (event.key === 'End') nextTab = TAB_ORDER[TAB_ORDER.length - 1];
    else if (event.key === 'ArrowLeft') {
      nextTab = TAB_ORDER[(currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length];
    } else {
      nextTab = TAB_ORDER[(currentIndex + 1) % TAB_ORDER.length];
    }
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
        <ListeningHistoryExperience key={view.snapshot.profile.id} importer={historyImporter}>
          {(listeningMonth) => (
            <>
              <div className="dashboard-tabs" role="tablist" aria-label="Visualizações do período">
                {TAB_ORDER.map((tab) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`panel-${tab}`}
                    tabIndex={activeTab === tab ? 0 : -1}
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={selectTabFromKeyboard}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
              {activeTab === 'details' ? (
                <div id="panel-details" role="tabpanel" aria-labelledby="tab-details">
                  <StatsOverview snapshot={view.snapshot} />
                  <RankedLists artists={view.snapshot.artists} tracks={view.snapshot.tracks} />
                </div>
              ) : activeTab === 'portrait' ? (
                <div id="panel-portrait" role="tabpanel" aria-labelledby="tab-portrait">
                  <MonthlyPortrait snapshot={view.snapshot} palette={palettes[0]} />
                </div>
              ) : (
                <div id="panel-capsule" role="tabpanel" aria-labelledby="tab-capsule">
                  <SoundCapsule
                    snapshot={view.snapshot}
                    palette={palettes[1]}
                    listeningMonth={listeningMonth}
                    showListening={showListening}
                    onToggleListening={() => setShowListening((visible) => !visible)}
                  />
                </div>
              )}
            </>
          )}
        </ListeningHistoryExperience>
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
