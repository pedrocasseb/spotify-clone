'use client';

import { create } from 'zustand';

import type { RepeatMode, Track } from '@/types';

interface PlayerActions {
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (percent: number) => void;
  setProgress: (percent: number) => void;
  setDuration: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setQueue: (queue: Track[]) => void;
  setBuffering: (v: boolean) => void;
}

export interface PlayerStore {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  lastVolume: number;
  progress: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  seekToken: number;
  isBuffering: boolean;
  actions: PlayerActions;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  volume: 0.7,
  lastVolume: 0.7,
  progress: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: 'off',
  seekToken: 0,
  isBuffering: false,
  actions: {
    play: (track, queue) => {
      const q = queue && queue.length > 0 ? queue : [track];
      const idx = q.findIndex((t) => t.id === track.id);
      set((s) => ({
        currentTrack: track,
        queue: q,
        queueIndex: idx >= 0 ? idx : 0,
        isPlaying: true,
        progress: 0,
        duration: track.duration,
        seekToken: s.seekToken + 1,
      }));
    },
    pause: () => set({ isPlaying: false }),
    resume: () => {
      const { currentTrack } = get();
      if (currentTrack) set({ isPlaying: true });
    },
    togglePlay: () => {
      const { isPlaying, currentTrack } = get();
      if (!currentTrack) return;
      set({ isPlaying: !isPlaying });
    },
    seek: (percent) =>
      set((s) => ({
        progress: Math.max(0, Math.min(100, percent)),
        seekToken: s.seekToken + 1,
      })),
    setProgress: (percent) => set({ progress: percent }),
    setDuration: (seconds) => set({ duration: seconds }),
    setVolume: (vol) => {
      const v = Math.max(0, Math.min(1, vol));
      set({ volume: v, lastVolume: v > 0 ? v : get().lastVolume });
    },
    toggleMute: () => {
      const { volume, lastVolume } = get();
      if (volume > 0) set({ volume: 0 });
      else set({ volume: lastVolume || 0.7 });
    },
    next: () => {
      const { queue, queueIndex, isShuffle, repeatMode } = get();
      if (queue.length === 0) return;
      if (repeatMode === 'track') {
        set((s) => ({
          progress: 0,
          isPlaying: true,
          seekToken: s.seekToken + 1,
        }));
        return;
      }
      let nextIdx = queueIndex + 1;
      if (isShuffle) {
        nextIdx = Math.floor(Math.random() * queue.length);
      } else if (nextIdx >= queue.length) {
        if (repeatMode === 'context') nextIdx = 0;
        else {
          set((s) => ({
            isPlaying: false,
            progress: 0,
            seekToken: s.seekToken + 1,
          }));
          return;
        }
      }
      const track = queue[nextIdx];
      set((s) => ({
        currentTrack: track,
        queueIndex: nextIdx,
        progress: 0,
        duration: track.duration,
        isPlaying: true,
        seekToken: s.seekToken + 1,
      }));
    },
    previous: () => {
      const { queue, queueIndex, progress } = get();
      if (queue.length === 0) return;
      if (progress > 5) {
        set((s) => ({ progress: 0, seekToken: s.seekToken + 1 }));
        return;
      }
      const prevIdx = Math.max(0, queueIndex - 1);
      const track = queue[prevIdx];
      set((s) => ({
        currentTrack: track,
        queueIndex: prevIdx,
        progress: 0,
        duration: track.duration,
        isPlaying: true,
        seekToken: s.seekToken + 1,
      }));
    },
    toggleShuffle: () => {
      const { isShuffle, queue, currentTrack } = get();
      const next = !isShuffle;
      if (next && currentTrack) {
        const rest = queue.filter((t) => t.id !== currentTrack.id);
        const reordered = [currentTrack, ...shuffle(rest)];
        set({ isShuffle: true, queue: reordered, queueIndex: 0 });
      } else {
        set({ isShuffle: false });
      }
    },
    cycleRepeat: () => {
      const order: RepeatMode[] = ['off', 'context', 'track'];
      const { repeatMode } = get();
      const next = order[(order.indexOf(repeatMode) + 1) % order.length];
      set({ repeatMode: next });
    },
    setQueue: (q) => set({ queue: q }),
    setBuffering: (v) => set({ isBuffering: v }),
  },
}));

export const usePlayerAction = () => usePlayerStore((s) => s.actions);