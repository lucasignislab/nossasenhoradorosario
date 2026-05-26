// Importamos os nossos componentes organizados por pastas
import { Header } from "@/components/layout/header/Header";
import { Hero } from "@/components/layout/Hero";
import { ContentSection } from "@/components/sections/content-section/content-section";
import { ValuesSection } from "@/components/sections/values-section";
import { AgendaSection } from "@/components/features/AgendaSection";
import { LocationContact } from "@/components/features/LocationContact";
import { Footer } from "@/components/layout/footer/footer";
import { type EventCardProps } from "@/components/features/event-card";

const mockEvents: EventCardProps[] = [
  {
    title: 'Gira de Esquerda',
    entity: 'Exu e Pombagira',
    date: '15/05/2026',
    time: '20:00',
    status: 'confirmada',
    description: 'Atendimento e descarrego com a linha de Esquerda.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800',
  },
  {
    title: 'Gira de Baianos',
    entity: 'Baianos',
    date: '22/05/2026',
    time: '20:00',
    status: 'confirmada',
    description: 'Alegria e conselhos com a linha dos Baianos.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
  },
  {
    title: 'Gira de Pretos Velhos',
    entity: 'Pretos Velhos e Almas',
    date: '29/05/2026',
    time: '20:00',
    status: 'confirmada',
    description: 'Acolhimento, passes e aconselhamento.',
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800',
  }
];

export default function Home() {
  return (
    <main className="min-h-screen" aria-label="Conteúdo Principal">
      {/* 1. O Cabeçalho fica fixo no topo */}
      <Header />

      {/* 2. A primeira dobra do site (Impacto) */}
      <Hero
        title="Portas abertas para a caridade e o Axé"
        subtitle="Um espaço de fé, amor e acolhimento espiritual sob a luz da Umbanda."
        buttonLabel="Ver Agenda de Giras"
        buttonHref="#agenda"
        // Mantemos a imagem como fallback se o vídeo falhar
        backgroundImage="https://images.unsplash.com/photo-1601314167099-232775b3ee61?q=80&w=1600&auto=format&fit=crop"
      />

      {/* 3. A Nossa Casa (Introdução Assimétrica) */}
      <ContentSection
        title="Uma comunidade de luz e respeito"
        subtitle="O Terreiro"
        text="A Senhora do Rosário é um espaço de resistência e acolhimento.\n\nAqui, a Umbanda é praticada em sua essência: caridade, humildade e sabedoria ancestral. Nossas portas estão abertas para todos que buscam conforto espiritual ou autoconhecimento, ensinando que antes de buscar um milagre, precisamos ser o milagre no mundo do outro."
        image="https://images.unsplash.com/photo-1595133606775-fe0e3f0ae866?q=80&w=800&auto=format&fit=crop"
        reverse={false}
      />

      {/* 4. Fundamentos (Dark Section com SVGs) */}
      <ValuesSection />

      {/* 5. Seção com as próximas giras */}
      <AgendaSection events={mockEvents} />

      {/* 6. Como chegar e contacto */}
      <LocationContact
        address="Rua das Flores, 123 - Centro, São Paulo - SP"
        phone="(11) 98765-4321"
        email="contato@terreirosenhadorosario.com.br"
        hours="Segunda a Sexta: 18h - 22h | Sábado e Domingo: 14h - 22h"
      />

      {/* 7. Rodapé com links e redes sociais */}
      <Footer />
    </main>
  );
}