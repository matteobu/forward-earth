// services/consumptionService.ts
import { ConsumptionPatchPayload } from '@/utils/types';

const API_BASE_URL = 'http://localhost:3000';

export const consumptionService = {
  // Retrieves user consumption data with support for pagination, sorting, and filtering
  fetchConsumptions: async (params: {
    userId: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    dateFrom?: string | null;
    dateTo?: string | null;
    activityType?: number | null;
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

    let url = `${API_BASE_URL}/consumption/${userId}`;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder.toUpperCase());
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);
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

  // Updates an existing consumption record with partial data
  updateConsumption: async (id: number, data: ConsumptionPatchPayload) => {
    const response = await fetch(`${API_BASE_URL}/consumption/patch/${id}`, {
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

  // Permanently removes a consumption record from the database
  deleteConsumption: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/consumption/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  },

  // Creates a new consumption record in the database
  createConsumption: async (data: {
    userId: number;
    amount: number;
    date: string;
    activityType: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/consumption/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  },
};
