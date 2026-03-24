import { create } from 'zustand';

interface SessionState {
  /** Today's session ID (null until created) */
  sessionId: string | null;
  /** Index of the current phrase slot (0 = warm-up, 1 = core, 2 = explore) */
  currentSlot: number;
  isRecording: boolean;
  isProcessing: boolean;
  setSessionId: (id: string) => void;
  setCurrentSlot: (slot: number) => void;
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  currentSlot: 0,
  isRecording: false,
  isProcessing: false,
  setSessionId: (sessionId) => set({ sessionId }),
  setCurrentSlot: (currentSlot) => set({ currentSlot }),
  setRecording: (isRecording) => set({ isRecording }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  reset: () =>
    set({
      sessionId: null,
      currentSlot: 0,
      isRecording: false,
      isProcessing: false,
    }),
}));
