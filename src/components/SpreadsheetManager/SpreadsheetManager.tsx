import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet, Calendar, User, Search, Grid3X3, Trash2, Copy, Edit3 } from 'lucide-react';

interface Spreadsheet {
  id: string;
  name: string;
  description?: string;
  lastModified: string;
  rowCount: number;
  createdBy: string;
  template?: string;
}

interface SpreadsheetManagerProps {
  onSelectSpreadsheet: (spreadsheetId: string) => void;
  onCreateNew: (template?: string) => void;
}

const SpreadsheetManager: React.FC<SpreadsheetManagerProps> = ({ onSelectSpreadsheet, onCreateNew }) => {
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Load spreadsheets from localStorage
    const savedSpreadsheets = localStorage.getItem('user-spreadsheets');
    if (savedSpreadsheets) {
      setSpreadsheets(JSON.parse(savedSpreadsheets));
    }
  }, []);

  const filteredSpreadsheets = spreadsheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sheet.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSpreadsheet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this spreadsheet?')) {
      const updated = spreadsheets.filter(sheet => sheet.id !== id);
      setSpreadsheets(updated);
      localStorage.setItem('user-spreadsheets', JSON.stringify(updated));
      // Also remove the spreadsheet data
      localStorage.removeItem(`spreadsheet-data-${id}`);
      localStorage.removeItem(`spreadsheet-columns-${id}`);
    }
  };

  const handleDuplicateSpreadsheet = (sheet: Spreadsheet, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `sheet-${Date.now()}`;
    const duplicated: Spreadsheet = {
      ...sheet,
      id: newId,
      name: `${sheet.name} (Copy)`,
      lastModified: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    const updated = [...spreadsheets, duplicated];
    setSpreadsheets(updated);
    localStorage.setItem('user-spreadsheets', JSON.stringify(updated));
    
    // Copy the data
    const originalData = localStorage.getItem(`spreadsheet-data-${sheet.id}`);
    const originalColumns = localStorage.getItem(`spreadsheet-columns-${sheet.id}`);
    if (originalData) localStorage.setItem(`spreadsheet-data-${newId}`, originalData);
    if (originalColumns) localStorage.setItem(`spreadsheet-columns-${newId}`, originalColumns);
  };

  const templates = [
    {
      id: 'blank',
      name: 'Blank Spreadsheet',
      description: 'Start with an empty spreadsheet',
      icon: <Grid3X3 className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'project-tracker',
      name: 'Project Tracker',
      description: 'Track project tasks and progress',
      icon: <FileSpreadsheet className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'budget-planner',
      name: 'Budget Planner',
      description: 'Manage finances and expenses',
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'inventory',
      name: 'Inventory Management',
      description: 'Track products and stock levels',
      icon: <User className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Spreadsheets</h1>
              <p className="text-gray-600 mt-1">Create, manage, and organize your spreadsheets</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Spreadsheet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search spreadsheets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Templates */}
        {!searchTerm && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Start with a template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onCreateNew(template.id)}
                  className={`p-6 border-2 border-dashed rounded-lg hover:border-solid transition-all text-left ${template.color} hover:shadow-md`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">{template.icon}</div>
                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spreadsheets List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Spreadsheets ({filteredSpreadsheets.length})
            </h2>
          </div>

          {filteredSpreadsheets.length === 0 ? (
            <div className="text-center py-12">
              <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No spreadsheets found' : 'No spreadsheets yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first spreadsheet to get started'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Spreadsheet
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpreadsheets.map((sheet) => (
                <div
                  key={sheet.id}
                  onClick={() => onSelectSpreadsheet(sheet.id)}
                  className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {sheet.name}
                          </h3>
                          {sheet.description && (
                            <p className="text-sm text-gray-500 mt-1">{sheet.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDuplicateSpreadsheet(sheet, e)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSpreadsheet(sheet.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Modified {new Date(sheet.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Grid3X3 className="w-4 h-4 mr-2" />
                        <span>{sheet.rowCount} rows</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{sheet.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateSpreadsheetModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(name, description, template) => {
            const newId = `sheet-${Date.now()}`;
            const newSheet: Spreadsheet = {
              id: newId,
              name,
              description,
              lastModified: new Date().toISOString(),
              rowCount: 0,
              createdBy: 'Current User',
              template
            };
            
            const updated = [...spreadsheets, newSheet];
            setSpreadsheets(updated);
            localStorage.setItem('user-spreadsheets', JSON.stringify(updated));
            
            setShowCreateModal(false);
            onCreateNew(template);
          }}
          templates={templates}
        />
      )}
    </div>
  );
};

interface CreateSpreadsheetModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string, template?: string) => void;
  templates: any[];
}

const CreateSpreadsheetModal: React.FC<CreateSpreadsheetModalProps> = ({ onClose, onCreate, templates }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim(), selectedTemplate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Spreadsheet</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spreadsheet Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter spreadsheet name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your spreadsheet..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Template
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">{template.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Spreadsheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpreadsheetManager;