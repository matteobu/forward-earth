import { useActivityTypeContext } from '@/contexts/ActivityTypeContext';
import React from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CalendarIcon } from 'lucide-react';

interface FilterSectionProps {
  dateFilter: {
    from: Date | null;
    to: Date | null;
  };
  activityFilter: number | null;
  amountFilter: {
    min: number | null;
    max: number | null;
  };
  co2ImpactFilter: {
    min: number | null;
    max: number | null;
  };
  onDateFilterChange: (range: { from: Date | null; to: Date | null }) => void;
  onActivityFilterChange: (activityId: number | null) => void;
  onAmountFilterChange: (range: {
    min: number | null;
    max: number | null;
  }) => void;
  onCO2FilterChange: (range: {
    min: number | null;
    max: number | null;
  }) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  isSubmitting: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  dateFilter,
  activityFilter,
  amountFilter = { min: null, max: null },
  co2ImpactFilter = { min: null, max: null },
  onDateFilterChange,
  onActivityFilterChange,
  onAmountFilterChange,
  onCO2FilterChange,
  clearFilters,
  applyFilters,
  isSubmitting,
}) => {
  const { activityTypes } = useActivityTypeContext();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : Number(value);

    if (name === 'amountMin') {
      onAmountFilterChange({ ...amountFilter, min: numValue });
    } else if (name === 'amountMax') {
      onAmountFilterChange({ ...amountFilter, max: numValue });
    }
  };

  const handleCO2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : Number(value);

    if (name === 'co2Min') {
      onCO2FilterChange({ ...co2ImpactFilter, min: numValue });
    } else if (name === 'co2Max') {
      onCO2FilterChange({ ...co2ImpactFilter, max: numValue });
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onActivityFilterChange(value === '' ? null : Number(value));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-6 p-5 bg-white shadow-sm rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        <button
          onClick={clearFilters}
          type="button"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center"
          disabled={isSubmitting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Date Range with Headless UI Popover */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Date Range</h4>
          <Popover className="relative">
            <PopoverButton className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left">
              <span>
                {dateFilter.from || dateFilter.to ? (
                  <>
                    {formatDate(dateFilter.from)} - {formatDate(dateFilter.to)}
                  </>
                ) : (
                  'Select date range'
                )}
              </span>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </PopoverButton>

            <PopoverPanel className="absolute z-10 mt-1 bg-white rounded-md shadow-lg p-4 border border-gray-100">
              <DayPicker
                mode="range"
                selected={{
                  from: dateFilter.from || undefined,
                  to: dateFilter.to || undefined,
                }}
                onSelect={(range) => {
                  onDateFilterChange({
                    from: range?.from || null,
                    to: range?.to || null,
                  });
                }}
                className="border-0"
              />
            </PopoverPanel>
          </Popover>
        </div>

        {/* Activity Type */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Activity Type</h4>
          <div className="relative">
            <select
              value={activityFilter || ''}
              onChange={handleActivityChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Activities</option>
              {activityTypes.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Amount Range</h4>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                name="amountMin"
                placeholder="Min"
                value={amountFilter.min === null ? '' : amountFilter.min}
                onChange={handleAmountChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                name="amountMax"
                placeholder="Max"
                value={amountFilter.max === null ? '' : amountFilter.max}
                onChange={handleAmountChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* CO2 Impact Range */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            CO2 Impact Range
          </h4>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                name="co2Min"
                placeholder="Min"
                value={co2ImpactFilter.min === null ? '' : co2ImpactFilter.min}
                onChange={handleCO2Change}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                name="co2Max"
                placeholder="Max"
                value={co2ImpactFilter.max === null ? '' : co2ImpactFilter.max}
                onChange={handleCO2Change}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={applyFilters}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Applying...' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
