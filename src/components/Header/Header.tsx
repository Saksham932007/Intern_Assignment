import React from 'react';
import { Search, Bell, ChevronRight, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBackToManager?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackToManager }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {onBackToManager && (
            <>
              <button
                onClick={onBackToManager}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Spreadsheets</span>
              </button>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="hover:text-gray-900 cursor-pointer">Workspace</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-gray-900 cursor-pointer">My Folder</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Current Spreadsheet</span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search within sheet"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">User</div>
              <div className="text-gray-500">user@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;