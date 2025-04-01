import { Controller, Get } from '@nestjs/common';
import { ActivityTypesService } from './activity-types.service';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly activityTypesService: ActivityTypesService) {}

  @Get()
  findAll() {
    return this.activityTypesService.findAll();
  }
}
