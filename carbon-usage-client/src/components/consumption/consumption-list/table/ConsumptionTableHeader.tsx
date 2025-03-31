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
    <thead className="bg-indigo-50 text-indigo-600">
      <tr>
        <th
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-100"
          onClick={() => handleSort('activity_table.name')}
        >
          Activity {renderSortIndicator('activity_table.name')}
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-100"
          onClick={() => handleSort('amount')}
        >
          Amount {renderSortIndicator('amount')}
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-100"
          onClick={() => handleSort('date')}
        >
          Date {renderSortIndicator('date')}
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-100"
          onClick={() => handleSort('co2_equivalent')}
        >
          CO2 Impact {renderSortIndicator('co2_equivalent')}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default ConsumptionTableHeader;
