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

const typeIcons: Record<string, JSX.Element> = {
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
    <div className={`absolute top-4 left-4 z-50 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="relative">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search 
              size={20} 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} 
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search fields... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={`
                pl-10 pr-10 py-2 w-64 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
              `}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isExpanded && searchQuery && (
          <div className={`
            absolute top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border shadow-lg
            ${isDarkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-300'
            }
          `}>
            {searchResults.length > 0 ? (
              <div className="p-2">
                <div className={`text-xs font-medium mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.modelName}-${result.fieldName}-${index}`}
                    onClick={() => handleFieldClick(result)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors duration-150
                      ${isDarkMode 
                        ? 'hover:bg-gray-700 border border-gray-700' 
                        : 'hover:bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIconForType(result.fieldType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {result.fieldName}
                          </span>
                          <div className="flex gap-1">
                            {result.isPrimaryKey && (
                              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                                PK
                              </span>
                            )}
                            {result.isForeignKey && !result.isPrimaryKey && (
                              <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded">
                                FK
                              </span>
                            )}
                            {result.isRelation && (
                              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                                REL
                              </span>
                            )}
                            {result.isEnum && (
                              <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded">
                                ENUM
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="flex items-center gap-1">
                            <Database size={12} />
                            <span>{result.modelName}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {getIconForType(result.fieldType)}
                            <span className="font-mono">{result.fieldType}</span>
                          </div>
                          {result.enumValues && result.enumValues.length > 0 && (
                            <div className="mt-1">
                              <span className="text-xs">Values: {result.enumValues.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-4 text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Search size={24} className="mx-auto mb-2 opacity-50" />
                <div className="text-sm">No fields found matching "{searchQuery}"</div>
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
