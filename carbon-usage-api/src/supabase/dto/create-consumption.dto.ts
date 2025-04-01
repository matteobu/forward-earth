import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupabaseConsumptionDto {
  @ApiProperty({ description: 'User ID', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Amount of consumption', example: 5555 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Activity type ID', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  activity_type_id: number;

  @ApiProperty({
    description: 'Activity name',
    example: 'Company Vehicles - Gasoline',
  })
  @IsNotEmpty()
  @IsString()
  activity_name?: string;

  @ApiProperty({ description: 'Emission factor', example: 2.3 })
  @IsNotEmpty()
  @IsNumber()
  emission_factor?: number;

  @ApiProperty({ description: 'Date of consumption', example: '2025-04-01' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'CO2 equivalent', example: 12776.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  co2_equivalent: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'km' })
  @IsNotEmpty()
  @IsString()
  unit?: string;
}
