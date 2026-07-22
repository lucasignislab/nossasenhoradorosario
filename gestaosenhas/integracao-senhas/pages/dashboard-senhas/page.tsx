/**
 * PÁGINA DE GESTÃO DE SENHAS NO DASHBOARD
 * Copie para: src/app/(auth)/dashboard/senhas/page.tsx
 * 
 * Tema claro (cards brancos) integrado ao Dashboard da Área do Filho.
 */

'use client';

import { useState } from "react";
import PainelControle from "@/components/senhas/PainelControle";
import FormularioSenha from "@/components/senhas/FormularioSenha";
import Estatisticas from "@/components/senhas/Estatisticas";
import HistoricoAtendimentos from "@/components/senhas/HistoricoAtendimentos";
import { Monitor, BarChart3, History } from "lucide-react";

type Aba = 'painel' | 'estatisticas' | 'historico';

const abas: { id: Aba; label: string; icone: typeof Monitor }[] = [
  { id: 'painel', label: 'Painel', icone: Monitor },
  { id: 'estatisticas', label: 'Estatísticas', icone: BarChart3 },
  { id: 'historico', label: 'Histórico', icone: History },
];

export default function DashboardSenhasPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('painel');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal font-[var(--font-heading)] text-[#2c1810]">
            Gestão de Senhas
          </h1>
          <p className="text-sm font-inter text-[#7d5a3d]">
            Controle de filas e atendimentos do terreiro
          </p>
        </div>

        <a
          href="/senhas"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B3A2A] hover:bg-black text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
        >
          <Monitor className="w-4 h-4" />
          Abrir Tela Pública
        </a>
      </div>

      {/* Abas */}
      <div className="flex gap-1 rounded-sm p-1 bg-[#d4a574]/10">
        {abas.map((aba) => {
          const Icone = aba.icone;
          const isActive = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-inter transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#2c1810] shadow-sm'
                  : 'bg-transparent text-[#7d5a3d] hover:text-[#2c1810]'
              }`}
            >
              <Icone className="w-4 h-4" />
              {aba.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      {abaAtiva === 'painel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PainelControle />
          <FormularioSenha />
        </div>
      )}

      {abaAtiva === 'estatisticas' && <Estatisticas />}

      {abaAtiva === 'historico' && <HistoricoAtendimentos />}
    </div>
  );
}
