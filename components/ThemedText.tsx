import { Text, TextProps, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ThemedTextProps extends TextProps {
  variant?: 'heading' | 'body' | 'caption' | 'label';
}

export function ThemedText({ variant = 'body', style, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Text
      style={[
        styles.base,
        isDark ? styles.dark : styles.light,
        styles[variant],
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
  dark: {
    color: Colors.white,
  },
  light: {
    color: Colors.navy,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    color: Colors.grey,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
