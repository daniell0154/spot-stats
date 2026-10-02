import type { RankedArtist, RankedTrack, UserProfile } from '../../domain/entities/stats';

interface SpotifyImage {
  url: string;
}
interface SpotifyExternalUrls {
  spotify?: string;
}
interface SpotifyArtistPayload {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
  external_urls?: SpotifyExternalUrls;
}
interface SpotifyTrackPayload {
  id: string;
  name: string;
  artists?: Array<{ name: string }>;
  album?: { name?: string; images?: SpotifyImage[] };
  duration_ms?: number;
  explicit?: boolean;
  external_urls?: SpotifyExternalUrls;
}

export function mapProfile(payload: Record<string, unknown>): UserProfile {
  const images = payload.images as SpotifyImage[] | undefined;
  return {
    id: String(payload.id ?? ''),
    displayName: String(payload.display_name || 'Ouvinte'),
    imageUrl: images?.[0]?.url ?? null,
    country: typeof payload.country === 'string' ? payload.country : null,
  };
}

export function mapArtists(items: readonly SpotifyArtistPayload[]): readonly RankedArtist[] {
  return items.map((artist, index) => ({
    rank: index + 1,
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images?.[0]?.url ?? null,
    genres: artist.genres ?? [],
    popularity: Math.min(100, Math.max(0, artist.popularity ?? 0)),
    externalUrl: artist.external_urls?.spotify ?? `https://open.spotify.com/artist/${artist.id}`,
  }));
}

export function mapTracks(items: readonly SpotifyTrackPayload[]): readonly RankedTrack[] {
  return items.map((track, index) => ({
    rank: index + 1,
    id: track.id,
    name: track.name,
    artists: track.artists?.map((artist) => artist.name) ?? ['Artista desconhecido'],
    albumName: track.album?.name ?? 'Álbum desconhecido',
    imageUrl: track.album?.images?.[0]?.url ?? null,
    durationMs: Math.max(0, track.duration_ms ?? 0),
    explicit: track.explicit ?? false,
    externalUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
  }));
}

export type { SpotifyArtistPayload, SpotifyTrackPayload };
