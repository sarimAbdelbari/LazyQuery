import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Model, Enum } from '../lib/types/schema';
import { Search, X, Database, Hash, Type, Calendar, CheckSquare, FileText, File, List, Link2 } from 'lucide-react';

interface TableFieldSelectorProps {
  models: Model[];
  enums: Enum[];
  selectedTables: string[];
  onSelectionChange: (selectedTables: string[]) => void;
  onFieldSelect?: (field: { modelName: string; fieldName: string; fieldType: string }) => void;
}

type Mode = 'tables' | 'fields';

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

export const TableFieldSelector = ({ 
  models, 
  enums, 
  selectedTables, 
  onSelectionChange,
  onFieldSelect 
}: TableFieldSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>('tables');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [fieldSearchQuery, setFieldSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const fieldInputRef = useRef<HTMLInputElement>(null);
  const ITEMS_PER_PAGE = 50;

  // Keyboard shortcut (Ctrl/Cmd + K) to focus field search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setActiveMode('fields');
        // Small delay to ensure input is rendered
        setTimeout(() => {
          fieldInputRef.current?.focus();
        }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoize all tables
  const allTables = useMemo(() => [
    ...models.map(m => ({ name: m.name, type: 'Model' as const })),
    ...enums.map(e => ({ name: e.name, type: 'Enum' as const }))
  ].sort((a, b) => a.name.localeCompare(b.name)), [models, enums]);

  // Filter selected tables to only include those that actually exist
  const validSelectedTables = useMemo(() => 
    selectedTables.filter(tableName => 
      allTables.some(table => table.name === tableName)
    ), [selectedTables, allTables]
  );

  // Memoize filtered tables for Tables mode
  const filteredTables = useMemo(() => {
    const filtered = allTables.filter(table => 
      table.name.toLowerCase().includes(tableSearchQuery.toLowerCase())
    );
    
    if (validSelectedTables.length === 0) {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered.sort((a, b) => {
      const aSelected = validSelectedTables.includes(a.name);
      const bSelected = validSelectedTables.includes(b.name);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [allTables, tableSearchQuery, validSelectedTables]);

  // Calculate pagination for tables
  const totalPages = Math.ceil(filteredTables.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTables = filteredTables.slice(startIndex, endIndex);

  // Create search results for Fields mode
  const fieldSearchResults = useMemo(() => {
    if (!fieldSearchQuery.trim()) return [];

    const query = fieldSearchQuery.toLowerCase().trim();
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
  }, [fieldSearchQuery, models, enums]);

  // Reset page when table search query changes
  const handleTableSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTableSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleToggleAll = useCallback(() => {
    if (validSelectedTables.length === allTables.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allTables.map(t => t.name));
    }
  }, [validSelectedTables.length, allTables, onSelectionChange]);

  const handleToggleTable = useCallback((tableName: string) => {
    if (selectedTables.includes(tableName)) {
      onSelectionChange(selectedTables.filter(name => name !== tableName));
    } else {
      onSelectionChange([...selectedTables, tableName]);
    }
  }, [selectedTables, onSelectionChange]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFieldClick = useCallback((result: SearchResult) => {
    // Auto-select the table containing the field
    if (!selectedTables.includes(result.modelName)) {
      onSelectionChange([...selectedTables, result.modelName]);
    }
    
    // Call the field select callback if provided
    if (onFieldSelect) {
      onFieldSelect({
        modelName: result.modelName,
        fieldName: result.fieldName,
        fieldType: result.fieldType,
      });
    }
  }, [selectedTables, onSelectionChange, onFieldSelect]);

  const handleModeChange = useCallback((mode: Mode) => {
    setActiveMode(mode);
    setCurrentPage(1);
    if (mode === 'fields') {
      setTimeout(() => {
        fieldInputRef.current?.focus();
      }, 100);
    }
  }, []);

  const selectedCount = validSelectedTables.length;
  const totalCount = allTables.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] text-white rounded-xl transition-all duration-300 shadow-lg"
      >
        <span className="text-base font-semibold">
          Tables ({selectedCount}/{totalCount}) 
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Click outside to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full w-[400px] left-0 mt-3 bg-[rgba(17,17,17,0.95)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 max-h-[calc(100vh-250px)] overflow-hidden flex flex-col">
            {/* Header with Mode Tabs */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModeChange('tables')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeMode === 'tables'
                        ? 'bg-[#00527d] text-white'
                        : 'text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                    }`}
                  >
                    Tables
                  </button>
                  <button
                    onClick={() => handleModeChange('fields')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeMode === 'fields'
                        ? 'bg-[#00527d] text-white'
                        : 'text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                    }`}
                  >
                    Fields
                  </button>
                </div>
                {activeMode === 'tables' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAll();
                    }}
                    className="text-sm text-[#00527d] hover:text-[#001477] transition-colors font-semibold"
                  >
                    {validSelectedTables.length === allTables.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
              {activeMode === 'tables' && (
                <div className="text-sm text-[rgba(255,255,255,0.6)]">
                  {selectedCount} of {totalCount} tables selected
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.1)]">
              {activeMode === 'tables' ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tables..."
                    value={tableSearchQuery}
                    onChange={handleTableSearchChange}
                    className="w-full px-4 py-3 pr-10 bg-[rgba(0,82,125,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white text-base placeholder-[#71717a] focus:outline-none focus:border-[#00527d] transition-all backdrop-blur-sm"
                  />
                  {tableSearchQuery && (
                    <button
                      onClick={() => {
                        setTableSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Search 
                    size={22} 
                    className="absolute left-4 z-50 top-1/2 transform -translate-y-1/2 text-[#a1a1aa]"
                  />
                  <input
                    ref={fieldInputRef}
                    type="text"
                    placeholder="Search fields... (Ctrl+K)"
                    value={fieldSearchQuery}
                    onChange={(e) => setFieldSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-[rgba(0,82,125,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white text-base placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#00527d] focus:border-[#00527d] transition-all backdrop-blur-sm"
                  />
                  {fieldSearchQuery && (
                    <button
                      onClick={() => {
                        setFieldSearchQuery('');
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}
              {activeMode === 'tables' && tableSearchQuery && (
                <div className="mt-3 text-sm text-[rgba(255,255,255,0.6)]">
                  Showing {filteredTables.length} of {allTables.length} tables
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {activeMode === 'tables' ? (
                // Tables Mode Content
                <>
                  {paginatedTables.length > 0 ? (
                    paginatedTables.map((table) => (
                      <label
                        key={table.name}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-[rgba(0,82,125,0.05)] cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={validSelectedTables.includes(table.name)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleTable(table.name);
                          }}
                          className="w-5 h-5 text-[#00527d] bg-[rgba(0,82,125,0.03)] border-[rgba(255,255,255,0.2)] rounded focus:ring-[#00527d] focus:ring-2"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                            table.type === 'Model' 
                              ? 'bg-gradient-to-r from-[#00527d] to-[#001477] text-white' 
                              : 'bg-gradient-to-r from-[#4da7ca] to-[#00527d] text-white'
                          }`}>
                            {table.type}
                          </span>
                          <span className="text-base text-white font-mono">{table.name}</span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="p-12 text-center text-[#a1a1aa]">
                      <div className="text-5xl mb-3">🔍</div>
                      <div className="text-base font-semibold">No tables found</div>
                      <div className="text-sm mt-1">Try a different search term</div>
                    </div>
                  )}
                </>
              ) : (
                // Fields Mode Content
                <>
                  {fieldSearchResults.length > 0 ? (
                    <div className="p-4">
                      <div className="text-sm font-bold mb-4 text-[rgba(255,255,255,0.6)]">
                        Found {fieldSearchResults.length} result{fieldSearchResults.length !== 1 ? 's' : ''}
                      </div>
                      {fieldSearchResults.map((result, index) => (
                        <div
                          key={`${result.modelName}-${result.fieldName}-${index}`}
                          onClick={() => handleFieldClick(result)}
                          className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[rgba(0,82,125,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] mb-2"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1 text-[#00527d]">
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
                                    <span className="text-xs bg-gradient-to-r from-[#00527d] to-[#001477] text-white px-2 py-1 rounded-full font-semibold">
                                      REL
                                    </span>
                                  )}
                                  {result.isEnum && (
                                    <span className="text-xs bg-gradient-to-r from-[#4da7ca] to-[#00527d] text-white px-2 py-1 rounded-full font-semibold">
                                      ENUM
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-[rgba(255,255,255,0.6)]">
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
                  ) : fieldSearchQuery ? (
                    <div className="p-8 text-center text-[#a1a1aa]">
                      <Search size={32} className="mx-auto mb-3 opacity-50" />
                      <div className="text-base font-semibold">No fields found matching "{fieldSearchQuery}"</div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-[#a1a1aa]">
                      <Search size={32} className="mx-auto mb-3 opacity-50" />
                      <div className="text-base font-semibold">Start typing to search for fields...</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {activeMode === 'tables' && (
              <>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-5 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#a1a1aa]">
                        Page {currentPage} of {totalPages} ({filteredTables.length} results)
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm bg-[rgba(255,255,255,0.05)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(255,255,255,0.1)] transition-all"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-[#a1a1aa] font-semibold">
                          {currentPage}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm bg-[rgba(255,255,255,0.05)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(255,255,255,0.1)] transition-all"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Stats */}
                <div className="p-5 border-t border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center justify-between text-sm text-[#a1a1aa]">
                    <span className="font-medium">Models: {models.length}</span>
                    <span className="font-medium">Enums: {enums.length}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

