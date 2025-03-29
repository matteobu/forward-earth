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
    return data as Consumption;
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
}
