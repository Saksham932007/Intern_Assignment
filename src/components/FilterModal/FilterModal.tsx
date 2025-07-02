import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { FilterConfig } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterConfig[];
  onFiltersChange: (filters: FilterConfig[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState<FilterConfig[]>(filters);

  if (!isOpen) return null;

  const columns = [
    { key: 'jobRequest', label: 'Job Request' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'status', label: 'Status' },
    { key: 'submitter', label: 'Submitter' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'estValue', label: 'Est. Value' }
  ];

  const operators = [
    { key: 'equals', label: 'Equals' },
    { key: 'contains', label: 'Contains' },
    { key: 'startsWith', label: 'Starts with' },
    { key: 'endsWith', label: 'Ends with' },
    { key: 'greaterThan', label: 'Greater than' },
    { key: 'lessThan', label: 'Less than' }
  ];

  const addFilter = () => {
    setLocalFilters([...localFilters, {
      column: 'jobRequest',
      operator: 'contains',
      value: ''
    }]);
  };

  const removeFilter = (index: number) => {
    setLocalFilters(localFilters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterConfig, value: any) => {
    const updated = localFilters.map((filter, i) => 
      i === index ? { ...filter, [field]: value } : filter
    );
    setLocalFilters(updated);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters.filter(f => f.value.trim() !== ''));
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters([]);
    onFiltersChange([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {localFilters.map((filter, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <select
                  value={filter.column}
                  onChange={(e) => updateFilter(index, 'column', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {columns.map(col => (
                    <option key={col.key} value={col.key}>{col.label}</option>
                  ))}
                </select>

                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {operators.map(op => (
                    <option key={op.key} value={op.key}>{op.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, 'value', e.target.value)}
                  placeholder="Filter value..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addFilter}
            className="mt-4 flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Filter</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            Clear All
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;