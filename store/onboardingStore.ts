import { create } from 'zustand';

interface OnboardingState {
  goal: string | null;
  nativeAccent: string | null;
  voiceCoachId: string | null;
  setGoal: (goal: string) => void;
  setNativeAccent: (accent: string) => void;
  setVoiceCoachId: (id: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  goal: null,
  nativeAccent: null,
  voiceCoachId: null,
  setGoal: (goal) => set({ goal }),
  setNativeAccent: (nativeAccent) => set({ nativeAccent }),
  setVoiceCoachId: (voiceCoachId) => set({ voiceCoachId }),
  reset: () => set({ goal: null, nativeAccent: null, voiceCoachId: null }),
}));
