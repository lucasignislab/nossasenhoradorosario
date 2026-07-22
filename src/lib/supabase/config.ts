export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes('seu-projeto') &&
    !supabasePublishableKey.includes('sua_chave'),
);

export function getSupabaseConfig() {
  if (!isSupabaseConfigured || !supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Supabase não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }

  return { supabaseUrl, supabasePublishableKey };
}
