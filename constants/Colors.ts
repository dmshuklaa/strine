/**
 * Strine brand colour palette.
 * Use these constants everywhere — never hardcode hex values in component files.
 */

export const Colors = {
  /** Primary background, main buttons */
  navy: '#0D1B2A',
  /** Accent, streak badges, highlights */
  gold: '#E8A825',
  /** Success states, skill bars */
  teal: '#0F6E56',
  /** Record button, error states */
  coral: '#D9534F',
  /** Primary text on dark backgrounds */
  white: '#FFFFFF',
  /** Muted text, borders */
  grey: '#8A9BAE',
  /** Subtle backgrounds, cards */
  navyLight: '#1A2D40',
  /** Overlay / scrim */
  overlay: 'rgba(13, 27, 42, 0.85)',
} as const;

export type ColorKey = keyof typeof Colors;
