// components/consumption/ui/ConsumptionHeader.tsx
import { useUser } from '@/contexts/UserContext';
import React from 'react';

const ConsumptionHeader: React.FC = () => {
  const { userContext } = useUser();

  return (
    <div className="flex justify-between items-center mb-6 mt-4 text-xs font-medium uppercase">
      <h2 className="text-xl font-bold">
        This is the list of all your consumptions, {userContext.name}
      </h2>
    </div>
  );
};

export default ConsumptionHeader;
