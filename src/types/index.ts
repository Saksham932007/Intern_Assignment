export interface SpreadsheetRow {
  id: number;
  jobRequest: string;
  submitted: string;
  status: 'In-progress' | 'Need to start' | 'Complete' | 'Blocked';
  submitter: string;
  url: string;
  assigned: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  estValue: number;
}

export interface Column {
  key: keyof SpreadsheetRow;
  label: string;
  width: string;
  sortable: boolean;
  hidden?: boolean;
  type?: 'text' | 'date' | 'select' | 'currency' | 'url';
}

export interface Tab {
  id: string;
  label: string;
  active: boolean;
  type?: 'default' | 'success' | 'info' | 'warning';
}

export interface FilterConfig {
  column: keyof SpreadsheetRow;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface SortConfig {
  key: keyof SpreadsheetRow;
  direction: 'asc' | 'desc';
}

export interface CellPosition {
  row: number;
  col: string;
}

export interface EditingCell {
  rowId: number;
  column: keyof SpreadsheetRow;
  value: string;
}