import { createSupabaseClient } from '@repo/db';
import BookingForm from './booking-form';

export default async function BookServicePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Next.js 15 requires awaiting the route parameters
  const resolvedParams = await params;
  const supabase = createSupabaseClient();

  // 2. Fetch the specific service using the resolved ID
  const { data: service, error } = await supabase
    .from('service_catalog')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  // 3. Gracefully handle invalid IDs or missing services
  if (error || !service) {
    return (
      <div className="min-h-screen p-12 bg-neutral-50 flex items-center justify-center font-sans">
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          Error: Could not find this service in the catalog.
        </div>
      </div>
    );
  }

  // 4. Pass the fully loaded service object to the client form
  return (
    <main className="min-h-screen bg-neutral-50 p-6 md:p-12 font-sans max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Booking: <span className="font-semibold text-neutral-800">{service.name}</span>
        </p>
      </header>
      
      <BookingForm service={service} />
    </main>
  );
}