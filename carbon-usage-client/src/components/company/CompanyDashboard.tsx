import { useUser } from '@/contexts/UserContext';
import { companyService } from '@/services/companyService';
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface CompanyData {
  id: string;
  user_id: number;
  name: string;
  location: string;
  production_step: string;
  step_number: number;
  established_year: number;
  employees: number;
  annual_revenue: string;
  sustainability_score: string;
  primary_expertise: string;
}

const CompanyDashboard: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userContext } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await companyService.fetchCompanyData(userContext.userId);
        setCompanyData(data[0]);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching company data';

        setError(errorMessage);
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestActual =
    MOCK_EMISSIONS_DATA[MOCK_EMISSIONS_DATA.length - 1].actual;
  const latestTarget =
    MOCK_EMISSIONS_DATA[MOCK_EMISSIONS_DATA.length - 1].target;
  const progressPercentage = (
    ((latestTarget - latestActual) / latestTarget) *
    100
  ).toFixed(1);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{companyData?.name}</h1>
                <p className="text-white/80 mt-2">{companyData?.location}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Primary Expertise </div>
                <div className="text-xl font-semibold text-white">
                  {companyData?.primary_expertise}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Company Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Established</span>
                  <span className="font-medium text-gray-800">
                    {companyData?.established_year}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-600">Employees</span>
                  <span className="font-medium text-gray-800">
                    {companyData?.employees}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Revenue</span>
                  <span className="font-medium text-gray-800">
                    {companyData?.annual_revenue}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Sustainability Metrics
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {companyData?.sustainability_score}
                  </div>
                  <div className="text-sm text-gray-600">
                    Sustainability Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Emissions Reduction
                </h3>
                <div className="text-3xl font-bold text-green-600">
                  {progressPercentage}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Progress towards annual target
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Current Emissions
                </h3>
                <div className="text-3xl font-bold text-blue-600">
                  {latestActual.toLocaleString()} t
                </div>
                <p className="text-sm text-gray-600 mt-2">As of last month</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Carbon Emissions Trend
              </h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={MOCK_EMISSIONS_DATA}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#fbbf24"
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

const MOCK_EMISSIONS_DATA = [
  { month: 'Jan', actual: 105000, target: 110000 },
  { month: 'Feb', actual: 100000, target: 105000 },
  { month: 'Mar', actual: 95000, target: 100000 },
  { month: 'Apr', actual: 90000, target: 95000 },
  { month: 'May', actual: 85000, target: 90000 },
  { month: 'Jun', actual: 80000, target: 85000 },
  { month: 'Jul', actual: 75000, target: 80000 },
  { month: 'Aug', actual: 70000, target: 75000 },
  { month: 'Sep', actual: 65000, target: 70000 },
  { month: 'Oct', actual: 60000, target: 65000 },
  { month: 'Nov', actual: 55000, target: 60000 },
  { month: 'Dec', actual: 50000, target: 55000 },
];
