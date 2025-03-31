// PaginationControls.tsx
import { Consumption } from '@/utils/types';
import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  consumptions: Consumption[];
  totalItems: number;
  itemsPerPage: number;
  setItemsPerPage: (perPage: number) => void;
  handlePageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  consumptions,
  totalItems,
  itemsPerPage,
  setItemsPerPage,
  handlePageChange,
}) => {
  return (
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
  );
};

export default PaginationControls;
