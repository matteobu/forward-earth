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
  fetchConsumptions: (params?: {
    [key: string]: string | number | null;
  }) => Promise<void>,
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

  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  const [activityFilter, setActivityFilter] = useState<number | null>(null);
  const [amountFilter, setAmountFilter] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });
  const [co2Filter, setCO2Filter] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

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
      setIsSubmitting(true);
      await consumptionService.deleteConsumption(itemToProcess);

      if (userContext?.userId) {
        await fetchConsumptions({ userId: userContext.userId });
      }
    } catch (err) {
      console.error('Failed to delete consumption', err);
      alert('Failed to delete consumption');
    } finally {
      setIsSubmitting(false);
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

  const applyFilters = async () => {
    setIsSubmitting(true);
    try {
      const filterParams: {
        userId: number;
        dateFrom?: string;
        dateTo?: string;
        activityTypeId?: number;
        activityType?: number;
        amountMin?: number;
        amountMax?: number;
        co2Min?: number;
        co2Max?: number;
      } = {
        userId: userContext.userId,
      };

      if (dateFilter.from) {
        const day = dateFilter.from.getDate().toString().padStart(2, '0');
        const month = (dateFilter.from.getMonth() + 1)
          .toString()
          .padStart(2, '0');
        const year = dateFilter.from.getFullYear();

        filterParams.dateFrom = `${year}-${month}-${day}`;
      }

      if (dateFilter.to) {
        const day = dateFilter.to.getDate().toString().padStart(2, '0');
        const month = (dateFilter.to.getMonth() + 1)
          .toString()
          .padStart(2, '0');
        const year = dateFilter.to.getFullYear();

        filterParams.dateTo = `${year}-${month}-${day}`;
      }

      if (activityFilter !== null) {
        filterParams.activityType = activityFilter;
      }

      if (amountFilter.min !== null) {
        filterParams.amountMin = amountFilter.min;
      }

      if (amountFilter.max !== null) {
        filterParams.amountMax = amountFilter.max;
      }

      if (co2Filter.min !== null) {
        filterParams.co2Min = co2Filter.min;
      }

      if (co2Filter.max !== null) {
        filterParams.co2Max = co2Filter.max;
      }
      console.log(filterParams);
      await fetchConsumptions(filterParams);
    } catch (err) {
      console.error('Failed to apply filters', err);
      alert('Failed to apply filters');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setDateFilter({ from: null, to: null });
    setActivityFilter(null);
    setAmountFilter({ min: null, max: null });
    setCO2Filter({ min: null, max: null });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    editingId,
    editForm,
    isSubmitting,
    isModalOpen,
    modalAction,
    showFilters,
    dateFilter,
    activityFilter,
    amountFilter,
    co2Filter,
    handleEdit,
    handleCancelEdit,
    handleInputChange,
    handleSaveEdit,
    handleDelete,
    closeModal,
    handleConfirm,
    setDateFilter,
    setActivityFilter,
    setAmountFilter,
    setCO2Filter,
    applyFilters,
    clearFilters,
    toggleFilters,
  };
};
