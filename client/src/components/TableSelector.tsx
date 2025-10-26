import { useState, useMemo, useCallback } from 'react';
import type { Model, Enum } from '../lib/types/schema';

interface TableSelectorProps {
  models: Model[];
  enums: Enum[];
  selectedTables: string[];
  onSelectionChange: (selectedTables: string[]) => void;
}

export const TableSelector = ({ 
  models, 
  enums, 
  selectedTables, 
  onSelectionChange 
}: TableSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50; // Limit items per page for better performance

  // Memoize all tables to prevent unnecessary recalculations
  const allTables = useMemo(() => [
    ...models.map(m => ({ name: m.name, type: 'Model' as const })),
    ...enums.map(e => ({ name: e.name, type: 'Enum' as const }))
  ].sort((a, b) => a.name.localeCompare(b.name)), [models, enums]);

  // Filter selected tables to only include those that actually exist in allTables
  const validSelectedTables = useMemo(() => 
    selectedTables.filter(tableName => 
      allTables.some(table => table.name === tableName)
    ), [selectedTables, allTables]
  );

  // Memoize filtered tables with minimal re-sorting
  const filteredTables = useMemo(() => {
    const filtered = allTables.filter(table => 
      table.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Only sort by selection status if there are selected items
    // This prevents unnecessary re-sorting when deselecting
    if (validSelectedTables.length === 0) {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered.sort((a, b) => {
      const aSelected = validSelectedTables.includes(a.name);
      const bSelected = validSelectedTables.includes(b.name);
      
      // If one is selected and the other isn't, selected comes first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both have same selection status, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [allTables, searchQuery, validSelectedTables]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTables.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTables = filteredTables.slice(startIndex, endIndex);

  // Reset page when search query changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
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

  const selectedCount = validSelectedTables.length;
  const totalCount = allTables.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors"
      >
        <span className="text-sm font-medium">
          Tables ({selectedCount}/{totalCount}) 
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2  bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Select Tables</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAll();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {validSelectedTables.length === allTables.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="text-xs text-gray-400">
              {selectedCount} of {totalCount} tables selected
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-600">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tables..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 pr-8 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-xs text-gray-400">
                Showing {filteredTables.length} of {allTables.length} tables
              </div>
            )}
          </div>

          {/* Table List */}
          <div className="max-h-64 overflow-y-auto">
            {paginatedTables.length > 0 ? (
              paginatedTables.map((table) => (
              <label
                key={table.name}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={validSelectedTables.includes(table.name)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleTable(table.name);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    table.type === 'Model' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {table.type}
                  </span>
                  <span className="text-sm text-white font-mono">{table.name}</span>
                </div>
              </label>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm">No tables found</div>
                <div className="text-xs mt-1">Try a different search term</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-600">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Page {currentPage} of {totalPages} ({filteredTables.length} results)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Models: {models.length}</span>
              <span>Enums: {enums.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

