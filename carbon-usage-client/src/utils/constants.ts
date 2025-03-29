import { ActivityType } from './types';

// Activity types with predefined units and CO2 emission factors
export const ACTIVITY_TYPES: ActivityType[] = [
  // Energy consumption
  { id: 1, name: 'Electricity', unit: 'kWh', co2: 0.5 }, // 0.5 kg CO2 per kWh
  { id: 2, name: 'Natural Gas', unit: 'm³', co2: 2.1 }, // 2.1 kg CO2 per cubic meter
  { id: 3, name: 'Heating Oil', unit: 'Liters', co2: 2.7 }, // 2.7 kg CO2 per liter
  { id: 4, name: 'Coal', unit: 'kg', co2: 2.42 }, // 2.42 kg CO2 per kg of coal

  // Transportation
  { id: 5, name: 'Company Vehicles - Gasoline', unit: 'Liters', co2: 2.3 }, // 2.3 kg CO2 per liter
  { id: 6, name: 'Company Vehicles - Diesel', unit: 'Liters', co2: 2.68 }, // 2.68 kg CO2 per liter
  { id: 7, name: 'Business Travel - Air (Short Haul)', unit: 'km', co2: 0.16 }, // 0.16 kg CO2 per passenger km
  { id: 8, name: 'Business Travel - Air (Long Haul)', unit: 'km', co2: 0.11 }, // 0.11 kg CO2 per passenger km
  { id: 9, name: 'Business Travel - Rail', unit: 'km', co2: 0.04 }, // 0.04 kg CO2 per passenger km
  { id: 10, name: 'Shipping - Road Freight', unit: 'tonne-km', co2: 0.11 }, // 0.11 kg CO2 per tonne-km

  // Water usage
  { id: 11, name: 'Water Supply', unit: 'm³', co2: 0.344 }, // 0.344 kg CO2 per cubic meter
  { id: 12, name: 'Wastewater Treatment', unit: 'm³', co2: 0.708 }, // 0.708 kg CO2 per cubic meter

  // Waste management
  { id: 13, name: 'Landfill Waste', unit: 'kg', co2: 0.58 }, // 0.58 kg CO2 per kg of waste
  { id: 14, name: 'Recycled Paper', unit: 'kg', co2: 0.01 }, // 0.01 kg CO2 per kg of paper
  { id: 15, name: 'Recycled Plastic', unit: 'kg', co2: 0.03 }, // 0.03 kg CO2 per kg of plastic

  // Manufacturing processes
  { id: 16, name: 'Refrigerant R410A Leakage', unit: 'kg', co2: 2088 }, // 2088 kg CO2e per kg of refrigerant
  { id: 17, name: 'Refrigerant R134a Leakage', unit: 'kg', co2: 1430 }, // 1430 kg CO2e per kg of refrigerant

  // Information technology
  { id: 18, name: 'Data Center Usage', unit: 'kWh', co2: 0.5 }, // 0.5 kg CO2 per kWh
  { id: 19, name: 'Cloud Services', unit: 'hours', co2: 0.02 }, // 0.02 kg CO2 per hour of usage

  // Office operations
  { id: 20, name: 'Office Paper Usage', unit: 'kg', co2: 1.1 }, // 1.1 kg CO2 per kg of paper
  { id: 21, name: 'Employee Remote Work', unit: 'days', co2: 2.5 }, // 2.5 kg CO2 per day of remote work

  // Agriculture/Land use
  { id: 22, name: 'Deforestation', unit: 'hectares', co2: 500000 }, // 500 tonnes CO2 per hectare
  { id: 23, name: 'Fertilizer Use (Nitrogen)', unit: 'kg', co2: 4.0 }, // 4.0 kg CO2e per kg of N fertilizer

  // Food
  { id: 24, name: 'Beef Consumption', unit: 'kg', co2: 60 }, // 60 kg CO2e per kg
  { id: 25, name: 'Chicken Consumption', unit: 'kg', co2: 6 }, // 6 kg CO2e per kg
  { id: 26, name: 'Plant-based Food', unit: 'kg', co2: 1.5 }, // 1.5 kg CO2e per kg

  // Industrial processes
  { id: 27, name: 'Cement Production', unit: 'tonnes', co2: 900 }, // 900 kg CO2 per tonne
  { id: 28, name: 'Steel Production', unit: 'tonnes', co2: 1800 }, // 1800 kg CO2 per tonne
  { id: 29, name: 'Aluminum Production', unit: 'tonnes', co2: 16500 }, // 16500 kg CO2 per tonne

  // Other
  { id: 30, name: 'Solar Panel Manufacturing', unit: 'panel', co2: 1200 }, // 1200 kg CO2 per panel
  {
    id: 31,
    name: 'Battery Manufacturing (Li-ion)',
    unit: 'kWh capacity',
    co2: 70,
  }, // 70 kg CO2 per kWh of battery capacity
];
