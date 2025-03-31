// TableHeader.tsx
import React, { JSX } from 'react';

interface TableHeaderProps {
  handleSort: (field: string) => void;
  renderSortIndicator: (field: string) => JSX.Element;
}

const ConsumptionTableHeader: React.FC<TableHeaderProps> = ({
  handleSort,
  renderSortIndicator,
}) => {
  return (
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
        <th className="py-3 px-4 text-left border-b w-[25%]">Actions</th>
      </tr>
    </thead>
  );
};

export default ConsumptionTableHeader;
