import type { UserProfile } from '../../domain/entities/stats';

interface AppHeaderProps {
  profile?: UserProfile;
  onLogout?: () => void;
}

export function AppHeader({ profile, onLogout }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="brand" href="/" aria-label="Spot Stats — início">
        <span className="brand-icon" aria-hidden="true">
          S
        </span>
        <span>
          SPOT/<b>STATS</b>
        </span>
      </a>
      <p className="header-tagline">SEU MÊS. SEU SOM.</p>
      {profile && onLogout ? (
        <div className="session-controls">
          <span className="profile-name">{profile.displayName}</span>
          <button className="ghost-button" type="button" onClick={onLogout}>
            Sair
          </button>
        </div>
      ) : (
        <span className="edition">EDIÇÃO 01</span>
      )}
    </header>
  );
}
