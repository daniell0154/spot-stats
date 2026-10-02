import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import documentMarkup from '../../index.html?raw';
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
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Logo Spotify' })).toHaveAttribute(
      'src',
      '/spotify-purple-logo.png',
    );
  });

  it('registra a logo compartilhada e a cor roxa no documento', () => {
    expect(documentMarkup).toContain(
      '<link rel="icon" type="image/png" href="/spotify-purple-logo.png" />',
    );
    expect(documentMarkup).toContain('<meta name="theme-color" content="#100911" />');
  });

  it('alterna para a cápsula sonora com capa, edição e destaques reais', async () => {
    const getStats = { execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    fireEvent.click(await screen.findByRole('tab', { name: 'Cápsula sonora' }));

    expect(screen.getByRole('tabpanel', { name: 'Cápsula sonora' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minha cápsula sonora' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Artistas em destaque' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Faixas em destaque' })).toBeInTheDocument();
    expect(screen.getByText(/50%.*mpb/i)).toBeInTheDocument();
    expect(screen.getByText(/aproximadamente 4 semanas/i)).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.queryByText('Spot/Stats')).not.toBeInTheDocument();
    expect(screen.getByText('≈ 5 minutos')).toBeInTheDocument();
    expect(screen.getByText(/2 reproduções recentes/i)).toBeInTheDocument();
    expect(screen.getByText(/não é tempo real ouvido/i)).toBeInTheDocument();
    expect(screen.getByTestId('capsule-brand-logo')).toHaveAttribute(
      'src',
      '/spotify-neutral-logo.png',
    );
    expect(getStats.execute).toHaveBeenCalledOnce();
  });

  it('mantém a cápsula útil sem permissão ou eventos recentes', async () => {
    const getStats = {
      execute: vi.fn().mockResolvedValue({ ...snapshot, recentListeningEstimate: null }),
    } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    fireEvent.click(await screen.findByRole('tab', { name: 'Cápsula sonora' }));

    expect(screen.getByText(/reconecte para incluir a estimativa/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Minha cápsula sonora' })).toBeInTheDocument();
  });

  it('mantém paletas distintas e estáveis ao alternar entre as artes', async () => {
    const getStats = { execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    fireEvent.click(await screen.findByRole('tab', { name: 'Retrato mensal' }));
    const portraitPalette = screen
      .getByRole('heading', { name: /Dani.*mês/i })
      .closest('article')
      ?.getAttribute('data-palette');

    fireEvent.click(screen.getByRole('tab', { name: 'Cápsula sonora' }));
    const capsulePalette = screen
      .getByRole('heading', { name: 'Minha cápsula sonora' })
      .closest('article')
      ?.getAttribute('data-palette');

    expect(portraitPalette).toBeTruthy();
    expect(capsulePalette).toBeTruthy();
    expect(portraitPalette).not.toBe(capsulePalette);

    fireEvent.click(screen.getByRole('tab', { name: 'Retrato mensal' }));
    expect(
      screen
        .getByRole('heading', { name: /Dani.*mês/i })
        .closest('article')
        ?.getAttribute('data-palette'),
    ).toBe(portraitPalette);
  });

  it('percorre ciclicamente as três abas com o teclado', async () => {
    const getStats = { execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    const details = await screen.findByRole('tab', { name: 'Visão detalhada' });
    fireEvent.keyDown(details, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Cápsula sonora' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Cápsula sonora' }), { key: 'ArrowRight' });
    expect(details).toHaveAttribute('aria-selected', 'true');
  });

  it('usa contagem real quando a cápsula não tem imagem nem gênero', async () => {
    const getStats = {
      execute: vi.fn().mockResolvedValue({
        ...snapshot,
        artists: snapshot.artists.map((artist) => ({ ...artist, imageUrl: null, genres: [] })),
        genres: [],
      }),
    } as unknown as GetMonthlyStats;
    render(<SpotStatsPage auth={auth(true)} getStats={getStats} />);

    fireEvent.click(await screen.findByRole('tab', { name: 'Cápsula sonora' }));

    expect(screen.getByText('3 itens')).toBeInTheDocument();
    expect(screen.getByLabelText(/capa sem imagem/i)).toBeInTheDocument();
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
