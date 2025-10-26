import { Handle, Position } from '@xyflow/react';
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
        rounded-2xl 
        border-2 
        ${isDarkMode ? 'border-[rgba(255,255,255,0.1)] bg-[rgba(17,17,17,0.95)]' : 'border-gray-300 bg-white'}
        shadow-lg
        backdrop-blur-xl
        overflow-hidden 
        transition-all 
        duration-300 
        hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]
        hover:border-[rgba(255,255,255,0.2)]
        min-w-[180px]
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
        className="p-3 text-center"
        style={{
          background: `linear-gradient(135deg, ${settings.theme.enumColor}, ${settings.theme.enumColor}dd)`,
        }}
      >
        <div
          className="font-bold text-lg tracking-wide text-white"
        >
          {data.name}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.1)] max-h-[500px] overflow-y-auto">
        {data.values.map((value, index) => (
          <div
            key={value}
            className={`
              px-4 py-3 
              text-base 
              ${
                isDarkMode
                  ? index % 2 === 0
                    ? 'bg-[rgba(255,255,255,0.03)]'
                    : 'bg-[rgba(255,255,255,0.06)]'
                  : index % 2 === 0
                    ? 'bg-gray-50'
                    : 'bg-white'
              }
              hover:bg-[rgba(255,255,255,0.1)]
              transition-colors 
              duration-200
            `}
          >
            <span className="font-mono text-sm text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

