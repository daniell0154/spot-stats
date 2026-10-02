import { useRef, useState, useEffect } from 'react';
import type { ImportListeningHistory } from '../../application/use-cases/import-listening-history';
import type { ListeningHistory, ListeningMonth } from '../../domain/entities/listening-history';
import { formatListeningTime } from '../services/format-listening-time';

export function ListeningHistoryImport({
  importer,
  onSelect,
}: {
  importer: ImportListeningHistory;
  onSelect: (month: ListeningMonth | null) => void;
}) {
  const [history, setHistory] = useState<ListeningHistory | null>(null);
  const [monthKey, setMonthKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current += 1;
    },
    [],
  );

  async function importFiles(files: File[]) {
    const request = ++generation.current;
    setError('');
    if (!files.length) return;
    if (
      files.length > 50 ||
      files.reduce((sum, file) => sum + file.size, 0) > 100 * 1024 * 1024 ||
      files.some((file) => !file.name.toLowerCase().endsWith('.json'))
    ) {
      setError('Selecione até 50 arquivos JSON extraídos, somando no máximo 100 MB.');
      return;
    }
    setBusy(true);
    try {
      async function* texts() {
        for (const file of files) {
          if (request !== generation.current) throw new Error('Importação cancelada.');
          const text = await file.text();
          if (request !== generation.current) throw new Error('Importação cancelada.');
          yield text;
        }
      }
      const result = await importer.execute(texts());
      if (request !== generation.current) return;
      setHistory(result);
      setMonthKey(result.months[0].month);
      onSelect(result.months[0]);
    } catch (cause) {
      if (request === generation.current)
        setError(
          cause instanceof Error
            ? cause.message
            : 'Não foi possível ler os arquivos. Tente novamente.',
        );
    } finally {
      if (request === generation.current) setBusy(false);
    }
  }

  const selected = history?.months.find((month) => month.month === monthKey);
  return (
    <section className="history-import" aria-labelledby="history-title">
      <h2 id="history-title">Seu tempo real de música</h2>
      <p>
        Solicite o{' '}
        <a href="https://www.spotify.com/account/privacy/" target="_blank" rel="noreferrer">
          Histórico de streaming estendido no Spotify
        </a>
        . Quando receber o download, extraia o ZIP e selecione todos os JSONs de músicas
        (Streaming_History_Audio ou endsong).
      </p>
      <p>
        Processado apenas neste navegador. Os arquivos não são enviados; os dados são apagados ao
        sair ou recarregar.
      </p>
      <label htmlFor="history-files">Importar arquivos de histórico (.json)</label>
      <p>
        Selecione os arquivos juntos: até 50 JSONs / 100 MB. Uma nova importação substitui a
        anterior.
      </p>
      <input
        id="history-files"
        type="file"
        accept=".json,application/json"
        multiple
        disabled={busy}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = '';
          void importFiles(files);
        }}
      />
      <p role="status">{busy ? 'Lendo histórico…' : error}</p>
      {history && selected ? (
        <>
          <label htmlFor="history-month">Mês do histórico (UTC)</label>
          <select
            id="history-month"
            value={monthKey}
            onChange={(event) => {
              setMonthKey(event.target.value);
              onSelect(history.months.find((month) => month.month === event.target.value) ?? null);
            }}
          >
            {history.months.map((month) => (
              <option key={month.month} value={month.month}>
                {month.month}
              </option>
            ))}
          </select>
          <p>
            <strong>{formatListeningTime(selected)}</strong> ·{' '}
            {Math.floor(selected.playedMs / 60_000).toLocaleString('pt-BR')} minutos registrados
          </p>
          <p>
            {selected.eventCount} eventos de música · registros de{' '}
            {selected.firstEvent.slice(0, 10)} a {selected.lastEvent.slice(0, 10)} (UTC).
          </p>
          <p>
            O total cobre somente os arquivos importados; arquivos ausentes podem deixar o mês
            incompleto. Podcasts e registros inválidos não entram na soma.
          </p>
          <small>
            {history.duplicates} duplicados removidos · {history.ignoredRows} registros excluídos.
          </small>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              generation.current += 1;
              setBusy(false);
              setHistory(null);
              setError('');
              onSelect(null);
            }}
          >
            Remover histórico
          </button>
        </>
      ) : null}
    </section>
  );
}
