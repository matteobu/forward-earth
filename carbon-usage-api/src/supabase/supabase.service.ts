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
      (consumption: Consumption) => consumption.activity_type_id,
    );

    const unitIds = consumptionData.map(
      (consumption: Consumption) => consumption.unit_id,
    );

    const { data: activityTypeData, error: activityTypeError } =
      await this.supabase
        .from('ActivityTypeTable')
        .select('id, activity_type_id')
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
      activityTypeMap.set(type.id, type.activity_type_id);
    });

    const unitMap = new Map();
    unitData?.forEach((unit) => {
      unitMap.set(unit.id, unit.name);
    });

    const enrichedConsumptions: Consumption[] = consumptionData.map(
      (consumption: Consumption) => {
        const mappedActivityTypeId = activityTypeMap.get(
          consumption.activity_type_id,
        );
        const unitName = unitMap.get(consumption.unit_id);
        return {
          ...consumption,
          activity_type_id:
            mappedActivityTypeId || consumption.activity_type_id,
          unit_name: unitName || '',
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

    let activityTypeId = consumptionData.activity_type_id;

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

      if (activityTypeData) {
        activityTypeId = activityTypeData.id;
      }
    }

    const { data, error } = await this.supabase
      .from('ConsumptionTable')
      .insert([
        {
          user_id: consumptionData.user_id,
          amount: consumptionData.amount,
          activity_type_id: activityTypeId,
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
      activity_type_id: number;
      unit_id: number;
      co2_equivalent: number;
      date: string;
      created_at: string;
    };
  }

  async deleteUserConsumption(consumption_id: number) {
    const { data: consumptionData, error: fetchError } = await this.supabase
      .from('ConsumptionTable')
      .select('id, unit_id, activity_type_id')
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

    const { unit_id, activity_type_id } = consumptionData;

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

      const { data: otherConsumptionsWithUnit, error: unitCheckError } =
        await this.supabase
          .from('ConsumptionTable')
          .select('id')
          .eq('unit_id', unit_id);

      if (unitCheckError) {
        throw new Error(
          `Error checking unit references: ${unitCheckError.message}`,
        );
      }

      if (
        !otherConsumptionsWithUnit ||
        otherConsumptionsWithUnit.length === 0
      ) {
        const { error: unitError } = await this.supabase
          .from('UnitTable')
          .delete()
          .eq('id', unit_id);

        if (unitError) {
          console.warn(`Could not delete unit: ${unitError.message}`);
        }
      }

      const { data: otherConsumptionsWithActivity, error: activityCheckError } =
        await this.supabase
          .from('ConsumptionTable')
          .select('id')
          .eq('activity_type_id', activity_type_id);

      if (activityCheckError) {
        throw new Error(
          `Error checking activity type references: ${activityCheckError.message}`,
        );
      }

      if (
        !otherConsumptionsWithActivity ||
        otherConsumptionsWithActivity.length === 0
      ) {
        const { error: activityError } = await this.supabase
          .from('ActivityTypeTable')
          .delete()
          .eq('id', activity_type_id);

        if (activityError) {
          console.warn(
            `Could not delete activity type: ${activityError.message}`,
          );
        }
      }

      console.log('Successfully deleted consumption and related data');
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
    console.log('Updating consumption with ID:', id);
    console.log('Patch data:', patchConsumptionDto);
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
      console.log({ currentConsumption });

      if (patchConsumptionDto.activity_type_id) {
        const { error: updateActivityError } = await this.supabase
          .from('ActivityTypeTable')
          .update({
            id: patchConsumptionDto.activity_type_id,
            name: patchConsumptionDto.activity_type_name,
            emission_factor: patchConsumptionDto.emission_factor,
          })
          .eq('id', currentConsumption.ActivityTypeTable.id);

        if (updateActivityError) {
          throw new Error(
            `Error updating activity type: ${updateActivityError.message}`,
          );
        }
      }

      if (patchConsumptionDto.unit) {
        const { error: updateUnitError } = await this.supabase
          .from('UnitTable')
          .update({
            name: patchConsumptionDto.unit,
          })
          .eq('id', currentConsumption.unit_id);

        if (updateUnitError) {
          throw new Error(`Error updating unit: ${updateUnitError.message}`);
        }
      }

      const updateData: any = {};

      if (patchConsumptionDto.amount !== undefined) {
        updateData.amount = patchConsumptionDto.amount;
      }

      if (patchConsumptionDto.activity_type_id !== undefined) {
        updateData.activity_type_id = patchConsumptionDto.activity_type_id;
      }

      if (patchConsumptionDto.unit_id !== undefined) {
        updateData.unit_id = patchConsumptionDto.unit_id;
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

      return currentConsumption as Consumption;
    } catch (error) {
      console.error('Error in updateUserConsumption:', error);
      throw error;
    }
  }
}
