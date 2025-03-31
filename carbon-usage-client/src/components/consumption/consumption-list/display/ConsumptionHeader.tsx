// components/consumption/ui/ConsumptionHeader.tsx
import { useUser } from '@/contexts/UserContext';
import React from 'react';

const ConsumptionHeader: React.FC = () => {
  const { userContext } = useUser();

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">
        Guess what, {userContext.name}? The consumption numbers are talking
      </h2>
    </div>
  );
};

export default ConsumptionHeader;
