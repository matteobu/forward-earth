import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Min,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class UnitTableDto {
  @ApiProperty({ description: 'Unit ID', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Unit name', example: 'ton-km' })
  @IsNotEmpty()
  name: string;
}

class ActivityTableDto {
  @ApiProperty({ description: 'Activity ID', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Activity name',
    example: 'Shipping - Road Freight',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Emission factor', example: 0.11 })
  @IsNumber()
  @IsNotEmpty()
  emission_factor: number;

  @ApiProperty({ description: 'Activity type ID', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  activity_type_id: number;
}

export class CreateConsumptionDto {
  @ApiProperty({ description: 'User ID', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Amount of consumption', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Activity type table ID', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  activity_type_table_id: number;

  @ApiProperty({ description: 'Date of consumption', example: '2025-04-01' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'CO2 equivalent in kg/tons', example: 0.22 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  co2_equivalent: number;

  @ApiProperty({ description: 'Unit ID', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  unit_id: number;

  @ApiPropertyOptional({ description: 'Unit table details' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UnitTableDto)
  unit_table?: UnitTableDto;

  @ApiPropertyOptional({ description: 'Activity table details' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ActivityTableDto)
  activity_table?: ActivityTableDto;
}
