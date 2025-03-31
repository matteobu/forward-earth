/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Consumption, ConsumptionPatchPayload } from '@/utils/types';
import { useUser } from '@/contexts/UserContext';
import { ACTIVITY_TYPES } from '@/utils/constants';

export default function ConsumptionList() {
  const navigate = useNavigate();
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userContext } = useUser();

  // Edit States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    activity_type_table_id: number;
    amount: number;
    date: string;
  } | null>(null);
  const [changedFields, setChangedFields] = useState<ConsumptionPatchPayload>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [showFilters, setShowFilters] = useState(false);

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
        console.log(data);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this consumption?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/consumption/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (userContext && userContext.userId) {
        await fetchConsumptions({
          userId: userContext.userId,
        });
      }
    } catch (err) {
      console.error('Failed to delete consumption', err);
      alert('Failed to delete consumption');
    }
  };

  const calculateTotalCO2 = () => {
    return consumptions.reduce((total, consumption) => {
      return total + consumption.co2_equivalent;
    }, 0);
  };

  const handleEdit = (consumption: Consumption) => {
    const matchingActivity = ACTIVITY_TYPES.find(
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

      const selectedActivity = ACTIVITY_TYPES.find(
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

  const handleSaveEdit = async () => {
    if (!editingId || !editForm || Object.keys(changedFields).length === 0) {
      handleCancelEdit();
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:3000/consumption/patch/${editingId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changedFields),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (userContext && userContext.userId) {
        await fetchConsumptions({
          userId: userContext.userId,
        });
      }

      handleCancelEdit();
    } catch (err) {
      console.error('Failed to update consumption', err);
      alert('Failed to update consumption');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Consumptions</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => navigate('/dashboard/consumptions/new')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={dateFilter.from || ''}
                onChange={handleFilterChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={dateFilter.to || ''}
                onChange={handleFilterChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                name="activityType"
                value={activityFilter || ''}
                onChange={handleFilterChange}
                className="border rounded p-2 w-full"
              >
                <option value="">All Activities</option>
                {ACTIVITY_TYPES.map((activity) => (
                  <option
                    key={activity.activity_type_id}
                    value={activity.activity_type_id}
                  >
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {!consumptions || consumptions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            You haven't added any consumptions yet.
          </p>
          <button
            onClick={() => navigate('/dashboard/consumptions/new')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Your First Consumption
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Total CO2 Impact
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {calculateTotalCO2().toFixed(2)} kg CO<sub>2</sub>e
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="py-3 px-4 text-left border-b w-[25%] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('activity_table.name')}
                  >
                    Activity {renderSortIndicator('activity_table.name')}
                  </th>
                  <th
                    className="py-3 px-4 text-left border-b w-[15%] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    Amount {renderSortIndicator('amount')}
                  </th>
                  <th
                    className="py-3 px-4 text-left border-b w-[15%] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('date')}
                  >
                    Date {renderSortIndicator('date')}
                  </th>
                  <th
                    className="py-3 px-4 text-left border-b w-[20%] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('co2_equivalent')}
                  >
                    CO2 Impact {renderSortIndicator('co2_equivalent')}
                  </th>
                  <th className="py-3 px-4 text-left border-b w-[25%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {consumptions.map((consumption) => (
                  <tr key={consumption.id} className="hover:bg-gray-50">
                    {editingId === consumption.id ? (
                      <>
                        <td className="py-3 px-4 border-b w-[25%]">
                          <select
                            name="activity_type_table_id"
                            value={editForm?.activity_type_table_id}
                            onChange={handleInputChange}
                            className="border rounded p-1 w-full"
                          >
                            {ACTIVITY_TYPES.map((activity) => (
                              <option
                                key={activity.activity_type_id}
                                value={activity.activity_type_id}
                              >
                                {activity.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 border-b w-[15%]">
                          <div className="flex items-center">
                            <input
                              type="number"
                              name="amount"
                              value={editForm?.amount}
                              onChange={handleInputChange}
                              className="border rounded p-1 max-w-[100px]"
                              step="0.01"
                              min="0"
                            />
                            <span className="ml-2">
                              {consumption.unit_table?.name || ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b w-[15%]">
                          <input
                            type="date"
                            name="date"
                            value={editForm?.date}
                            onChange={handleInputChange}
                            className="border rounded p-1 w-full"
                          />
                        </td>
                        <td className="py-3 px-4 border-b w-[20%]">
                          <span className="font-medium">
                            {consumption.co2_equivalent.toFixed(2)}
                          </span>{' '}
                          kg CO<sub>2</sub>e
                        </td>
                        <td className="py-3 px-4 border-b w-[25%]">
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={isSubmitting}
                              className={`text-green-500 hover:text-green-700 mr-2 ${
                                isSubmitting
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                            >
                              {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 border-b w-[25%]">
                          {consumption.activity_table
                            ? consumption.activity_table.name
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 border-b w-[15%]">
                          {consumption.amount}{' '}
                          {consumption.unit_table
                            ? consumption.unit_table.name
                            : ''}
                        </td>
                        <td className="py-3 px-4 border-b w-[15%]">
                          {formatDate(consumption.date)}
                        </td>
                        <td className="py-3 px-4 border-b w-[20%]">
                          <span className="font-medium">
                            {consumption.co2_equivalent.toFixed(2)}
                          </span>{' '}
                          kg CO<sub>2</sub>e
                        </td>
                        <td className="py-3 px-4 border-b w-[25%]">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDelete(consumption.id)}
                              className="text-red-500 hover:text-red-700 mr-2"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEdit(consumption)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {consumptions.length} of {totalItems} items
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border rounded p-1 ml-2"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                &laquo;
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                &lsaquo;
              </button>

              {/* Current Page Display */}
              <span className="px-3 py-1 bg-blue-500 text-white rounded">
                {currentPage}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                &rsaquo;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                &raquo;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
