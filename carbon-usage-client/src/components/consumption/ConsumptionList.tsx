// components/consumption/ConsumptionList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACTIVITY_TYPES } from '@/utils/constants';
import { Consumption } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';

export default function ConsumptionList() {
  const navigate = useNavigate();
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userContext } = useUser();

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

        const consumptionsData = Array.isArray(responseJson.data)
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

  const getActivityName = (activityTypeId: number) => {
    const activity = ACTIVITY_TYPES.find((type) => type.id === activityTypeId);
    return activity ? activity.name : 'Unknown Activity';
  };

  const getUnitName = (unitId: number) => {
    // Se hai un modo per ottenere il nome dell'unità, implementalo qui
    return unitId ? `Unit ${unitId}` : '';
  };

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

      // Remove the deleted consumption from state
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
                  <th className="py-3 px-4 text-left border-b">Activity</th>
                  <th className="py-3 px-4 text-left border-b">Amount</th>
                  <th className="py-3 px-4 text-left border-b">Date</th>
                  <th className="py-3 px-4 text-left border-b">CO2 Impact</th>
                  <th className="py-3 px-4 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consumptions.map((consumption) => (
                  <tr key={consumption.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      {getActivityName(consumption.activity_type_id)}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {consumption.amount} {getUnitName(consumption.unit_id)}
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
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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
