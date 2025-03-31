// components/consumption/ui/ConsumptionHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ConsumptionHeaderProps {
  showFilters: boolean;
  toggleFilters: () => void;
}

const ConsumptionHeader: React.FC<ConsumptionHeaderProps> = ({
  showFilters,
  toggleFilters,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Your Consumptions</h2>
      <div className="flex space-x-2">
        <button
          onClick={toggleFilters}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <button
          onClick={() => navigate('/dashboard/consumptions/new')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
    </div>
  );
};

export default ConsumptionHeader;
