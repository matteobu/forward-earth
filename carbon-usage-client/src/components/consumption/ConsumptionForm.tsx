/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
// components/consumption/ConsumptionForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityType } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';
import { useActivityTypeContext } from '@/contexts/ActivityTypeContext';

export default function ConsumptionForm() {
  const navigate = useNavigate();
  const { userContext } = useUser();
  const { activityTypes } = useActivityTypeContext();

  const [formData, setFormData] = useState({
    amount: '',
    activity_type_id: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null
  );
  const [co2Impact, setCo2Impact] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Group activities by category for better organization
  const activityCategories = {
    Energy: ['Electricity', 'Natural Gas', 'Heating Oil'],
    Transportation: [
      'Business Travel - Air',
      'Business Travel - Rail',
      'Company Vehicles',
      'Shipping',
    ],
    'Waste & Materials': [
      'Landfill Waste',
      'Recycled Paper',
      'Recycled Plastic',
      'Office Paper Usage',
    ],
    Water: ['Water Supply', 'Wastewater Treatment'],
    Other: [
      'Refrigerant Leakage',
      'Data Center Usage',
      'Cloud Services',
      'Employee Remote Work',
    ],
  };

  // Find category for a specific activity type
  const getCategoryForActivity = (activityName: string): string => {
    for (const [category, activities] of Object.entries(activityCategories)) {
      if (activities.some((activity) => activityName.includes(activity))) {
        return category;
      }
    }
    return 'Other';
  };

  // Get activities by category
  const getActivitiesByCategory = (category: string) => {
    if (!category) return activityTypes;

    return activityTypes.filter(
      (type) => getCategoryForActivity(type.name) === category
    );
  };

  useEffect(() => {
    if (formData.activity_type_id) {
      const activity = activityTypes.find(
        (type) => type.activity_type_id.toString() === formData.activity_type_id
      );
      setSelectedActivity(activity || null);
    } else {
      setSelectedActivity(null);
    }

    updateCo2Impact(formData.amount, selectedActivity);
  }, [formData.activity_type_id]);

  useEffect(() => {
    updateCo2Impact(formData.amount, selectedActivity);
  }, [formData.amount, selectedActivity]);

  const updateCo2Impact = (amount: string, activity: ActivityType | null) => {
    if (amount && activity) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setCo2Impact(numAmount * activity.emission_factor);
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
    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      co2_equivalent: co2Impact,
      unit: selectedActivity?.unit,
    };

    try {
      const response = await fetch('http://localhost:3000/consumption/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userContext.userId,
          amount: parseFloat(submissionData.amount),
          activity_type_id: parseInt(submissionData.activity_type_id),
          date: submissionData.date,
          co2_equivalent: submissionData.co2_equivalent,
          unit: submissionData.unit,
          activity_name: selectedActivity ? selectedActivity.name : '',
          emission_factor: selectedActivity
            ? selectedActivity.emission_factor
            : 0,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Success - navigate away
      navigate('/dashboard/consumptions/list');
    } catch (error) {
      console.error('Failed to create consumption', error);
      setIsSubmitting(false);
    }
  };

  // Get an icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Energy':
        return '⚡';
      case 'Transportation':
        return '✈️';
      case 'Waste & Materials':
        return '🗑️';
      case 'Water':
        return '💧';
      default:
        return '🔹';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Record New Consumption
        </h2>
        <p className="text-gray-600 mt-1">
          Track your environmental impact by recording your consumption
          activities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {Object.keys(activityCategories).map((category) => (
            <div
              key={category}
              className={`relative cursor-pointer rounded-lg p-4 text-center transition-all hover:bg-indigo-50 hover:shadow-md
                ${
                  selectedCategory === category
                    ? 'bg-indigo-100 shadow-md'
                    : 'bg-gray-50'
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">
                  {getCategoryIcon(category)}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {category}
                </span>
              </div>
              {selectedCategory === category && (
                <div className="absolute h-1 w-full bg-indigo-500 bottom-0 left-0 rounded-b-lg"></div>
              )}
            </div>
          ))}
        </div>

        {/* Activity Type Selection */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <label className="block text-gray-700 font-medium mb-2">
            Activity Type
          </label>
          <select
            name="activity_type_id"
            value={formData.activity_type_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
            required
          >
            <option value="">Select an activity type...</option>
            {(selectedCategory
              ? getActivitiesByCategory(selectedCategory)
              : activityTypes
            ).map((type) => (
              <option key={type.activity_type_id} value={type.activity_type_id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <label className="block text-gray-700 font-medium mb-2">
            Amount {selectedActivity ? `(${selectedActivity.unit})` : ''}
          </label>
          <div className="flex">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
              required
              placeholder={
                selectedActivity
                  ? `Enter amount in ${selectedActivity.unit}`
                  : 'Select an activity type first'
              }
              disabled={!selectedActivity}
              step="0.01"
            />
            {selectedActivity && (
              <div className="ml-2 bg-gray-200 text-gray-700 px-4 flex items-center rounded-lg">
                {selectedActivity.unit}
              </div>
            )}
          </div>
        </div>

        {/* Date Input */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <label className="block text-gray-700 font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        {/* CO2 Impact Card */}
        {co2Impact !== null && (
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg my-6">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="text-lg font-medium">Estimated CO2 Impact</h3>
            </div>

            <div className="flex items-end mt-2">
              <p className="text-3xl font-bold">{co2Impact.toFixed(2)}</p>
              <p className="ml-2 text-lg mb-0.5">
                kg CO<sub>2</sub>e
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <p className="text-sm opacity-90">
                <span className="font-semibold">Calculation:</span>{' '}
                {formData.amount} {selectedActivity?.unit} ×{' '}
                {selectedActivity?.emission_factor} kg CO<sub>2</sub>e per{' '}
                {selectedActivity?.unit}
              </p>
              <p className="text-sm mt-1 opacity-80">
                You would need to plant {Math.ceil(co2Impact / 25)} trees to
                offset this impact.
              </p>
              <p className="text-sm mt-1 opacity-80">
                Offset by switching to a plant-based diet for{' '}
                {calculateDietImpactOffset(co2Impact)}
              </p>
            </div>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className={`flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
              ${
                isSubmitting || !selectedActivity || !formData.amount
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            disabled={isSubmitting || !selectedActivity || !formData.amount}
          >
            {isSubmitting ? 'Saving...' : 'Save Consumption'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/consumptions')}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export const calculateDietImpactOffset = (co2Amount: number): string => {
  const dailyMeatDietEmissions = 7.2;
  const dailyPlantBasedDietEmissions = 3.8;

  const dailyReduction = dailyMeatDietEmissions - dailyPlantBasedDietEmissions;

  const daysToOffset = co2Amount / dailyReduction;

  if (daysToOffset < 1) {
    return Math.max(1, Math.round(daysToOffset)) + ' days';
  }

  const monthsToOffset = daysToOffset / 30;
  const yearsToOffset = daysToOffset / 365;

  if (yearsToOffset >= 1) {
    const years = Math.floor(yearsToOffset);
    return years === 1 ? '1 year' : `${years} years`;
  }

  if (monthsToOffset >= 1) {
    const months = Math.floor(monthsToOffset);
    return months === 1 ? '1 month' : `${months} months`;
  }

  return Math.round(daysToOffset) + ' days';
};
