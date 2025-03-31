/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Consumption } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';
import { consumptionService } from '@/services/consumptionService';

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

  const fetchConsumptions = async (params = {}) => {
    try {
      const result = await consumptionService.fetchConsumptions({
        userId: userContext.userId,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortField,
        sortOrder: sortDirection,
        dateFrom: dateFilter.from,
        dateTo: dateFilter.to,
        activityType: activityFilter,
        ...params,
      });

      if (result.data && result.meta) {
        setConsumptions(result.data);
        setTotalItems(result.meta.total);
        setTotalPages(result.meta.totalPages);
      } else {
        setConsumptions(Array.isArray(result) ? result : []);
        setTotalItems(Array.isArray(result) ? result.length : 0);
        setTotalPages(1);
      }

      return result;
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
