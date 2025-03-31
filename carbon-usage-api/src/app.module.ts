import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { ActivityTypesModule } from './activity-types/activity-types.module';
import { UnitsModule } from './units/units.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    UsersModule,
    ConsumptionModule,
    ActivityTypesModule,
    UnitsModule,
    AuthModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
