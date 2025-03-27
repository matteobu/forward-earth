import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { ActivityTypesModule } from './activity-types/activity-types.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [UsersModule, ConsumptionModule, ActivityTypesModule, UnitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
