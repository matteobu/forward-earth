import { ACTIVITY_TYPES } from './constants';
import { Consumption, ConsumptionPatchPayload } from './types';

/**
 * Compares original consumption data with edited data and returns only the changed fields
 * @param editFormData The edited consumption data
 * @param originalConsumption The original consumption data
 * @returns An object containing only the fields that have changed
 */
export const getChangedConsumptionFields = (
  editFormData: Consumption,
  originalConsumption: Consumption
): ConsumptionPatchPayload => {
  const changedFields: ConsumptionPatchPayload = {};

  if (editFormData.amount !== originalConsumption.amount) {
    changedFields.amount = editFormData.amount;

    if (
      editFormData.activity_type_id === originalConsumption.activity_type_id
    ) {
      const activityType = ACTIVITY_TYPES.find(
        (type) => type.id === editFormData.activity_type_id
      );
      if (activityType) {
        changedFields.co2_equivalent = editFormData.amount * activityType.co2;
      }
    }
  }

  if (editFormData.activity_type_id !== originalConsumption.activity_type_id) {
    changedFields.activity_type_id = editFormData.activity_type_id;

    const activityType = ACTIVITY_TYPES.find(
      (type) => type.id === editFormData.activity_type_id
    );
    if (activityType) {
      changedFields.co2_equivalent = editFormData.amount * activityType.co2;
    }
  }

  if (editFormData.date !== originalConsumption.date) {
    changedFields.date = editFormData.date;
  }

  return changedFields;
};

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
