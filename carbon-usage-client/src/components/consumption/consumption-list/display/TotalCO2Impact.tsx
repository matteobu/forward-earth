import React from 'react';

interface TotalCO2ImpactProps {
  totalCO2: number;
}

const TotalCO2Impact: React.FC<TotalCO2ImpactProps> = ({ totalCO2 }) => {
  const KG_CO2_PER_TREE_PER_YEAR = 25;
  const treesNeeded = Math.ceil(totalCO2 / KG_CO2_PER_TREE_PER_YEAR);

  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <h3 className="text-md font-medium text-gray-700 mb-2">
        Total CO2 Impact
      </h3>
      <p className="text-2xl font-bold text-gray-800 mb-2">
        {totalCO2.toFixed(2)} kg CO<sub>2</sub>e
      </p>
      <p className="text-sm text-gray-600 mt-2">
        You should plant{' '}
        <span className="font-semibold text-green-600">{treesNeeded}</span>{' '}
        trees to compensate this amount
      </p>
    </div>
  );
};

export default TotalCO2Impact;
