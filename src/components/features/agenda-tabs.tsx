'use client';

import { EventCard, type EventCardProps } from '@/components/features/event-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';

type AgendaTabsProps = {
  giras: EventCardProps[];
  eventos: EventCardProps[];
};

export function AgendaTabs({ giras, eventos }: AgendaTabsProps) {
  return (
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
        {giras.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giras.map((gira, index) => (
              <div key={`${gira.title}-${index}`} className="transition-transform duration-300 hover:-translate-y-1">
                <EventCard {...gira} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white border border-dashed border-black/10 rounded-lg max-w-2xl mx-auto shadow-sm">
            <Calendar size={48} className="mx-auto mb-4 text-[var(--color-sacred-gold)] opacity-60" />
            <p className="text-base text-[#6F6F6F] font-inter leading-relaxed">
              Nenhuma gira agendada no momento.
            </p>
            <p className="text-sm text-[#6F6F6F]/70 font-inter mt-2">
              Volte em breve ou acompanhe nossas redes sociais para atualizações.
            </p>
          </div>
        )}
      </TabsContent>

      {/* Conteúdo da Aba: Eventos */}
      <TabsContent value="eventos" className="w-full">
        {eventos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento, index) => (
              <div key={`${evento.title}-${index}`} className="transition-transform duration-300 hover:-translate-y-1">
                <EventCard {...evento} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white border border-dashed border-black/10 rounded-lg max-w-2xl mx-auto shadow-sm">
            <Calendar size={48} className="mx-auto mb-4 text-[var(--color-sacred-gold)] opacity-60" />
            <p className="text-base text-[#6F6F6F] font-inter leading-relaxed">
              Nenhum evento especial marcado para este mês.
            </p>
            <p className="text-sm text-[#6F6F6F]/70 font-inter mt-2">
              Fique atento às nossas redes sociais para atualizações de festividades.
            </p>
          </div>
        )}
      </TabsContent>

    </Tabs>
  );
}
