import React from 'react';
import { useConsumptionData } from '@/hooks/useConsumptionData';

const categoryGroups: Record<string, string[]> = {
  'Procured goods and services': ['Office Paper Usage', 'Recycled Paper'],
  Transportation: [
    'Business Travel - Air (Short Haul)',
    'Business Travel - Air (Long Haul)',
    'Shipping - Road Freight',
  ],
  Refrigerants: ['Refrigerant R410A Leakage', 'Refrigerant R134a Leakage'],
  Waste: ['Landfill Waste'],
  Energy: ['Electricity', 'Natural Gas', 'Heating Oil'],
  Water: ['Water Supply', 'Wastewater Treatment'],
};

const ConsumptionDataCollection: React.FC = () => {
  const {
    consumptions,
    isLoading,
    error,

    currentPage,
    itemsPerPage,

    totalPages,
    dateFilter,
    activityFilter,
    handleSort,
    renderSortIndicator,
    handlePageChange,
    setItemsPerPage,
    handleFilterChange,
    clearFilters,
    calculateTotalCO2,
  } = useConsumptionData();

  const activityOptions = Object.values(categoryGroups).flat();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Carbon Emissions Data Collection
      </h2>

      {/* Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date From
          </label>
          <input
            type="date"
            name="dateFrom"
            value={dateFilter.from || ''}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date To
          </label>
          <input
            type="date"
            name="dateTo"
            value={dateFilter.to || ''}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm"
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
            className="block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">All Activities</option>
            {activityOptions.map((activity, index) => (
              <option key={index} value={index}>
                {activity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cancel Filter Btn */}
      <div className="mb-4">
        <button
          onClick={clearFilters}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Consumptions Table */}
      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading consumption data...</p>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('date')}
                  >
                    Date {renderSortIndicator('date')}
                  </th>
                  <th
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('activity_table.name')}
                  >
                    Activity {renderSortIndicator('activity_table.name')}
                  </th>
                  <th
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('co2_equivalent')}
                  >
                    CO2 Equivalent (kg) {renderSortIndicator('co2_equivalent')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {consumptions.map((consumption, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{consumption.date}</td>
                    <td className="border p-2">
                      {consumption.activity_table.name}
                    </td>
                    <td className="border p-2 text-right">
                      {consumption.co2_equivalent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-gray-600">
                Total CO2: {calculateTotalCO2(consumptions).toFixed(2)} kg
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm"
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num} per page
                  </option>
                ))}
              </select>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConsumptionDataCollection;
