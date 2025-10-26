import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from 'react';

export interface DiagramSettings {
  layout: 'TB' | 'LR' | 'BT' | 'RL';
  showFieldTypes: boolean;
  showFieldIcons: boolean;
  showMinimap: boolean;
  showBackground: boolean;
  backgroundVariant: 'lines' | 'dots' | 'cross';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    enumColor: string;
    titleColor: string;
    backgroundColor: string;
  };
}

export const DEFAULT_SETTINGS: DiagramSettings = {
  layout: 'TB',
  showFieldTypes: true,
  showFieldIcons: true,
  showMinimap: true,
  showBackground: true,
  backgroundVariant: 'lines',
  theme: {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    enumColor: '#06b6d4',
    titleColor: '#ffffff',
    backgroundColor: '#0a0a0a',
  },
};

interface SettingsContextType {
  settings: DiagramSettings;
  updateSetting: <K extends keyof DiagramSettings>(
    key: K,
    value: DiagramSettings[K],
  ) => void;
  updateTheme: (themeUpdates: Partial<DiagramSettings['theme']>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<DiagramSettings>(DEFAULT_SETTINGS);

  const updateSetting = useCallback(
    <K extends keyof DiagramSettings>(key: K, value: DiagramSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateTheme = useCallback(
    (themeUpdates: Partial<DiagramSettings['theme']>) => {
      setSettings((prev) => ({
        ...prev,
        theme: { ...prev.theme, ...themeUpdates },
      }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateTheme,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

