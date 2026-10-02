import { useRef } from 'react';
import type { MonthlySnapshot } from '../../domain/entities/stats';
import { visualPaletteStyle, type VisualPalette } from '../styles/visual-palettes';
import { ArtworkDownloadButton } from './ArtworkDownloadButton';
import type { ListeningMonth } from '../../domain/entities/listening-history';
import { formatListeningTime } from '../services/format-listening-time';

interface SoundCapsuleProps {
  snapshot: MonthlySnapshot;
  palette: VisualPalette;
  listeningMonth?: ListeningMonth | null;
}

function currentEditionLabel() {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date())
    .replace(' de ', ' ');
}

export function SoundCapsule({ snapshot, palette, listeningMonth }: SoundCapsuleProps) {
  const leadingArtist = snapshot.artists[0];
  const leadingGenre = snapshot.genres[0];
  const artworkRef = useRef<HTMLElement>(null);

  return (
    <div className="artwork-export">
      <article
        ref={artworkRef}
        className="sound-capsule"
        aria-labelledby="capsule-title"
        data-palette={palette.id}
        style={visualPaletteStyle(palette)}
      >
        <div className="capsule-cover">
          {leadingArtist?.imageUrl ? (
            <a
              href={leadingArtist.externalUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir ${leadingArtist.name} no Spotify`}
            >
              <img src={leadingArtist.imageUrl} alt="" />
            </a>
          ) : (
            <div role="img" aria-label="Capa sem imagem do artista principal">
              <span aria-hidden="true">
                {leadingArtist?.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part.charAt(0))
                  .join('') || '♪'}
              </span>
            </div>
          )}
        </div>

        <div className="capsule-body">
          <header className="capsule-edition">
            <span className="capsule-brand">
              <img data-testid="capsule-brand-logo" src="/spotify-neutral-logo.png" alt="" />
              Spotify
            </span>
            <time>{currentEditionLabel()}</time>
          </header>

          <h1 id="capsule-title">Minha cápsula sonora</h1>

          <div className="capsule-rankings">
            <section aria-labelledby="capsule-artists-title">
              <h2 id="capsule-artists-title">Artistas em destaque</h2>
              {snapshot.artists.length ? (
                <ol>
                  {snapshot.artists.slice(0, 5).map((artist) => (
                    <li key={artist.id}>
                      <span>{artist.rank}</span>
                      <a href={artist.externalUrl} target="_blank" rel="noreferrer">
                        {artist.name}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Nenhum artista disponível.</p>
              )}
            </section>

            <section aria-labelledby="capsule-tracks-title">
              <h2 id="capsule-tracks-title">Faixas em destaque</h2>
              {snapshot.tracks.length ? (
                <ol>
                  {snapshot.tracks.slice(0, 5).map((track) => (
                    <li key={track.id}>
                      <span>{track.rank}</span>
                      <a href={track.externalUrl} target="_blank" rel="noreferrer">
                        {track.name}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Nenhuma faixa disponível.</p>
              )}
            </section>
          </div>

          {leadingGenre ? (
            <div className="capsule-highlight">
              <span>Gênero em destaque</span>
              <strong>
                {leadingGenre.percentage}% {leadingGenre.name}
              </strong>
            </div>
          ) : null}

          <div className="capsule-listening">
            {listeningMonth ? (
              <>
                <span>Música ouvida · {listeningMonth.month} (UTC)</span>
                <strong>{formatListeningTime(listeningMonth)}</strong>
                <small>
                  {Math.floor(listeningMonth.playedMs / 60_000).toLocaleString('pt-BR')} minutos
                  registrados · histórico importado.
                </small>
                <small>
                  Registros de {listeningMonth.firstEvent.slice(0, 10)} a{' '}
                  {listeningMonth.lastEvent.slice(0, 10)}. Total dos arquivos fornecidos; o mês pode
                  estar incompleto. Rankings acima: afinidade atual.
                </small>
              </>
            ) : snapshot.recentListeningEstimate ? (
              <>
                <span>Duração estimada dos eventos recentes</span>
                <strong>≈ {snapshot.recentListeningEstimate.minutes} minutos</strong>
                <small>
                  {snapshot.recentListeningEstimate.playCount} reproduções recentes · duração
                  integral das faixas; não é tempo real ouvido nem mês completo.
                </small>
              </>
            ) : (
              <>
                <span>Estimativa recente indisponível</span>
                <p>Reconecte para incluir a estimativa ou ouça mais faixas recentemente.</p>
              </>
            )}
          </div>

          <p className="capsule-period">Afinidade de aproximadamente 4 semanas</p>
        </div>
      </article>
      <ArtworkDownloadButton
        artworkRef={artworkRef}
        artworkName="Cápsula sonora"
        filename="spotify-capsula-sonora.png"
      />
    </div>
  );
}
