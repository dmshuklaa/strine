import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>Daily phrases</Text>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.description}>
          Record yourself saying Australian phrases and get real-time AI coaching
          on your accent.
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
    color: Colors.coral,
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
