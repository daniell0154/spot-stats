interface LoginHeroProps {
  onConnect: () => void;
  loading: boolean;
  error: string | null;
}

export function LoginHero({ onConnect, loading, error }: LoginHeroProps) {
  return (
    <main className="landing" id="conteudo">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">
          <span /> SEU SOM, EM PERSPECTIVA
        </p>
        <h1 id="hero-title">
          Quatro semanas.
          <br />
          Um <em>retrato</em> musical.
        </h1>
        <p className="hero-copy">
          Descubra os artistas, faixas e gêneros que definiram seu momento — em uma leitura bonita,
          direta e feita só para você.
        </p>
        <button className="primary-button" type="button" onClick={onConnect} disabled={loading}>
          <span className="spotify-mark" aria-hidden="true">
            ♪
          </span>
          {loading ? 'Conectando…' : 'Conectar com Spotify'}
          <span aria-hidden="true">↗</span>
        </button>
        <p className="privacy-note">Somente leitura. Nada é publicado ou salvo.</p>
        {error && (
          <div className="inline-error" role="alert">
            {error}
          </div>
        )}
      </section>
      <aside className="preview-card" aria-label="Prévia do painel">
        <div className="preview-topline">
          <span>OUT · 2026</span>
          <span className="live-dot">AO VIVO</span>
        </div>
        <p className="preview-kicker">Seu artista do momento</p>
        <div className="preview-orbit" aria-hidden="true">
          <span className="orbital-note">♪</span>
          <div className="vinyl">
            <div />
          </div>
        </div>
        <p className="preview-name">
          Sua música
          <br />
          mora aqui.
        </p>
        <div className="preview-bars" aria-hidden="true">
          {[32, 58, 42, 76, 50, 92, 62, 40, 72, 48, 28, 54].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </aside>
      <div className="trust-row" aria-label="Características do Spot Stats">
        <span>
          01 <b>PRIVADO</b>
        </span>
        <span>
          02 <b>SEM POSTAGENS</b>
        </span>
        <span>
          03 <b>DADOS DO SPOTIFY</b>
        </span>
      </div>
    </main>
  );
}
