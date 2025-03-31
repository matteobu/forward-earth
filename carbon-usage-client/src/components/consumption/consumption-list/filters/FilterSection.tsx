// FilterSection.tsx
import { useActivityTypeContext } from '@/contexts/ActivityTypeContext';
import React from 'react';

interface FilterSectionProps {
  dateFilter: {
    from: string | null;
    to: string | null;
  };
  activityFilter: number | null;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  clearFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  dateFilter,
  activityFilter,
  handleFilterChange,
  clearFilters,
}) => {
  const { activityTypes } = useActivityTypeContext();

  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="dateFrom"
            value={dateFilter.from || ''}
            onChange={handleFilterChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            name="dateTo"
            value={dateFilter.to || ''}
            onChange={handleFilterChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Type
          </label>
          <select
            name="activityType"
            value={activityFilter || ''}
            onChange={handleFilterChange}
            className="border rounded p-2 w-full"
          >
            <option value="">All Activities</option>
            {activityTypes.map((activity) => (
              <option
                key={activity.activity_type_id}
                value={activity.activity_type_id}
              >
                {activity.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
