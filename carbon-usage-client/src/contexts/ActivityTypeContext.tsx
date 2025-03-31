/* eslint-disable react-refresh/only-export-components */
import { activityTypeService } from '@/services/activityTypeService';
// import { unitService } from '@/services/unitService';
import { ACTIVITY_TYPE_UNIT_MOCKED } from '@/utils/constants';
import { ActivityType } from '@/utils/types';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

export interface ActivityTypeContextType {
  activityTypes: ActivityType[];
}

const ActivityContext = createContext<ActivityTypeContextType | undefined>(
  undefined
);

export const useActivityTypeContext = (): ActivityTypeContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error(
      'useActivityTypeContext must be used within an ActivityTypeProvider'
    );
  }
  return context;
};

interface ActivityTypeProviderProps {
  children: ReactNode;
}

export const ActivityTypeProvider: React.FC<ActivityTypeProviderProps> = ({
  children,
}) => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const fetchedActivityTypes =
          await activityTypeService.fetchAllActivityType();
        // FIXME: This is conceptually wrong. The Activity Type should have a connection with uni_id so we can have the right info
        // Now, I am using a mocked const to do the job: ACTIVITY_TYPE_UNIT_MOCKED
        // const fetchedUnit = await unitService.fetchAllUnit();

        const activityTypesWithUnits = fetchedActivityTypes.map(
          (activityType: ActivityType) => {
            const mockedUnit = ACTIVITY_TYPE_UNIT_MOCKED.find(
              (mock) =>
                mock.activityType.toLowerCase() ===
                activityType.name.toLowerCase()
            );

            return {
              ...activityType,
              unit: mockedUnit?.unit || null,
            };
          }
        );

        setActivityTypes(activityTypesWithUnits);
      } catch (error) {
        console.error('Error fetching activity types:', error);
      }
    };

    fetchActivityTypes();
  }, []);

  return (
    <ActivityContext.Provider value={{ activityTypes }}>
      {children}
    </ActivityContext.Provider>
  );
};
