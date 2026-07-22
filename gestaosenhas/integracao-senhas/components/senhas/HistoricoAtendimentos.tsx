/**
 * HISTÓRICO DE ATENDIMENTOS
 * Copie para: src/components/senhas/HistoricoAtendimentos.tsx
 * 
 * Cards brancos + inputs conforme Design System Orixá.
 */

'use client';

import { useState } from "react";
import { useSenhaStore } from "@/store/useSenhaStore";
import { TIPOS_ATENDIMENTO, STATUS_LABELS } from "@/types/senhas";
import { Search, Calendar, Clock, Filter } from "lucide-react";

export default function HistoricoAtendimentos() {
  const { historico, senhas } = useSenhaStore();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroData, setFiltroData] = useState<string>("hoje");

  const todasSenhas = [
    ...historico.map((h) => ({
      id: h.id, senha: h.senha, fila: h.fila, data: h.data,
      tempoEspera: h.tempoEsperaMinutos, tempoAtendimento: h.tempoAtendimentoMinutos,
      origem: "historico" as const,
    })),
    ...senhas
      .filter((s) => s.status === "cancelado")
      .map((s) => ({
        id: s.id, senha: s, fila: null, data: s.dataCriacao,
        tempoEspera: 0, tempoAtendimento: 0, origem: "senha" as const,
      })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const senhasFiltradas = todasSenhas.filter((item) => {
    const matchBusca =
      item.senha.nomePessoa.toLowerCase().includes(busca.toLowerCase()) ||
      `${item.senha.prefixo}${item.senha.numero.toString().padStart(3, "0")}`.includes(busca);
    const matchStatus = filtroStatus === "todos" || item.senha.status === filtroStatus;

    const dataItem = new Date(item.data);
    const hoje = new Date();
    let matchData = true;
    if (filtroData === "hoje") matchData = dataItem.toDateString() === hoje.toDateString();
    else if (filtroData === "semana") {
      const diff = (hoje.getTime() - dataItem.getTime()) / (1000 * 60 * 60 * 24);
      matchData = diff <= 7;
    } else if (filtroData === "mes") {
      matchData = dataItem.getMonth() === hoje.getMonth() && dataItem.getFullYear() === hoje.getFullYear();
    }
    return matchBusca && matchStatus && matchData;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'finalizado':
        return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'cancelado':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-md border border-black/5 shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou senha..."
              className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 pl-10 text-sm font-sans text-black placeholder:text-slate-400 focus:outline-none focus:border-[#C9A227]/50 focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="border border-black/10 bg-white/70 rounded-sm px-3 py-2.5 text-sm font-sans text-black focus:outline-none focus:border-[#C9A227]/50"
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Este mês</option>
              <option value="todos">Todas as datas</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="border border-black/10 bg-white/70 rounded-sm px-3 py-2.5 text-sm font-sans text-black focus:outline-none focus:border-[#C9A227]/50"
            >
              <option value="todos">Todos os status</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {senhasFiltradas.length === 0 ? (
          <div className="bg-white rounded-md border border-black/5 shadow-sm p-12 text-center">
            <p className="text-sm font-inter text-slate-400">Nenhum registro encontrado</p>
          </div>
        ) : (
          senhasFiltradas.map((item) => (
            <div key={item.id} className="bg-white rounded-md border border-black/5 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-2xl font-normal font-[var(--font-heading)] text-[#C9A227]">
                    {item.senha.prefixo}{item.senha.numero.toString().padStart(3, "0")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-inter text-sm text-black">{item.senha.nomePessoa}</p>
                  <div className="flex items-center gap-2 text-xs font-inter text-slate-500">
                    <span>{TIPOS_ATENDIMENTO[item.senha.tipoAtendimento]?.label}</span>
                    {item.fila && (
                      <>
                        <span className="text-slate-300">|</span>
                        <span>{item.fila.nome}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-inter text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatarData(item.data)}
                    </span>
                    {item.tempoEspera > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Espera: {item.tempoEspera}min
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className={`self-start sm:self-center inline-flex px-3 py-1 rounded-full text-xs font-inter font-medium border ${statusBadge(item.senha.status)}`}>
                {STATUS_LABELS[item.senha.status]}
              </span>
            </div>
          ))
        )}
      </div>

      {senhasFiltradas.length > 0 && (
        <p className="text-center text-sm font-inter text-slate-400">
          {senhasFiltradas.length} registro{senhasFiltradas.length !== 1 ? 's' : ''} encontrado{senhasFiltradas.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
