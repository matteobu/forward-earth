export type ActivityType = {
  id: number;
  name: string;
  emission_factor: number;
  unit?: string;
};

export type Consumption = {
  id: number;
  user_id: number;
  amount: number;
  activity_type_table_id: number;
  unit_id: number;
  co2_equivalent: number;
  date: string;
  created_at: string;
  unit_table: Unit;
  activity_table: ActivityType;
};

export type Unit = {
  id: number;
  name: string;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ConsumptionPatchPayload extends Partial<Consumption> {
  activity_type_name?: string;
  emission_factor?: number;
  unit?: string;
}
