import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, fontSize, fonts, borderRadius } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useThemeColors();

  // UI state for now
  const [dailyReminder, setDailyReminder] = useState(false);
  const [biometricLock, setBiometricLock] = useState(false);
  const [themeMode, setThemeMode] = useState('system'); // system, light, dark
  const [arabicFontSize, setArabicFontSize] = useState('medium'); // small, medium, large

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>{title}</Text>
  );

  const SettingRow = ({ 
    label, 
    value, 
    control,
    onPress 
  }: { 
    label: string, 
    value?: string, 
    control?: React.ReactNode,
    onPress?: () => void 
  }) => (
    <TouchableOpacity 
      style={[styles.settingRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]} 
      disabled={!onPress}
      onPress={onPress}
    >
      <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      {control ? control : <Text style={[styles.settingValue, { color: theme.textSecondary }]}>{value}</Text>}
    </TouchableOpacity>
  );

  const SegmentedControl = ({ options, selected, onSelect }: { options: string[], selected: string, onSelect: (val: string) => void }) => (
    <View style={[styles.segmentedControl, { backgroundColor: theme.border }]}>
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <TouchableOpacity 
            key={opt}
            style={[styles.segment, isSelected && { backgroundColor: theme.primary }]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.segmentText, isSelected ? { color: '#FFFFFF' } : { color: theme.textSecondary }]}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Settings' }} />

      <View style={styles.section}>
        <SectionHeader title="APPEARANCE" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.settingRow, { borderBottomColor: theme.border, flexDirection: 'column', alignItems: 'flex-start', gap: spacing.sm }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Theme</Text>
            <SegmentedControl 
              options={['system', 'light', 'dark']} 
              selected={themeMode} 
              onSelect={setThemeMode} 
            />
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0, flexDirection: 'column', alignItems: 'flex-start', gap: spacing.sm }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Arabic Font Size</Text>
            <SegmentedControl 
              options={['small', 'medium', 'large']} 
              selected={arabicFontSize} 
              onSelect={setArabicFontSize} 
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="NOTIFICATIONS" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow 
            label="Daily Reminder" 
            control={<Switch value={dailyReminder} onValueChange={setDailyReminder} trackColor={{ true: theme.primary }} />} 
          />
          <SettingRow label="Reminder Time" value="06:00 AM" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="SECURITY" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow 
            label="Biometric Lock" 
            control={<Switch value={biometricLock} onValueChange={setBiometricLock} trackColor={{ true: theme.primary }} />} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="ABOUT" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow label="Version" value="1.0.0" />
          <SettingRow label="Source" value="Hisn al-Muslim" />
        </View>
      </View>

      <Text style={[styles.footer, { color: theme.textSecondary }]}>Built with ❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
  },
  settingValue: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 2,
    width: '100%',
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm - 2,
  },
  segmentText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
  },
  footer: {
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  }
});
