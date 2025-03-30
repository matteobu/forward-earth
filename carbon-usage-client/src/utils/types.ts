export type ActivityType = {
  id: number;
  name: string;
  co2: number;
  unit: string;
};

export type Consumption = {
  id: number;
  user_id: number;
  amount: number;
  activity_type_id: number;
  unit_id: number;
  co2_equivalent: number;
  date: string;
  created_at: string;
  unit_name: string;
};

export type Unit = {
  id: number;
  name: string;
};

export interface ConsumptionPatchPayload extends Partial<Consumption> {
  activity_type_name?: string;
  emission_factor?: number;
  unit?: string;
}
