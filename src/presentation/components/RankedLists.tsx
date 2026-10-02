import type { RankedArtist, RankedTrack } from '../../domain/entities/stats';

interface RankedListsProps {
  artists: readonly RankedArtist[];
  tracks: readonly RankedTrack[];
}

function durationLabel(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function RankedLists({ artists, tracks }: RankedListsProps) {
  return (
    <div className="rank-grid">
      <section className="ranking" aria-labelledby="artists-title">
        <div className="section-heading">
          <div>
            <span>TOP 10</span>
            <h2 id="artists-title">Artistas</h2>
          </div>
          <span className="heading-number">A</span>
        </div>
        {artists.length ? (
          <ol>
            {artists.map((artist) => (
              <li key={artist.id}>
                <span className="rank">{String(artist.rank).padStart(2, '0')}</span>
                {artist.imageUrl ? (
                  <img src={artist.imageUrl} alt="" />
                ) : (
                  <span className="image-fallback" aria-hidden="true">
                    ♪
                  </span>
                )}
                <div className="item-copy">
                  <a href={artist.externalUrl} target="_blank" rel="noreferrer">
                    {artist.name}
                  </a>
                  <small>{artist.genres.slice(0, 2).join(' · ') || 'Gênero não informado'}</small>
                </div>
                <span className="popularity" title="Popularidade">
                  {artist.popularity}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-copy">Ainda não há artistas suficientes para este período.</p>
        )}
      </section>

      <section className="ranking" aria-labelledby="tracks-title">
        <div className="section-heading">
          <div>
            <span>TOP 10</span>
            <h2 id="tracks-title">Faixas</h2>
          </div>
          <span className="heading-number">B</span>
        </div>
        {tracks.length ? (
          <ol>
            {tracks.map((track) => (
              <li key={track.id}>
                <span className="rank">{String(track.rank).padStart(2, '0')}</span>
                {track.imageUrl ? (
                  <img src={track.imageUrl} alt="" />
                ) : (
                  <span className="image-fallback" aria-hidden="true">
                    ♫
                  </span>
                )}
                <div className="item-copy">
                  <a href={track.externalUrl} target="_blank" rel="noreferrer">
                    {track.name}
                  </a>
                  <small>{track.artists.join(', ')}</small>
                </div>
                <span className="duration">{durationLabel(track.durationMs)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-copy">Ainda não há faixas suficientes para este período.</p>
        )}
      </section>
    </div>
  );
}
