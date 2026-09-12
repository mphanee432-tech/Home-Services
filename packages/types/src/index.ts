export type AppRole = 'user' | 'professional' | 'admin';

export type BookingStatus = 
  | 'pending_acceptance'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type KycStatus = 'pending' | 'approved' | 'rejected';

export interface ProfileRecord {
  id: string;
  role: AppRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface BookingRecord {
  id: string;
  user_id: string;
  professional_id: string | null;
  service_id: string;
  promo_code: string | null;
  status: BookingStatus;
  price_at_booking: number;
  commission_rate_at_booking: number;
  cash_collected: number;
  service_lat: number;
  service_lng: number;
  exact_address: string;
  locality_area: string;
  completion_otp: string | null;
  scheduled_for: string;
  created_at: string;
}