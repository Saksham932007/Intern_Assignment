import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header/Header';
import Toolbar from './components/Toolbar/Toolbar';
import TabSystem from './components/TabSystem/TabSystem';
import SpreadsheetGrid from './components/SpreadsheetGrid/SpreadsheetGrid';
import BottomTabs from './components/BottomTabs/BottomTabs';
import SpreadsheetManager from './components/SpreadsheetManager/SpreadsheetManager';
import { spreadsheetData } from './data/mockData';
import { SpreadsheetRow, Tab, Column, FilterConfig, SortConfig } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { applyFilters, exportToCSV, generateId } from './utils/dataUtils';

function App() {
  const [currentView, setCurrentView] = useState<'manager' | 'spreadsheet'>('manager');
  const [currentSpreadsheetId, setCurrentSpreadsheetId] = useState<string | null>(null);
  
  const [data, setData] = useLocalStorage<SpreadsheetRow[]>(
    currentSpreadsheetId ? `spreadsheet-data-${currentSpreadsheetId}` : 'spreadsheet-data', 
    spreadsheetData
  );
  const [columns, setColumns] = useLocalStorage<Column[]>(
    currentSpreadsheetId ? `spreadsheet-columns-${currentSpreadsheetId}` : 'spreadsheet-columns',
    [
      { key: 'jobRequest', label: 'Job Request', width: 'w-80', sortable: true, type: 'text' },
      { key: 'submitted', label: 'Submitted', width: 'w-32', sortable: true, type: 'date' },
      { key: 'status', label: 'Status', width: 'w-36', sortable: true, type: 'select' },
      { key: 'submitter', label: 'Submitter', width: 'w-36', sortable: true, type: 'text' },
      { key: 'url', label: 'URL', width: 'w-40', sortable: false, type: 'url' },
      { key: 'assigned', label: 'Assigned', width: 'w-36', sortable: true, type: 'text' },
      { key: 'priority', label: 'Priority', width: 'w-28', sortable: true, type: 'select' },
      { key: 'dueDate', label: 'Due Date', width: 'w-32', sortable: true, type: 'date' },
      { key: 'estValue', label: 'Est. Value', width: 'w-32', sortable: true, type: 'currency' }
    ]
  );
  
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeBottomTab, setActiveBottomTab] = useState('all');
  
  const [activeTabs] = useState<Tab[]>([
    { id: 'overview', label: 'My Spreadsheet', active: true, type: 'default' }
  ]);
  
  const [bottomTabs] = useState([
    { id: 'all', label: 'All Items', active: true },
    { id: 'pending', label: 'Pending', active: false },
    { id: 'in-progress', label: 'In Progress', active: false },
    { id: 'complete', label: 'Complete', active: false }
  ]);

  // Filter data based on active bottom tab
  const filteredByTab = useMemo(() => {
    switch (activeBottomTab) {
      case 'pending':
        return data.filter(row => row.status === 'Need to start');
      case 'in-progress':
        return data.filter(row => row.status === 'In-progress');
      case 'complete':
        return data.filter(row => row.status === 'Complete');
      default:
        return data;
    }
  }, [data, activeBottomTab]);

  // Apply filters to the tab-filtered data
  const processedData = useMemo(() => {
    return applyFilters(filteredByTab, filters);
  }, [filteredByTab, filters]);

  const handleSelectSpreadsheet = useCallback((spreadsheetId: string) => {
    setCurrentSpreadsheetId(spreadsheetId);
    setCurrentView('spreadsheet');
    
    // Reset filters and sorting when switching spreadsheets
    setFilters([]);
    setSortConfig(null);
    setActiveBottomTab('all');
  }, []);

  const handleCreateNew = useCallback((template?: string) => {
    const newId = `sheet-${Date.now()}`;
    setCurrentSpreadsheetId(newId);
    setCurrentView('spreadsheet');
    
    // Initialize with template data if specified
    let initialData: SpreadsheetRow[] = [];
    let initialColumns = [
      { key: 'jobRequest', label: 'Job Request', width: 'w-80', sortable: true, type: 'text' },
      { key: 'submitted', label: 'Submitted', width: 'w-32', sortable: true, type: 'date' },
      { key: 'status', label: 'Status', width: 'w-36', sortable: true, type: 'select' },
      { key: 'submitter', label: 'Submitter', width: 'w-36', sortable: true, type: 'text' },
      { key: 'url', label: 'URL', width: 'w-40', sortable: false, type: 'url' },
      { key: 'assigned', label: 'Assigned', width: 'w-36', sortable: true, type: 'text' },
      { key: 'priority', label: 'Priority', width: 'w-28', sortable: true, type: 'select' },
      { key: 'dueDate', label: 'Due Date', width: 'w-32', sortable: true, type: 'date' },
      { key: 'estValue', label: 'Est. Value', width: 'w-32', sortable: true, type: 'currency' }
    ];

    if (template === 'project-tracker') {
      initialColumns = [
        { key: 'jobRequest', label: 'Task Name', width: 'w-80', sortable: true, type: 'text' },
        { key: 'submitted', label: 'Start Date', width: 'w-32', sortable: true, type: 'date' },
        { key: 'status', label: 'Status', width: 'w-36', sortable: true, type: 'select' },
        { key: 'submitter', label: 'Assignee', width: 'w-36', sortable: true, type: 'text' },
        { key: 'priority', label: 'Priority', width: 'w-28', sortable: true, type: 'select' },
        { key: 'dueDate', label: 'Due Date', width: 'w-32', sortable: true, type: 'date' },
        { key: 'estValue', label: 'Budget', width: 'w-32', sortable: true, type: 'currency' }
      ];
    } else if (template === 'budget-planner') {
      initialColumns = [
        { key: 'jobRequest', label: 'Expense Item', width: 'w-80', sortable: true, type: 'text' },
        { key: 'submitted', label: 'Date', width: 'w-32', sortable: true, type: 'date' },
        { key: 'status', label: 'Category', width: 'w-36', sortable: true, type: 'select' },
        { key: 'submitter', label: 'Vendor', width: 'w-36', sortable: true, type: 'text' },
        { key: 'priority', label: 'Type', width: 'w-28', sortable: true, type: 'select' },
        { key: 'estValue', label: 'Amount', width: 'w-32', sortable: true, type: 'currency' }
      ];
    } else if (template === 'inventory') {
      initialColumns = [
        { key: 'jobRequest', label: 'Product Name', width: 'w-80', sortable: true, type: 'text' },
        { key: 'submitted', label: 'Last Updated', width: 'w-32', sortable: true, type: 'date' },
        { key: 'status', label: 'Status', width: 'w-36', sortable: true, type: 'select' },
        { key: 'submitter', label: 'Supplier', width: 'w-36', sortable: true, type: 'text' },
        { key: 'priority', label: 'Category', width: 'w-28', sortable: true, type: 'select' },
        { key: 'estValue', label: 'Unit Price', width: 'w-32', sortable: true, type: 'currency' }
      ];
    }

    // Save initial data to localStorage
    localStorage.setItem(`spreadsheet-data-${newId}`, JSON.stringify(initialData));
    localStorage.setItem(`spreadsheet-columns-${newId}`, JSON.stringify(initialColumns));
    
    // Reset state
    setFilters([]);
    setSortConfig(null);
    setActiveBottomTab('all');
  }, []);

  const handleBackToManager = useCallback(() => {
    setCurrentView('manager');
    setCurrentSpreadsheetId(null);
  }, []);

  const handleCellChange = useCallback((rowId: number, column: keyof SpreadsheetRow, value: any) => {
    setData(prevData => {
      const existingRowIndex = prevData.findIndex(row => row.id === rowId);
      
      if (existingRowIndex >= 0) {
        // Update existing row
        const updatedData = [...prevData];
        updatedData[existingRowIndex] = { ...updatedData[existingRowIndex], [column]: value };
        return updatedData;
      } else {
        // Create new row
        const newRow: SpreadsheetRow = {
          id: rowId,
          jobRequest: column === 'jobRequest' ? value : '',
          submitted: column === 'submitted' ? value : new Date().toISOString().split('T')[0],
          status: column === 'status' ? value : 'Need to start',
          submitter: column === 'submitter' ? value : '',
          url: column === 'url' ? value : '',
          assigned: column === 'assigned' ? value : '',
          priority: column === 'priority' ? value : 'Medium',
          dueDate: column === 'dueDate' ? value : '',
          estValue: column === 'estValue' ? value : 0
        };
        return [...prevData, newRow];
      }
    });
  }, [setData]);

  const handleAddRow = useCallback(() => {
    const newRow: SpreadsheetRow = {
      id: generateId(),
      jobRequest: '',
      submitted: new Date().toISOString().split('T')[0],
      status: 'Need to start',
      submitter: '',
      url: '',
      assigned: '',
      priority: 'Medium',
      dueDate: '',
      estValue: 0
    };
    setData(prevData => [...prevData, newRow]);
  }, [setData]);

  const handleSort = useCallback((column: keyof SpreadsheetRow) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === column) {
        return prevConfig.direction === 'asc' 
          ? { key: column, direction: 'desc' }
          : null;
      }
      return { key: column, direction: 'asc' };
    });
  }, []);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const importedData = JSON.parse(content);
          if (Array.isArray(importedData)) {
            setData(importedData);
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const importedData = lines.slice(1)
            .filter(line => line.trim())
            .map((line, index) => {
              const values = line.split(',');
              const row: any = { id: generateId() };
              headers.forEach((header, i) => {
                const cleanHeader = header.trim().replace(/"/g, '');
                const value = values[i]?.trim().replace(/"/g, '') || '';
                
                // Map CSV headers to our data structure
                switch (cleanHeader.toLowerCase()) {
                  case 'job request':
                  case 'jobrequest':
                    row.jobRequest = value;
                    break;
                  case 'submitted':
                    row.submitted = value;
                    break;
                  case 'status':
                    row.status = value;
                    break;
                  case 'submitter':
                    row.submitter = value;
                    break;
                  case 'url':
                    row.url = value;
                    break;
                  case 'assigned':
                    row.assigned = value;
                    break;
                  case 'priority':
                    row.priority = value;
                    break;
                  case 'due date':
                  case 'duedate':
                    row.dueDate = value;
                    break;
                  case 'est. value':
                  case 'estvalue':
                    row.estValue = parseFloat(value) || 0;
                    break;
                }
              });
              return row;
            });
          setData(importedData);
        }
        
        console.log('Data imported successfully');
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Error importing file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  }, [setData]);

  const handleExport = useCallback(() => {
    if (processedData.length === 0) {
      alert('No data to export. Please add some rows first.');
      return;
    }
    exportToCSV(processedData, `spreadsheet-export-${new Date().toISOString().split('T')[0]}.csv`);
  }, [processedData]);

  const handleShare = useCallback(() => {
    if (processedData.length === 0) {
      alert('No data to share. Please add some rows first.');
      return;
    }
    
    const shareData = {
      data: processedData,
      filters,
      sortConfig,
      columns: columns.filter(col => !col.hidden)
    };
    
    const shareUrl = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(shareData, null, 2))}`;
    const link = document.createElement('a');
    link.href = shareUrl;
    link.download = 'spreadsheet-share.json';
    link.click();
    
    console.log('Spreadsheet shared');
  }, [processedData, filters, sortConfig, columns]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    console.log(`Tab changed to: ${tabId}`);
  }, []);

  const handleBottomTabChange = useCallback((tabId: string) => {
    setActiveBottomTab(tabId);
    console.log(`Bottom tab changed to: ${tabId}`);
  }, []);

  // Toolbar handlers
  const toolbarHandlers = {
    onHideFields: () => console.log('Hide fields clicked'),
    onSort: () => console.log('Sort clicked'),
    onFilter: () => console.log('Filter clicked'),
    onCellView: () => console.log('Cell view clicked'),
    onImport: handleImport,
    onExport: handleExport,
    onShare: handleShare,
    onNewAction: handleAddRow
  };

  const handleAddTab = () => console.log('Add tab clicked');
  const handleAddBottomTab = () => console.log('Add bottom tab clicked');

  // Show spreadsheet manager
  if (currentView === 'manager') {
    return (
      <SpreadsheetManager
        onSelectSpreadsheet={handleSelectSpreadsheet}
        onCreateNew={handleCreateNew}
      />
    );
  }

  // Show spreadsheet interface
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onBackToManager={handleBackToManager} />
      <Toolbar 
        {...toolbarHandlers}
        columns={columns}
        onColumnsChange={setColumns}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <TabSystem 
        tabs={activeTabs.map(tab => ({ ...tab, active: tab.id === activeTab }))}
        onTabChange={handleTabChange} 
        onAddTab={handleAddTab} 
      />
      <SpreadsheetGrid 
        data={processedData}
        onCellChange={handleCellChange}
        onAddRow={handleAddRow}
        columns={columns}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <BottomTabs 
        tabs={bottomTabs.map(tab => ({ ...tab, active: tab.id === activeBottomTab }))}
        onTabChange={handleBottomTabChange} 
        onAddTab={handleAddBottomTab} 
      />
    </div>
  );
}

export default App;