import { URL_ENDPOINTS } from '@/utils/endpoints';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
      <p className="text-gray-600 mb-4">
        You haven't added any consumptions yet.
      </p>
      <button
        onClick={() =>
          navigate(URL_ENDPOINTS.DASHBOARD + URL_ENDPOINTS.CONSUMPTION_NEW)
        }
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Your First Consumption
      </button>
    </div>
  );
};

export default EmptyState;
