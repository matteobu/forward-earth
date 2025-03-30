// components/consumption/ConsumptionList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Consumption, ConsumptionPatchPayload } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';
import { ACTIVITY_TYPES } from '@/utils/constants';

export default function ConsumptionList() {
  const navigate = useNavigate();
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userContext } = useUser();
  // Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    activity_type_table_id: number;
    amount: number;
    date: string;
  } | null>(null);
  const [changedFields, setChangedFields] = useState<ConsumptionPatchPayload>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchConsumptions = async () => {
      if (!userContext || !userContext.userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const consumptionsResponse = await fetch(
          `http://localhost:3000/consumption/${userContext.userId}`,
          {
            credentials: 'include',
          }
        );

        if (!consumptionsResponse.ok) {
          throw new Error(`Error: ${consumptionsResponse.status}`);
        }

        const responseJson = await consumptionsResponse.json();

        const consumptionsData: Consumption[] = Array.isArray(responseJson.data)
          ? responseJson.data
          : Array.isArray(responseJson)
          ? responseJson
          : [];

        setConsumptions(consumptionsData);
      } catch (err) {
        console.error('Failed to fetch consumptions', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsumptions();
  }, [userContext]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this consumption?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/consumption/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setConsumptions((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete consumption', err);
      alert('Failed to delete consumption');
    }
  };

  const calculateTotalCO2 = () => {
    return consumptions.reduce((total, consumption) => {
      return total + consumption.co2_equivalent;
    }, 0);
  };

  const handleEdit = (consumption: Consumption) => {
    const matchingActivity = ACTIVITY_TYPES.find(
      (activity) => activity.name === consumption.activity_table.name
    );

    const activityId = matchingActivity
      ? matchingActivity.activity_type_id
      : consumption.activity_type_table_id;

    setEditingId(consumption.id);
    setEditForm({
      activity_type_table_id: activityId,
      amount: consumption.amount,
      date: consumption.date.split('T')[0],
    });
    setChangedFields({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setChangedFields({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editForm) return;

    const { name, value } = e.target;

    const updatedForm = { ...editForm };

    if (name === 'activity_type_table_id') {
      updatedForm.activity_type_table_id = parseInt(value, 10);

      const selectedActivity = ACTIVITY_TYPES.find(
        (activity) => activity.activity_type_id === parseInt(value, 10)
      );

      if (selectedActivity) {
        setChangedFields((prev) => ({
          ...prev,
          activity_type_table_id: parseInt(value, 10),
          activity_type_name: selectedActivity.name,
          emission_factor: selectedActivity.emission_factor,
          unit: selectedActivity.unit,
        }));
      }
    } else if (name === 'amount') {
      updatedForm.amount = parseFloat(value);
      setChangedFields((prev) => ({
        ...prev,
        amount: parseFloat(value),
      }));
    } else if (name === 'date') {
      updatedForm.date = value;
      setChangedFields((prev) => ({
        ...prev,
        date: value,
      }));
    }

    setEditForm(updatedForm);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm || Object.keys(changedFields).length === 0) {
      handleCancelEdit();
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:3000/consumption/patch/${editingId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changedFields),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (userContext && userContext.userId) {
        const refreshResponse = await fetch(
          `http://localhost:3000/consumption/${userContext.userId}`,
          {
            credentials: 'include',
          }
        );

        if (!refreshResponse.ok) {
          throw new Error(`Error refreshing data: ${refreshResponse.status}`);
        }

        const refreshData = await refreshResponse.json();

        let consumptionsData = Array.isArray(refreshData.data)
          ? refreshData.data
          : Array.isArray(refreshData)
          ? refreshData
          : [];

        consumptionsData = consumptionsData.map((consumption: Consumption) => {
          if (
            consumption.amount &&
            consumption.activity_table &&
            consumption.activity_table.emission_factor
          ) {
            const co2_equivalent: number =
              consumption.amount * consumption.activity_table.emission_factor;
            return {
              ...consumption,
              co2_equivalent: co2_equivalent,
            } as Consumption;
          }
          return consumption as Consumption;
        });

        setConsumptions(consumptionsData);
      }

      handleCancelEdit();
    } catch (err) {
      console.error('Failed to update consumption', err);
      alert('Failed to update consumption');
    } finally {
      setIsSubmitting(false);
    }
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
        <button
          onClick={() => navigate('/dashboard/consumptions/new')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>

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

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left border-b w-[25%]">
                    Activity
                  </th>
                  <th className="py-3 px-4 text-left border-b w-[15%]">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left border-b w-[15%]">Date</th>
                  <th className="py-3 px-4 text-left border-b w-[20%]">
                    CO2 Impact
                  </th>
                  <th className="py-3 px-4 text-left border-b w-[25%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {consumptions.map((consumption) => (
                  <tr key={consumption.id} className="hover:bg-gray-50">
                    {editingId === consumption.id ? (
                      <>
                        <td className="py-3 px-4 border-b w-[25%]">
                          <select
                            name="activity_type_table_id"
                            value={editForm?.activity_type_table_id}
                            onChange={handleInputChange}
                            className="border rounded p-1 max-w-[200px]"
                          >
                            {ACTIVITY_TYPES.map((activity) => (
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
                            <span className="ml-2">
                              {consumption.unit_table?.name || ''}
                            </span>
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
                        <td className="py-3 px-4 border-b">
                          <span className="font-medium">
                            {consumption.co2_equivalent.toFixed(2)}
                          </span>{' '}
                          kg CO<sub>2</sub>e
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={isSubmitting}
                              className={`text-green-500 hover:text-green-700 mr-2 ${
                                isSubmitting
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
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
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 border-b">
                          {consumption.activity_table
                            ? consumption.activity_table.name
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {consumption.amount}{' '}
                          {consumption.unit_table
                            ? consumption.unit_table.name
                            : ''}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {formatDate(consumption.date)}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <span className="font-medium">
                            {consumption.co2_equivalent.toFixed(2)}
                          </span>{' '}
                          kg CO<sub>2</sub>e
                        </td>
                        <td className="py-3 px-4 border-b">
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
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
