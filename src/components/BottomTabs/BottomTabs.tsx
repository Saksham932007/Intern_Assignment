import React from 'react';
import { Plus } from 'lucide-react';

interface BottomTab {
  id: string;
  label: string;
  active: boolean;
}

interface BottomTabsProps {
  tabs: BottomTab[];
  onTabChange: (tabId: string) => void;
  onAddTab: () => void;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ tabs, onTabChange, onAddTab }) => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-2">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              tab.active
                ? 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          onClick={onAddTab}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BottomTabs;