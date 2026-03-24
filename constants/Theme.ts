import { Colors } from './Colors';

export const Theme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    chip: 8,
    card: 12,
    button: 10,
    full: 9999,
  },
  typography: {
    heading: {
      fontFamily: 'Syne-Bold',
      fontWeight: '700' as const,
    },
    body: {
      fontFamily: undefined, // system default
    },
  },
  /** Screen horizontal padding applied on every screen */
  screenPadding: 16,
} as const;
