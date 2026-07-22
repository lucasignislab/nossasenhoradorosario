import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isPortalPreviewEnabled } from '@/lib/portal-preview';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  if (isPortalPreviewEnabled) {
    const pathname = request.nextUrl.pathname;
    const redirectUrl = request.nextUrl.clone();

    if (pathname === '/login') {
      redirectUrl.pathname = '/portal-preview/dashboard';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      redirectUrl.pathname = `/portal-preview${pathname}`;
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      redirectUrl.pathname = `/portal-preview${pathname}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};
