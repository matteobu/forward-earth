/* eslint-disable react-hooks/exhaustive-deps */
// React and core libraries
import { useState, useEffect } from 'react';
// Contexts
import { useUser } from '@/contexts/UserContext';
// Custom hooks
import { useConsumptionData } from '@/hooks/useConsumptionData';
import { useEditingState } from '@/hooks/useEditingState';
// Utilities
import { formatDate } from '@/utils/utils';
// UI Components - Main sections
import ConsumptionHeader from './display/ConsumptionHeader';
import FilterSection from './filters/FilterSection';
import ConsumptionTable from './table/ConsumptionTable';
import PaginationControls from './navigation/PaginationControls';
// UI Components - States
import EmptyState from './display/EmptyState';
import TotalCO2Impact from './display/TotalCO2Impact';
import LoadingSpinner from './display/LoadingSpinner';
import ErrorMessage from './display/ErrorMessage';

export default function ConsumptionList() {
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <ConsumptionHeader
        showFilters={showFilters}
        toggleFilters={toggleFilters}
      />

      {/* Filters */}
      {showFilters && (
        <FilterSection
          dateFilter={dateFilter}
          activityFilter={activityFilter}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />
      )}

      {!consumptions || consumptions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TotalCO2Impact totalCO2={calculateTotalCO2(consumptions)} />
          {/* Consumption Table */}
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
