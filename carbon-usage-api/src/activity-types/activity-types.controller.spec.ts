import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypesController } from './activity-types.controller';
import { ActivityTypesService } from './activity-types.service';

describe('ActivityTypesController', () => {
  let controller: ActivityTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityTypesController],
      providers: [ActivityTypesService],
    }).compile();

    controller = module.get<ActivityTypesController>(ActivityTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
