export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createSupabaseClient } from '@repo/db';

export const metadata = {
  title: 'Home Services - Catalog',
  description: 'Browse and book home services.',
};

export default async function UserCatalogPage() {
  let services = [];
  let error = null;

  try {
    const supabase = createSupabaseClient();
    
    const { data, error: fetchError } = await supabase
      .from('service_catalog')
      .select('id, category, name, description, base_price')
      .eq('is_active', true);

    if (fetchError) {
      throw fetchError;
    }

    services = data || [];
  } catch (err: any) {
    console.error('Failed to fetch service catalog:', err);
    error = 'We are currently unable to load the service catalog. Please try again later.';
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">
                Home Services
              </h1>
            </Link>
            <p className="hidden sm:block text-sm text-neutral-500">
              Professional services at your doorstep
            </p>
          </div>
          <nav>
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2 rounded-md hover:bg-neutral-100"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Available Services
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            Browse our catalog of verified professionals and book your service instantly.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Oops! Something went wrong.</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!error && services.length === 0 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No active services</h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              We currently don't have any active services available in your area. Please check back soon.
            </p>
          </div>
        )}

        {services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <div key={service.id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{service.category}</span>
                  <h2 className="text-lg font-bold text-neutral-900 mt-1">{service.name}</h2>
                  <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{service.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400">Price</span>
                    <p className="text-lg font-bold text-neutral-900">₹{service.base_price}</p>
                  </div>
                  <Link
                    href={`/book/${service.id}`}
                    className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}