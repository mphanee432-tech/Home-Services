'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '../actions';
import { Button } from '@repo/ui';

export default function BookingForm({ service }: { service: any }) {
  const router = useRouter();
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [exactAddress, setExactAddress] = useState<string>('');
  const [localityArea, setLocalityArea] = useState<string>('');
  const [pinPos, setPinPos] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMockGPS = () => {
    setLat('12.9716');
    setLng('77.5946');
    setPinPos({ x: 50, y: 50 });
    setExactAddress('123 Main Street, Tech Park');
    setLocalityArea('Downtown');
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    setPinPos({ x: xPercent, y: yPercent });
    
    // Generate mock coordinates around Bangalore (12.9, 77.5)
    const mockLat = (12.9 + (yPercent / 100) * 0.1).toFixed(4);
    const mockLng = (77.5 + (xPercent / 100) * 0.1).toFixed(4);
    
    setLat(mockLat);
    setLng(mockLng);
    setExactAddress(`Virtual Building ${Math.floor(xPercent)}, Sector ${Math.floor(yPercent)}`);
    setLocalityArea('Virtual Tech Park');
  };

  const formAction = (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      const result = await createBooking(formData);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push('/');
      }
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="service_id" value={service.id} />
      <input type="hidden" name="captured_lat" value={lat} />
      <input type="hidden" name="captured_lng" value={lng} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="scheduled_for" className="block text-sm font-medium text-neutral-700">Date & Time</label>
        <input 
          type="datetime-local" 
          name="scheduled_for" 
          id="scheduled_for" 
          required 
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white text-neutral-900" 
        />
      </div>

      <div>
        <label htmlFor="locality_area" className="block text-sm font-medium text-neutral-700">Locality Area</label>
        <input 
          type="text" 
          name="locality_area" 
          id="locality_area" 
          placeholder="e.g. Downtown"
          required 
          value={localityArea}
          onChange={(e) => setLocalityArea(e.target.value)}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white text-neutral-900" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Pinpoint Location on Map</label>
        <div 
          onClick={handleMapClick}
          className="relative w-full h-48 bg-neutral-100 rounded-lg border border-neutral-300 overflow-hidden cursor-crosshair group"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4d4d8 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity">
            <span className="text-sm font-medium text-neutral-600 bg-white/80 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
              Click anywhere on the map to drop a pin
            </span>
          </div>
          
          {pinPos && (
            <div 
              className="absolute w-8 h-8 -ml-4 -mt-8 pointer-events-none transition-all duration-300 ease-out z-10"
              style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
            >
              <svg className="w-full h-full text-red-500 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="exact_address" className="block text-sm font-medium text-neutral-700">Exact Street Address</label>
        <textarea 
          name="exact_address" 
          id="exact_address" 
          required 
          rows={3} 
          value={exactAddress}
          onChange={(e) => setExactAddress(e.target.value)}
          placeholder="House number, street name, landmarks..."
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white text-neutral-900 resize-none"
        ></textarea>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-50 p-4 rounded-lg border border-neutral-200 gap-4">
         <div className="text-sm text-neutral-600">
           {lat && lng ? (
             <span className="text-emerald-600 font-medium flex items-center gap-1.5">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
               Location captured
             </span>
           ) : (
             <span>Capture location for accurate service delivery</span>
           )}
         </div>
         <button 
           type="button" 
           onClick={handleMockGPS} 
           className="shrink-0 text-sm font-medium text-neutral-900 bg-white border border-neutral-300 px-4 py-2 rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900"
         >
           Use Current Location
         </button>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="w-full text-base py-6 rounded-xl">
           {isPending ? 'Processing...' : `Confirm Booking • ₹${service.base_price}`}
        </Button>
      </div>
    </form>
  );
}
