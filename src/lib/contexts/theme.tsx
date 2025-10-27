import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { ColorThemeKind } from '../types/schema';

interface ThemeContextType {
  theme: ColorThemeKind;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  theme: ColorThemeKind;
  children: ReactNode;
}

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  const isDarkMode = theme === ColorThemeKind.Dark || theme === ColorThemeKind.HighContrast;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

