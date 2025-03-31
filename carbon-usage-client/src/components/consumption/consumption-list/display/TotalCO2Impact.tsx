import React from 'react';

interface TotalCO2ImpactProps {
  totalCO2: number;
}

const TotalCO2Impact: React.FC<TotalCO2ImpactProps> = ({ totalCO2 }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Total CO2 Impact
      </h3>
      <p className="text-2xl font-bold text-gray-800">
        {totalCO2.toFixed(2)} kg CO<sub>2</sub>e
      </p>
    </div>
  );
};

export default TotalCO2Impact;
