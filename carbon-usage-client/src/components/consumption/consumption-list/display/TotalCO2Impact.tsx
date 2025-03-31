import { formatNumber } from '@/utils/utils';
import React from 'react';

interface TotalCO2ImpactProps {
  totalCO2: number;
}

const TotalCO2Impact: React.FC<TotalCO2ImpactProps> = ({ totalCO2 }) => {
  const KG_CO2_PER_TREE_PER_YEAR = 25;
  const treesNeeded = Math.ceil(totalCO2 / KG_CO2_PER_TREE_PER_YEAR);

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Total CO2 Emissions</h3>
      </div>
      <p className="text-4xl font-bold mb-2">{formatNumber(totalCO2)}</p>
      <p className="text-sm opacity-80">
        kg CO<sub>2</sub>e
      </p>
      <div className="mt-4 text-xs">
        <span>
          You should plant <strong>{treesNeeded}</strong> trees to offset this
          impact
        </span>
      </div>
    </div>
  );
};

export default TotalCO2Impact;
