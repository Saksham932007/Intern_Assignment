import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowUpDown, Plus } from 'lucide-react';
import { SpreadsheetRow, Column, CellPosition, SortConfig } from '../../types';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { applySorting } from '../../utils/dataUtils';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityIndicator from '../PriorityIndicator/PriorityIndicator';
import CellEditor from '../CellEditor/CellEditor';

interface SpreadsheetGridProps {
  data: SpreadsheetRow[];
  onCellChange: (rowId: number, column: keyof SpreadsheetRow, value: any) => void;
  onAddRow: () => void;
  columns: Column[];
  sortConfig: SortConfig | null;
  onSort: (column: keyof SpreadsheetRow) => void;
}

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({ 
  data, 
  onCellChange, 
  onAddRow,
  columns,
  sortConfig,
  onSort
}) => {
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    column: keyof SpreadsheetRow;
    position: { top: number; left: number; width: number; height: number };
  } | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  const visibleColumns = columns.filter(col => !col.hidden);
  const sortedData = applySorting(data, sortConfig);

  useKeyboardNavigation({
    selectedCell,
    setSelectedCell,
    totalRows: sortedData.length + 20,
    columns: visibleColumns.map(col => col.key),
    isEditing: !!editingCell
  });

  const handleCellClick = useCallback((rowId: number, column: keyof SpreadsheetRow) => {
    setSelectedCell({ row: rowId, col: column });
  }, []);

  const handleCellDoubleClick = useCallback((rowId: number, column: keyof SpreadsheetRow, event: React.MouseEvent) => {
    const cellElement = event.currentTarget as HTMLElement;
    const rect = cellElement.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();
    
    if (gridRect) {
      setEditingCell({
        rowId,
        column,
        position: {
          top: rect.top - gridRect.top,
          left: rect.left - gridRect.left,
          width: rect.width,
          height: rect.height
        }
      });
    }
  }, []);

  const handleCellSave = useCallback((rowId: number, column: keyof SpreadsheetRow, value: any) => {
    onCellChange(rowId, column, value);
    setEditingCell(null);
  }, [onCellChange]);

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const formatValue = (value: any, column: keyof SpreadsheetRow) => {
    if (column === 'estValue') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    if (column === 'url' && value) {
      return (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      );
    }
    return value;
  };

  const renderCell = (row: SpreadsheetRow, column: Column) => {
    const isSelected = selectedCell?.row === row.id && selectedCell?.col === column.key;
    const cellKey = `${row.id}-${column.key}`;

    if (column.key === 'status') {
      return <StatusBadge status={row.status} />;
    }

    if (column.key === 'priority') {
      return <PriorityIndicator priority={row.priority} />;
    }

    return (
      <div
        ref={(el) => {
          if (el) cellRefs.current[cellKey] = el;
        }}
        className={`p-2 h-full cursor-cell border border-transparent hover:border-blue-300 rounded transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : ''
        }`}
        onClick={() => handleCellClick(row.id, column.key)}
        onDoubleClick={(e) => handleCellDoubleClick(row.id, column.key, e)}
      >
        {formatValue(row[column.key], column.key)}
      </div>
    );
  };

  const renderEmptyCell = (rowIndex: number, column: Column) => {
    const virtualRowId = sortedData.length + rowIndex + 1;
    const isSelected = selectedCell?.row === virtualRowId && selectedCell?.col === column.key;
    const cellKey = `empty-${rowIndex}-${column.key}`;

    return (
      <div
        ref={(el) => {
          if (el) cellRefs.current[cellKey] = el;
        }}
        className={`p-2 h-full cursor-cell border border-transparent hover:border-blue-300 rounded transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : ''
        }`}
        onClick={() => handleCellClick(virtualRowId, column.key)}
        onDoubleClick={(e) => handleCellDoubleClick(virtualRowId, column.key, e)}
      >
        {virtualRowId === sortedData.length + 1 && column.key === 'jobRequest' && (
          <div className="border border-dashed border-gray-300 rounded px-3 py-2 bg-gray-50 min-h-[32px] flex items-center">
            <span className="text-gray-400 text-sm">Click to add your first row...</span>
          </div>
        )}
      </div>
    );
  };

  // Show empty state when no data
  if (sortedData.length === 0) {
    return (
      <div className="flex-1 overflow-auto bg-white relative" ref={gridRef}>
        <div className="min-w-full">
          {/* Header */}
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
            <div className="flex">
              {/* Row number header */}
              <div className="w-12 px-4 py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200">
                #
              </div>
              
              {/* Column headers */}
              {visibleColumns.map((column) => (
                <div
                  key={column.key}
                  className={`${column.width} px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0`}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <button
                        onClick={() => onSort(column.key)}
                        className={`ml-2 hover:text-gray-700 transition-colors ${
                          sortConfig?.key === column.key ? 'text-blue-600' : ''
                        }`}
                      >
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add column button */}
              <div className="w-12 px-4 py-3 text-center border-r border-gray-200">
                <button
                  onClick={() => console.log('Add column')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your spreadsheet</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                Add your first row by clicking the "New Action" button or import existing data.
              </p>
              <button
                onClick={onAddRow}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Row
              </button>
            </div>
          </div>
        </div>

        {/* Cell Editor */}
        {editingCell && (
          <CellEditor
            rowId={editingCell.rowId}
            column={editingCell.column}
            value={sortedData.find(row => row.id === editingCell.rowId)?.[editingCell.column] || ''}
            onSave={handleCellSave}
            onCancel={handleCellCancel}
            position={editingCell.position}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white relative" ref={gridRef}>
      <div className="min-w-full">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
          <div className="flex">
            {/* Row number header */}
            <div className="w-12 px-4 py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200">
              #
            </div>
            
            {/* Column headers */}
            {visibleColumns.map((column) => (
              <div
                key={column.key}
                className={`${column.width} px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0`}
              >
                <div className="flex items-center justify-between">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <button
                      onClick={() => onSort(column.key)}
                      className={`ml-2 hover:text-gray-700 transition-colors ${
                        sortConfig?.key === column.key ? 'text-blue-600' : ''
                      }`}
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add column button */}
            <div className="w-12 px-4 py-3 text-center border-r border-gray-200">
              <button
                onClick={() => console.log('Add column')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data rows */}
        <div>
          {sortedData.map((row, index) => (
            <div
              key={row.id}
              className={`flex hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              {/* Row number */}
              <div className="w-12 px-4 py-3 text-center text-sm text-gray-500 border-r border-gray-200">
                {index + 1}
              </div>
              
              {/* Data cells */}
              {visibleColumns.map((column) => (
                <div
                  key={`${row.id}-${column.key}`}
                  className={`${column.width} border-r border-gray-200 last:border-r-0 text-sm`}
                >
                  {renderCell(row, column)}
                </div>
              ))}
              
              {/* Add row button */}
              <div className="w-12 px-4 py-3 text-center border-r border-gray-200">
                {index === 0 && (
                  <button
                    onClick={onAddRow}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Empty rows for editing */}
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`empty-${index}`} className="flex hover:bg-gray-50 transition-colors">
              <div className="w-12 px-4 py-3 text-center text-sm text-gray-400 border-r border-gray-200">
                {sortedData.length + index + 1}
              </div>
              {visibleColumns.map((column) => (
                <div
                  key={`empty-${index}-${column.key}`}
                  className={`${column.width} border-r border-gray-200 last:border-r-0 h-10`}
                >
                  {renderEmptyCell(index, column)}
                </div>
              ))}
              <div className="w-12 px-4 py-3 text-center border-r border-gray-200"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Cell Editor */}
      {editingCell && (
        <CellEditor
          rowId={editingCell.rowId}
          column={editingCell.column}
          value={sortedData.find(row => row.id === editingCell.rowId)?.[editingCell.column] || ''}
          onSave={handleCellSave}
          onCancel={handleCellCancel}
          position={editingCell.position}
        />
      )}
    </div>
  );
};

export default SpreadsheetGrid;