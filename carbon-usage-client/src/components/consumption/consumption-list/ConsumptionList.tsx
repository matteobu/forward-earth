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
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import NoResultsMessage from './display/NoResultConsumption';

export default function ConsumptionList() {
  const {
    consumptions,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    fetchConsumptions,
    handleSort,
    renderSortIndicator,
    handlePageChange,
    setItemsPerPage,
    calculateTotalCO2,
  } = useConsumptionData();

  const { userContext } = useUser();

  const {
    editingId,
    editForm,
    isSubmitting,
    isModalOpen,
    modalAction,
    dateFilter,
    activityFilter,
    amountFilter,
    co2Filter,
    setDateFilter,
    setActivityFilter,
    setAmountFilter,
    setCO2Filter,
    applyFilters,
    clearFilters,
    closeModal,
    handleConfirm,
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
      {!consumptions ? (
        <EmptyState />
      ) : consumptions.length === 0 ? (
        <>
          <ConsumptionHeader />

          {showFilters && (
            <FilterSection
              dateFilter={dateFilter}
              activityFilter={activityFilter}
              amountFilter={amountFilter}
              co2ImpactFilter={co2Filter}
              onDateFilterChange={setDateFilter}
              onActivityFilterChange={setActivityFilter}
              onAmountFilterChange={setAmountFilter}
              onCO2FilterChange={setCO2Filter}
              clearFilters={clearFilters}
              applyFilters={() => {
                applyFilters();
                toggleFilters();
              }}
              isSubmitting={isSubmitting}
            />
          )}
          <NoResultsMessage
            clearFilters={clearFilters}
            applyFilters={applyFilters}
          />
        </>
      ) : (
        <>
          <TotalCO2Impact totalCO2={calculateTotalCO2(consumptions)} />
          <ConsumptionHeader />

          {/* Filters */}
          {showFilters && (
            <FilterSection
              dateFilter={dateFilter}
              activityFilter={activityFilter}
              amountFilter={amountFilter}
              co2ImpactFilter={co2Filter}
              onDateFilterChange={setDateFilter}
              onActivityFilterChange={setActivityFilter}
              onAmountFilterChange={setAmountFilter}
              onCO2FilterChange={setCO2Filter}
              clearFilters={clearFilters}
              applyFilters={() => {
                applyFilters();
                toggleFilters();
              }}
              isSubmitting={isSubmitting}
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

          <ConfirmationModal
            isOpen={isModalOpen}
            actionType={modalAction}
            onClose={closeModal}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </div>
  );
}
