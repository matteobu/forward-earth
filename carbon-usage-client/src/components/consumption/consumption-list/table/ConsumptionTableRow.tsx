// ConsumptionRow.tsx
import React, { useEffect, useState } from 'react';
import { ActivityType, Consumption } from '@/utils/types';
import { activityTypeService } from '@/services/activityTypeService';

interface ConsumptionRowProps {
  consumption: Consumption;
  isEditing: boolean;
  editForm: {
    activity_type_table_id: number;
    amount: number;
    date: string;
  } | null;
  isSubmitting: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDelete: (id: number) => void;
  handleEdit: (consumption: Consumption) => void;
  formatDate: (dateString: string) => string;
}

const ConsumptionTableRow: React.FC<ConsumptionRowProps> = ({
  consumption,
  isEditing,
  editForm,
  isSubmitting,
  handleInputChange,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  handleEdit,
  formatDate,
}) => {
  const [allActivityType, setAllActivityType] = useState<ActivityType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing) {
        try {
          const _allActivityType =
            await activityTypeService.fetchAllActivityType();

          setAllActivityType(_allActivityType);
        } catch (error) {
          console.error('Error fetching activity types:', error);
        }
      }
    };

    fetchData();
  }, [isEditing]);

  if (isEditing) {
    return (
      <tr className="hover:bg-gray-50">
        <td className="py-3 px-4 border-b w-[25%]">
          <select
            name="activity_type_table_id"
            value={editForm?.activity_type_table_id}
            onChange={handleInputChange}
            className="border rounded p-1 w-full"
          >
            {allActivityType.map((activity) => (
              <option
                key={activity.activity_type_id}
                value={activity.activity_type_id}
              >
                {activity.name}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-4 border-b w-[15%]">
          <div className="flex items-center">
            <input
              type="number"
              name="amount"
              value={editForm?.amount}
              onChange={handleInputChange}
              className="border rounded p-1 max-w-[100px]"
              step="0.01"
              min="0"
            />
            <span className="ml-2">{consumption.unit_table?.name || ''}</span>
          </div>
        </td>
        <td className="py-3 px-4 border-b w-[15%]">
          <input
            type="date"
            name="date"
            value={editForm?.date}
            onChange={handleInputChange}
            className="border rounded p-1 w-full"
          />
        </td>
        <td className="py-3 px-4 border-b w-[20%]">
          <span className="font-medium">
            {consumption.co2_equivalent.toFixed(2)}
          </span>{' '}
          kg CO<sub>2</sub>e
        </td>
        <td className="py-3 px-4 border-b w-[25%]">
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className={`text-green-500 hover:text-green-700 mr-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4 border-b w-[25%]">
        {consumption.activity_table ? consumption.activity_table.name : 'N/A'}
      </td>
      <td className="py-3 px-4 border-b w-[15%]">
        {consumption.amount}{' '}
        {consumption.unit_table ? consumption.unit_table.name : ''}
      </td>
      <td className="py-3 px-4 border-b w-[15%]">
        {formatDate(consumption.date)}
      </td>
      <td className="py-3 px-4 border-b w-[20%]">
        <span className="font-medium">
          {consumption.co2_equivalent.toFixed(2)}
        </span>{' '}
        kg CO<sub>2</sub>e
      </td>
      <td className="py-3 px-4 border-b w-[25%]">
        <div className="flex space-x-2">
          <button
            onClick={() => handleDelete(consumption.id)}
            className="text-red-500 hover:text-red-700 mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleEdit(consumption)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ConsumptionTableRow;
