'use client';

import React from 'react';
import { Header } from "@/components/layout/header/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/footer/footer";
import { EventCard, type EventCardProps } from "@/components/features/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

const mockGiras: EventCardProps[] = [
  {
    title: 'Gira de Pretos Velhos',
    entity: 'Pretos Velhos e Almas',
    date: '13/05/2026',
    time: '19:30',
    status: 'confirmada',
    description: 'Momento de sabedoria, passes de limpeza e conselhos dos nossos vovôs e vovós.',
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800',
  },
  {
    title: 'Gira de Caboclos',
    entity: 'Caboclos',
    date: '20/05/2026',
    time: '19:30',
    status: 'confirmada',
    description: 'Força da mata e cura espiritual com a falange dos caçadores.',
    imageUrl: 'https://images.unsplash.com/photo-1595133606775-fe0e3f0ae866?q=80&w=800',
  },
  {
    title: 'Gira de Baianos',
    entity: 'Baianos',
    date: '27/05/2026',
    time: '19:30',
    status: 'confirmada',
    description: 'Alegria e firmeza com o povo da Bahia.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
  }
];

export default function AgendaPage() {
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

        <Tabs defaultValue="giras" className="w-full flex flex-col items-center">
          
          {/* Menu das Abas (Estilo Pílulas Minimalistas) */}
          <TabsList className="flex gap-2 bg-black/5 p-1 rounded-full max-w-md w-full mb-12">
            <TabsTrigger 
              value="giras"
              className="flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-[0.1em] font-inter rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300 cursor-pointer"
            >
              Giras Regulares
            </TabsTrigger>
            <TabsTrigger 
              value="eventos"
              className="flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-[0.1em] font-inter rounded-full data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300 cursor-pointer"
            >
              Eventos e Festas
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo da Aba: Giras */}
          <TabsContent value="giras" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockGiras.map((gira, index) => (
                <div key={`${gira.title}-${index}`} className="transition-transform duration-300 hover:-translate-y-1">
                  <EventCard {...gira} />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Conteúdo da Aba: Eventos */}
          <TabsContent value="eventos" className="w-full">
            <div className="text-center py-20 px-6 bg-white border border-dashed border-black/10 rounded-lg max-w-2xl mx-auto shadow-sm">
              <Calendar size={48} className="mx-auto mb-4 text-[var(--color-sacred-gold)] opacity-60" />
              <p className="text-base text-[#6F6F6F] font-inter leading-relaxed">
                Nenhum evento especial marcado para este mês.
              </p>
              <p className="text-sm text-[#6F6F6F]/70 font-inter mt-2">
                Fique atento às nossas redes sociais para atualizações de festividades.
              </p>
            </div>
          </TabsContent>

        </Tabs>
      </section>

      <Footer />
    </main>
  );
}