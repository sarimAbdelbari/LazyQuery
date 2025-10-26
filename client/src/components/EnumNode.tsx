import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import { useTheme } from '../lib/contexts/theme';
import { useSettings } from '../lib/contexts/settings';
import type { EnumNodeType } from '../lib/types/schema';

export const EnumNode = memo(({ data }: NodeProps<EnumNodeType>) => {
  const { isDarkMode } = useTheme();
  const { settings } = useSettings();

  return (
    <div
      className={`
        rounded-xl 
        border 
        ${isDarkMode ? 'border-gray-700 bg-[#1c1c1c]' : 'border-gray-300 bg-white'}
        shadow-md 
        overflow-hidden 
        transition-shadow 
        duration-300 
        hover:shadow-lg
        min-w-[150px]
      `}
    >
      {/* Always render target handle for incoming connections */}
      <Handle
        id={`${data.name}-target`}
        position={Position.Top}
        type="target"
      />
      
      {/* Always render source handle for outgoing connections */}
      <Handle
        id={`${data.name}-source`}
        position={Position.Bottom}
        type="source"
      />

      <div
        className="p-2 text-center"
        style={{
          background: `linear-gradient(to right, ${settings.theme.enumColor}, ${settings.theme.enumColor}dd)`,
        }}
      >
        <div
          className="font-semibold tracking-wide text-white"
        >
          {data.name}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
        {data.values.map((value, index) => (
          <div
            key={value}
            className={`
              px-3 py-2 
              text-sm 
              ${
                isDarkMode
                  ? index % 2 === 0
                    ? 'bg-[#ffffff]'
                    : 'bg-[#ffffff]'
                  : index % 2 === 0
                    ? 'bg-gray-50'
                    : 'bg-white'
              }
              transition-colors 
              duration-200
            `}
          >
            <span className="font-mono text-sm">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

