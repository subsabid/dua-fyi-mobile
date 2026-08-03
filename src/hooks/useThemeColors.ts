import { useColorScheme } from 'react-native';
import { colors, type ThemeColors } from '@/src/theme';

export function useThemeColors(): ThemeColors {
  const colorScheme = useColorScheme();
  return colors[colorScheme === 'dark' ? 'dark' : 'light'];
}
