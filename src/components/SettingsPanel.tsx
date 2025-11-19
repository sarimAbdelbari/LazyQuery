import { Leva, folder, useControls } from 'leva';
import { useSettings } from '../lib/contexts/settings';

export const SettingsPanel = () => {
  const { settings, updateSetting, updateTheme } = useSettings();

  useControls({
    // Display Section
    Display: folder({
      direction: {
        value: settings.layout,
        options: {
          'Top to Bottom': 'TB',
          'Left to Right': 'LR',
          'Bottom to Top': 'BT',
          'Right to Left': 'RL',
        },
        onChange: (value) => updateSetting('layout', value as 'TB' | 'LR' | 'BT' | 'RL'),
      },
      showMinimap: {
        value: settings.showMinimap,
        onChange: (value) => updateSetting('showMinimap', value),
      },
      showBackground: {
        value: settings.showBackground,
        onChange: (value) => updateSetting('showBackground', value),
      },
      backgroundVariant: {
        value: settings.backgroundVariant,
        options: {
          Lines: 'lines',
          Dots: 'dots',
          Cross: 'cross',
        },
        onChange: (value) => updateSetting('backgroundVariant', value as 'lines' | 'dots' | 'cross'),
      },
      showFieldTypes: {
        value: settings.showFieldTypes,
        onChange: (value) => updateSetting('showFieldTypes', value),
      },
      showFieldIcons: {
        value: settings.showFieldIcons,
        onChange: (value) => updateSetting('showFieldIcons', value),
      },
    }),

    // Theme Section
    Theme: folder({
      primaryColor: {
        value: settings.theme.primaryColor,
        onChange: (value) => updateTheme({ primaryColor: value }),
      },
      secondaryColor: {
        value: settings.theme.secondaryColor,
        onChange: (value) => updateTheme({ secondaryColor: value }),
      },
      enumColor: {
        value: settings.theme.enumColor,
        onChange: (value) => updateTheme({ enumColor: value }),
      },
      titleColor: {
        value: settings.theme.titleColor,
        onChange: (value) => updateTheme({ titleColor: value }),
      },
    }),
  });

  return (
    <Leva 
      theme={{
        colors: {
          // Background elevations using project's dark theme
          elevation1: '#001029', // --bg-secondary
          elevation2: '#00213e', // --bg-tertiary
          elevation3: '#003153', // --bg-elevated
          
          // Accent colors using project's primary/secondary
          accent1: settings.theme.primaryColor, // #00527d
          accent2: settings.theme.secondaryColor, // #001477
          accent3: '#4da7ca', // --primary-300 (cyan accent)
          
          // Highlight colors
          highlight1: settings.theme.primaryColor,
          highlight2: settings.theme.secondaryColor,
          highlight3: '#00213e', // --bg-tertiary
          
          // Vivid accent
          vivid1: settings.theme.primaryColor,
          
          // Folder/widget colors
          folderWidgetColor: '#00213e', // --bg-tertiary
          folderTextColor: '#ffffff', // Always white
          
          // Tooltip colors
          toolTipBackground: '#001029', // --bg-secondary
          toolTipText: '#ffffff', // Always white
        },
        sizes: {
          rootWidth: '280px',
        },
      }}
      titleBar={{
        drag: false,
        title: 'Settings',
      }}
      collapsed={true}
    />
  );
};

