import { useEffect, useCallback } from 'react';
import { CellPosition } from '../types';

interface UseKeyboardNavigationProps {
  selectedCell: CellPosition | null;
  setSelectedCell: (cell: CellPosition | null) => void;
  totalRows: number;
  columns: string[];
  isEditing: boolean;
}

export function useKeyboardNavigation({
  selectedCell,
  setSelectedCell,
  totalRows,
  columns,
  isEditing
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedCell || isEditing) return;

    const currentRowIndex = selectedCell.row;
    const currentColIndex = columns.indexOf(selectedCell.col);

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (currentRowIndex > 1) {
          setSelectedCell({ row: currentRowIndex - 1, col: selectedCell.col });
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (currentRowIndex < totalRows) {
          setSelectedCell({ row: currentRowIndex + 1, col: selectedCell.col });
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentColIndex > 0) {
          setSelectedCell({ row: selectedCell.row, col: columns[currentColIndex - 1] });
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentColIndex < columns.length - 1) {
          setSelectedCell({ row: selectedCell.row, col: columns[currentColIndex + 1] });
        }
        break;
      case 'Enter':
        event.preventDefault();
        // Enter edit mode or move to next row
        if (currentRowIndex < totalRows) {
          setSelectedCell({ row: currentRowIndex + 1, col: selectedCell.col });
        }
        break;
      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          // Move left
          if (currentColIndex > 0) {
            setSelectedCell({ row: selectedCell.row, col: columns[currentColIndex - 1] });
          }
        } else {
          // Move right
          if (currentColIndex < columns.length - 1) {
            setSelectedCell({ row: selectedCell.row, col: columns[currentColIndex + 1] });
          }
        }
        break;
    }
  }, [selectedCell, setSelectedCell, totalRows, columns, isEditing]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}