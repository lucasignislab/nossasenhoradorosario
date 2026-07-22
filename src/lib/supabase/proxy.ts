import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from './config';

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured || !supabaseUrl || !supabasePublishableKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const isPrivateRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isPrivateRoute && (error || !data?.claims)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('retorno', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
