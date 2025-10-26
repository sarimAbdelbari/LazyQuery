/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import type { JSX } from 'react';
import { useTheme } from '../lib/contexts/theme';
import { useSettings } from '../lib/contexts/settings';
import type { ModelNodeType } from '../lib/types/schema';

import {
  Calculator,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  File,
  FileText,
  Hash,
  Link2,
  List,
  Type,
} from 'lucide-react';

const typeIcons: Record<string, JSX.Element> = {
  string: <Type size={16} />,
  int: <Hash size={16} />,
  float: <Calculator size={16} />,
  double: <Hash size={16} />,
  date: <Calendar size={16} />,
  datetime: <Calendar size={16} />,
  boolean: <CheckSquare size={16} />,
  text: <FileText size={16} />,
  file: <File size={16} />,
  enum: <List size={16} />,
};

const getIconForType = (type: string) => {
  return typeIcons[type.toLowerCase()] || <Link2 size={16} />;
};

export const ModelNode = memo(({ data }: NodeProps<ModelNodeType>) => {
  const { isDarkMode } = useTheme();
  const { settings } = useSettings();

  return (
    <div
      className={`
        rounded-xl 
        border 
        ${isDarkMode ? 'border-gray-700 bg-[#1c1c1c]' : 'border-gray-300 bg-white'}
        ${(data as any).isExpanded ? (isDarkMode ? 'border-blue-500 shadow-blue-500/20' : 'border-blue-400 shadow-blue-400/20') : ''}
        shadow-md 
        overflow-hidden 
        transition-all 
        duration-300 
        hover:shadow-lg
        min-w-[280px]
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
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: `linear-gradient(to right, ${settings.theme.primaryColor}, ${settings.theme.secondaryColor})`,
        }}
      >
        <div
          className="font-semibold tracking-wide text-white"
        >
          {data.name}
        </div>
        {(data as any).relatedTables && (data as any).relatedTables.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              (data as any).onExpand?.();
            }}
            className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors"
            title={`${(data as any).isExpanded ? 'Collapse' : 'Expand'} related tables (${(data as any).relatedTables.length})`}
          >
            {(data as any).isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span className="text-xs font-medium">
              {(data as any).relatedTables.length}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
        {data.fields.map(({ type, name, hasConnections, isForeignKey, isRelation, isPrimaryKey }, index) => {
          const isHighlighted = data.highlightedField === name;
          
          return (
            <div
              key={name}
              className={`
                flex 
                items-center 
                px-3 py-2 
                text-sm
                min-h-[40px]
                ${
                  isDarkMode
                    ? index % 2 === 0
                      ? 'bg-[#2a2a2a]'
                      : 'bg-[#232323]'
                    : index % 2 === 0
                      ? 'bg-gray-50'
                      : 'bg-white'
                }
                ${isPrimaryKey ? 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/10 to-transparent dark:from-red-900/20' : ''}
                ${isForeignKey ? 'border-l-2 border-l-yellow-500' : ''}
                ${isRelation ? 'border-l-2 border-l-blue-500' : ''}
                ${isHighlighted ? 'ring-2 ring-yellow-400 ring-opacity-75 bg-yellow-100/20 dark:bg-yellow-900/20' : ''}
                transition-all 
                duration-300
                ${isHighlighted ? 'animate-pulse' : ''}
              `}
            >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {settings.showFieldIcons && getIconForType(type)}
              <span className={`font-medium flex items-center gap-1 ${
                isPrimaryKey ? 'text-red-400 dark:text-red-300' : 'text-white'
              }`}>
                {name}
                {isPrimaryKey && <span className="text-red-500 text-xs font-bold">🔑</span>}
                {isForeignKey && !isPrimaryKey && <span className="text-yellow-500 text-xs">🔑</span>}
                {isRelation && <span className="text-blue-500 text-xs">🔗</span>}
              </span>
            </div>
            {settings.showFieldTypes && (
              <span className={`ml-auto text-xs font-mono flex-shrink-0 ${
                isPrimaryKey ? 'text-red-500 dark:text-red-400 font-bold' :
                isForeignKey ? 'text-yellow-600 dark:text-yellow-400' : 
                isRelation ? 'text-blue-600 dark:text-blue-400' : 
                
                'text-white dark:text-white'
              }`}>
                {type}
                {isPrimaryKey && <span className="ml-1 text-red-500">PK</span>}
              </span>
            )}

            {hasConnections && (
              <Handle
                position={Position.Right}
                id={`${data.name}-${name}-source`}
                type="source"
                style={{
                  top: 15 + 10 +  5 * index, // Increased spacing to prevent overlap
                }}
              />
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
});

