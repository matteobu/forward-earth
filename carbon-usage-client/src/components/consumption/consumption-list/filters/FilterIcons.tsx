import { URL_ENDPOINTS } from '@/utils/endpoints';
import { CircleX, ListFilter, SquarePlus } from 'lucide-react';
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
        title={showFilters ? 'Close Filters' : 'Open Filters'}
        className="p-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        {showFilters ? <CircleX size={16} /> : <ListFilter size={16} />}
      </button>
      <button
        onClick={() =>
          navigate(URL_ENDPOINTS.DASHBOARD + URL_ENDPOINTS.CONSUMPTION_NEW)
        }
        title="Add Consumption"
        className="p-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        <SquarePlus size={16} />
      </button>
    </div>
  );
};

export default FilterIcons;
