export type ProfileRole = 'member' | 'admin' | 'developer' | 'editor';

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

export type FinanceEntryStatus = 'pendente' | 'pago';

export type FinanceEntry = {
  id: string;
  type: FinanceEntryType;
  category: string;
  description: string;
  amount_cents: number;
  entry_date: string;
  status: FinanceEntryStatus;
  receipt_path: string | null;
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

export type Attendance = {
  id: string;
  event_id: string;
  profile_id: string;
  present: boolean;
  justified: boolean;
  notes: string | null;
  marked_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  published_at: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentKind = 'video' | 'artigo' | 'documento';

export type StudyContent = {
  id: string;
  title: string;
  description: string | null;
  kind: ContentKind;
  url: string;
  module: string | null;
  duration_minutes: number | null;
  published: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentProgress = {
  id: string;
  content_id: string;
  profile_id: string;
  completed_at: string;
};

export type CleaningShiftKind = 'thursday' | 'saturday';

export type CleaningShiftDate = {
  id: string;
  shift_date: string;
  kind: CleaningShiftKind;
  created_at: string;
  updated_at: string;
};

export type CleaningShiftSignup = {
  id: string;
  shift_date_id: string;
  profile_id: string;
  created_at: string;
};
