import { GetMonthlyStats } from '../application/use-cases/get-monthly-stats';
import { SpotifyAuthGateway } from '../infrastructure/auth/spotify-auth-gateway';
import { SpotifyApiGateway } from '../infrastructure/http/spotify-api-gateway';
import { BrowserSessionRepository } from '../infrastructure/storage/session-storage';

const sessionRepository = new BrowserSessionRepository();

export const authGateway = new SpotifyAuthGateway(
  {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? '',
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI ?? 'http://127.0.0.1:5173/callback',
  },
  sessionRepository,
);

export const getMonthlyStats = new GetMonthlyStats(authGateway, new SpotifyApiGateway());
