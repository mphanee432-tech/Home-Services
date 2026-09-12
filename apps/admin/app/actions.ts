'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export async function createServiceItem(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin credentials are missing from environment variables.');
  }

  // Privileged admin client bypassing RLS policies
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const category = (formData.get('category') as string)?.trim();
  const subcategory = (formData.get('subcategory') as string)?.trim() || null;
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const base_price = parseFloat(formData.get('base_price') as string);
  const target_audience = (formData.get('target_audience') as string) || 'both';

  if (!category || !name || isNaN(base_price)) {
    throw new Error('Please provide a valid category, service name, and base price.');
  }

  const { error } = await supabaseAdmin.from('service_catalog').insert({
    category,
    subcategory,
    name,
    description,
    base_price,
    target_audience,
    is_active: true,
  });

  if (error) {
    console.error('[Admin Mutation Error]:', error);
    throw new Error(`Failed to create service: ${error.message}`);
  }

  // Clear cache for the admin root route and the user marketplace
  revalidatePath('/');
}