import { createClient } from '@supabase/supabase-js';
import { createServiceItem } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: services, error: fetchError } = await supabaseAdmin
    .from('service_catalog')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b border-neutral-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Admin Operations Dashboard</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage platform service catalog, pricing snapshots, and active assignments.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creation Form */}
          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-semibold text-white mb-4">Add Catalog Service</h2>
            <form action={createServiceItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Service Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. AC Deep Cleaning"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Category</label>
                  <input
                    name="category"
                    type="text"
                    required
                    placeholder="e.g. Appliance"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Subcategory</label>
                  <input
                    name="subcategory"
                    type="text"
                    placeholder="e.g. Repair"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Base Price (INR)</label>
                <input
                  name="base_price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="599.00"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Target Audience</label>
                <select
                  name="target_audience"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                >
                  <option value="both">Both (User & Professional)</option>
                  <option value="user">User Marketplace Only</option>
                  <option value="professional">Professional Dispatch Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Scope of work and included checklist..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-900 font-semibold rounded-lg text-sm transition-colors"
              >
                Publish Service
              </button>
            </form>
          </div>

          {/* Current Services Table */}
          <div className="lg:col-span-2 bg-neutral-800/60 border border-neutral-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
              <h2 className="font-semibold text-white">Current Services</h2>
              <span className="text-xs font-mono text-neutral-400">
                Count: {services?.length ?? 0}
              </span>
            </div>

            {fetchError ? (
              <div className="p-6 text-red-400 text-sm">Failed to load catalog: {fetchError.message}</div>
            ) : !services || services.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 text-sm">
                No services have been added yet. Use the form to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-900/60 text-neutral-400 border-b border-neutral-700 text-xs uppercase">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₹)</th>
                      <th className="p-4">Audience</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {services.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-800/40">
                        <td className="p-4 font-medium text-white">{item.name}</td>
                        <td className="p-4 text-neutral-300">{item.category}</td>
                        <td className="p-4 font-semibold text-emerald-400">₹{item.base_price}</td>
                        <td className="p-4 capitalize text-neutral-400">{item.target_audience}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              item.is_active
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-neutral-700 text-neutral-400'
                            }`}
                          >
                            {item.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}