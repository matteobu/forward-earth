/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import FilterSection from './FilterSection';
import PaginationControls from './PaginationControls';
import ConsumptionTable from './ConsumptionTable';
import { useConsumptionData } from '@/hooks/useConsumptionData';
import { useEditingState } from '@/hooks/useEditingState';

export default function ConsumptionList() {
  const navigate = useNavigate();
  const {
    consumptions,
    isLoading,
    error,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    dateFilter,
    activityFilter,
    setIsLoading,
    setError,
    fetchConsumptions,
    handleSort,
    renderSortIndicator,
    handlePageChange,
    setItemsPerPage,
    handleFilterChange,
    clearFilters,
    calculateTotalCO2,
  } = useConsumptionData();

  const { userContext } = useUser();

  const {
    editingId,
    editForm,
    isSubmitting,
    handleEdit,
    handleCancelEdit,
    handleInputChange,
    handleSaveEdit,
    handleDelete,
  } = useEditingState(fetchConsumptions, userContext);
  // Sorting
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadConsumptions = async () => {
      if (!userContext || !userContext.userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        await fetchConsumptions({
          userId: userContext.userId,
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortField,
          sortOrder: sortDirection,
          dateFrom: dateFilter.from,
          dateTo: dateFilter.to,
          activityType: activityFilter,
        });
      } catch (err) {
        console.error('Failed to fetch consumptions', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadConsumptions();
  }, [
    userContext,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    dateFilter.from,
    dateFilter.to,
    activityFilter,
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
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

      {showFilters && (
        <FilterSection
          dateFilter={dateFilter}
          activityFilter={activityFilter}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />
      )}

      {!consumptions || consumptions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            You haven't added any consumptions yet.
          </p>
          <button
            onClick={() => navigate('/dashboard/consumptions/new')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Your First Consumption
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Total CO2 Impact
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {calculateTotalCO2().toFixed(2)} kg CO<sub>2</sub>e
            </p>
          </div>

          <ConsumptionTable
            consumptions={consumptions}
            editingId={editingId}
            editForm={editForm}
            isSubmitting={isSubmitting}
            handleSort={handleSort}
            handleInputChange={handleInputChange}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            formatDate={formatDate}
            renderSortIndicator={renderSortIndicator}
          />

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            consumptions={consumptions}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
