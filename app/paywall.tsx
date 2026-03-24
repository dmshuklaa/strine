import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

export default function PaywallScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Go Pro</Text>
        <Text style={styles.description}>
          Unlock unlimited phrases, all 4 voice coaches, and starred recordings.
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
    paddingTop: Theme.spacing.xl,
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
