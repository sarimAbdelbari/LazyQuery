import { Link } from 'lucide-react';
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
      type: 'Many-to-Many (N:N)', 
      key: 'many-to-many' as const,
      color: isDarkMode ? '#06b6d4' : '#0891b2',
      example: 'Product ↔ Supplier'
    },
    { 
      type: 'One-to-One (1:1)', 
      key: 'one-to-one' as const,
      color: isDarkMode ? '#00527d' : '#004268',
      example: 'User → Profile'
    },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-40 p-6 rounded-2xl border-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[320px]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Link size={22} />
          Relationship Types
        </h3>
        <div className="flex gap-2">
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
            className="px-4 py-2 cursor-pointer hover:scale-110 duration-300 text-sm rounded-xl transition-all  bg-[rgba(255,255,255,0.05)] hover:bg-[var(--bg-secondary)] text-white font-semibold"
            title={Object.values(enabledRelations).every(Boolean) ? 'Deselect All' : 'Select All'}
          >
            {Object.values(enabledRelations).every(Boolean) ? 'None' : 'All'}
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {relations.map((rel) => (
          <div key={rel.type} className="flex items-center gap-4 p-3 rounded-xl bg-[rgba(0,82,125,0.02)] hover:bg-[rgba(0,82,125,0.05)] transition-all">
            <input
              type="checkbox"
              checked={enabledRelations[rel.key]}
              onChange={() => onRelationToggle(rel.key)}
              className="w-5 h-5 rounded border-2 bg-[rgba(0,82,125,0.03)] border-[rgba(255,255,255,0.2)] text-[#00527d] focus:ring-2 focus:ring-[#00527d] focus:ring-offset-0"
            />
            <div 
              className={`w-10 h-1 rounded-full transition-opacity shadow-sm ${
                enabledRelations[rel.key] ? 'opacity-100' : 'opacity-30'
              }`}
              style={{ backgroundColor: rel.color, boxShadow: enabledRelations[rel.key] ? `0 0 10px ${rel.color}40` : 'none' }}
            />
            <div className="flex-1">
              <div className={`text-sm font-bold transition-opacity text-white ${enabledRelations[rel.key] ? 'opacity-100' : 'opacity-50'}`}>
                {rel.type}
              </div>
              <div className={`text-xs transition-opacity text-[rgba(255,255,255,0.6)] ${enabledRelations[rel.key] ? 'opacity-100' : 'opacity-50'}`}>
                {rel.example}
              </div>
            </div>
          </div>
        ))}
        <div className="pt-3 mt-3 border-t border-primary-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(251,191,36,0.1)]">
            <span className="text-lg font-bold" style={{ color: '#fbbf24' }}>●</span>
            <span className="text-sm text-white">
              Labels in <span className="font-bold" style={{ color: '#fbbf24' }}>gold</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

