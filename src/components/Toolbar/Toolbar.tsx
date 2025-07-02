import React, { useState } from 'react';
import { ChevronRight, EyeOff, ArrowUpDown, Filter, Grid3X3, Upload, Download, Share2, Plus } from 'lucide-react';
import ColumnManager from '../ColumnManager/ColumnManager';
import FilterModal from '../FilterModal/FilterModal';
import { Column, FilterConfig } from '../../types';

interface ToolbarProps {
  onHideFields: () => void;
  onSort: () => void;
  onFilter: () => void;
  onCellView: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onShare: () => void;
  onNewAction: () => void;
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
  filters: FilterConfig[];
  onFiltersChange: (filters: FilterConfig[]) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onHideFields,
  onSort,
  onFilter,
  onCellView,
  onImport,
  onExport,
  onShare,
  onNewAction,
  columns,
  onColumnsChange,
  filters,
  onFiltersChange
}) => {
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
  };

  const handleHideFields = () => {
    setShowColumnManager(!showColumnManager);
    onHideFields();
  };

  const handleFilter = () => {
    setShowFilterModal(true);
    onFilter();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Left side tools */}
        <div className="flex items-center space-x-1">
          <button 
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => console.log('Tool bar toggled')}
          >
            <span>Tool bar</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <div className="relative">
            <button 
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                showColumnManager 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={handleHideFields}
            >
              <EyeOff className="w-4 h-4" />
              <span>Hide fields</span>
            </button>
            <ColumnManager
              columns={columns}
              onColumnsChange={onColumnsChange}
              isOpen={showColumnManager}
              onClose={() => setShowColumnManager(false)}
            />
          </div>

          <button 
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onSort}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>

          <button 
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              filters.length > 0
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={handleFilter}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {filters.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {filters.length}
              </span>
            )}
          </button>

          <button 
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onCellView}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Cell view</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <button 
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={handleImportClick}
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>

          <button 
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onExport}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button 
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button 
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors font-medium"
            onClick={onNewAction}
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </div>
  );
};

export default Toolbar;