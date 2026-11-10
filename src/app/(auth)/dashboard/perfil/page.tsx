import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/features/ProfileForm';
import { createClient } from '@/lib/supabase/server';

type Profile = {
  full_name: string;
  phone: string | null;
  role: 'member' | 'admin' | 'developer';
  guia_frente: string | null;
  orixa_cabeca: string | null;
  adjunto: string | null;
  avatar_url: string | null;
  joined_at: string | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone, role, guia_frente, orixa_cabeca, adjunto, avatar_url, joined_at')
    .eq('id', user.id)
    .single();
  const profile = data as Profile | null;
  if (!profile) redirect('/dashboard');

  return (
    <ProfileForm
      fullName={profile.full_name}
      phone={profile.phone ?? ''}
      email={user.email ?? ''}
      role={profile.role}
      joinedAt={profile.joined_at}
      guiaFrente={profile.guia_frente}
      orixaCabeca={profile.orixa_cabeca}
      adjunto={profile.adjunto}
      avatarUrl={profile.avatar_url}
    />
  );
}
