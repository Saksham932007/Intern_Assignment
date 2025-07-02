import React from 'react';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { Column } from '../../types';

interface ColumnManagerProps {
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ columns, onColumnsChange, isOpen, onClose }) => {
  if (!isOpen) return null;

  const toggleColumnVisibility = (columnKey: string) => {
    const updatedColumns = columns.map(col => 
      col.key === columnKey ? { ...col, hidden: !col.hidden } : col
    );
    onColumnsChange(updatedColumns);
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Manage Columns</h3>
        <div className="space-y-2">
          {columns.map((column) => (
            <div key={column.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{column.label}</span>
              </div>
              <button
                onClick={() => toggleColumnVisibility(column.key)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {column.hidden ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnManager;