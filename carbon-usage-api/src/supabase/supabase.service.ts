import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { User } from 'src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { Consumption } from 'src/consumption/entities/consumption.entity';
import {
  CreateConsumptionDto,
  PatchConsumptionDto,
} from 'src/consumption/dto/create-consumption.dto';

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
    const { data: unitData, error: unitError } = await this.supabase
      .from('UnitTable')
      .insert([{ name: consumptionData.unit }])
      .select('id')
      .single();

    if (unitError) {
      throw new Error(`Error creating unit: ${unitError.message}`);
    }

    const unitId = unitData.id;
    let activityTypeTableId = 0;
    if (consumptionData.activity_name && consumptionData.emission_factor) {
      const { data: activityTypeData, error: activityTypeError } =
        await this.supabase
          .from('ActivityTypeTable')
          .insert([
            {
              name: consumptionData.activity_name,
              emission_factor: consumptionData.emission_factor,
              activity_type_id: consumptionData.activity_type_id,
            },
          ])
          .select('id')
          .single();

      if (activityTypeError) {
        console.error('ActivityType insertion error:', activityTypeError);
        throw new Error(
          `Error creating activity type: ${activityTypeError.message}`,
        );
      }
      activityTypeTableId = activityTypeData.id;
    }

    const { data, error } = await this.supabase
      .from('ConsumptionTable')
      .insert([
        {
          user_id: consumptionData.user_id,
          amount: consumptionData.amount,
          activity_type_table_id: activityTypeTableId,
          unit_id: unitId,
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
    const { data: consumptionData, error: fetchError } = await this.supabase
      .from('ConsumptionTable')
      .select('id, unit_id, activity_type_table_id')
      .eq('id', consumption_id)
      .single();

    if (fetchError) {
      console.error('Error fetching consumption details:', fetchError);
      throw new Error(
        `Error fetching consumption details: ${fetchError.message}`,
      );
    }

    if (!consumptionData) {
      throw new Error(`Consumption with ID ${consumption_id} not found`);
    }

    const { unit_id, activity_type_table_id } = consumptionData;

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

      const { error: activityTypeTableError } = await this.supabase
        .from('ActivityTypeTable')
        .delete()
        .eq('id', activity_type_table_id);

      if (activityTypeTableError) {
        throw new Error(
          `Error deleting Activity Table: ${activityTypeTableError.message}`,
        );
      }

      const { error: unitTable } = await this.supabase
        .from('UnitTable')
        .delete()
        .eq('id', unit_id);

      if (activityTypeTableError) {
        throw new Error(`Error deleting Activity Table: ${unitTable.message}`);
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

      const from = (page - 1) * limit;
      const to = from + limit - 1;

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
        console.log(transformed);
        return transformed as Consumption[];
      });

      return {
        data: transformedData,
        meta: {
          total: count || 0,
          page: options.page,
          limit: options.limit,
          totalPages: count ? Math.ceil(count / options.limit) : 0,
        },
      };
    } catch (error) {
      console.error('Error in getPaginatedData:', error);
      throw error;
    }
  }
}
