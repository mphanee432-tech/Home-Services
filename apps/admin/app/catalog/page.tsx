import { createSupabaseClient } from '@repo/db';
import { createServiceItem } from '../actions';
import { Button } from '@repo/ui';

export default async function AdminCatalogPage() {
  const supabase = createSupabaseClient();
  const { data: services } = await supabase
    .from('service_catalog')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Service Catalog</h1>
          <p className="text-neutral-500 text-sm">Manage offerings, prices, and target audiences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 h-fit">
          <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
          <form action={createServiceItem} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Service Name</label>
              <input name="name" required className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. AC Deep Cleaning" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Category</label>
                <input name="category" required className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Appliance" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Subcategory</label>
                <input name="subcategory" className="w-full border rounded-lg p-2 text-sm" placeholder="e.g. Repair" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Base Price (INR)</label>
              <input name="base_price" type="number" step="0.01" required className="w-full border rounded-lg p-2 text-sm" placeholder="499.00" />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Target Audience</label>
              <select name="target_audience" className="w-full border rounded-lg p-2 text-sm bg-white">
                <option value="both">Both (User & Pro)</option>
                <option value="user">User Only</option>
                <option value="professional">Professional Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full border rounded-lg p-2 text-sm" placeholder="Includes filter wash and gas check." />
            </div>

            <Button type="submit" className="w-full">Publish Service</Button>
          </form>
        </div>

        {/* Existing Items Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Audience</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services && services.length > 0 ? (
                services.map((s) => (
                  <tr key={s.id}>
                    <td className="p-4 font-medium text-neutral-900">{s.name}</td>
                    <td className="p-4 text-neutral-600">{s.category}</td>
                    <td className="p-4 text-neutral-900 font-semibold">₹{s.base_price}</td>
                    <td className="p-4 capitalize text-neutral-500">{s.target_audience}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>
                        {s.is_active ? 'Active' : 'Archived'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">
                    No services in catalog yet. Add one to see it listed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}