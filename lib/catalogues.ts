import type { Album, Artist, Playlist, Track } from '@/types';

const LIKED_QUICK_ACCESS = {
  id: 'liked',
  title: 'Liked Songs',
  coverUrl: 'liked',
  href: '/liked-songs',
} as const;

const EMPTY_HOME_FEED: HomeFeed = {
  quickAccess: [LIKED_QUICK_ACCESS],
  madeForYou: [],
  popularAlbums: [],
  newReleases: [],
  popularArtists: [],
};

// Home fieds
export interface QuickAccessItem {
  id: string;
  title: string;
  coverUrl: string;
  href: string;
}

export interface HomeFeed {
  quickAccess: QuickAccessItem[];
  madeForYou: Playlist[];
  popularAlbums: Album[];
  newReleases: Album[];
  popularArtists: Artist[];
}
