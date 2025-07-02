import React from 'react';

interface PriorityIndicatorProps {
  priority: 'High' | 'Medium' | 'Low';
}

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority }) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles()}`}>
      {priority}
    </span>
  );
};

export default PriorityIndicator;