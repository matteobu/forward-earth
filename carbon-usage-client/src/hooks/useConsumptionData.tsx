/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Consumption, PaginationMeta } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';
import { consumptionService } from '@/services/consumptionService';
import { calculateTotalCO2 } from '@/utils/utils';

export const useConsumptionData = () => {
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataChecked, setDataChecked] = useState(false);
  const { userContext } = useUser();

  // Sorting
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const setItemsPerPageWithReset = (newPerPage: number) => {
    setCurrentPage(1);
    setItemsPerPage(newPerPage);
  };

  // Filtering
  const [dateFilter, setDateFilter] = useState<{
    from: string | null;
    to: string | null;
  }>({ from: null, to: null });
  const [activityFilter, setActivityFilter] = useState<number | null>(null);

  const fetchConsumptions = async (
    params: {
      dateFrom?: string | null;
      dateTo?: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    } = {}
  ) => {
    try {
      const result: { data: Consumption[]; meta: PaginationMeta } =
        await consumptionService.fetchConsumptions({
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
        setDataChecked(true);

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
        setDataChecked(true);
      } catch (err) {
        console.error('Failed to fetch consumptions', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setDataChecked(true);
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
    dataChecked,
    setIsLoading,
    setError,
    fetchConsumptions,
    handleSort,
    renderSortIndicator,
    handlePageChange,
    setItemsPerPage: setItemsPerPageWithReset,
    handleFilterChange,
    clearFilters,
    calculateTotalCO2,
  };
};
