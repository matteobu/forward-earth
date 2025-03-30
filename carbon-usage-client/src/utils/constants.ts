import { ActivityType } from './types';

// Activity types with predefined units and CO2 emission factors
export const ACTIVITY_TYPES: ActivityType[] = [
  // Energy consumption
  {
    activity_type_id: 1,
    name: 'Electricity',
    unit: 'kWh',
    emission_factor: 0.5,
  }, // 0.5 kg CO2 per kWh
  {
    activity_type_id: 2,
    name: 'Natural Gas',
    unit: 'm³',
    emission_factor: 2.1,
  }, // 2.1 kg CO2 per cubic meter
  {
    activity_type_id: 3,
    name: 'Heating Oil',
    unit: 'Liters',
    emission_factor: 2.7,
  }, // 2.7 kg CO2 per liter
  { activity_type_id: 4, name: 'Coal', unit: 'kg', emission_factor: 2.42 }, // 2.42 kg CO2 per kg of coal

  // Transportation
  {
    activity_type_id: 5,
    name: 'Company Vehicles - Gasoline',
    unit: 'Liters',
    emission_factor: 2.3,
  }, // 2.3 kg CO2 per liter
  {
    activity_type_id: 6,
    name: 'Company Vehicles - Diesel',
    unit: 'Liters',
    emission_factor: 2.68,
  }, // 2.68 kg CO2 per liter
  {
    activity_type_id: 7,
    name: 'Business Travel - Air (Short Haul)',
    unit: 'km',
    emission_factor: 0.16,
  }, // 0.16 kg CO2 per passenger km
  {
    activity_type_id: 8,
    name: 'Business Travel - Air (Long Haul)',
    unit: 'km',
    emission_factor: 0.11,
  }, // 0.11 kg CO2 per passenger km
  {
    activity_type_id: 9,
    name: 'Business Travel - Rail',
    unit: 'km',
    emission_factor: 0.04,
  }, // 0.04 kg CO2 per passenger km
  {
    activity_type_id: 10,
    name: 'Shipping - Road Freight',
    unit: 'tonne-km',
    emission_factor: 0.11,
  }, // 0.11 kg CO2 per tonne-km

  // Water usage
  {
    activity_type_id: 11,
    name: 'Water Supply',
    unit: 'm³',
    emission_factor: 0.344,
  }, // 0.344 kg CO2 per cubic meter
  {
    activity_type_id: 12,
    name: 'Wastewater Treatment',
    unit: 'm³',
    emission_factor: 0.708,
  }, // 0.708 kg CO2 per cubic meter

  // Waste management
  {
    activity_type_id: 13,
    name: 'Landfill Waste',
    unit: 'kg',
    emission_factor: 0.58,
  }, // 0.58 kg CO2 per kg of waste
  {
    activity_type_id: 14,
    name: 'Recycled Paper',
    unit: 'kg',
    emission_factor: 0.01,
  }, // 0.01 kg CO2 per kg of paper
  {
    activity_type_id: 15,
    name: 'Recycled Plastic',
    unit: 'kg',
    emission_factor: 0.03,
  }, // 0.03 kg CO2 per kg of plastic

  // Manufacturing processes
  {
    activity_type_id: 16,
    name: 'Refrigerant R410A Leakage',
    unit: 'kg',
    emission_factor: 2088,
  }, // 2088 kg CO2e per kg of refrigerant
  {
    activity_type_id: 17,
    name: 'Refrigerant R134a Leakage',
    unit: 'kg',
    emission_factor: 1430,
  }, // 1430 kg CO2e per kg of refrigerant

  // Information technology
  {
    activity_type_id: 18,
    name: 'Data Center Usage',
    unit: 'kWh',
    emission_factor: 0.5,
  }, // 0.5 kg CO2 per kWh
  {
    activity_type_id: 19,
    name: 'Cloud Services',
    unit: 'hours',
    emission_factor: 0.02,
  }, // 0.02 kg CO2 per hour of usage

  // Office operations
  {
    activity_type_id: 20,
    name: 'Office Paper Usage',
    unit: 'kg',
    emission_factor: 1.1,
  }, // 1.1 kg CO2 per kg of paper
  {
    activity_type_id: 21,
    name: 'Employee Remote Work',
    unit: 'days',
    emission_factor: 2.5,
  }, // 2.5 kg CO2 per day of remote work

  // Agriculture/Land use
  {
    activity_type_id: 22,
    name: 'Deforestation',
    unit: 'hectares',
    emission_factor: 500000,
  }, // 500 tonnes CO2 per hectare
  {
    activity_type_id: 23,
    name: 'Fertilizer Use (Nitrogen)',
    unit: 'kg',
    emission_factor: 4.0,
  }, // 4.0 kg CO2e per kg of N fertilizer

  // Food
  {
    activity_type_id: 24,
    name: 'Beef Consumption',
    unit: 'kg',
    emission_factor: 60,
  }, // 60 kg CO2e per kg
  {
    activity_type_id: 25,
    name: 'Chicken Consumption',
    unit: 'kg',
    emission_factor: 6,
  }, // 6 kg CO2e per kg
  {
    activity_type_id: 26,
    name: 'Plant-based Food',
    unit: 'kg',
    emission_factor: 1.5,
  }, // 1.5 kg CO2e per kg

  // Industrial processes
  {
    activity_type_id: 27,
    name: 'Cement Production',
    unit: 'tonnes',
    emission_factor: 900,
  }, // 900 kg CO2 per tonne
  {
    activity_type_id: 28,
    name: 'Steel Production',
    unit: 'tonnes',
    emission_factor: 1800,
  }, // 1800 kg CO2 per tonne
  {
    activity_type_id: 29,
    name: 'Aluminum Production',
    unit: 'tonnes',
    emission_factor: 16500,
  }, // 16500 kg CO2 per tonne

  // Other
  {
    activity_type_id: 30,
    name: 'Solar Panel Manufacturing',
    unit: 'panel',
    emission_factor: 1200,
  }, // 1200 kg CO2 per panel
  {
    activity_type_id: 31,
    name: 'Battery Manufacturing (Li-ion)',
    unit: 'kWh capacity',
    emission_factor: 70,
  }, // 70 kg CO2 per kWh of battery capacity
];

// SIDE BAR CONSTANTS
