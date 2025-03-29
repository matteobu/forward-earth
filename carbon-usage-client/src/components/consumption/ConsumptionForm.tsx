/* eslint-disable react-hooks/exhaustive-deps */
// components/consumption/ConsumptionForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACTIVITY_TYPES } from '@/utils/constants';
import { ActivityType } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';

export default function ConsumptionForm() {
  const navigate = useNavigate();
  const { userContext } = useUser();
  const [formData, setFormData] = useState({
    amount: '',
    activityTypeId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null
  );
  const [co2Impact, setCo2Impact] = useState<number | null>(null);

  useEffect(() => {
    if (formData.activityTypeId) {
      const activity = ACTIVITY_TYPES.find(
        (type) => type.id.toString() === formData.activityTypeId
      );
      setSelectedActivity(activity || null);
    } else {
      setSelectedActivity(null);
    }

    updateCo2Impact(formData.amount, selectedActivity);
  }, [formData.activityTypeId]);

  useEffect(() => {
    updateCo2Impact(formData.amount, selectedActivity);
  }, [formData.amount, selectedActivity]);

  const updateCo2Impact = (amount: string, activity: ActivityType | null) => {
    if (amount && activity) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setCo2Impact(numAmount * activity.co2);
      } else {
        setCo2Impact(null);
      }
    } else {
      setCo2Impact(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      co2_equivalent: co2Impact,
      unit: selectedActivity?.unit,
    };

    console.log('Submitted data:', submissionData);
    try {
      const response = await fetch('http://localhost:3000/consumption/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userContext.userId,
          amount: parseFloat(submissionData.amount),
          activity_type_id: parseInt(submissionData.activityTypeId),
          date: submissionData.date,
          co2_equivalent: submissionData.co2_equivalent,
          unit: submissionData.unit,
          activity_name: selectedActivity ? selectedActivity.name : '',
          emission_factor: selectedActivity ? selectedActivity.co2 : 0,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to create consumption', error);
    }

    navigate('/dashboard/consumptions');
  };

  return (
    <div>
      <h4>
        Welcome {userContext.name}, {userContext.userId}
      </h4>
      <h2 className="text-2xl font-bold mb-4">New Consumption</h2>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Activity Type</label>
          <select
            name="activityTypeId"
            value={formData.activityTypeId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select type...</option>
            {ACTIVITY_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Amount {selectedActivity ? `(${selectedActivity.unit})` : ''}
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder={
              selectedActivity
                ? `Enter amount in ${selectedActivity.unit}`
                : 'Select an activity type first'
            }
            disabled={!selectedActivity}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {co2Impact !== null && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Estimated CO2 Impact
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {co2Impact.toFixed(2)} kg CO<sub>2</sub>e
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Calculation: {formData.amount} {selectedActivity?.unit} ×{' '}
              {selectedActivity?.co2} kg CO<sub>2</sub>e per{' '}
              {selectedActivity?.unit}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedActivity || !formData.amount}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/consumptions')}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
