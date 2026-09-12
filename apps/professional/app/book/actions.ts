'use server';

import { createSupabaseClient } from '@repo/db';

export async function createBooking(formData: FormData) {
  try {
    const supabase = createSupabaseClient();
    
    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Authentication required to book a service.' };
    }

    const serviceId = formData.get('service_id')?.toString();
    const scheduledFor = formData.get('scheduled_for')?.toString();
    const localityArea = formData.get('locality_area')?.toString();
    const exactAddress = formData.get('exact_address')?.toString();
    const lat = formData.get('captured_lat')?.toString();
    const lng = formData.get('captured_lng')?.toString();

    if (!serviceId || !scheduledFor || !localityArea || !exactAddress) {
      return { error: 'Missing required booking fields.' };
    }

    // Fetch current base_price to prevent client-side tampering
    const { data: service, error: serviceError } = await supabase
      .from('service_catalog')
      .select('base_price, name')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return { error: 'Invalid service specified.' };
    }

    // Generate random 6-digit completion OTP
    const completionOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const { error: insertError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_id: serviceId,
        service_name: service.name,
        status: 'pending_acceptance',
        price_at_booking: service.base_price,
        snapshot_price: service.base_price,
        commission_rate_at_booking: 15.00,
        scheduled_for: scheduledFor,
        scheduled_time: scheduledFor,
        locality_area: localityArea,
        exact_address: exactAddress,
        captured_lat: lat ? parseFloat(lat) : null,
        captured_lng: lng ? parseFloat(lng) : null,
        completion_otp: completionOtp
      });

    if (insertError) {
      console.error('Error inserting booking:', insertError);
      return { error: 'Failed to create booking. Please try again.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in createBooking:', err);
    return { error: 'An unexpected error occurred.' };
  }
}
