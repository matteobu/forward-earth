import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { ConsumptionService } from './consumption.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';

@Controller('consumption')
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  @Get(':id')
  async getConsumptionInfo(
    @Param('id') user_id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('amountMin') amountMin?: string,
    @Query('amountMax') amountMax?: string,
    @Query('co2Min') co2Min?: number,
    @Query('co2Max') co2Max?: number,
    @Query('activityType') activityType?: number,
  ) {
    const filters: Record<string, any> = { user_id };

    if (amountMin !== undefined) filters['gte_amount'] = +amountMin;
    if (amountMax !== undefined) filters['lte_amount'] = +amountMax;
    if (co2Min !== undefined) filters['gte_co2_equivalent'] = +co2Min;
    if (co2Max !== undefined) filters['lte_co2_equivalent'] = +co2Max;
    if (activityType !== undefined)
      filters['activity_type_table_id'] = +activityType;
    if (dateFrom) filters['gte_date'] = dateFrom;
    if (dateTo) filters['lte_date'] = dateTo;

    interface PaginationOptions {
      user_id: number;
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
      dateFrom?: string;
      dateTo?: string;
      amountMin?: number;
      amountMax?: number;
      co2Min?: number;
      co2Max?: number;
      activityType?: number;
    }

    return await this.consumptionService.getUserConsumption({
      user_id,
      page: page || 1,
      limit: limit || 10,
      sortBy: sortBy || 'date',
      sortOrder: sortOrder || 'ASC',
      dateFrom,
      dateTo,
      amountMin: amountMin ? +amountMin : undefined,
      amountMax: amountMax ? +amountMax : undefined,
      co2Min,
      co2Max,
      activityType,
    } satisfies PaginationOptions);
  }

  @Post('create')
  async create(@Body() createConsumptionDto: CreateConsumptionDto) {
    try {
      const result = await this.consumptionService.create(createConsumptionDto);
      console.log({ result });
      return {
        message: 'Consumption added successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create consumption',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.consumptionService.remove(+id);
      return {
        message: 'Consumption deleted successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to delete consumption',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('patch/:id')
  async patch(@Param('id') id: string, @Body() patchConsumptionDto: any) {
    try {
      const result = await this.consumptionService.patch(
        +id,
        patchConsumptionDto,
      );

      return {
        message: 'Consumption edited successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to edit consumption',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
