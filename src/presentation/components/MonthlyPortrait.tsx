import type { CSSProperties } from 'react';
import type { MonthlySnapshot, RankedArtist } from '../../domain/entities/stats';
import { visualPaletteStyle, type VisualPalette } from '../styles/visual-palettes';

function ArtistPortrait({ artist }: { artist: RankedArtist }) {
  return (
    <a
      className="portrait-artist"
      href={artist.externalUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir ${artist.name} no Spotify`}
    >
      {artist.imageUrl ? (
        <img src={artist.imageUrl} alt="" />
      ) : (
        <span aria-hidden="true">{artist.name.charAt(0).toLocaleUpperCase('pt-BR')}</span>
      )}
    </a>
  );
}

interface MonthlyPortraitProps {
  snapshot: MonthlySnapshot;
  palette: VisualPalette;
}

export function MonthlyPortrait({ snapshot, palette }: MonthlyPortraitProps) {
  const featuredArtists = snapshot.artists.slice(0, 3);
  const leadingGenre = snapshot.genres[0];

  return (
    <article
      className="monthly-portrait"
      aria-labelledby="portrait-title"
      data-palette={palette.id}
      style={visualPaletteStyle(palette)}
    >
      <div className="portrait-signal" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <i key={index} style={{ height: `${22 + ((index * 17) % 70)}%` } as CSSProperties} />
        ))}
      </div>

      <header className="portrait-heading">
        <p>{snapshot.profile.displayName.toLocaleLowerCase('pt-BR')}.</p>
        <span>
          meu mês <b>{new Date().getFullYear()}</b>
        </span>
        <h1 id="portrait-title">{snapshot.profile.displayName}, este foi o seu mês</h1>
      </header>

      <div className={`portrait-collage portrait-count-${featuredArtists.length}`}>
        {featuredArtists.length ? (
          featuredArtists.map((artist) => <ArtistPortrait key={artist.id} artist={artist} />)
        ) : (
          <div className="portrait-empty-art" aria-hidden="true">
            ♪
          </div>
        )}
      </div>

      <div className="portrait-metrics" aria-label="Itens de afinidade retornados">
        <p aria-label={`${snapshot.artists.length} artistas`}>
          <strong>{snapshot.artists.length}</strong>
          <span>{snapshot.artists.length === 1 ? 'artista' : 'artistas'}</span>
        </p>
        <p
          aria-label={`${snapshot.tracks.length} ${snapshot.tracks.length === 1 ? 'faixa' : 'faixas'}`}
        >
          <strong>{snapshot.tracks.length}</strong>
          <span>{snapshot.tracks.length === 1 ? 'faixa' : 'faixas'}</span>
        </p>
      </div>

      <div className="portrait-rankings">
        <section aria-labelledby="portrait-tracks-title">
          <h2 id="portrait-tracks-title">Top faixas</h2>
          {snapshot.tracks.length ? (
            <ol>
              {snapshot.tracks.slice(0, 5).map((track) => (
                <li key={track.id}>
                  <span>{track.rank}.</span>
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
        <section aria-labelledby="portrait-artists-title">
          <h2 id="portrait-artists-title">Top artistas</h2>
          {snapshot.artists.length ? (
            <ol>
              {snapshot.artists.slice(0, 5).map((artist) => (
                <li key={artist.id}>
                  <span>{artist.rank}.</span>
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
      </div>

      <div className="portrait-vibe">
        {leadingGenre ? (
          <>
            <span>Seu perfil teve {leadingGenre.percentage}% de</span>
            <strong>· · · {leadingGenre.name} · · ·</strong>
          </>
        ) : (
          <strong>· · · gênero ainda não classificado · · ·</strong>
        )}
      </div>

      <footer className="portrait-footer">
        <span>▮▮ spot/stats</span>
        <small>Afinidade de aproximadamente 4 semanas</small>
      </footer>
    </article>
  );
}
