import type { MonthlySnapshot } from '../../domain/entities/stats';

export function StatsOverview({ snapshot }: { snapshot: MonthlySnapshot }) {
  return (
    <section className="overview" aria-labelledby="overview-title">
      <div className="profile-block">
        {snapshot.profile.imageUrl ? (
          <img src={snapshot.profile.imageUrl} alt="" />
        ) : (
          <div className="profile-fallback" aria-hidden="true">
            {snapshot.profile.displayName.charAt(0)}
          </div>
        )}
        <div>
          <p className="eyebrow">RETRATO DE</p>
          <h1 id="overview-title">{snapshot.profile.displayName}</h1>
          <p>{snapshot.periodLabel}</p>
        </div>
      </div>
      <div className="metric-block">
        <strong>{snapshot.artists.length}</strong>
        <span>
          artistas
          <br />
          no radar
        </span>
      </div>
      <div className="metric-block">
        <strong>{snapshot.tracks.length}</strong>
        <span>
          faixas
          <br />
          em destaque
        </span>
      </div>
      <div className="genres-block">
        <p className="eyebrow">GÊNEROS EM ALTA</p>
        {snapshot.genres.length ? (
          <ul>
            {snapshot.genres.map((genre) => (
              <li key={genre.name}>
                <span>{genre.name}</span>
                <div className="genre-track" aria-label={`${genre.percentage}%`}>
                  <i style={{ width: `${genre.percentage}%` }} />
                </div>
                <b>{genre.percentage}%</b>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-copy">Sem dados de gênero suficientes.</p>
        )}
      </div>
    </section>
  );
}
