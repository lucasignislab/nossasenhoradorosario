import { Header } from "@/components/layout/header/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/footer/footer";
import { AgendaTabs } from "@/components/features/agenda-tabs";
import { currentMonthStartISODate, toEventCardProps } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";
import type { PortalEvent } from "@/types";

export default async function AgendaPage() {
  let events: PortalEvent[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'confirmada')
      .gte('event_date', currentMonthStartISODate())
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });
    events = (data ?? []) as PortalEvent[];
  } catch {
    // Falha ao carregar a agenda: a página segue com os estados vazios.
  }

  const giras = events.filter((event) => event.category === 'gira').map(toEventCardProps);
  const eventos = events.filter((event) => event.category !== 'gira').map(toEventCardProps);

  return (
    <main className="min-h-screen bg-[#FAF5EC] text-slate-900" aria-label="Agenda de Giras">
      <Header />

      {/* Hero Section Cinemática Consistente */}
      <Hero
        title="Agenda de Giras"
        subtitle='"A umbanda é a manifestação do espírito para a caridade." Conheça a nossa programação mensal de giras e trabalhos espirituais.'
        buttonLabel="Ver Giras Regulares"
        buttonHref="#programacao"
        backgroundImage="https://images.unsplash.com/photo-1601314167099-232775b3ee61?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Seção Principal com Abas */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" id="programacao">

        {/* Header da Agenda */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[#6F6F6F] mb-4 font-inter">
            Cronograma do Mês
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
            Nossos Trabalhos
          </h2>
          <div className="w-16 h-[1px] bg-black/15 mx-auto" />
        </div>

        <AgendaTabs giras={giras} eventos={eventos} />
      </section>

      <Footer />
    </main>
  );
}
