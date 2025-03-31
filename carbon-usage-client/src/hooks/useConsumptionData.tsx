// hooks/useConsumptionData.ts
import { useState, useEffect } from 'react';
import { Consumption } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';

export const useConsumptionData = () => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userContext } = useUser();

  // Sorting
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering
  const [dateFilter, setDateFilter] = useState<{
    from: string | null;
    to: string | null;
  }>({ from: null, to: null });
  const [activityFilter, setActivityFilter] = useState<number | null>(null);

  const fetchConsumptions = async (
    params: {
      userId?: number;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      dateFrom?: string | null;
      dateTo?: string | null;
      activityType?: number | null;
    } = {}
  ) => {
    const {
      userId,
      page = currentPage,
      limit = itemsPerPage,
      sortBy = sortField,
      sortOrder = sortDirection,
      dateFrom = dateFilter.from,
      dateTo = dateFilter.to,
      activityType = activityFilter,
    } = params;

    let url = `http://localhost:3000/consumption/${userId}`;

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

    try {
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const text = await response.text();
      if (!text || text.trim() === '') {
        setConsumptions([]);
        setTotalItems(0);
        setTotalPages(1);
        return [];
      }

      try {
        const data = JSON.parse(text);
        if (data.data && data.meta) {
          setConsumptions(data.data);
          setTotalItems(data.meta.total);
          setTotalPages(data.meta.totalPages);
        } else {
          setConsumptions(Array.isArray(data) ? data : []);
          setTotalItems(Array.isArray(data) ? data.length : 0);
          setTotalPages(1);
        }

        return data;
      } catch (e) {
        console.error('Error parsing JSON:', text, e);
        setConsumptions([]);
        setTotalItems(0);
        setTotalPages(1);
        return [];
      }
    } catch (error) {
      console.error('Error fetching consumptions:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadConsumptions = async () => {
      if (!userContext || !userContext.userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        await fetchConsumptions({
          userId: userContext.userId,
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortField,
          sortOrder: sortDirection,
          dateFrom: dateFilter.from,
          dateTo: dateFilter.to,
          activityType: activityFilter,
        });
      } catch (err) {
        console.error('Failed to fetch consumptions', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadConsumptions();
  }, [
    userContext,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    dateFilter.from,
    dateFilter.to,
    activityFilter,
  ]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return sortDirection === 'asc' ? (
      <span className="text-blue-500 ml-1">↑</span>
    ) : (
      <span className="text-blue-500 ml-1">↓</span>
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'dateFrom') {
      setDateFilter((prev) => ({ ...prev, from: value || null }));
    } else if (name === 'dateTo') {
      setDateFilter((prev) => ({ ...prev, to: value || null }));
    } else if (name === 'activityType') {
      setActivityFilter(value ? parseInt(value, 10) : null);
    }
  };

  const clearFilters = () => {
    setDateFilter({ from: null, to: null });
    setActivityFilter(null);
    setCurrentPage(1);
  };

  const calculateTotalCO2 = () => {
    return consumptions.reduce((total, consumption) => {
      return total + consumption.co2_equivalent;
    }, 0);
  };

  return {
    consumptions,
    isLoading,
    error,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    dateFilter,
    activityFilter,
    setIsLoading,
    setError,
    fetchConsumptions,
    handleSort,
    renderSortIndicator,
    handlePageChange,
    setItemsPerPage,
    handleFilterChange,
    clearFilters,
    calculateTotalCO2,
  };
};
