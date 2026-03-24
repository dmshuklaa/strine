import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  streakCurrent: number;
  streakBest: number;
  subscriptionTier: 'free' | 'pro';
  voiceCoachId: string | null;
  onboardingDone: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, isLoading: false }),
}));
