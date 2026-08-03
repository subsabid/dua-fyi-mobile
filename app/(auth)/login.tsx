import {  View, Text, StyleSheet , useColorScheme } from 'react-native';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, fontSize } from '@/src/theme';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>Auth UI coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: fontSize.xxl, fontWeight: '700', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md },
});
