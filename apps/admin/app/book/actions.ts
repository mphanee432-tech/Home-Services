'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server';

export async function createBooking(formData: FormData) {
  const supabase = await createClient();

  // 1. Verify the active user session securely via cookies
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    // If not logged in, redirect gracefully instead of crashing
    redirect('/login');
  }

  const service_id = formData.get('service_id') as string;
  const base_price = parseFloat(formData.get('base_price') as string);
  
  // 2. Generate random 6-digit completion OTP
  const completionOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Insert using the real user.id to satisfy Postgres RLS
  const { error } = await supabase.from('bookings').insert({
    user_id: user.id,
    service_id,
    price_at_booking: base_price,
    commission_rate_at_booking: 15.00,
    service_lat: parseFloat(formData.get('captured_lat') as string) || 12.9716,
    service_lng: parseFloat(formData.get('captured_lng') as string) || 77.5946,
    scheduled_for: formData.get('scheduled_for') as string,
    locality_area: formData.get('locality_area') as string,
    exact_address: formData.get('exact_address') as string,
    completion_otp: completionOtp,
    status: 'pending_acceptance',
  });

  if (error) {
    console.error('Booking Insert Failed:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  redirect('/');
}