import { Module } from '@nestjs/common';
import { ActivityTypesService } from './activity-types.service';
import { ActivityTypesController } from './activity-types.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ActivityTypesController],
  providers: [ActivityTypesService],
})
export class ActivityTypesModule {}
