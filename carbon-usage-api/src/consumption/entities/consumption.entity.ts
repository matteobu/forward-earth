export class Consumption {
  id: number;
  user_id: number;
  amount: number;
  activity_type_table_id: number;
  unit_id: number;
  co2_equivalent: number;
  date: Date;
  created_at: string;
  deleted_at: string | null;
  unit_table: UnitTable;
  activity_table: ActivityTable;
}

export class UnitTable {
  id: number;
  name: string;
}
export class ActivityTable {
  id: number;
  name: string;
  emission_factor: number;
  activity_type_id: number;
}
