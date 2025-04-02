import { Controller, Get } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  // TOIMPROVE: Give the user with admin role the authorization to add new Unit

  @Get()
  findAll() {
    return this.unitsService.findAll();
  }
}
