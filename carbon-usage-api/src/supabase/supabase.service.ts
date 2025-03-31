import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { User } from 'src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { Consumption } from 'src/consumption/entities/consumption.entity';
import {
  CreateConsumptionDto,
  PatchConsumptionDto,
} from 'src/consumption/dto/create-consumption.dto';
import { ActivityTypeTable } from 'src/activity-types/entities/activity-type.entity';

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
  async getUserConsumption(user_id: number) {
    const { data: consumptionData, error: consumptionError } =
      await this.supabase
        .from('ConsumptionTable')
        .select('*')
        .eq('user_id', user_id);

    if (consumptionError) {
      console.error('Error fetching consumptions:', consumptionError);
      throw new Error(
        `Error fetching consumptions: ${consumptionError.message}`,
      );
    }

    if (!consumptionData || consumptionData.length === 0) {
      return [];
    }

    const activityTypeIds = consumptionData.map(
      (consumption: Consumption) => consumption.activity_type_table_id,
    );

    const unitIds = consumptionData.map(
      (consumption: Consumption) => consumption.unit_id,
    );

    const { data: activityTypeData, error: activityTypeError } =
      await this.supabase
        .from('ActivityTypeTable')
        .select('id, name, emission_factor, activity_type_id')
        .in('id', activityTypeIds);

    if (activityTypeError) {
      console.error('Error fetching activity types:', activityTypeError);
      throw new Error(
        `Error fetching activity types: ${activityTypeError.message}`,
      );
    }

    const { data: unitData, error: unitError } = await this.supabase
      .from('UnitTable')
      .select('id, name')
      .in('id', unitIds);

    if (unitError) {
      console.error('Error fetching units:', unitError);
      throw new Error(`Error fetching units: ${unitError.message}`);
    }

    const activityTypeMap = new Map();
    activityTypeData?.forEach((type) => {
      activityTypeMap.set(type.id, type);
    });

    const unitMap = new Map();
    unitData?.forEach((unit) => {
      unitMap.set(unit.id, unit);
    });

    const enrichedConsumptions: Consumption[] = consumptionData.map(
      (consumption: any) => {
        const activityType = activityTypeMap.get(
          consumption.activity_type_table_id,
        );
        const unit = unitMap.get(consumption.unit_id);

        return {
          id: consumption.id,
          user_id: consumption.user_id,
          amount: consumption.amount,
          activity_type_table_id: consumption.activity_type_table_id,
          unit_id: consumption.unit_id,
          co2_equivalent: consumption.co2_equivalent,
          date: consumption.date,
          created_at: consumption.created_at,
          deleted_at: consumption.deleted_at,
          unit_table: {
            id: unit?.id,
            name: unit?.name,
          },
          activity_table: {
            id: activityType?.id,
            name: activityType?.name,
            emission_factor: activityType?.emission_factor,
            activity_type_id: activityType?.activity_type_id,
          },
        };
      },
    );

    return enrichedConsumptions;
  }

  async createConsumption(consumptionData: CreateConsumptionDto) {
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

  async updateUserConsumption(
    id: number,
    patchConsumptionDto: PatchConsumptionDto,
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

  async getPaginatedData(
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

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      let query = this.supabase.from(table).select(select, { count: 'exact' });

      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          if (key.startsWith('gte_')) {
            const field = key.replace('gte_', '');
            query = query.gte(field, value);
          } else if (key.startsWith('lte_')) {
            const field = key.replace('lte_', '');
            query = query.lte(field, value);
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
      console.error('Error in getPaginatedData:', error);
      throw error;
    }
  }

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
}
