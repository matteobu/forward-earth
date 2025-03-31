// ConsumptionTable.tsx
import React, { JSX } from 'react';
import { Consumption } from '@/utils/types';
import ConsumptionTableHeader from './ConsumptionTableHeader';
import ConsumptionTableRow from './ConsumptionTableRow';

interface ConsumptionTableProps {
  consumptions: Consumption[];
  editingId: number | null;
  editForm: {
    activity_type_table_id: number;
    amount: number;
    date: string;
  } | null;
  isSubmitting: boolean;
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <ConsumptionTableHeader
          handleSort={handleSort}
          renderSortIndicator={renderSortIndicator}
        />
        <tbody>
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
  );
};

export default ConsumptionTable;
