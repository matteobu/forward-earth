import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateConsumptionDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  co2_equivalent?: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumber()
  activity_type_table_id?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  emission_factor?: number;
}
