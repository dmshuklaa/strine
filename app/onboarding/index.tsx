import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

export default function OnboardingWelcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.wordmark}>strine</Text>
        <Text style={styles.title}>Speak like a local.</Text>
        <Text style={styles.description}>
          Master the Australian accent with daily guided practice and real-time
          AI feedback.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.screenPadding,
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: 18,
    color: Colors.grey,
    lineHeight: 28,
  },
});
