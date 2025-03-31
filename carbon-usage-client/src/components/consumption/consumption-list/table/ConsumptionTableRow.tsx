import React, { useEffect, useState } from 'react';
import { ActivityType, Consumption } from '@/utils/types';
import { activityTypeService } from '@/services/activityTypeService';
import { Ban, Pencil, Save, Trash2 } from 'lucide-react';
import { formatNumber } from '@/utils/utils';

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
      <tr key={consumption.activity_type_table_id} className="bg-indigo-50">
        <td className="px-6 py-4 whitespace-nowrap">
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
        <td className="px-6 py-4 whitespace-nowrap">
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
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="date"
            name="date"
            value={editForm?.date}
            onChange={handleInputChange}
            className="border rounded p-1 w-full"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          <span className="font-medium"></span> kg CO<sub>2</sub>e
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className={`text-green-500 hover:text-green-700 mr-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : <Save size={16} />}
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <Ban size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={consumption.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {consumption.activity_table ? consumption.activity_table.name : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formatNumber(consumption.amount)}{' '}
        {consumption.unit_table ? consumption.unit_table.name : ''}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formatDate(consumption.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <span className="font-medium">
          {formatNumber(consumption.co2_equivalent)}
        </span>{' '}
        kg CO<sub>2</sub>e
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            onClick={() => handleDelete(consumption.id)}
            className="text-purple-500 hover:text-purple-700 mr-1 border-2 border-purple-100 p-1"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => handleEdit(consumption)}
            className="text-orange-500 hover:text-orange-700 border-2 border-orange-100 p-1"
          >
            <Pencil size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ConsumptionTableRow;
