import { ACTIVITY_CATEGORIES } from './constants';
import { ActivityType, Consumption } from './types';

/**
 * Checks if there are any changes in the consumption data
 * @param changedFields The object containing changed fields
 * @returns Boolean indicating if there are any changes
 */
export const hasChanges = (changedFields: Partial<Consumption>): boolean => {
  return Object.keys(changedFields).length > 0;
};

/**
 * Finds the original consumption by id from a list of consumptions
 * @param consumptions Array of consumption objects
 * @param id ID of the consumption to find
 * @returns The found consumption or undefined
 */
export const findConsumptionById = (
  consumptions: Consumption[],
  id: number | null
): Consumption | undefined => {
  return consumptions.find((c) => c.id === id);
};

/**
 * Formats a date string into a human-readable format
 * @param dateString - The ISO date string to format
 * @returns Formatted date (e.g., "Jan 15, 2023")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculates the total CO2 equivalent from a list of consumption records
 * @param consumptions - Array of consumption records
 * @returns Total CO2 equivalent in kg
 */
export const calculateTotalCO2 = (consumptions: Consumption[]): number => {
  return consumptions.reduce((total, consumption) => {
    return total + consumption.co2_equivalent;
  }, 0);
};

export const formatNumber = (num: number) => {
  const numStr = num.toFixed(1);
  const [intPart, decPart] = numStr.split('.');
  return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decPart}`;
};

// Find category for a specific activity type
export const getCategoryForActivity = (activityName: string): string => {
  for (const [category, activities] of Object.entries(ACTIVITY_CATEGORIES)) {
    if (activities.some((activity) => activityName.includes(activity))) {
      return category;
    }
  }
  return 'Other';
};

// Get activities by category
export const getActivitiesByCategory = (
  category: string,
  activityTypes: ActivityType[]
) => {
  if (!category) return activityTypes;

  return activityTypes.filter(
    (type) => getCategoryForActivity(type.name) === category
  );
};
