import { useState, useEffect } from 'react';
import { useConsumptionData } from '@/hooks/useConsumptionData';
import EmissionTypeCard from './EmissionCard';
import { Consumption } from '@/utils/types';
import TotalCO2Impact from '../consumption/consumption-list/display/TotalCO2Impact';
import DataQualityScoreCard from './DataQualityScoreCard';
import CategoryBreakdown from './CategoryBreakdown';
import MonthlyTrend from './MonthlyTrend';
import HighImpactActivitiesTable from './HighImpactActivitiesTable';
import { useNavigate } from 'react-router-dom';
import { ACTIVITY_CATEGORIES } from '@/utils/constants';
import { URL_ENDPOINTS } from '@/utils/endpoints';

const MainPage = () => {
  const { consumptions, dataChecked, isLoading } = useConsumptionData();
  const [dataQuality, setDataQuality] = useState<'Good' | 'Fair' | 'Poor'>(
    'Good'
  );
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number; percentage: number }[]
  >([]);
  const [monthlySummary, setMonthlySummary] = useState<
    { name: string; emissions: number }[]
  >([]);
  const [highImpactActivities, setHighImpactActivities] = useState<
    Consumption[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!consumptions || consumptions.length === 0) return;

    const total = consumptions.reduce(
      (sum, item) => sum + item.co2_equivalent,
      0
    );
    setTotalEmissions(total);

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

    const emissionsByCategory: Record<string, number> = {};
    Object.entries(ACTIVITY_CATEGORIES).forEach(([category, activities]) => {
      emissionsByCategory[category] = 0;
      activities.forEach((activityName) => {
        if (emissionsByActivityType[activityName]) {
          emissionsByCategory[category] +=
            emissionsByActivityType[activityName];
        }
      });
    });

    let categorizedEmissions = 0;
    Object.values(emissionsByCategory).forEach((value) => {
      categorizedEmissions += value;
    });
    if (total > categorizedEmissions) {
      emissionsByCategory['Other'] = total - categorizedEmissions;
    }
    const categoryChartData = Object.keys(emissionsByCategory)
      .filter((key) => emissionsByCategory[key] > 0)
      .map((key) => ({
        name: key,
        value: emissionsByCategory[key],
        percentage: Math.round((emissionsByCategory[key] / total) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    setCategoryData(categoryChartData);

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

    const sortedActivities = [...consumptions]
      .sort((a, b) => b.co2_equivalent - a.co2_equivalent)
      .slice(0, 5);

    setHighImpactActivities(sortedActivities);

    if (consumptions.length > 10) {
      setDataQuality('Good');
    } else if (consumptions.length > 5) {
      setDataQuality('Fair');
    } else {
      setDataQuality('Poor');
    }
  }, [consumptions]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (dataChecked && consumptions.length === 0) {
      timeoutId = setTimeout(() => {
        navigate(URL_ENDPOINTS.DASHBOARD + URL_ENDPOINTS.CONSUMPTION_NEW);
      }, 5000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dataChecked, consumptions, navigate]);

  const topTwoEmissionCategory =
    categoryData.length > 0
      ? [categoryData[0], categoryData[1]]
      : [
          { name: 'N/A', percentage: 0 },
          { name: 'N/A', percentage: 0 },
        ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your carbon data...</p>
        </div>
      </div>
    );
  }

  if (!consumptions || consumptions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Carbon Data Available
          </h2>
          <p className="text-gray-600 mb-6">
            It looks like you haven't added any carbon consumption entries yet.
          </p>
          <button
            onClick={() =>
              navigate(URL_ENDPOINTS.DASHBOARD + URL_ENDPOINTS.CONSUMPTION_NEW)
            }
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add First Entry
          </button>
        </div>
      </div>
    );
  }

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
        <TotalCO2Impact totalCO2={totalEmissions} />
        <DataQualityScoreCard dataQuality={dataQuality} />
        <EmissionTypeCard
          topTwoEmissionCategory={topTwoEmissionCategory}
          color="indigo"
          icon="⚡"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Category Breakdown */}
        <CategoryBreakdown categoryData={categoryData} />

        {/* Monthly Trend */}
        <MonthlyTrend monthlySummary={monthlySummary} />
      </div>

      <HighImpactActivitiesTable
        highImpactActivities={highImpactActivities}
        totalEmissions={totalEmissions}
      />

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
