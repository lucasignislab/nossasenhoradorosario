// Importamos os nossos componentes organizados por pastas
import { Header } from "@/components/layout/header/Header";
import { Hero } from "@/components/layout/Hero";
import { ContentSection } from "@/components/sections/content-section/content-section";
import { ValuesSection } from "@/components/sections/values-section";
import { AgendaSection } from "@/components/features/AgendaSection";
import { LocationContact } from "@/components/features/LocationContact";
import { Footer } from "@/components/layout/footer/footer";
import { toEventCardProps, todayISODate } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";
import type { PortalEvent } from "@/types";

export default async function Home() {
  let events: PortalEvent[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'confirmada')
      .gte('event_date', todayISODate())
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
      .limit(3);
    events = (data ?? []) as PortalEvent[];
  } catch {
    // Falha ao carregar eventos: a seção segue com o estado vazio.
  }

  return (
    <>
      {/* 1. O Cabeçalho fica fixo no topo */}
      <Header />

      <main className="min-h-screen" aria-label="Conteúdo Principal">
      {/* 2. A primeira dobra do site (Impacto) */}
      <Hero
        title="Portas abertas para a caridade e o Axé"
        subtitle="Um espaço de fé, amor e acolhimento espiritual sob a luz da Umbanda."
        buttonLabel="Ver Agenda de Giras"
        buttonHref="#agenda"
        backgroundImages={[
          '/images/home/hero-atabaques.jpg',
          '/images/home/hero-fundamentos.jpg',
          '/images/home/hero-acolhimento.jpg',
        ]}
      />

      {/* 3. A Nossa Casa (Introdução Assimétrica) */}
      <ContentSection
        title="Uma comunidade de luz e respeito"
        subtitle="O Terreiro"
        text={'A Senhora do Rosário é um espaço de resistência, acolhimento e cuidado coletivo.\n\nAqui, a Umbanda é vivida em sua essência: caridade, humildade e sabedoria ancestral. Nossas portas estão abertas a quem busca conforto espiritual, pertencimento ou autoconhecimento.'}
        quote="Antes de buscar um milagre, precisamos ser o milagre no mundo do outro."
        image="/images/home/section-community.jpg"
        imageCaption="Nossa casa, nossa comunidade"
        linkLabel="Conheça nossa história"
        linkHref="/sobre"
        reverse={false}
      />

      {/* 4. Fundamentos (Dark Section com SVGs) */}
      <ValuesSection />

      {/* 5. Seção com as próximas giras */}
      <AgendaSection events={events.map(toEventCardProps)} />

      {/* 6. Como chegar e contacto */}
      <LocationContact
        address="Rua Antônio Adami, 36 - Barão Geraldo, Campinas - SP"
        hours="Entrega das fichas: 19h00 · Início dos trabalhos: 19h30"
      />

      {/* 7. Rodapé com links e redes sociais */}
      </main>

      <Footer />
    </>
  );
}
