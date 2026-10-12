import { HomeContent } from '@/components/home/HomeContent';
import { mockHomeFeed } from '@/lib/mock-home-feed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home . Spotify Clone',
  description: 'Discover new music, jump back into your favorites.',
};

export default async function HomePage() {
  return <HomeContent feed={mockHomeFeed}/>;
}