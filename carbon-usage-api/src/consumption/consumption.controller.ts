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
import {
  CreateConsumptionDto,
  PatchConsumptionDto,
} from './dto/create-consumption.dto';
import { Consumption } from './entities/consumption.entity';

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
    @Query('activityType') activityType?: number,
  ) {
    const hasAdvancedParams =
      page !== undefined ||
      limit !== undefined ||
      sortBy !== undefined ||
      sortOrder !== undefined ||
      dateFrom !== undefined ||
      dateTo !== undefined ||
      activityType !== undefined;

    if (!hasAdvancedParams) {
      const consumption: Consumption[] =
        await this.consumptionService.getUserConsumption(user_id);
      return consumption;
    }

    const result = await this.consumptionService.getUserConsumptionPaginated({
      user_id,
      page: page || 1,
      limit: limit || 10,
      sortBy: sortBy || 'date',
      sortOrder: sortOrder || 'DESC',
      dateFrom,
      dateTo,
      activityType: activityType ? +activityType : undefined,
    });

    return result;
  }

  @Post('create')
  async create(@Body() createConsumptionDto: CreateConsumptionDto) {
    try {
      const result = await this.consumptionService.create(createConsumptionDto);

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
    return this.consumptionService.remove(+id);
  }

  @Patch('patch/:id')
  async patch(
    @Param('id') id: string,
    @Body() patchConsumptionDto: PatchConsumptionDto,
  ) {
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
