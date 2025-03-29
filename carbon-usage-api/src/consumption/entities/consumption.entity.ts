export class Consumption {
  id: number;
  user_id: number;
  amount: number;
  activity_type_id: number;
  unit_id: number;
  co2_equivalent: number;
  date: Date;
  created_at: string;
  deleted_at: string | null;
}
