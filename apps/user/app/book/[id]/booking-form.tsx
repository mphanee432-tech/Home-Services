'use client';

import { useState } from 'react';
import { createBooking } from '../actions';

export default function BookingForm({ service }: { service: any }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleLocationCapture = () => {
    // Mocking hybrid GPS capture
    setLat('12.9716');
    setLng('77.5946');
    alert('Mock GPS Location Captured: Bangalore');
  };

  return (
    <form action={createBooking} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5">
      <input type="hidden" name="service_id" value={service.id} />
      <input type="hidden" name="base_price" value={service.base_price} />
      <input type="hidden" name="captured_lat" value={lat} />
      <input type="hidden" name="captured_lng" value={lng} />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Scheduled Date & Time</label>
        <input type="datetime-local" name="scheduled_for" required className="w-full border border-neutral-300 rounded-lg p-2.5" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Locality Area</label>
        <input type="text" name="locality_area" placeholder="e.g. Downtown" required className="w-full border border-neutral-300 rounded-lg p-2.5" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Exact Street Address</label>
        <textarea name="exact_address" rows={3} required className="w-full border border-neutral-300 rounded-lg p-2.5" />
      </div>

      <button type="button" onClick={handleLocationCapture} className="text-sm text-sky-600 font-semibold hover:text-sky-700">
        📍 Use Current Location
      </button>

      <button type="submit" className="w-full py-3 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors">
        Confirm Booking • ₹{service.base_price}
      </button>
    </form>
  );
}