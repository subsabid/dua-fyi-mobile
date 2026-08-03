import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { spacing, fontSize, fonts } from '@/src/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap | string;
  title: string;
  subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
  const themeColors = useThemeColors();
  const isIonicons = typeof icon === 'string' && icon in Ionicons.glyphMap;

  return (
    <View style={styles.container}>
      {isIonicons ? (
        <Ionicons 
          name={icon as keyof typeof Ionicons.glyphMap} 
          size={64} 
          color={themeColors.textMuted} 
          style={styles.iconMargin}
        />
      ) : (
        <Text style={styles.iconText}>{icon}</Text>
      )}
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    marginTop: spacing.xl,
  },
  iconMargin: {
    marginBottom: spacing.lg,
  },
  iconText: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
  },
});
