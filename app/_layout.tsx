import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { colors } from '@/src/theme';
import { useNotificationHandler } from '@/src/hooks/useNotificationHandler';
import { BiometricGate } from '@/src/components/BiometricGate';
import { AudioPlayer } from '@/src/components/AudioPlayer';
import { useAuthStore } from '@/src/stores/authStore';

import { useFavoritesStore } from '@/src/stores/favoritesStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  useNotificationHandler();
  const initializeAuth = useAuthStore(state => state.initialize);

  const [fontsLoaded] = useFonts({
    'Amiri': require('../assets/fonts/Amiri-Regular.ttf'),
    'Amiri-Bold': require('../assets/fonts/Amiri-Bold.ttf'),
  });

  useEffect(() => {
    initializeAuth();
    useFavoritesStore.getState().initialize();
  }, [initializeAuth]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BiometricGate>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </Stack>
        <AudioPlayer />
      </BiometricGate>
    </QueryClientProvider>
  );
}
