import { Controller, Get } from '@nestjs/common';
import { ActivityTypesService } from './activity-types.service';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly activityTypesService: ActivityTypesService) {}

  // TODO: Give the user with admin role the authorization to add new ActivityType

  @Get()
  findAll() {
    return this.activityTypesService.findAll();
  }
}
