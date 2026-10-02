import { GetMonthlyStats } from '../application/use-cases/get-monthly-stats';
import { SpotifyAuthGateway } from '../infrastructure/auth/spotify-auth-gateway';
import { SpotifyApiGateway } from '../infrastructure/http/spotify-api-gateway';
import { BrowserSessionRepository } from '../infrastructure/storage/session-storage';
import { ImportListeningHistory } from '../application/use-cases/import-listening-history';
import { SpotifyHistoryParser } from '../infrastructure/mappers/spotify-history-parser';

export const historyImporter = new ImportListeningHistory(new SpotifyHistoryParser());

const sessionRepository = new BrowserSessionRepository();

export const authGateway = new SpotifyAuthGateway(
  {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? '',
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI ?? 'http://127.0.0.1:5173/callback',
  },
  sessionRepository,
);

export const getMonthlyStats = new GetMonthlyStats(authGateway, new SpotifyApiGateway());
