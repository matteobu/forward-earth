import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { ActivityTypesModule } from './activity-types/activity-types.module';
import { UnitsModule } from './units/units.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ProductsModule } from './products/products.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    UsersModule,
    ConsumptionModule,
    ActivityTypesModule,
    UnitsModule,
    AuthModule,
    CompaniesModule,
    ProductsModule,
    SupabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
