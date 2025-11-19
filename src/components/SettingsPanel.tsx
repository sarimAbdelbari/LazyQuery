import { useState } from 'react';
import { ChevronUp, ChevronDown, Settings } from 'lucide-react';
import { useSettings } from '../lib/contexts/settings';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { ColorPicker } from './ui/ColorPicker';
import { Accordion } from './ui/Accordion';

export const SettingsPanel = () => {
  const { settings, updateSetting, updateTheme } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-50 w-[280px]">
      <div className="panel rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[var(--panel-bg)] hover:bg-[var(--panel-bg-hover)] transition-colors border-b border-[var(--panel-border)]"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-white" />
            <h3 className="text-base font-bold text-white">Settings</h3>
          </div>
          {isCollapsed ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Content */}
        {!isCollapsed && (
          <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Display Section */}
            <Accordion title="Display" defaultOpen={true}>
              <Select
                label="Direction"
                value={settings.layout}
                options={[
                  { label: 'Top to Bottom', value: 'TB' },
                  { label: 'Left to Right', value: 'LR' },
                  { label: 'Bottom to Top', value: 'BT' },
                  { label: 'Right to Left', value: 'RL' },
                ]}
                onChange={(value) => updateSetting('layout', value as 'TB' | 'LR' | 'BT' | 'RL')}
              />

          

              <Switch
                label="Show Background"
                checked={settings.showBackground}
                onChange={(value) => updateSetting('showBackground', value)}
              />

              <Select
                label="Background Variant"
                value={settings.backgroundVariant}
                options={[
                  { label: 'Lines', value: 'lines' },
                  { label: 'Dots', value: 'dots' },
                  { label: 'Cross', value: 'cross' },
                ]}
                onChange={(value) => updateSetting('backgroundVariant', value as 'lines' | 'dots' | 'cross')}
              />

              <Switch
                label="Show Field Types"
                checked={settings.showFieldTypes}
                onChange={(value) => updateSetting('showFieldTypes', value)}
              />

              <Switch
                label="Show Field Icons"
                checked={settings.showFieldIcons}
                onChange={(value) => updateSetting('showFieldIcons', value)}
              />
            </Accordion>

            {/* Theme Section */}
            <Accordion title="Theme" defaultOpen={true}>
              <ColorPicker
                label="Primary Color"
                value={settings.theme.primaryColor}
                onChange={(value) => updateTheme({ primaryColor: value })}
              />

              <ColorPicker
                label="Secondary Color"
                value={settings.theme.secondaryColor}
                onChange={(value) => updateTheme({ secondaryColor: value })}
              />

              <ColorPicker
                label="Enum Color"
                value={settings.theme.enumColor}
                onChange={(value) => updateTheme({ enumColor: value })}
              />

              <ColorPicker
                label="Title Color"
                value={settings.theme.titleColor}
                onChange={(value) => updateTheme({ titleColor: value })}
              />
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};
