import { API_ENDPOINTS } from '@/utils/endpoints';
import { ConsumptionPatchPayload } from '@/utils/types';
import { NavigateFunction } from 'react-router-dom';

export const consumptionService = {
  fetchConsumptions: async (params: {
    userId: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    dateFrom?: string | null;
    dateTo?: string | null;
    activityType?: number | null;
    amountMin?: number | null;
    amountMax?: number | null;
    co2Min?: number | null;
    co2Max?: number | null;
  }) => {
    const {
      userId,
      page,
      limit,
      sortBy,
      sortOrder,
      dateFrom,
      dateTo,
      activityType,
    } = params;

    let url = `${API_ENDPOINTS.CONSUMPTION}${userId}`;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder.toUpperCase());
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);
    if (params.amountMin)
      queryParams.append('amountMin', params.amountMin.toString());
    if (params.amountMax)
      queryParams.append('amountMax', params.amountMax.toString());
    if (params.co2Min) queryParams.append('co2Min', params.co2Min.toString());
    if (params.co2Max) queryParams.append('co2Max', params.co2Max.toString());
    if (activityType)
      queryParams.append('activityType', activityType.toString());
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return { data: [], meta: { total: 0, totalPages: 1 } };
    }

    return JSON.parse(text);
  },

  updateConsumption: async (id: number, data: ConsumptionPatchPayload) => {
    const response = await fetch(`${API_ENDPOINTS.CONSUMPTION_PATCH}${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  },

  deleteConsumption: async (id: number) => {
    const response = await fetch(`${API_ENDPOINTS.CONSUMPTION_DELETE}${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  },

  createConsumption: async (
    data: {
      user_id: number;
      amount: number;
      activity_type_table_id: number;
      date: string;
      co2_equivalent: number | null;
      unit_id: number | null;
      unit_table: {
        id: number;
        name: string | undefined;
      } | null;
    },
    navigate: NavigateFunction,
    setIsSubmitting: (value: React.SetStateAction<boolean>) => void
  ) => {
    try {
      const response = await fetch('http://localhost:3000/consumption/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      navigate('/dashboard/consumptions/list');
    } catch (error) {
      console.error('Failed to create consumption', error);
      setIsSubmitting(false);
    }
  },
};
