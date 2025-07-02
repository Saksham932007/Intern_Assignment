import React from 'react';
import { Info, Plus } from 'lucide-react';
import { Tab } from '../../types';

interface TabSystemProps {
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
  onAddTab: () => void;
}

const TabSystem: React.FC<TabSystemProps> = ({ tabs, onTabChange, onAddTab }) => {
  const getTabStyles = (tab: Tab) => {
    const baseStyles = "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors cursor-pointer flex items-center space-x-2";
    
    if (tab.active) {
      return `${baseStyles} text-blue-600 border-blue-600 bg-blue-50`;
    }
    
    const typeStyles = {
      success: "text-green-700 bg-green-100 border-green-200",
      info: "text-purple-700 bg-purple-100 border-purple-200", 
      warning: "text-orange-700 bg-orange-100 border-orange-200",
      default: "text-gray-600 bg-gray-100 border-gray-200"
    };
    
    return `${baseStyles} hover:text-gray-900 hover:bg-gray-50 border-transparent ${typeStyles[tab.type || 'default']}`;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={getTabStyles(tab)}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.id === 'overview' && <Info className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onAddTab}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSystem;