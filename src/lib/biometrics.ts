import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export const biometrics = {
  // Check if device supports biometric auth
  async isAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch {
      return false;
    }
  },

  // Get supported authentication types
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    if (Platform.OS === 'web') return [];
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch {
      return [];
    }
  },

  // Prompt for biometric authentication
  async authenticate(promptMessage: string = 'Authenticate to open dua.fyi'): Promise<boolean> {
    if (Platform.OS === 'web') return true;
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use passcode',
      });
      return result.success;
    } catch {
      return true;
    }
  },

  // Get friendly name for the biometric type
  async getBiometricTypeName(): Promise<string> {
    if (Platform.OS === 'web') return 'Biometric';
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'Face ID';
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'Fingerprint';
      }
      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Iris';
      }
    } catch {}
    return 'Biometric';
  },
};
