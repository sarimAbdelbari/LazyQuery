import { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '../lib/contexts/theme';
import type { Model, Enum } from '../lib/types/schema';
import { Search, X, Database, Hash, Type, Calendar, CheckSquare, FileText, File, List, Link2 } from 'lucide-react';

interface FieldSearchProps {
  models: Model[];
  enums: Enum[];
  onFieldSelect?: (field: { modelName: string; fieldName: string; fieldType: string }) => void;
}

interface SearchResult {
  modelName: string;
  fieldName: string;
  fieldType: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isRelation?: boolean;
  hasConnections?: boolean;
  isEnum?: boolean;
  enumValues?: string[];
}

const typeIcons: Record<string, React.ReactElement> = {
  string: <Type size={16} />,
  int: <Hash size={16} />,
  float: <Hash size={16} />,
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

export const FieldSearch = ({ models, enums, onFieldSelect }: FieldSearchProps) => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add keyboard shortcut (Ctrl/Cmd + K) to focus search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsExpanded(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Create search results from models and enums
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search in model fields
    models.forEach(model => {
      model.fields.forEach(field => {
        if (field.name.toLowerCase().includes(query) || 
            field.type.toLowerCase().includes(query)) {
          results.push({
            modelName: model.name,
            fieldName: field.name,
            fieldType: field.type,
            isPrimaryKey: field.isPrimaryKey,
            isForeignKey: field.isForeignKey,
            isRelation: field.isRelation,
            hasConnections: field.hasConnections,
          });
        }
      });
    });

    // Search in enums
    enums.forEach(enumItem => {
      if (enumItem.name.toLowerCase().includes(query)) {
        results.push({
          modelName: enumItem.name,
          fieldName: enumItem.name,
          fieldType: 'enum',
          isEnum: true,
          enumValues: enumItem.values,
        });
      }
      
      // Also search in enum values
      enumItem.values.forEach(value => {
        if (value.toLowerCase().includes(query)) {
          results.push({
            modelName: enumItem.name,
            fieldName: value,
            fieldType: 'enum value',
            isEnum: true,
            enumValues: enumItem.values,
          });
        }
      });
    });

    // Sort results: exact matches first, then by model name, then by field name
    return results.sort((a, b) => {
      const aExact = a.fieldName.toLowerCase() === query;
      const bExact = b.fieldName.toLowerCase() === query;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      if (a.modelName !== b.modelName) {
        return a.modelName.localeCompare(b.modelName);
      }
      
      return a.fieldName.localeCompare(b.fieldName);
    });
  }, [searchQuery, models, enums]);

  const handleFieldClick = (result: SearchResult) => {
    if (onFieldSelect) {
      onFieldSelect({
        modelName: result.modelName,
        fieldName: result.fieldName,
        fieldType: result.fieldType,
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsExpanded(false);
  };

  return (
    <div className={`absolute top-4 left-4 z-[99] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="relative">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search 
              size={22} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a1a1aa]"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search fields... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="pl-12 pr-12 py-3 w-80 rounded-xl border-2 text-base bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border-[rgba(255,255,255,0.1)] text-white placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-[#667eea] transition-all duration-300 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a1a1aa] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isExpanded && searchQuery && (
          <div className="absolute top-full mt-3 w-96 max-h-[500px] overflow-y-auto rounded-2xl border-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-[rgba(17,17,17,0.95)] backdrop-blur-2xl border-[rgba(255,255,255,0.1)]" style={{ overflowY: 'auto' }}>
            {searchResults.length > 0 ? (
              <div className="p-4">
                <div className="text-sm font-bold mb-4 text-[#a1a1aa]">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.modelName}-${result.fieldName}-${index}`}
                    onClick={() => handleFieldClick(result)}
                    className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] mb-2"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1 text-[#667eea]">
                        {getIconForType(result.fieldType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-base text-white">
                            {result.fieldName}
                          </span>
                          <div className="flex gap-2">
                            {result.isPrimaryKey && (
                              <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full font-semibold">
                                PK
                              </span>
                            )}
                            {result.isForeignKey && !result.isPrimaryKey && (
                              <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full font-semibold">
                                FK
                              </span>
                            )}
                            {result.isRelation && (
                              <span className="text-xs bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-2 py-1 rounded-full font-semibold">
                                REL
                              </span>
                            )}
                            {result.isEnum && (
                              <span className="text-xs bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white px-2 py-1 rounded-full font-semibold">
                                ENUM
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-[#a1a1aa]">
                          <div className="flex items-center gap-2 mb-1">
                            <Database size={14} />
                            <span className="font-medium">{result.modelName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getIconForType(result.fieldType)}
                            <span className="font-mono">{result.fieldType}</span>
                          </div>
                          {result.enumValues && result.enumValues.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.1)]">
                              <span className="text-xs font-semibold">Values: </span>
                              <span className="text-xs">{result.enumValues.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#a1a1aa]">
                <Search size={32} className="mx-auto mb-3 opacity-50" />
                <div className="text-base font-semibold">No fields found matching "{searchQuery}"</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};
