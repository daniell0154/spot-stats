import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImportListeningHistory } from '../../src/application/use-cases/import-listening-history';
import type { GetMonthlyStats } from '../../src/application/use-cases/get-monthly-stats';
import { SpotifyHistoryParser } from '../../src/infrastructure/mappers/spotify-history-parser';
import { SpotStatsPage } from '../../src/presentation/pages/SpotStatsPage';
import { snapshot } from '../fixtures';

function setup() {
  const auth = {
    hasSession: () => true,
    createAuthorizationUrl: vi.fn(),
    completeAuthorization: vi.fn(),
    getValidAccessToken: vi.fn(),
    refreshAccessToken: vi.fn(),
    logout: vi.fn(),
  };
  render(
    <SpotStatsPage
      auth={auth}
      getStats={{ execute: vi.fn().mockResolvedValue(snapshot) } as unknown as GetMonthlyStats}
      historyImporter={new ImportListeningHistory(new SpotifyHistoryParser())}
    />,
  );
}
function file(content: string, name = 'Streaming_History_Audio.json') {
  const result = new File([content], name, { type: 'application/json' });
  Object.defineProperty(result, 'text', { value: async () => content });
  return result;
}
const rows = [
  {
    ts: '2026-09-10T12:00:00Z',
    ms_played: 60_000_000,
    master_metadata_track_name: 'Track',
    master_metadata_album_artist_name: 'Artist',
  },
  {
    ts: '2026-08-10T12:00:00Z',
    ms_played: 120_000,
    master_metadata_track_name: 'Track',
    master_metadata_album_artist_name: 'Artist',
  },
];

describe('history import experience', () => {
  it('shows actual monthly hours in the capsule and export content, changes month, recovers and removes', async () => {
    setup();
    const input = await screen.findByLabelText(/Importar arquivos/);
    fireEvent.change(input, { target: { files: [file(JSON.stringify(rows))] } });
    expect(await screen.findByText('16h 40min')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Cápsula sonora' }));
    const capsule = screen
      .getByRole('heading', { name: 'Minha cápsula sonora' })
      .closest('article');
    expect(capsule).toHaveTextContent('16h 40min');
    expect(capsule).toHaveTextContent('2026-09 (UTC)');
    expect(capsule).not.toHaveTextContent('≈ 5 minutos');
    fireEvent.change(screen.getByLabelText('Mês do histórico (UTC)'), {
      target: { value: '2026-08' },
    });
    expect(capsule).toHaveTextContent('0h 02min');
    fireEvent.change(input, { target: { files: [file('bad')] } });
    expect(await screen.findByText(/JSON inválido/)).toBeInTheDocument();
    expect(capsule).toHaveTextContent('0h 02min');
    fireEvent.click(screen.getByRole('button', { name: 'Remover histórico' }));
    expect(screen.queryByLabelText('Mês do histórico (UTC)')).not.toBeInTheDocument();
    expect(capsule).toHaveTextContent('≈ 5 minutos');
  });
  it('rejects ZIP and oversized imports before reading', async () => {
    setup();
    const input = await screen.findByLabelText(/Importar arquivos/);
    const oversized = file('[]');
    Object.defineProperty(oversized, 'size', { value: 101 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [oversized] } });
    expect(screen.getByText(/no máximo 100 MB/)).toBeInTheDocument();
    fireEvent.change(input, { target: { files: [file('[]', 'history.zip')] } });
    expect(screen.getByText(/no máximo 100 MB/)).toBeInTheDocument();
  });
  it('clears imported history when logging out', async () => {
    setup();
    fireEvent.change(await screen.findByLabelText(/Importar arquivos/), {
      target: { files: [file(JSON.stringify(rows))] },
    });
    await screen.findByText('16h 40min');
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    await waitFor(() => expect(screen.queryByText('16h 40min')).not.toBeInTheDocument());
    expect(screen.queryByLabelText(/Importar arquivos/)).not.toBeInTheDocument();
  });
});
