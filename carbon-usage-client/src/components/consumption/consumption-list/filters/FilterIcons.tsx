// components/consumption/ui/ConsumptionHeader.tsx
import { CircleX, FilePlus2, ListFilter } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FilterIconsProps {
  showFilters: boolean;
  toggleFilters: () => void;
}

const FilterIcons: React.FC<FilterIconsProps> = ({
  showFilters,
  toggleFilters,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2">
      <button
        onClick={toggleFilters}
        className="p-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        {showFilters ? <CircleX size={16} /> : <ListFilter size={16} />}
      </button>
      <button
        onClick={() => navigate('/dashboard/consumptions/new')}
        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FilePlus2 size={16} />
      </button>
    </div>
  );
};

export default FilterIcons;
