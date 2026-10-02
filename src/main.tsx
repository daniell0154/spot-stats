import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { authGateway, getMonthlyStats, historyImporter } from './app/composition';
import { SpotStatsPage } from './presentation/pages/SpotStatsPage';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpotStatsPage
      auth={authGateway}
      getStats={getMonthlyStats}
      historyImporter={historyImporter}
    />
  </StrictMode>,
);
