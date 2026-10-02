import type { MonthlySnapshot } from '../../domain/entities/stats';
import { visualPaletteStyle, type VisualPalette } from '../styles/visual-palettes';

interface SoundCapsuleProps {
  snapshot: MonthlySnapshot;
  palette: VisualPalette;
}

function currentEditionLabel() {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date())
    .replace(' de ', ' ');
}

export function SoundCapsule({ snapshot, palette }: SoundCapsuleProps) {
  const leadingArtist = snapshot.artists[0];
  const leadingGenre = snapshot.genres[0];
  const itemCount = snapshot.artists.length + snapshot.tracks.length;

  return (
    <article
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
            <i aria-hidden="true">S</i> Spot/Stats
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

        <div className="capsule-highlight">
          {leadingGenre ? (
            <>
              <span>Gênero em destaque</span>
              <strong>
                {leadingGenre.percentage}% {leadingGenre.name}
              </strong>
            </>
          ) : (
            <>
              <span>Destaques retornados</span>
              <strong>{itemCount} itens</strong>
            </>
          )}
        </div>

        <p className="capsule-period">Afinidade de aproximadamente 4 semanas</p>
      </div>
    </article>
  );
}
