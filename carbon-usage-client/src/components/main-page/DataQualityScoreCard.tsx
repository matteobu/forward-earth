interface DataQualityScoreCardProps {
  dataQuality: 'Good' | 'Fair' | 'Poor';
}

const DataQualityScoreCard = ({ dataQuality }: DataQualityScoreCardProps) => {
  return (
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
  );
};

export default DataQualityScoreCard;
