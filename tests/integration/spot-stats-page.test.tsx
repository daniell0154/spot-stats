import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../../src/application/errors';
import type { AuthGateway } from '../../src/application/ports/gateways';
import type { GetMonthlyStats } from '../../src/application/use-cases/get-monthly-stats';
import { SpotStatsPage } from '../../src/presentation/pages/SpotStatsPage';
import { snapshot } from '../fixtures';

function auth(active = false): AuthGateway {
  return {
    createAuthorizationUrl: vi.fn().mockResolvedValue('https://accounts.spotify.com/authorize'),
    completeAuthorization: vi.fn(),
    getValidAccessToken: vi.fn(),
    refreshAccessToken: vi.fn(),
    hasSession: vi.fn().mockReturnValue(active),
    logout: vi.fn(),
  };
}

describe('SpotStatsPage', () => {
  it('renderiza o dashboard quando existe sessão', async () => {
    const gateway = auth(true);
    const getStats = { execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={gateway} getStats={getStats} />);
    expect(await screen.findByRole('heading', { name: 'Dani' })).toBeInTheDocument();
    expect(screen.getByText('Luedji Luna')).toBeInTheDocument();
    expect(screen.getByText(/Aproximadamente as últimas 4 semanas/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Visão detalhada' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('alterna para um retrato mensal com os dados disponíveis do snapshot', async () => {
    const getStats = { execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    const portraitTab = await screen.findByRole('tab', { name: 'Retrato mensal' });
    fireEvent.click(portraitTab);

    expect(portraitTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Retrato mensal' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Dani.*mês/i })).toBeInTheDocument();
    expect(screen.getByLabelText('2 artistas')).toBeInTheDocument();
    expect(screen.getByLabelText('1 faixa')).toBeInTheDocument();
    expect(screen.getByText(/mpb/i)).toBeInTheDocument();
    expect(getStats.execute).toHaveBeenCalledOnce();
  });

  it('mantém o retrato legível sem imagens nem gêneros', async () => {
    const getStats = {
      execute: vi.fn().mockResolvedValue({
        ...snapshot,
        artists: snapshot.artists.map((artist) => ({ ...artist, imageUrl: null, genres: [] })),
        genres: [],
      }),
    } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    fireEvent.click(await screen.findByRole('tab', { name: 'Retrato mensal' }));

    expect(screen.getByText(/gênero ainda não classificado/i)).toBeInTheDocument();
    expect(screen.getAllByText(/[LL]/).length).toBeGreaterThan(0);
  });

  it('apaga a sessão no logout', async () => {
    const gateway = auth(true);
    const getStats = { execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={gateway} getStats={getStats} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Sair' }));
    await waitFor(() => expect(gateway.logout).toHaveBeenCalledOnce());
    expect(screen.getByRole('button', { name: /Conectar com Spotify/i })).toBeInTheDocument();
  });

  it('mostra estados vazios sem inventar rankings', async () => {
    const getStats = {
      execute: vi.fn().mockResolvedValue({ ...snapshot, artists: [], tracks: [], genres: [] }),
    } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);
    expect(await screen.findByText(/não há artistas suficientes/i)).toBeInTheDocument();
    expect(screen.getByText(/não há faixas suficientes/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem dados de gênero suficientes/i)).toBeInTheDocument();
  });

  it('bloqueia retry durante o Retry-After informado', async () => {
    const getStats = {
      execute: vi.fn().mockRejectedValue(new AppError('RATE_LIMITED', 'limited', 8)),
    } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);
    expect(await screen.findByRole('button', { name: /Tente novamente em 8s/i })).toBeDisabled();
  });
});
