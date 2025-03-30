import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { User } from 'src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { Consumption } from 'src/consumption/entities/consumption.entity';

dotenv.config();

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    // Initialize Supabase client
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
    const { data, error } = await this.supabase
      .from('ConsumptionTable')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      throw new Error('Error fetching user from Supabase');
    }
    return data as Consumption[];
  }

  async createConsumption(consumptionData: {
    user_id: number;
    amount: number;
    activity_type_id: number;
    activity_name: string;
    emission_factor: number;
    date: string;
    co2_equivalent: number;
    unit: string;
  }) {
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
    console.log('Deleting consumption with ID:', consumption_id);

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
      // 2. Elimina il record dalla ConsumptionTable
      const { error: consumptionError } = await this.supabase
        .from('ConsumptionTable')
        .delete()
        .eq('id', consumption_id);

      if (consumptionError) {
        throw new Error(
          `Error deleting consumption: ${consumptionError.message}`,
        );
      }

      // 3. Verifica se ci sono altre consumazioni che usano la stessa unità
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

      // 4. Se nessun'altra consumazione usa questa unità, eliminala
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
}
