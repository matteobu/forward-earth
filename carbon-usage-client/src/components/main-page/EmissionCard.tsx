const EmissionTypeCard = ({
  topTwoEmissionCategory = [],
  color,
  icon,
}: EmissionTypeCardProps) => {
  const firstCategory = topTwoEmissionCategory[0] || {
    name: 'N/A',
    percentage: 0,
  };
  const hasSecondCategory = topTwoEmissionCategory[1] !== undefined;
  const secondCategory = topTwoEmissionCategory[1] || {
    name: '',
    percentage: 0,
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-${color}-100`}
          >
            <span className={`text-${color}-600 text-xl`}>{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {firstCategory.name}
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {firstCategory.percentage}%
            </p>
          </div>
        </div>

        {hasSecondCategory && (
          <>
            <div className="h-12 w-px bg-gray-200 mx-4"></div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                {secondCategory.name}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {secondCategory.percentage}%
              </p>
            </div>
          </>
        )}
      </div>

      <div
        className={`absolute w-2 h-full bg-${color}-500 top-0 right-0 rounded-r-lg`}
      ></div>
    </div>
  );
};

export default EmissionTypeCard;

interface EmissionTypeCardProps {
  topTwoEmissionCategory?:
    | {
        name: string;
        value: number;
        percentage: number;
      }[]
    | {
        name: string;
        percentage: number;
      }[];
  color: string;
  icon: string;
}
