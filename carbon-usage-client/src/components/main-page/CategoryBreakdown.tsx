import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/utils/constants';
import { formatNumber } from '@/utils/utils';

interface Category {
  name: string;
  value: number;
  percentage: number;
}

const CategoryBreakdown: React.FC<{ categoryData: Category[] }> = ({
  categoryData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Emissions by Category
      </h3>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${
                    typeof value === 'number' ? formatNumber(value) : value
                  } kg CO₂e`,
                  'Emissions',
                ]}
                labelFormatter={(name) =>
                  categoryData.find((item) => item.value === name)?.name || name
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 gap-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                ></div>
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
                  {category.name}
                </span>
                <span className="ml-auto text-sm font-medium">
                  {category.percentage}%
                </span>
                <div className="ml-2 bg-gray-200 w-20 h-2 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
