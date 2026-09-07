export type ProfileRole = 'member' | 'admin' | 'developer';

export type ProfileStatus = 'pending' | 'active' | 'suspended';

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: ProfileRole;
  status: ProfileStatus;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EventCategory = 'gira' | 'festividade' | 'acao-social' | 'curso';

export type EventStatus = 'confirmada' | 'cancelada';

export type PortalEvent = {
  id: string;
  title: string;
  entity: string | null;
  description: string | null;
  details: string | null;
  category: EventCategory;
  event_date: string;
  event_time: string | null;
  location: string;
  image_url: string | null;
  status: EventStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventConfirmation = {
  id: string;
  event_id: string;
  profile_id: string;
  created_at: string;
};

export type FinanceEntryType = 'entrada' | 'saida';

export type FinanceEntry = {
  id: string;
  type: FinanceEntryType;
  category: string;
  description: string;
  amount_cents: number;
  entry_date: string;
  profile_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type MonthlyFinancePoint = {
  month: string;
  income: number;
  expense: number;
};
