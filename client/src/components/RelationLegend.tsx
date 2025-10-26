import { useTheme } from '../lib/contexts/theme';

interface RelationLegendProps {
  enabledRelations: {
    'one-to-many': boolean;
    'many-to-one': boolean;
    'many-to-many': boolean;
    'one-to-one': boolean;
  };
  onRelationToggle: (relationType: keyof RelationLegendProps['enabledRelations']) => void;
}

export const RelationLegend = ({ enabledRelations, onRelationToggle }: RelationLegendProps) => {
  const { isDarkMode } = useTheme();

  const relations = [
    { 
      type: 'One-to-Many (1:N)', 
      key: 'one-to-many' as const,
      color: isDarkMode ? '#10b981' : '#059669',
      example: 'Category → Products'
    },
    { 
      type: 'Many-to-One (N:1)', 
      key: 'many-to-one' as const,
      color: isDarkMode ? '#f59e0b' : '#d97706',
      example: 'Product → Category'
    },
    { 
      type: 'Many-to-Many (M:N)', 
      key: 'many-to-many' as const,
      color: isDarkMode ? '#06b6d4' : '#0891b2',
      example: 'Product ↔ Supplier'
    },
    { 
      type: 'One-to-One (1:1)', 
      key: 'one-to-one' as const,
      color: isDarkMode ? '#8b5cf6' : '#7c3aed',
      example: 'User → Profile'
    },
  ];

  return (
    <div className={`absolute bottom-4 right-4 z-40 p-4 rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-800/95 border-gray-600' 
        : 'bg-white/95 border-gray-300'
    } shadow-lg backdrop-blur-sm min-w-[280px]`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          🔗 Relationship Types
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => {
              const allEnabled = Object.values(enabledRelations).every(Boolean);
              if (allEnabled) {
                // Deselect all
                (Object.keys(enabledRelations) as Array<keyof typeof enabledRelations>).forEach(key => {
                  if (enabledRelations[key]) {
                    onRelationToggle(key);
                  }
                });
              } else {
                // Select all
                (Object.keys(enabledRelations) as Array<keyof typeof enabledRelations>).forEach(key => {
                  if (!enabledRelations[key]) {
                    onRelationToggle(key);
                  }
                });
              }
            }}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={Object.values(enabledRelations).every(Boolean) ? 'Deselect All' : 'Select All'}
          >
            {Object.values(enabledRelations).every(Boolean) ? 'None' : 'All'}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {relations.map((rel) => (
          <div key={rel.type} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabledRelations[rel.key]}
              onChange={() => onRelationToggle(rel.key)}
              className={`w-4 h-4 rounded border-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-500 text-blue-500' 
                  : 'bg-white border-gray-300 text-blue-600'
              } focus:ring-2 focus:ring-blue-500 focus:ring-offset-0`}
            />
            <div 
              className={`w-8 h-0.5 rounded-full transition-opacity ${
                enabledRelations[rel.key] ? 'opacity-100' : 'opacity-30'
              }`}
              style={{ backgroundColor: rel.color }}
            />
            <div className="flex-1">
              <div className={`text-xs font-semibold transition-opacity ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              } ${enabledRelations[rel.key] ? 'opacity-100' : 'opacity-50'}`}>
                {rel.type}
              </div>
              <div className={`text-xs transition-opacity ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              } ${enabledRelations[rel.key] ? 'opacity-100' : 'opacity-50'}`}>
                {rel.example}
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>●</span>
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Labels in <span className="font-semibold" style={{ color: '#fbbf24' }}>gold</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

