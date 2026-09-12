export const dynamic = 'force-dynamic';
import { createSupabaseClient } from '@repo/db';
export default async function ProfessionalJobsPage() {
  const supabase = createSupabaseClient();

  // Query pending jobs available for providers to claim
  const { data: availableJobs, error } = await supabase
    .from('candidate_bookings_view')
    .select('*');

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans max-w-3xl mx-auto">
      <header className="mb-8 pb-4 border-b border-neutral-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Available Jobs</h1>
          <p className="text-sm text-neutral-500">Claim incoming requests in your area</p>
        </div>
        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full">
          Unauthenticated
        </span>
      </header>

      {error ? (
        <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
          Authentication required. You must log in to view the live dispatch queue.
        </div>
      ) : !availableJobs || availableJobs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-neutral-300 rounded-xl">
          <p className="text-neutral-500">No open requests in your area.</p>
          <p className="text-xs text-neutral-400 mt-1">New requests will appear here in real time.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {availableJobs.map((job) => (
            <div key={job.id} className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Area</p>
                  <p className="font-medium text-neutral-800">{job.locality_area}</p>
                </div>
                <span className="text-lg font-bold text-neutral-900">₹{job.price_at_booking}</span>
              </div>
              <button className="w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                Claim Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}