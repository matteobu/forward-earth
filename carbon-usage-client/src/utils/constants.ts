import { ActivityType } from './types';

// Activity types with predefined units and CO2 emission factors
export const ACTIVITY_TYPES: ActivityType[] = [
  // Energy consumption
  {
    activity_type_id: 1,
    name: 'Electricity',
    unit: 'kWh',
    emission_factor: 0.5,
  },
  {
    activity_type_id: 2,
    name: 'Natural Gas',
    unit: 'm³',
    emission_factor: 2.1,
  },
  {
    activity_type_id: 3,
    name: 'Heating Oil',
    unit: 'Liters',
    emission_factor: 2.7,
  },
  { activity_type_id: 4, name: 'Coal', unit: 'kg', emission_factor: 2.42 },

  // Transportation
  {
    activity_type_id: 5,
    name: 'Company Vehicles - Gasoline',
    unit: 'Liters',
    emission_factor: 2.3,
  },
  {
    activity_type_id: 6,
    name: 'Company Vehicles - Diesel',
    unit: 'Liters',
    emission_factor: 2.68,
  },
  {
    activity_type_id: 7,
    name: 'Business Travel - Air (Short Haul)',
    unit: 'km',
    emission_factor: 0.16,
  },
  {
    activity_type_id: 8,
    name: 'Business Travel - Air (Long Haul)',
    unit: 'km',
    emission_factor: 0.11,
  },
  {
    activity_type_id: 9,
    name: 'Business Travel - Rail',
    unit: 'km',
    emission_factor: 0.04,
  },
  {
    activity_type_id: 10,
    name: 'Shipping - Road Freight',
    unit: 'tonne-km',
    emission_factor: 0.11,
  },

  // Water usage
  {
    activity_type_id: 11,
    name: 'Water Supply',
    unit: 'm³',
    emission_factor: 0.344,
  },
  {
    activity_type_id: 12,
    name: 'Wastewater Treatment',
    unit: 'm³',
    emission_factor: 0.708,
  },

  // Waste management
  {
    activity_type_id: 13,
    name: 'Landfill Waste',
    unit: 'kg',
    emission_factor: 0.58,
  },
  {
    activity_type_id: 14,
    name: 'Recycled Paper',
    unit: 'kg',
    emission_factor: 0.01,
  },
  {
    activity_type_id: 15,
    name: 'Recycled Plastic',
    unit: 'kg',
    emission_factor: 0.03,
  },

  // Manufacturing processes
  {
    activity_type_id: 16,
    name: 'Refrigerant R410A Leakage',
    unit: 'kg',
    emission_factor: 2088,
  },
  {
    activity_type_id: 17,
    name: 'Refrigerant R134a Leakage',
    unit: 'kg',
    emission_factor: 1430,
  },

  // Information technology
  {
    activity_type_id: 18,
    name: 'Data Center Usage',
    unit: 'kWh',
    emission_factor: 0.5,
  },
  {
    activity_type_id: 19,
    name: 'Cloud Services',
    unit: 'hours',
    emission_factor: 0.02,
  },

  // Office operations
  {
    activity_type_id: 20,
    name: 'Office Paper Usage',
    unit: 'kg',
    emission_factor: 1.1,
  },
  {
    activity_type_id: 21,
    name: 'Employee Remote Work',
    unit: 'days',
    emission_factor: 2.5,
  },

  // Agriculture/Land use
  {
    activity_type_id: 22,
    name: 'Deforestation',
    unit: 'hectares',
    emission_factor: 500000,
  },
  {
    activity_type_id: 23,
    name: 'Fertilizer Use (Nitrogen)',
    unit: 'kg',
    emission_factor: 4.0,
  },

  // Food
  {
    activity_type_id: 24,
    name: 'Beef Consumption',
    unit: 'kg',
    emission_factor: 60,
  },
  {
    activity_type_id: 25,
    name: 'Chicken Consumption',
    unit: 'kg',
    emission_factor: 6,
  },
  {
    activity_type_id: 26,
    name: 'Plant-based Food',
    unit: 'kg',
    emission_factor: 1.5,
  },

  // Industrial processes
  {
    activity_type_id: 27,
    name: 'Cement Production',
    unit: 'tonnes',
    emission_factor: 900,
  },
  {
    activity_type_id: 28,
    name: 'Steel Production',
    unit: 'tonnes',
    emission_factor: 1800,
  },
  {
    activity_type_id: 29,
    name: 'Aluminum Production',
    unit: 'tonnes',
    emission_factor: 16500,
  },

  // Other
  {
    activity_type_id: 30,
    name: 'Solar Panel Manufacturing',
    unit: 'panel',
    emission_factor: 1200,
  },
  {
    activity_type_id: 31,
    name: 'Battery Manufacturing (Li-ion)',
    unit: 'kWh capacity',
    emission_factor: 70,
  },
];
