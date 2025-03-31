import React, { JSX } from 'react';
import { Consumption } from '@/utils/types';
import ConsumptionTableHeader from './ConsumptionTableHeader';
import ConsumptionTableRow from './ConsumptionTableRow';
import FilterIcons from '../filters/FilterIcons';

interface ConsumptionTableProps {
  consumptions: Consumption[];
  editingId: number | null;
  editForm: {
    activity_type_table_id: number;
    amount: number;
    date: string;
  } | null;
  isSubmitting: boolean;
  showFilters: boolean;
  toggleFilters: () => void;
  handleSort: (field: string) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDelete: (id: number) => void;
  handleEdit: (consumption: Consumption) => void;
  formatDate: (dateString: string) => string;
  renderSortIndicator: (field: string) => JSX.Element;
}

const ConsumptionTable: React.FC<ConsumptionTableProps> = ({
  consumptions,
  editingId,
  editForm,
  isSubmitting,
  showFilters,
  toggleFilters,
  handleSort,
  handleInputChange,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  handleEdit,
  formatDate,
  renderSortIndicator,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Consumption Data</h3>
        <FilterIcons showFilters={showFilters} toggleFilters={toggleFilters} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <ConsumptionTableHeader
            handleSort={handleSort}
            renderSortIndicator={renderSortIndicator}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {consumptions.map((consumption) => (
              <ConsumptionTableRow
                key={consumption.id}
                consumption={consumption}
                isEditing={editingId === consumption.id}
                editForm={editForm}
                isSubmitting={isSubmitting}
                handleInputChange={handleInputChange}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsumptionTable;
