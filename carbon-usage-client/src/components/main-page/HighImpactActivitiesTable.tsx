import React from 'react';
import { formatNumber } from '@/utils/utils';
import { Consumption } from '@/utils/types';

interface HighImpactActivitiesTableProps {
  highImpactActivities: Consumption[];
  totalEmissions: number;
}

const HighImpactActivitiesTable: React.FC<HighImpactActivitiesTableProps> = ({
  highImpactActivities,
  totalEmissions,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">
          Top five consumptions
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50 text-indigo-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total CO₂e
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                % of Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Emission Factor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {highImpactActivities.map((activity, index) => (
              <tr
                key={activity.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {activity.activity_table.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatNumber(activity.co2_equivalent)} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {((activity.co2_equivalent / totalEmissions) * 100).toFixed(
                    1
                  )}
                  %
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatNumber(activity.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {activity.unit_table.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {activity.activity_table.emission_factor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighImpactActivitiesTable;
