export const ACTIVITY_TYPE_UNIT_MOCKED = [
  // Production Activity
  { activityType: 'Metal Casting Process', unit: 'kg' },
  { activityType: 'Plastic Injection Molding', unit: 'kg' },
  { activityType: 'Wood Treatment Process', unit: 'kg' },
  { activityType: 'Electronic Assembly', unit: 'hours' },
  { activityType: 'Food Processing', unit: 'kg' },
  { activityType: 'Textile Manufacturing', unit: 'kg' },
  { activityType: 'Glass Production', unit: 'kg' },
  { activityType: 'Paper Manufacturing', unit: 'tonnes' },
  { activityType: 'Ceramic Production', unit: 'kg' },
  { activityType: 'Chemical Processing', unit: 'liters' },

  // Energy
  { activityType: 'Electricity Consumption', unit: 'kWh' },
  { activityType: 'Natural Gas Usage', unit: 'mc' },
  { activityType: 'Diesel Generator', unit: 'liters' },
  { activityType: 'Factory Heating', unit: 'kWh' },

  // Transports
  { activityType: 'Company Cars - Petrol', unit: 'km' },
  { activityType: 'Company Cars - Diesel', unit: 'km' },
  { activityType: 'Company Cars - Electric', unit: 'km' },
  { activityType: 'Delivery Trucks', unit: 'km' },
  { activityType: 'Business Air Travel', unit: 'passenger-km' },
  { activityType: 'Business Train Travel', unit: 'passenger-km' },

  // Waste and Materials
  { activityType: 'Industrial Waste Disposal', unit: 'tonnes' },
  { activityType: 'Packaging Materials', unit: 'kg' },
  { activityType: 'Office Paper Consumption', unit: 'kg' },
  { activityType: 'Office Supplies', unit: 'kg' },

  //  Corporate Resources
  { activityType: 'Water Consumption', unit: 'mc' },
  { activityType: 'Data Center Operations', unit: 'kWh' },
  { activityType: 'Employee Commuting', unit: 'km' },
  { activityType: 'Company Events', unit: 'participant-days' },
  { activityType: 'Refrigerant Leakage', unit: 'kg' },
  { activityType: 'Office Electronics', unit: 'units' },
];

// TAble ActivityTypeTable (id, emission_factor, name)
export const ActivityTypeTable = [
  { id: 1, emission_factor: 1.8, name: 'Metal Casting Process' },
  { id: 2, emission_factor: 3.5, name: 'Plastic Injection Molding' },
  { id: 3, emission_factor: 0.7, name: 'Wood Treatment Process' },
  { id: 4, emission_factor: 0.4, name: 'Electronic Assembly' },
  { id: 5, emission_factor: 2.5, name: 'Food Processing' },
  { id: 6, emission_factor: 1.2, name: 'Textile Manufacturing' },
  { id: 7, emission_factor: 0.9, name: 'Glass Production' },
  { id: 8, emission_factor: 1.1, name: 'Paper Manufacturing' },
  { id: 9, emission_factor: 1.3, name: 'Ceramic Production' },
  { id: 10, emission_factor: 2.7, name: 'Chemical Processing' },
  { id: 11, emission_factor: 0.4, name: 'Electricity Consumption' },
  { id: 12, emission_factor: 2.3, name: 'Natural Gas Usage' },
  { id: 13, emission_factor: 2.7, name: 'Diesel Generator' },
  { id: 14, emission_factor: 0.3, name: 'Factory Heating' },
  { id: 15, emission_factor: 0.16, name: 'Company Cars - Petrol' },
  { id: 16, emission_factor: 0.14, name: 'Company Cars - Diesel' },
  { id: 17, emission_factor: 0.05, name: 'Company Cars - Electric' },
  { id: 18, emission_factor: 0.9, name: 'Delivery Trucks' },
  { id: 19, emission_factor: 0.25, name: 'Business Air Travel' },
  { id: 20, emission_factor: 0.04, name: 'Business Train Travel' },
  { id: 21, emission_factor: 0.5, name: 'Industrial Waste Disposal' },
  { id: 22, emission_factor: 0.1, name: 'Packaging Materials' },
  { id: 23, emission_factor: 0.8, name: 'Office Paper Consumption' },
  { id: 24, emission_factor: 0.3, name: 'Office Supplies' },
  { id: 25, emission_factor: 0.3, name: 'Water Consumption' },
  { id: 26, emission_factor: 0.5, name: 'Data Center Operations' },
  { id: 27, emission_factor: 0.17, name: 'Employee Commuting' },
  { id: 28, emission_factor: 0.1, name: 'Company Events' },
  { id: 29, emission_factor: 4000, name: 'Refrigerant Leakage' },
  { id: 30, emission_factor: 80, name: 'Office Electronics' },
];

// Table UnitTable (id, name)
export const UnitTable = [
  { id: 1, name: 'kg' },
  { id: 2, name: 'tonnes' },
  { id: 3, name: 'liters' },
  { id: 4, name: 'kWh' },
  { id: 5, name: 'mc' },
  { id: 6, name: 'km' },
  { id: 7, name: 'passenger-km' },
  { id: 8, name: 'hours' },
  { id: 9, name: 'participant-days' },
  { id: 10, name: 'units' },
];

export const ACTIVITY_CATEGORIES = {
  Energy: [
    'Electricity Consumption',
    'Natural Gas Usage',
    'Factory Heating',
    'Diesel Generator',
  ],
  Transports: [
    'Company Cars - Petrol',
    'Company Cars - Diesel',
    'Company Cars - Electric',
    'Business Air Travel',
    'Business Train Travel',
    'Delivery Trucks',
    'Employee Commuting',
  ],
  Production: [
    'Metal Casting Process',
    'Plastic Injection Molding',
    'Wood Treatment Process',
    'Electronic Assembly',
    'Food Processing',
    'Textile Manufacturing',
    'Glass Production',
    'Paper Manufacturing',
    'Ceramic Production',
    'Chemical Processing',
  ],
  'Waste & Materials': [
    'Industrial Waste Disposal',
    'Packaging Materials',
    'Office Paper Consumption',
    'Office Supplies',
  ],
  Water: ['Water Consumption'],
  Other: [
    'Refrigerant Leakage',
    'Data Center Operations',
    'Company Events',
    'Office Electronics',
  ],
};


export const CHART_COLORS = [
  '#4F46E5', // primary blue
  '#F97316', // orange
  '#10B981', // green
  '#F43F5E', // pink
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // hot pink
  '#06B6D4', // cyan
  '#EF4444', // red
  '#84CC16', // lime
];
