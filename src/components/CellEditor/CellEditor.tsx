import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { SpreadsheetRow } from '../../types';

interface CellEditorProps {
  rowId: number;
  column: keyof SpreadsheetRow;
  value: any;
  onSave: (rowId: number, column: keyof SpreadsheetRow, value: any) => void;
  onCancel: () => void;
  position: { top: number; left: number; width: number; height: number };
}

const CellEditor: React.FC<CellEditorProps> = ({ 
  rowId, 
  column, 
  value, 
  onSave, 
  onCancel, 
  position 
}) => {
  const [editValue, setEditValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, []);

  const handleSave = () => {
    let processedValue: any = editValue;

    // Process value based on column type
    switch (column) {
      case 'estValue':
        processedValue = parseFloat(editValue) || 0;
        break;
      case 'submitted':
      case 'dueDate':
        // Keep as string for date formatting
        break;
      default:
        processedValue = editValue;
    }

    onSave(rowId, column, processedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const renderInput = () => {
    const baseProps = {
      ref: inputRef as any,
      value: editValue,
      onChange: (e: React.ChangeEvent<any>) => setEditValue(e.target.value),
      onKeyDown: handleKeyDown,
      className: "w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
      style: {
        minHeight: position.height - 4,
      }
    };

    switch (column) {
      case 'status':
        return (
          <select {...baseProps}>
            <option value="Need to start">Need to start</option>
            <option value="In-progress">In-progress</option>
            <option value="Complete">Complete</option>
            <option value="Blocked">Blocked</option>
          </select>
        );
      
      case 'priority':
        return (
          <select {...baseProps}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        );
      
      case 'estValue':
        return (
          <input
            {...baseProps}
            type="number"
            min="0"
            step="1000"
          />
        );
      
      case 'submitted':
      case 'dueDate':
        return (
          <input
            {...baseProps}
            type="date"
          />
        );
      
      case 'jobRequest':
        return (
          <textarea
            {...baseProps}
            rows={2}
            className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        );
      
      default:
        return <input {...baseProps} type="text" />;
    }
  };

  return (
    <div
      className="absolute bg-white border-2 border-blue-500 rounded shadow-lg z-50"
      style={{
        top: position.top,
        left: position.left,
        width: Math.max(position.width, 200),
        minHeight: position.height,
      }}
    >
      <div className="p-1">
        {renderInput()}
        <div className="flex items-center justify-end space-x-1 mt-1">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={onCancel}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CellEditor;