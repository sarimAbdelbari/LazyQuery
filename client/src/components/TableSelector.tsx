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
        <div className="absolute top-full left-0 mt-3 bg-[rgba(17,17,17,0.95)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white">Select Tables</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAll();
                }}
                className="text-sm text-[#667eea] hover:text-[#764ba2] transition-colors font-semibold"
              >
                {validSelectedTables.length === allTables.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="text-sm text-[#a1a1aa]">
              {selectedCount} of {totalCount} tables selected
            </div>
          </div>

          {/* Search */}
          <div className="p-5 border-b border-[rgba(255,255,255,0.1)]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tables..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pr-10 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white text-base placeholder-[#71717a] focus:outline-none focus:border-[#667eea] transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-white transition-colors"
                  title="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-3 text-sm text-[#a1a1aa]">
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
                className="flex items-center gap-4 px-5 py-3 hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={validSelectedTables.includes(table.name)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleTable(table.name);
                  }}
                  className="w-5 h-5 text-[#667eea] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.2)] rounded focus:ring-[#667eea] focus:ring-2"
                />
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                    table.type === 'Model' 
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' 
                      : 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white'
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
          </div>

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

          {/* Footer */}
          <div className="p-5 border-t border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between text-sm text-[#a1a1aa]">
              <span className="font-medium">Models: {models.length}</span>
              <span className="font-medium">Enums: {enums.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

