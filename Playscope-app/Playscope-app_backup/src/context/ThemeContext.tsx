import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { darkColors, lightColors } from '../constants/colors';
import { useAuth } from './AuthContext';
import { UserRepository } from '../repositories/UserRepository';

const STORAGE_KEY = 'playscope:theme:dark-mode';

type ThemeColors = typeof darkColors;

interface ThemeContextData {
  darkMode: boolean;
  colors: ThemeColors;
  navigationTheme: typeof DarkTheme;
  ready: boolean;
  setDarkMode: (value: boolean) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({
  darkMode: true,
  colors: darkColors,
  navigationTheme: DarkTheme,
  ready: false,
  setDarkMode: async () => {},
  toggleDarkMode: async () => {},
});

function buildNavigationTheme(colors: ThemeColors, darkMode: boolean) {
  const baseTheme = darkMode ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    dark: darkMode,
    colors: {
      ...baseTheme.colors,
      primary: colors.ACCENT,
      background: colors.BG_PRIMARY,
      card: colors.BG_CARD,
      text: colors.TEXT_PRIMARY,
      border: colors.BORDER,
      notification: colors.ACCENT,
    },
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userRepo = new UserRepository();

  const [darkMode, setDarkModeState] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!mounted || value === null) return;
        setDarkModeState(value === 'true');
      })
      .finally(() => {
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !user) return;

    const preferredDarkMode = user.preferences?.darkMode;
    if (typeof preferredDarkMode !== 'boolean') return;

    setDarkModeState(preferredDarkMode);
    AsyncStorage.setItem(STORAGE_KEY, String(preferredDarkMode)).catch(() => {});
  }, [ready, user]);

  const setDarkMode = async (value: boolean) => {
    setDarkModeState(value);
    await AsyncStorage.setItem(STORAGE_KEY, String(value));

    if (user) {
      try {
        await userRepo.updatePreferences(user.uid, { darkMode: value });
      } catch {
        // O tema continua persistido localmente mesmo se o Firestore falhar.
      }
    }
  };

  const colors = darkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        colors,
        navigationTheme: buildNavigationTheme(colors, darkMode),
        ready,
        setDarkMode,
        toggleDarkMode: () => setDarkMode(!darkMode),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
