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
import { UpdateConsumptionDto } from 'src/consumption/dto/update-consumption.dto';

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

  // TOIMPROVE: Not implemented now
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

            if (field === 'date') {
              query = query.gte(field, value);
            } else {
              query = query.gte(field, Number(value));
            }
          } else if (key.startsWith('lte_')) {
            const field = key.replace('lte_', '');

            if (field === 'date') {
              query = query.lte(field, value);
            } else {
              query = query.lte(field, Number(value));
            }
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
          activity_type_table_id: consumptionData.activity_type_table_id,
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

  async updateUserConsumption(
    id: number,
    patchConsumptionDto: UpdateConsumptionDto,
  ) {
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

      const updateData: {
        amount?: number;
        co2_equivalent?: number;
        date?: string;
        activity_type_table_id?: number;
        unit_id?: number;
      } = {};

      if (patchConsumptionDto.amount !== undefined) {
        updateData.amount = patchConsumptionDto.amount;
      }

      if (patchConsumptionDto.co2_equivalent !== undefined) {
        updateData.co2_equivalent = patchConsumptionDto.co2_equivalent;
      }

      if (patchConsumptionDto.date !== undefined) {
        updateData.date = patchConsumptionDto.date;
      }

      if (patchConsumptionDto.activity_type_table_id !== undefined) {
        updateData.activity_type_table_id =
          patchConsumptionDto.activity_type_table_id;
      }

      if (patchConsumptionDto.unit !== undefined) {
        const { data: unitData, error: unitError } = await this.supabase
          .from('UnitTable')
          .select('id')
          .eq('name', patchConsumptionDto.unit)
          .single();

        if (unitError) {
          console.error('Error finding unit:', unitError);
        } else if (unitData) {
          // Use unit_id as per your schema
          updateData.unit_id = unitData.id;
        }
      }

      if (Object.keys(updateData).length > 0) {
        const { data, error } = await this.supabase
          .from('ConsumptionTable')
          .update(updateData)
          .eq('id', id)
          .select(
            '*, UnitTable(id, name), ActivityTypeTable(id, name, emission_factor)',
          );

        if (error) {
          console.error('Update failed with error:', error);
          throw new Error(`Error updating consumption: ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.error('No data returned after update');
          throw new Error('No data returned after update');
        }

        const transformedConsumption = {
          ...data[0],
          unit_table: data[0].UnitTable,
          activity_table: data[0].ActivityTypeTable,
        };
        delete transformedConsumption.UnitTable;
        delete transformedConsumption.ActivityTypeTable;

        return transformedConsumption as Consumption;
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return productsData;
  }

  // ***
  // PRODUCTION ROUTE
  // ***
  async getProductionData() {
    const { data: productionData, error: productionError } = await this.supabase
      .from('ProductionTable')
      .select('*');

    if (productionError) {
      throw new Error(
        `Error fetching production data: ${productionError.message}`,
      );
    }

    if (!productionData || !Array.isArray(productionData)) {
      throw new Error(
        'Invalid data format: expected an array of production records',
      );
    }

    const validatedData = productionData.map((record, index) => {
      if (!record.id) {
        console.warn(
          `Record at index ${index} missing id, skipping validation`,
        );
        return {
          id: record.id || '',
          product_id: record.product_id || '',
          batch_number: record.batch_number || '',
          production_date: record.production_date || '',
          total_units: record.total_units || 0,
          production_efficiency: record.production_efficiency || 0,
        };
      }

      const validRecord = {
        id: this.validateField(record.id, 'id', ['string', 'number']),
        product_id: this.validateField(record.product_id, 'product_id', [
          'string',
        ]),
        batch_number: this.validateField(record.batch_number, 'batch_number', [
          'string',
        ]),
        production_date: this.validateField(
          record.production_date,
          'production_date',
          ['string'],
        ),
        total_units: this.validateField(record.total_units, 'total_units', [
          'number',
        ]),
        production_efficiency: this.validateField(
          record.production_efficiency,
          'production_efficiency',
          ['number'],
        ),
      };

      if (
        validRecord.production_efficiency < 0 ||
        validRecord.production_efficiency > 1
      ) {
        console.warn(
          `Record ${record.id}: production_efficiency outside valid range (0-1)`,
        );
        validRecord.production_efficiency = Math.max(
          0,
          Math.min(1, validRecord.production_efficiency),
        );
      }

      if (validRecord.total_units < 0) {
        console.warn(`Record ${record.id}: negative total_units, setting to 0`);
        validRecord.total_units = 0;
      }

      return validRecord;
    });

    return validatedData;
  }

  private validateField(
    value: any,
    fieldName: string,
    expectedTypes: string[],
  ): any {
    if (value === undefined || value === null) {
      console.warn(`Missing required field: ${fieldName}`);
      switch (expectedTypes[0]) {
        case 'string':
          return '';
        case 'number':
          return 0;
        case 'boolean':
          return false;
        default:
          return null;
      }
    }

    const actualType = typeof value;
    if (!expectedTypes.includes(actualType)) {
      console.warn(
        `Invalid type for ${fieldName}: expected ${expectedTypes.join(' or ')}, got ${actualType}`,
      );

      if (expectedTypes.includes('number') && actualType === 'string') {
        const converted = Number(value);
        if (!isNaN(converted)) return converted;
      }
      if (expectedTypes.includes('string')) {
        return String(value);
      }

      switch (expectedTypes[0]) {
        case 'string':
          return '';
        case 'number':
          return 0;
        case 'boolean':
          return false;
        default:
          return null;
      }
    }

    return value;
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
