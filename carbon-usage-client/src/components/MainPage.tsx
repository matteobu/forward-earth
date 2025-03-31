import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

// Custom colors for charts
const COLORS = [
  '#4F46E5', // primary blue
  '#F97316', // orange
  '#10B981', // green
  '#F43F5E', // pink
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // hot pink
  '#06B6D4', // cyan
  '#EF4444', // red
  '#84CC16', // lime
];

interface EmissionTypeCardProps {
  title: string;
  percentage: number;
  color: string;
  icon: string;
}

const EmissionTypeCard = ({
  title,
  percentage,
  color,
  icon,
}: EmissionTypeCardProps) => (
  <div className="relative bg-white rounded-xl shadow-md p-6 mb-4">
    <div className="flex items-center space-x-4">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-${color}-100`}
      >
        <span className={`text-${color}-600 text-xl`}>{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{percentage}%</p>
      </div>
    </div>
    <div
      className={`absolute w-1 h-full bg-${color}-500 top-0 right-0 rounded-r-lg`}
    ></div>
  </div>
);

// Sample consumption data for demonstration
const sampleConsumptionData = [
  {
    id: 100,
    user_id: 2,
    amount: 132,
    activity_type_table_id: 20,
    unit_id: 4,
    co2_equivalent: 145.2,
    date: '2024-12-31',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 20,
      name: 'Office Paper Usage',
      emission_factor: 1.1,
      activity_type_id: 20,
    },
    unit_table: {
      id: 4,
      name: 'kg',
    },
  },
  {
    id: 94,
    user_id: 2,
    amount: 0.9,
    activity_type_table_id: 17,
    unit_id: 4,
    co2_equivalent: 1287,
    date: '2024-12-14',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 17,
      name: 'Refrigerant R134a Leakage',
      emission_factor: 1430,
      activity_type_id: 17,
    },
    unit_table: {
      id: 4,
      name: 'kg',
    },
  },
  {
    id: 91,
    user_id: 2,
    amount: 1.4,
    activity_type_table_id: 16,
    unit_id: 4,
    co2_equivalent: 2923.2,
    date: '2024-12-05',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 16,
      name: 'Refrigerant R410A Leakage',
      emission_factor: 2088,
      activity_type_id: 16,
    },
    unit_table: {
      id: 4,
      name: 'kg',
    },
  },
  {
    id: 85,
    user_id: 2,
    amount: 230,
    activity_type_table_id: 13,
    unit_id: 4,
    co2_equivalent: 133.4,
    date: '2024-12-14',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 13,
      name: 'Landfill Waste',
      emission_factor: 0.58,
      activity_type_id: 13,
    },
    unit_table: {
      id: 4,
      name: 'kg',
    },
  },
  {
    id: 82,
    user_id: 2,
    amount: 38,
    activity_type_table_id: 11,
    unit_id: 2,
    co2_equivalent: 13.072,
    date: '2024-11-02',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 11,
      name: 'Water Supply',
      emission_factor: 0.344,
      activity_type_id: 11,
    },
    unit_table: {
      id: 2,
      name: 'm³',
    },
  },
  {
    id: 76,
    user_id: 2,
    amount: 7850,
    activity_type_table_id: 8,
    unit_id: 6,
    co2_equivalent: 863.5,
    date: '2024-10-08',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 8,
      name: 'Business Travel - Air (Long Haul)',
      emission_factor: 0.11,
      activity_type_id: 8,
    },
    unit_table: {
      id: 6,
      name: 'tonne-km',
    },
  },
  {
    id: 73,
    user_id: 2,
    amount: 1850,
    activity_type_table_id: 7,
    unit_id: 6,
    co2_equivalent: 296,
    date: '2024-09-27',
    created_at: '2025-03-31T09:13:25.404+00:00',
    deleted_at: null,
    activity_table: {
      id: 7,
      name: 'Business Travel - Air (Short Haul)',
      emission_factor: 0.16,
      activity_type_id: 7,
    },
    unit_table: {
      id: 6,
      name: 'tonne-km',
    },
  },
];

const MainPage = () => {
  const [consumptions] = useState(sampleConsumptionData);
  const [dataQuality, setDataQuality] = useState('Good');
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number; percentage: number }[]
  >([]);
  const [monthlySummary, setMonthlySummary] = useState<
    { name: string; emissions: number }[]
  >([]);
  const [highImpactActivities, setHighImpactActivities] = useState<
    {
      id: number;
      user_id: number;
      amount: number;
      activity_type_table_id: number;
      unit_id: number;
      co2_equivalent: number;
      date: string;
      created_at: string;
      deleted_at: null;
      activity_table: {
        id: number;
        name: string;
        emission_factor: number;
        activity_type_id: number;
      };
      unit_table: {
        id: number;
        name: string;
      };
    }[]
  >([]);

  useEffect(() => {
    if (!consumptions || consumptions.length === 0) return;

    // Calculate total emissions
    const total = consumptions.reduce(
      (sum, item) => sum + item.co2_equivalent,
      0
    );
    setTotalEmissions(total);

    // Process data for category breakdown
    const emissionsByCategory: Record<string, number> = {};
    const categoryGroups: Record<string, string[]> = {
      'Procured goods and services': ['Office Paper Usage', 'Recycled Paper'],
      Transportation: [
        'Business Travel - Air (Short Haul)',
        'Business Travel - Air (Long Haul)',
        'Shipping - Road Freight',
      ],
      Refrigerants: ['Refrigerant R410A Leakage', 'Refrigerant R134a Leakage'],
      Waste: ['Landfill Waste'],
      Energy: ['Electricity', 'Natural Gas', 'Heating Oil'],
      Water: ['Water Supply', 'Wastewater Treatment'],
    };

    // Calculate emissions by activity type first
    const emissionsByActivityType = consumptions.reduce<Record<string, number>>(
      (acc, curr) => {
        const activityName = curr.activity_table.name;
        if (!acc[activityName]) {
          acc[activityName] = 0;
        }
        acc[activityName] += curr.co2_equivalent;
        return acc;
      },
      {}
    );

    // Then aggregate by category
    Object.keys(categoryGroups).forEach((category) => {
      emissionsByCategory[category] = 0;
      categoryGroups[category].forEach((activityName) => {
        if (emissionsByActivityType[activityName]) {
          emissionsByCategory[category] +=
            emissionsByActivityType[activityName];
        }
      });
    });

    // Add 'Other' category for any activities not explicitly categorized
    let categorizedEmissions = 0;
    Object.values(emissionsByCategory).forEach((value) => {
      categorizedEmissions += value;
    });
    if (total > categorizedEmissions) {
      emissionsByCategory['Other'] = total - categorizedEmissions;
    }

    // Convert to percentage and prepare for charts
    const categoryChartData = Object.keys(emissionsByCategory)
      .filter((key) => emissionsByCategory[key] > 0)
      .map((key) => ({
        name: key,
        value: emissionsByCategory[key],
        percentage: Math.round((emissionsByCategory[key] / total) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    setCategoryData(categoryChartData);

    // Prepare monthly summary data
    const monthlyData: Record<string, { name: string; emissions: number }> = {};
    consumptions.forEach((item) => {
      const date = new Date(item.date);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: monthYear,
          emissions: 0,
        };
      }

      monthlyData[monthYear].emissions += item.co2_equivalent;
    });

    const monthlyChartData = Object.values(monthlyData).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setMonthlySummary(monthlyChartData);

    // Find highest impact activities
    const sortedActivities = [...consumptions]
      .sort((a, b) => b.co2_equivalent - a.co2_equivalent)
      .slice(0, 5);

    setHighImpactActivities(sortedActivities);

    // Set data quality based on data completeness and consistency
    // This is a simplified example - in a real app, you'd have more complex logic
    if (consumptions.length > 10) {
      setDataQuality('Good');
    } else if (consumptions.length > 5) {
      setDataQuality('Fair');
    } else {
      setDataQuality('Poor');
    }
  }, [consumptions]);

  // If no data, show loading
  if (!consumptions || consumptions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your carbon data...</p>
        </div>
      </div>
    );
  }

  // Find the top emission category for display
  const topEmissionCategory =
    categoryData.length > 0 ? categoryData[0] : { name: 'N/A', percentage: 0 };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Carbon Emissions Dashboard
        </h1>
        <p className="text-gray-600">
          Track, analyze and reduce your organization's carbon footprint
        </p>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Emissions Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">Total CO2 Emissions</h3>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              Scope 3
            </span>
          </div>
          <p className="text-4xl font-bold mb-2">
            {Math.round(totalEmissions).toLocaleString()}
          </p>
          <p className="text-sm opacity-80">
            kg CO<sub>2</sub>e
          </p>
          <div className="mt-4 text-xs">
            <span>
              You should plant <strong>{Math.ceil(totalEmissions / 25)}</strong>{' '}
              trees to offset this impact
            </span>
          </div>
        </div>

        {/* Data Quality Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Data Quality Score
          </h3>
          <div className="flex items-center mb-4">
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 ${
                dataQuality === 'Good'
                  ? 'bg-green-500'
                  : dataQuality === 'Fair'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span className="text-lg font-semibold">{dataQuality}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="text-xs uppercase text-gray-500 mb-1">
                Activity data
              </h4>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    dataQuality === 'Good'
                      ? 'bg-green-500'
                      : dataQuality === 'Fair'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width:
                      dataQuality === 'Good'
                        ? '85%'
                        : dataQuality === 'Fair'
                        ? '65%'
                        : '40%',
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="text-xs uppercase text-gray-500 mb-1">
                Emission factor
              </h4>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    dataQuality === 'Good'
                      ? 'bg-green-500'
                      : dataQuality === 'Fair'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width:
                      dataQuality === 'Good'
                        ? '90%'
                        : dataQuality === 'Fair'
                        ? '70%'
                        : '35%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Emission Category Card */}
        <EmissionTypeCard
          title={topEmissionCategory.name}
          percentage={topEmissionCategory.percentage}
          color="indigo"
          icon="⚡"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Category Breakdown */}
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
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${
                        typeof value === 'number' ? value.toFixed(2) : value
                      } kg CO₂e`,
                      'Emissions',
                    ]}
                    labelFormatter={(name) =>
                      categoryData.find((item) => item.value === name)?.name ||
                      name
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
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Monthly Emissions Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlySummary}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year.substring(2)}`;
                }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `${
                    typeof value === 'number' ? value.toFixed(2) : value
                  } kg CO₂e`,
                  'Emissions',
                ]}
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#4F46E5"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Emissions Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-800">
            Emissions Calculations
          </h3>
          <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
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
                    {activity.co2_equivalent.toFixed(2)} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {((activity.co2_equivalent / totalEmissions) * 100).toFixed(
                      1
                    )}
                    %
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {activity.amount}
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

      {/* Action Items */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Recommended Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 flex items-start">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">
                Switch to renewable energy
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Could reduce emissions by up to 30%
              </p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 flex items-start">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">
                Optimize refrigerant management
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Regular maintenance could prevent leakage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
