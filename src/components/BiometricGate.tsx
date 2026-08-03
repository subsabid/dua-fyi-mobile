import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, AppState, StyleSheet, useColorScheme } from 'react-native';
import { secureStorage } from '@/src/lib/secure-store';
import { biometrics } from '@/src/lib/biometrics';
import { colors, spacing, borderRadius, fontSize } from '@/src/theme';
interface BiometricGateProps {
  children: React.ReactNode;
}

const GRACE_PERIOD_MS = 30000; // 30 seconds

export const BiometricGate: React.FC<BiometricGateProps> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const appState = useRef(AppState.currentState);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const checkLockState = async () => {
    try {
      const isEnabled = await secureStorage.isBiometricEnabled();
      if (!isEnabled) {
        setIsLocked(false);
        setIsChecking(false);
        return;
      }

      const lastActive = await secureStorage.getLastActiveTimestamp();
      const now = Date.now();
      
      if (now - lastActive > GRACE_PERIOD_MS) {
        setIsLocked(true);
        await promptAuth();
      } else {
        setIsLocked(false);
      }
    } catch (e) {
      console.error('Error checking biometric state:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const promptAuth = async () => {
    try {
      const success = await biometrics.authenticate('Authenticate to unlock dua.fyi');
      if (success) {
        await secureStorage.setLastActiveTimestamp();
        setIsLocked(false);
      }
    } catch (e) {
      console.error('Auth error:', e);
    }
  };

  useEffect(() => {
    checkLockState();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkLockState();
      } else if (nextAppState === 'background') {
        secureStorage.setLastActiveTimestamp();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isChecking) {
    return null;
  }

  if (isLocked) {
    const bgColor = isDark ? colors.dark.background : colors.light.background;
    const textColor = isDark ? colors.dark.text : colors.light.text;

    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Text style={[styles.title, { color: colors.light.primary }]}>dua.fyi</Text>
        <Text style={[styles.bismillah, { color: colors.light.accent }]}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</Text>
        <Text style={styles.icon}>🔒</Text>
        <Text style={[styles.message, { color: textColor }]}>Authentication required</Text>
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.light.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={promptAuth}
        >
          <Text style={styles.buttonText}>Tap to unlock</Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  bismillah: {
    fontSize: fontSize.xl,
    fontFamily: 'Amiri', // Adjust to correct font name if loaded differently
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: 'bold',
  }
});
