import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlySummary {
  name: string;
  emissions: number;
}

const MonthlyTrend = ({
  monthlySummary,
}: {
  monthlySummary: MonthlySummary[];
}) => {
  return (
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
              `${typeof value === 'number' ? value.toFixed(2) : value} kg CO₂e`,
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
  );
};

export default MonthlyTrend;
