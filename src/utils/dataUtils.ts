import { SpreadsheetRow, FilterConfig, SortConfig } from '../types';

export function applyFilters(data: SpreadsheetRow[], filters: FilterConfig[]): SpreadsheetRow[] {
  return data.filter(row => {
    return filters.every(filter => {
      const cellValue = String(row[filter.column]).toLowerCase();
      const filterValue = filter.value.toLowerCase();

      switch (filter.operator) {
        case 'equals':
          return cellValue === filterValue;
        case 'contains':
          return cellValue.includes(filterValue);
        case 'startsWith':
          return cellValue.startsWith(filterValue);
        case 'endsWith':
          return cellValue.endsWith(filterValue);
        case 'greaterThan':
          return parseFloat(cellValue) > parseFloat(filterValue);
        case 'lessThan':
          return parseFloat(cellValue) < parseFloat(filterValue);
        default:
          return true;
      }
    });
  });
}

export function applySorting(data: SpreadsheetRow[], sortConfig: SortConfig | null): SpreadsheetRow[] {
  if (!sortConfig) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle different data types
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle dates
    if (sortConfig.key === 'submitted' || sortConfig.key === 'dueDate') {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      return sortConfig.direction === 'asc' 
        ? aDate.getTime() - bDate.getTime() 
        : bDate.getTime() - aDate.getTime();
    }

    // Handle strings
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function exportToCSV(data: SpreadsheetRow[], filename: string = 'spreadsheet-data.csv') {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header as keyof SpreadsheetRow];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : String(value);
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function validateCellValue(value: string, column: keyof SpreadsheetRow): boolean {
  switch (column) {
    case 'estValue':
      return !isNaN(parseFloat(value));
    case 'submitted':
    case 'dueDate':
      return !isNaN(Date.parse(value));
    case 'url':
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
        return true;
      } catch {
        return value.includes('.');
      }
    default:
      return value.trim().length > 0;
  }
}