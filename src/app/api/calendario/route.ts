import { NextResponse } from 'next/server';
import { createClient as createAnonClient } from '@supabase/supabase-js';
import { buildCalendarFeed } from '@/lib/calendar';
import type { PortalEvent } from '@/types';

// Feed ICS público das atividades confirmadas — o filho assina uma vez no
// Google Agenda ou Apple Calendar e as giras aparecem/atualizam sozinhas.
export async function GET() {
  const supabase = createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'confirmada')
    .order('event_date', { ascending: true });

  const feed = buildCalendarFeed((data ?? []) as PortalEvent[]);

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="agenda-senhora-do-rosario.ics"',
      // Atualiza a cada hora para quem assina.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
