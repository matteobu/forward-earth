import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserConsumption {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}

export class CreateConsumptionDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Amount of consumption', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Activity type ID', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  activity_type_id: number;

  @ApiProperty({
    description: 'Activity type name',
    example: 'Company Vehicles - Gasoline',
  })
  @IsNotEmpty()
  @IsString()
  activity_name: string;

  @ApiProperty({ description: 'emission factor', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  emission_factor: number;

  @ApiProperty({ description: 'Date of consumption', example: '2025-03-29' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'CO2 equivalent in kg/tons', example: 6.3 })
  @IsNotEmpty()
  @IsNumber()
  co2_equivalent: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'm³' })
  @IsNotEmpty()
  @IsString()
  unit: string;
}

export class PatchConsumptionDto {
  @ApiPropertyOptional({ description: 'Amount of consumption', example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ description: 'Activity type ID', example: 2 })
  @IsOptional()
  @IsNumber()
  activity_type_id?: number;

  @ApiPropertyOptional({
    description: 'Date of consumption',
    example: '2025-03-29',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'CO2 equivalent in kg/tons',
    example: 6.3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  co2_equivalent?: number;

  @ApiPropertyOptional({
    description: 'Activity type name',
    example: 'Electricity',
  })
  @IsOptional()
  @IsString()
  activity_type_name?: string;

  @ApiPropertyOptional({
    description: 'Emission factor',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  emission_factor?: number;

  @ApiPropertyOptional({
    description: 'Unit of measurement',
    example: 'kWh',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Unit ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  unit_id?: number;
}
