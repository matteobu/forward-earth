import { useState } from 'react';

import { Consumption, ConsumptionPatchPayload } from '@/utils/types';

import { User } from '@/interfaces/interfaces';
import { consumptionService } from '@/services/consumptionService';
import { useActivityTypeContext } from '@/contexts/ActivityTypeContext';

type ActionType = 'delete' | 'edit';

interface EditForm {
  activity_type_table_id: number;
  amount: number;
  date: string;
}

export const useEditingState = (
  fetchConsumptions: (params?: { userId: number }) => Promise<void>,
  userContext: User
) => {
  const { activityTypes } = useActivityTypeContext();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [changedFields, setChangedFields] = useState<ConsumptionPatchPayload>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ActionType>('edit');
  const [itemToProcess, setItemToProcess] = useState<number | null>(null);

  const handleEdit = (consumption: Consumption) => {
    const matchingActivity = activityTypes.find(
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

      const selectedActivity = activityTypes.find(
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

  const handleSaveEdit = () => {
    if (!editingId || !editForm || Object.keys(changedFields).length === 0) {
      handleCancelEdit();
      return;
    }

    setItemToProcess(editingId);
    setModalAction('edit');
    setIsModalOpen(true);
  };

  const confirmSaveEdit = async () => {
    if (!itemToProcess || !changedFields) return;

    try {
      setIsSubmitting(true);
      await consumptionService.updateConsumption(itemToProcess, changedFields);

      if (userContext?.userId) {
        await fetchConsumptions({ userId: userContext.userId });
      }

      handleCancelEdit();
    } catch (err) {
      console.error('Failed to update consumption', err);
      alert('Failed to update consumption');
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const handleDelete = (id: number) => {
    setItemToProcess(id);
    setModalAction('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToProcess === null) return;

    try {
      await consumptionService.deleteConsumption(itemToProcess);

      if (userContext?.userId) {
        await fetchConsumptions({ userId: userContext.userId });
      }
    } catch (err) {
      console.error('Failed to delete consumption', err);
      alert('Failed to delete consumption');
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemToProcess(null);
  };

  const handleConfirm = () => {
    if (modalAction === 'delete') {
      confirmDelete();
    } else if (modalAction === 'edit') {
      confirmSaveEdit();
    }
  };

  return {
    editingId,
    editForm,
    isSubmitting,
    isModalOpen,
    modalAction,
    handleEdit,
    handleCancelEdit,
    handleInputChange,
    handleSaveEdit,
    handleDelete,
    closeModal,
    handleConfirm,
  };
};
