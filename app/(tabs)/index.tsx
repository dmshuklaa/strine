import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>G'day!</Text>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.description}>
          Your daily streak, today's phrases, and quick access to practice.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: Colors.navy,
  },
  containerLight: {
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.screenPadding,
    paddingTop: Theme.spacing.xl,
  },
  heading: {
    fontSize: 14,
    color: Colors.gold,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Theme.spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: Colors.grey,
    lineHeight: 24,
  },
});
