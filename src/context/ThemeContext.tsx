import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  // Cores principais
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  // Cores de fundo
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Cores de texto
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Cores de borda
  border: string;
  borderLight: string;
  
  // Cores de status
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Cores de componentes
  card: string;
  input: string;
  button: string;
  buttonText: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export interface Theme {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
}

type ThemeContextType = {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const lightColors: ThemeColors = {
  // Cores principais
  primary: '#00BFFF',
  primaryDark: '#0099CC',
  secondary: '#6C757D',
  accent: '#FF6B35',
  
  // Cores de fundo
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#E9ECEF',
  
  // Cores de texto
  text: '#212529',
  textSecondary: '#6C757D',
  textDisabled: '#ADB5BD',
  
  // Cores de borda
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  
  // Cores de status
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Cores de componentes
  card: '#FFFFFF',
  input: '#F8F9FA',
  button: '#00BFFF',
  buttonText: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarActive: '#00BFFF',
  tabBarInactive: '#6C757D',
};

const darkColors: ThemeColors = {
  // Cores principais
  primary: '#00BFFF',
  primaryDark: '#0099CC',
  secondary: '#6C757D',
  accent: '#FF6B35',
  
  // Cores de fundo
  background: '#000000',
  surface: '#1A1A1A',
  surfaceVariant: '#2A2A2A',
  
  // Cores de texto
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textDisabled: '#666666',
  
  // Cores de borda
  border: '#333333',
  borderLight: '#2A2A2A',
  
  // Cores de status
  success: '#4CAF50',
  warning: '#FFA500',
  error: '#F44336',
  info: '#2196F3',
  
  // Cores de componentes
  card: '#1A1A1A',
  input: '#1A1A1A',
  button: '#00BFFF',
  buttonText: '#FFFFFF',
  tabBar: '#1A1A1A',
  tabBarActive: '#00BFFF',
  tabBarInactive: '#AAAAAA',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: {
    colors: darkColors,
    mode: 'auto',
    isDark: true,
  },
  setThemeMode: async () => {},
  toggleTheme: async () => {},
});

const THEME_STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o tema salvo no AsyncStorage
  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
        setThemeMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determina se o tema atual é escuro
  const isDark = themeMode === 'auto' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  // Seleciona as cores baseadas no tema
  const colors = isDark ? darkColors : lightColors;

  const theme: Theme = {
    colors,
    mode: themeMode,
    isDark,
  };

  const setThemeModeAndSave = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    await setThemeModeAndSave(newMode);
  };

  // Não renderiza até carregar o tema
  if (isLoading) {
    return <></>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode: setThemeModeAndSave, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}

// Hook para criar estilos baseados no tema
export function useThemedStyles<T>(styleCreator: (colors: ThemeColors) => T): T {
  const { theme } = useTheme();
  return styleCreator(theme.colors);
}
