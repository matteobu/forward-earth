import { Injectable } from '@nestjs/common';
import {
  CreateConsumptionDto,
  PatchConsumptionDto,
} from './dto/create-consumption.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ConsumptionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createConsumptionDto: CreateConsumptionDto) {
    return this.supabaseService.createConsumption({
      user_id: createConsumptionDto.user_id,
      amount: createConsumptionDto.amount,
      activity_type_id: createConsumptionDto.activity_type_id,
      activity_name: createConsumptionDto.activity_name,
      emission_factor: createConsumptionDto.emission_factor,
      date: createConsumptionDto.date,
      co2_equivalent: createConsumptionDto.co2_equivalent,
      unit: createConsumptionDto.unit,
    });
  }

  async patch(id: number, patchConsumptionDto: PatchConsumptionDto) {
    return this.supabaseService.updateUserConsumption(id, patchConsumptionDto);
  }

  remove(id: number) {
    return this.supabaseService.deleteUserConsumption(id);
  }

  async getUserConsumption(user_id: number) {
    return this.supabaseService.getUserConsumption(user_id);
  }

  async getUserConsumptionPaginated(params: {
    user_id: number;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    co2Min?: number;
    co2Max?: number;
    activityType?: number;
  }) {
    try {
      const filters: Record<string, any> = {
        user_id: params.user_id,
      };

      if (params.dateFrom) {
        filters['gte_date'] = params.dateFrom;
      }

      if (params.dateTo) {
        filters['lte_date'] = params.dateTo;
      }

      if (params.activityType) {
        filters['activity_type_table_id'] = params.activityType;
      }

      if (params.amountMin !== undefined) {
        filters['gte_amount'] = params.amountMin;
      }

      if (params.amountMax !== undefined) {
        filters['lte_amount'] = params.amountMax;
      }

      const isNestedField = params.sortBy.includes('.');

      const orderBy = isNestedField ? 'date' : params.sortBy;

      const result = await this.supabaseService.getPaginatedData(
        'ConsumptionTable',
        {
          select: '*, ActivityTypeTable(*), UnitTable(*)',
          filters,
          page: params.page,
          limit: params.limit,
          orderBy: orderBy,
          ascending: params.sortOrder === 'ASC',
        },
      );

      let sortedData = result.data;
      if (isNestedField) {
        const [table, field] = params.sortBy.split('.');
        sortedData = [...result.data].sort((a, b) => {
          const valueA = a[table]?.[field];
          const valueB = b[table]?.[field];

          if (params.sortOrder === 'ASC') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        });
      }

      const processedData = sortedData
        .map(
          (consumption: {
            amount: number;
            activity_table?: { emission_factor: number };
            [key: string]: any;
          }) => {
            if (
              consumption.amount &&
              consumption.activity_table &&
              consumption.activity_table.emission_factor
            ) {
              const co2_equivalent =
                consumption.amount * consumption.activity_table.emission_factor;
              return {
                ...consumption,
                co2_equivalent: co2_equivalent,
              };
            }
            return consumption;
          },
        )
        .filter((consumption) => {
          if (!consumption.co2_equivalent) return true;

          if (
            params.co2Min !== undefined &&
            consumption.co2_equivalent < params.co2Min
          ) {
            return false;
          }

          if (
            params.co2Max !== undefined &&
            consumption.co2_equivalent > params.co2Max
          ) {
            return false;
          }

          return true;
        });

      if (params.co2Min !== undefined || params.co2Max !== undefined) {
        const totalAfterCO2Filter = processedData.length;

        const totalPagesAfterFilter = Math.ceil(
          totalAfterCO2Filter / params.limit,
        );

        return {
          data: processedData,
          meta: {
            ...result.meta,
            total: totalAfterCO2Filter,
            totalPages: totalPagesAfterFilter,
          },
        };
      }

      return {
        data: processedData,
        meta: result.meta,
      };
    } catch (error) {
      console.error('Error in getUserConsumptionPaginated:', error);
      throw error;
    }
  }
}
