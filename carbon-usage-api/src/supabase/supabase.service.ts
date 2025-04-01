import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { User } from 'src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import {
  ActivityTable,
  Consumption,
  UnitTable,
} from 'src/consumption/entities/consumption.entity';

import { ActivityTypeTable } from '../activity-types/entities/activity-type.entity';
import { SupabaseConsumptionDto } from './dto/create-consumption.dto';

dotenv.config();

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || '',
    );
  }

  // ***
  // USER ROUTE
  // ***
  // Function to get user from Supabase by email
  async getUserByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error('Error fetching user from Supabase');
    }

    return data as User;
  }

  async createUser(name: string, email: string) {
    const { data, error } = await this.supabase
      .from('Users')
      .insert([{ name, email }])
      .single();

    if (error) {
      throw new Error('Error creating user in Supabase');
    }
    return data as User;
  }

  // ***
  // ACTIVITY TYPE ROUTE
  // ***
  async getAllActivityType() {
    const { data: activityTypeTableData, error: activityTypeTableError } =
      await this.supabase.from('ActivityTypeTable').select('*');

    if (activityTypeTableError) {
      console.error('Error fetching consumptions:', activityTypeTableError);
      throw new Error(
        `Error fetching consumptions: ${activityTypeTableError.message}`,
      );
    }
    return activityTypeTableData as ActivityTypeTable;
  }

  // ***
  // UNIT ROUTE
  // ***
  async getAllUnit() {
    const { data: unitTableData, error: unitTableError } = await this.supabase
      .from('UnitTable')
      .select('*');

    if (unitTableError) {
      console.error('Error fetching consumptions:', unitTableError);
      throw new Error(`Error fetching consumptions: ${unitTableError.message}`);
    }
    return unitTableData as { id: number; name: string };
  }

  // ***
  // CONSUMPTION ROUTE
  // ***
  async getUserConsumption(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, any>;
      page: number;
      limit: number;
      orderBy?: string;
      ascending?: boolean;
      extraQuery?: (query: any) => any;
    },
  ) {
    try {
      const {
        select = '*',
        filters = {},
        page,
        limit,
        orderBy,
        ascending = true,
        extraQuery,
      } = options;

      const pageNum = typeof page === 'string' ? parseInt(page, 10) : page || 1;
      const limitNum =
        typeof limit === 'string' ? parseInt(limit, 10) : limit || 10;

      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      const processedFilters = { ...filters };

      const numericFilterKeys = [
        'lte_amount',
        'gte_amount',
        'lte_co2_equivalent',
        'gte_co2_equivalent',
      ];
      numericFilterKeys.forEach((key) => {
        if (filters[key] !== undefined) {
          processedFilters[key] =
            typeof filters[key] === 'string'
              ? parseFloat(filters[key])
              : filters[key];
        }
      });

      let query = this.supabase.from(table).select(select, { count: 'exact' });

      for (const [key, value] of Object.entries(processedFilters)) {
        if (value !== undefined && value !== null) {
          if (key.startsWith('gte_')) {
            const field = key.replace('gte_', '');
            query = query.gte(field, Number(value));
          } else if (key.startsWith('lte_')) {
            const field = key.replace('lte_', '');
            query = query.lte(field, Number(value));
          } else {
            query = query.eq(key, value);
          }
        }
      }

      if (extraQuery) {
        query = extraQuery(query);
      }

      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Error fetching paginated data: ${error.message}`);
      }

      const transformedData = data.map((item) => {
        const transformed = { ...item };

        if (transformed.ActivityTypeTable) {
          transformed.activity_table = transformed.ActivityTypeTable;
          delete transformed.ActivityTypeTable;
        }

        if (transformed.UnitTable) {
          transformed.unit_table = transformed.UnitTable;
          delete transformed.UnitTable;
        }

        return transformed as Consumption;
      });

      if (!isConsumptionArray(transformedData)) {
        throw new Error('Transformed data does not match the expected format.');
      }

      return {
        data: transformedData,
        meta: {
          total: count || 0,
          page: pageNum,
          limit: limitNum,
          totalPages: count ? Math.ceil(count / limitNum) : 0,
        },
      };
    } catch (error) {
      console.error('Error in getUserConsumption:', error);
      throw error;
    }
  }

  async createConsumption(consumptionData: SupabaseConsumptionDto) {
    // FIXME: Here the table has Liters instead of liters
    consumptionData.unit =
      consumptionData.unit === 'liters' ? 'Liters' : consumptionData.unit;

    const { data: unitData, error: unitError } = await this.supabase
      .from('UnitTable')
      .select('id')
      .eq('name', consumptionData.unit);

    const firstUnit = unitData?.[0];

    if (unitError) {
      throw new Error(`Error creating unit: ${unitError.message}`);
    }
    const unitId = firstUnit;
    const { data: lastRecord, error: lastRecordError } = await this.supabase
      .from('ConsumptionTable')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (lastRecordError) {
      throw new Error(`Error creating unit: ${lastRecordError.message}`);
    }

    const newId = lastRecord ? lastRecord.id + 1 : 1;

    const { data, error } = await this.supabase
      .from('ConsumptionTable')
      .insert([
        {
          id: newId,
          user_id: consumptionData.user_id,
          amount: consumptionData.amount,
          activity_type_table_id: consumptionData.activity_type_id,
          unit_id: unitId.id,
          co2_equivalent: consumptionData.co2_equivalent,
          date: consumptionData.date,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error creating consumption: ${error.message}`);
    }
    return data[0] as {
      id: number;
      user_id: number;
      amount: number;
      activity_type_table_id: number;
      unit_id: number;
      co2_equivalent: number;
      date: string;
      unit_name: string;
      created_at: string;
    };
  }

  async deleteUserConsumption(consumption_id: number) {
    try {
      const { error: consumptionError } = await this.supabase
        .from('ConsumptionTable')
        .delete()
        .eq('id', consumption_id);

      if (consumptionError) {
        throw new Error(
          `Error deleting consumption: ${consumptionError.message}`,
        );
      }

      return { success: true, id: consumption_id };
    } catch (error) {
      console.error('Error in deletion process:', error);
      throw error;
    }
  }

  async updateUserConsumption(id: number, patchConsumptionDto: any) {
    try {
      const { data: currentConsumption, error: fetchError } =
        await this.supabase
          .from('ConsumptionTable')
          .select(
            '*, UnitTable(id, name), ActivityTypeTable(id, name, emission_factor)',
          )
          .eq('id', id)
          .single();

      if (fetchError) {
        throw new Error(
          `Error fetching current consumption: ${fetchError.message}`,
        );
      }

      if (
        patchConsumptionDto.activity_type_name ||
        patchConsumptionDto.emission_factor
      ) {
        const updateFields: any = {};

        if (patchConsumptionDto.activity_type_name) {
          updateFields.name = patchConsumptionDto.activity_type_name;
        }

        if (patchConsumptionDto.emission_factor) {
          updateFields.emission_factor = patchConsumptionDto.emission_factor;
        }

        if (Object.keys(updateFields).length > 0) {
          const { error: updateError } = await this.supabase
            .from('ActivityTypeTable')
            .update(updateFields)
            .eq('id', currentConsumption.activity_type_table_id);

          if (updateError) {
            throw new Error(
              `Error updating activity type: ${updateError.message}`,
            );
          }
        }
      }

      if (
        patchConsumptionDto.unit &&
        patchConsumptionDto.unit !== currentConsumption.UnitTable.name
      ) {
        const { error: updateError } = await this.supabase
          .from('UnitTable')
          .update({ name: patchConsumptionDto.unit })
          .eq('id', currentConsumption.UnitTable.id);

        if (updateError) {
          throw new Error(`Error updating unit: ${updateError.message}`);
        }
      }

      const updateData: any = {};

      if (patchConsumptionDto.amount !== undefined) {
        updateData.amount = patchConsumptionDto.amount;
      }

      if (patchConsumptionDto.co2_equivalent !== undefined) {
        updateData.co2_equivalent = patchConsumptionDto.co2_equivalent;
      }

      if (patchConsumptionDto.date !== undefined) {
        updateData.date = patchConsumptionDto.date;
      }

      if (Object.keys(updateData).length > 0) {
        const { data, error } = await this.supabase
          .from('ConsumptionTable')
          .update(updateData)
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(`Error updating consumption: ${error.message}`);
        }

        return data[0] as Consumption;
      }
      const transformedConsumption = {
        ...currentConsumption,
        unit_table: currentConsumption.UnitTable,
        activity_table: currentConsumption.ActivityTypeTable,
      };
      delete transformedConsumption.UnitTable;
      delete transformedConsumption.ActivityTypeTable;

      return transformedConsumption as Consumption;
    } catch (error) {
      console.error('Error in updateUserConsumption:', error);
      throw error;
    }
  }

  // ***
  // COMPANY ROUTE
  // ***
  async getCompanyData(userId: number) {
    const { data: companyData, error: companyError } = await this.supabase
      .from('CompanyTable')
      .select('*')
      .eq('user_id', userId);

    if (companyError) {
      throw new Error(`Error deleting consumption: ${companyError.message}`);
    }

    // FIXME:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return companyData;
  }

  // ***
  // PRODUCTS ROUTE
  // ***
  async getProductsData() {
    const { data: productsData, error: productsError } = await this.supabase
      .from('ProductTable')
      .select('*');

    if (productsError) {
      throw new Error(`Error deleting consumption: ${productsError.message}`);
    }

    // FIXME:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return productsData;
  }
}

function isConsumptionArray(data: any): data is Consumption[] {
  return Array.isArray(data) && data.every(isConsumption);
}

function isConsumption(item: any): item is Consumption {
  return (
    typeof item.id === 'number' &&
    typeof item.user_id === 'number' &&
    typeof item.amount === 'number' &&
    typeof item.activity_type_table_id === 'number' &&
    typeof item.unit_id === 'number' &&
    typeof item.co2_equivalent === 'number' &&
    typeof item.date === 'string' &&
    typeof item.created_at === 'string' &&
    (item.deleted_at === null || typeof item.deleted_at === 'string') &&
    isUnitTable(item.unit_table) &&
    isActivityTable(item.activity_table)
  );
}

function isUnitTable(item: any): item is UnitTable {
  return typeof item.id === 'number' && typeof item.name === 'string';
}

function isActivityTable(item: any): item is ActivityTable {
  return (
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.emission_factor === 'number'
  );
}
