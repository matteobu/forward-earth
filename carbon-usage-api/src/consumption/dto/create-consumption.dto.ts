import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
