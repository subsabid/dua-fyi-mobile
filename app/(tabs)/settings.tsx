import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors, spacing, fontSize, fonts, borderRadius } from '@/src/theme';
import { useSettingsStore, ThemeMode, FontSizeOption } from '@/src/stores/settingsStore';
import { useNotificationStore } from '@/src/stores/notificationStore';
import { biometrics } from '@/src/lib/biometrics';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useThemeColors();

  const {
    themeMode,
    arabicFontSize,
    biometricLock,
    showTransliteration,
    showTranslation,
    autoPlayNext,
    setThemeMode,
    setArabicFontSize,
    setBiometricLock,
    setShowTransliteration,
    setShowTranslation,
    setAutoPlayNext,
  } = useSettingsStore();

  const {
    dailyReminderEnabled,
    dailyReminderHour,
    dailyReminderMinute,
    toggleDailyReminder,
    setReminderTime,
  } = useNotificationStore();

  const [biometricTypeName, setBiometricTypeName] = useState('Biometrics');

  useEffect(() => {
    biometrics.getBiometricTypeName().then(setBiometricTypeName);
  }, []);

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      const isAvail = await biometrics.isAvailable();
      if (!isAvail) {
        Alert.alert(
          'Biometrics Unavailable',
          'Biometric authentication is not supported or set up on this device.'
        );
        return;
      }
      const success = await biometrics.authenticate(`Enable ${biometricTypeName} lock`);
      if (success) {
        setBiometricLock(true);
      }
    } else {
      setBiometricLock(false);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>{title}</Text>
  );

  const SettingRow = ({
    label,
    value,
    control,
    onPress,
    icon,
  }: {
    label: string;
    value?: string;
    control?: React.ReactNode;
    onPress?: () => void;
    icon?: string;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
      disabled={!onPress}
      onPress={onPress}
    >
      <View style={styles.settingLabelRow}>
        {!!icon && <Ionicons name={icon as any} size={20} color={theme.primary} style={{ marginRight: spacing.sm }} />}
        <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      </View>
      {control ? control : <Text style={[styles.settingValue, { color: theme.textSecondary }]}>{value}</Text>}
    </TouchableOpacity>
  );

  const SegmentedControl = ({
    options,
    selected,
    onSelect,
  }: {
    options: string[];
    selected: string;
    onSelect: (val: any) => void;
  }) => (
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

      {/* ─── Reading & Appearance ─── */}
      <View style={styles.section}>
        <SectionHeader title="APPEARANCE & READING" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.settingRow, { borderBottomColor: theme.border, flexDirection: 'column', alignItems: 'flex-start', gap: spacing.sm }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Theme Mode</Text>
            <SegmentedControl
              options={['system', 'light', 'dark']}
              selected={themeMode}
              onSelect={(val) => setThemeMode(val as ThemeMode)}
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: theme.border, flexDirection: 'column', alignItems: 'flex-start', gap: spacing.sm }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Arabic Font Size</Text>
            <SegmentedControl
              options={['small', 'medium', 'large']}
              selected={arabicFontSize}
              onSelect={(val) => setArabicFontSize(val as FontSizeOption)}
            />
          </View>
          <SettingRow
            label="Show Transliteration"
            icon="language-outline"
            control={
              <Switch
                value={showTransliteration}
                onValueChange={setShowTransliteration}
                trackColor={{ true: theme.primary }}
              />
            }
          />
          <SettingRow
            label="Show Translation"
            icon="document-text-outline"
            control={
              <Switch
                value={showTranslation}
                onValueChange={setShowTranslation}
                trackColor={{ true: theme.primary }}
              />
            }
          />
        </View>
      </View>

      {/* ─── Audio Settings ─── */}
      <View style={styles.section}>
        <SectionHeader title="AUDIO PLAYBACK" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow
            label="Auto-play Next Dua"
            icon="volume-high-outline"
            control={
              <Switch
                value={autoPlayNext}
                onValueChange={setAutoPlayNext}
                trackColor={{ true: theme.primary }}
              />
            }
          />
        </View>
      </View>

      {/* ─── Notifications ─── */}
      <View style={styles.section}>
        <SectionHeader title="NOTIFICATIONS" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow
            label="Daily Dua Reminder"
            icon="notifications-outline"
            control={
              <Switch
                value={dailyReminderEnabled}
                onValueChange={toggleDailyReminder}
                trackColor={{ true: theme.primary }}
              />
            }
          />
          <SettingRow
            label="Reminder Time"
            icon="time-outline"
            value={`${String(dailyReminderHour).padStart(2, '0')}:${String(dailyReminderMinute).padStart(2, '0')}`}
          />
        </View>
      </View>

      {/* ─── Security ─── */}
      <View style={styles.section}>
        <SectionHeader title="SECURITY" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow
            label={`Unlock with ${biometricTypeName}`}
            icon="finger-print-outline"
            control={
              <Switch
                value={biometricLock}
                onValueChange={handleBiometricToggle}
                trackColor={{ true: theme.primary }}
              />
            }
          />
        </View>
      </View>

      {/* ─── About & Source Information ─── */}
      <View style={styles.section}>
        <SectionHeader title="ABOUT DUA.FYI" />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingRow label="App Version" value="1.0.0" icon="information-circle-outline" />
          <SettingRow label="Content Source" value="Hisn al-Muslim" icon="book-outline" />
          <SettingRow label="Total Chapters" value="132 Chapters" icon="grid-outline" />
          <SettingRow label="Total Supplications" value="267+ Duas" icon="sparkles-outline" />
          <SettingRow
            label="Website"
            value="dua.fyi"
            icon="globe-outline"
            onPress={() => Linking.openURL('https://dua.fyi')}
          />
          <SettingRow
            label="GitHub Repository"
            value="subsabid/dua-fyi-mobile"
            icon="logo-github"
            onPress={() => Linking.openURL('https://github.com/subsabid/dua-fyi-mobile')}
          />
        </View>
      </View>

      <Text style={[styles.footer, { color: theme.textMuted }]}>
        dua.fyi • Fortress of the Muslim {'\n'}
        Built with ❤️ for the Ummah
      </Text>
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
    fontFamily: fonts.bold,
    fontSize: fontSize.xs,
    letterSpacing: 0.8,
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
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    lineHeight: 18,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
