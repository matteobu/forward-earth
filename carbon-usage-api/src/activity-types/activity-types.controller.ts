import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivityTypesService } from './activity-types.service';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';

@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly activityTypesService: ActivityTypesService) {}

  @Post()
  create(@Body() createActivityTypeDto: CreateActivityTypeDto) {
    return this.activityTypesService.create(createActivityTypeDto);
  }

  @Get()
  findAll() {
    return this.activityTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityTypeDto: UpdateActivityTypeDto) {
    return this.activityTypesService.update(+id, updateActivityTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityTypesService.remove(+id);
  }
}
