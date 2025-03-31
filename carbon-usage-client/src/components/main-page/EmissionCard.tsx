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
export default EmissionTypeCard;

interface EmissionTypeCardProps {
  title: string;
  percentage: number;
  color: string;
  icon: string;
}
