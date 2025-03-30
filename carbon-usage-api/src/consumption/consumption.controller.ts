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

  @Get(':id') // Get all consumptions based on the user_id
  async getConsumptionInfo(@Param('id') user_id: number) {
    const consumption: Consumption[] =
      await this.consumptionService.getUserConsumption(user_id);
    return consumption;
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
