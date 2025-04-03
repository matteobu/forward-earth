import React, { useState } from 'react';
import { formatNumber } from '@/utils/utils';

interface ProductionRecord {
  id: number;
  product_id: string;
  batch_number: string;
  production_date: string;
  total_units: number;
  production_efficiency: number;
}

// TOIMPROVE: Here we could improve the component with a api call to the backend to provide real time data from a database.

const ProductionTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const productionData: ProductionRecord[] = productionDataMock;
  const totalPages = Math.ceil(productionData.length / itemsPerPage);

  const paginatedData = productionData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">
          Production Batches
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50 text-indigo-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Batch Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Production Efficiency
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((record, index) => (
              <tr
                key={record.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {record.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.product_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.batch_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.production_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatNumber(record.total_units)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {(record.production_efficiency * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductionTable;

export const productionDataMock = [
  {
    id: 1,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-001',
    production_date: '2024-01-15',
    total_units: 1250,
    production_efficiency: 0.92,
  },
  {
    id: 2,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-002',
    production_date: '2024-01-16',
    total_units: 980,
    production_efficiency: 0.88,
  },
  {
    id: 3,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-003',
    production_date: '2024-01-17',
    total_units: 1500,
    production_efficiency: 0.95,
  },
  {
    id: 4,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-004',
    production_date: '2024-01-18',
    total_units: 800,
    production_efficiency: 0.86,
  },
  {
    id: 5,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-005',
    production_date: '2024-01-19',
    total_units: 1100,
    production_efficiency: 0.9,
  },
  {
    id: 6,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-006',
    production_date: '2024-01-20',
    total_units: 1350,
    production_efficiency: 0.93,
  },
  {
    id: 7,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-007',
    production_date: '2024-01-21',
    total_units: 1050,
    production_efficiency: 0.89,
  },
  {
    id: 8,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-008',
    production_date: '2024-01-22',
    total_units: 1600,
    production_efficiency: 0.96,
  },
  {
    id: 9,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-009',
    production_date: '2024-01-23',
    total_units: 750,
    production_efficiency: 0.85,
  },
  {
    id: 10,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-010',
    production_date: '2024-01-24',
    total_units: 1200,
    production_efficiency: 0.91,
  },
  {
    id: 11,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-011',
    production_date: '2024-01-25',
    total_units: 1400,
    production_efficiency: 0.94,
  },
  {
    id: 12,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-012',
    production_date: '2024-01-26',
    total_units: 900,
    production_efficiency: 0.87,
  },
  {
    id: 13,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-013',
    production_date: '2024-01-27',
    total_units: 1550,
    production_efficiency: 0.95,
  },
  {
    id: 14,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-014',
    production_date: '2024-01-28',
    total_units: 820,
    production_efficiency: 0.86,
  },
  {
    id: 15,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-015',
    production_date: '2024-01-29',
    total_units: 1150,
    production_efficiency: 0.9,
  },
  {
    id: 16,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-016',
    production_date: '2024-01-30',
    total_units: 1300,
    production_efficiency: 0.92,
  },
  {
    id: 17,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-017',
    production_date: '2024-01-31',
    total_units: 1000,
    production_efficiency: 0.88,
  },
  {
    id: 18,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-018',
    production_date: '2024-02-01',
    total_units: 1450,
    production_efficiency: 0.93,
  },
  {
    id: 19,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-019',
    production_date: '2024-02-02',
    total_units: 780,
    production_efficiency: 0.85,
  },
  {
    id: 20,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-020',
    production_date: '2024-02-03',
    total_units: 1080,
    production_efficiency: 0.89,
  },
  {
    id: 21,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-021',
    production_date: '2024-02-04',
    total_units: 1380,
    production_efficiency: 0.94,
  },
  {
    id: 22,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-022',
    production_date: '2024-02-05',
    total_units: 920,
    production_efficiency: 0.87,
  },
  {
    id: 23,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-023',
    production_date: '2024-02-06',
    total_units: 1520,
    production_efficiency: 0.95,
  },
  {
    id: 24,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-024',
    production_date: '2024-02-07',
    total_units: 840,
    production_efficiency: 0.86,
  },
  {
    id: 25,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-025',
    production_date: '2024-02-08',
    total_units: 1180,
    production_efficiency: 0.91,
  },
  {
    id: 26,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-026',
    production_date: '2024-02-09',
    total_units: 1320,
    production_efficiency: 0.93,
  },
  {
    id: 27,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-027',
    production_date: '2024-02-10',
    total_units: 1030,
    production_efficiency: 0.89,
  },
  {
    id: 28,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-028',
    production_date: '2024-02-11',
    total_units: 1480,
    production_efficiency: 0.94,
  },
  {
    id: 29,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-029',
    production_date: '2024-02-12',
    total_units: 800,
    production_efficiency: 0.85,
  },
  {
    id: 30,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-030',
    production_date: '2024-02-13',
    total_units: 1110,
    production_efficiency: 0.9,
  },
  {
    id: 31,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-031',
    production_date: '2024-02-14',
    total_units: 1410,
    production_efficiency: 0.95,
  },
  {
    id: 32,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-032',
    production_date: '2024-02-15',
    total_units: 950,
    production_efficiency: 0.88,
  },
  {
    id: 33,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-033',
    production_date: '2024-02-16',
    total_units: 1550,
    production_efficiency: 0.96,
  },
  {
    id: 34,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-034',
    production_date: '2024-02-17',
    total_units: 860,
    production_efficiency: 0.86,
  },
  {
    id: 35,
    product_id: '1d1e8cfca-53c5-4ca5-9e8f-9f6a1708073b',
    batch_number: 'BATCH-2024-035',
    production_date: '2024-02-18',
    total_units: 1210,
    production_efficiency: 0.91,
  },
  {
    id: 36,
    product_id: '9f6a1708-0738-4ca5-9e8f-1d1e8cfca53c',
    batch_number: 'BATCH-2024-036',
    production_date: '2024-02-19',
    total_units: 1350,
    production_efficiency: 0.93,
  },
  {
    id: 37,
    product_id: '5a3e9d2b-1c4f-4f9d-a2b7-2e8c1d3b4a5c',
    batch_number: 'BATCH-2024-037',
    production_date: '2024-02-20',
    total_units: 1060,
    production_efficiency: 0.89,
  },
  {
    id: 38,
    product_id: 'd7b2e1a6-3f5c-4b8d-9a1e-3c2d5f7g8h9i',
    batch_number: 'BATCH-2024-038',
    production_date: '2024-02-21',
    total_units: 1510,
    production_efficiency: 0.94,
  },
  {
    id: 39,
    product_id: '2e8c1d3b-4a5f-4c9d-b2a7-9f6a1708073b',
    batch_number: 'BATCH-2024-039',
    production_date: '2024-02-22',
    total_units: 820,
    production_efficiency: 0.85,
  },
];
