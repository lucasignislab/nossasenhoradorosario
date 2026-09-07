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
