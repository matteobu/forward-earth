// React and core libraries
import { useState } from 'react';
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
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    dateFilter,
    activityFilter,
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
      {!consumptions || consumptions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TotalCO2Impact totalCO2={calculateTotalCO2(consumptions)} />
          <ConsumptionHeader />

          {/* Filters */}
          {showFilters && (
            <FilterSection
              dateFilter={dateFilter}
              activityFilter={activityFilter}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
            />
          )}
          {/* Consumption Table */}
          <ConsumptionTable
            consumptions={consumptions}
            editingId={editingId}
            editForm={editForm}
            isSubmitting={isSubmitting}
            showFilters={showFilters}
            toggleFilters={toggleFilters}
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
