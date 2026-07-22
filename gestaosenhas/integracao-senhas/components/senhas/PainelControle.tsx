/**
 * PAINEL DE CONTROLE ADMINISTRATIVO
 * Copie para: src/components/senhas/PainelControle.tsx
 * 
 * Estilo: Glassmorphism escuro + botões conforme Design System Orixá.
 */

'use client';

import { useSenhaStore } from "@/store/useSenhaStore";
import { STATUS_LABELS, TIPOS_ATENDIMENTO } from "@/types/senhas";
import { SkipForward, RotateCcw, Ban, CheckCircle2, AlertTriangle, Play, Square } from "lucide-react";
import { useState } from "react";

export default function PainelControle() {
  const {
    senhaAtualChamada, filas, filaAtiva, setFilaAtiva,
    chamarProxima, chamarSenhaEspecifica, finalizarAtendimento,
    cancelarSenha, getSenhasAguardando, zerarTodasSenhas,
  } = useSenhaStore();

  const [mostrarZerar, setMostrarZerar] = useState(false);
  const aguardando = getSenhasAguardando();

  const handleZerar = () => {
    zerarTodasSenhas();
    setMostrarZerar(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'chamando':
        return 'bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/40 animate-pulse';
      case 'atendendo':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-[#8B3A2A]/20 text-[#C97B6B] border-[#8B3A2A]/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Senha Atual — Glassmorphism */}
      <div className="relative overflow-hidden rounded-sm border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg p-8 text-center space-y-4 shadow-lg">
        <p className="text-sm font-inter tracking-[0.2em] uppercase text-[#C9A227]">Senha em Atendimento</p>

        {senhaAtualChamada ? (
          <div className="space-y-3">
            <div className="font-normal font-[var(--font-heading)] text-6xl sm:text-7xl text-[#C9A227]"
              style={{ textShadow: '0 0 30px rgba(201,162,39,0.3)' }}>
              {senhaAtualChamada.prefixo}{senhaAtualChamada.numero.toString().padStart(3, "0")}
            </div>
            <div className="space-y-1">
              <p className="font-inter text-[#FAF5EC]">{senhaAtualChamada.nomePessoa}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-inter border ${statusBadge(senhaAtualChamada.status)}`}>
                {STATUS_LABELS[senhaAtualChamada.status]}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <p className="text-4xl font-normal font-[var(--font-heading)] text-[#FAF5EC]/20">---</p>
            <p className="text-sm font-inter text-[#FAF5EC]/40 mt-2">Nenhuma senha em atendimento</p>
          </div>
        )}
      </div>

      {/* Botões de Controle */}
      <div className="grid grid-cols-2 gap-3">
        {/* Chamar Próxima — Primário Terracota */}
        <button
          onClick={chamarProxima}
          disabled={aguardando.length === 0}
          className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-[#8B3A2A] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <SkipForward className="w-5 h-5" />
          Chamar Próxima
        </button>

        {/* Finalizar */}
        <button
          onClick={() => senhaAtualChamada && finalizarAtendimento(senhaAtualChamada.id)}
          disabled={!senhaAtualChamada || senhaAtualChamada.status === 'finalizado'}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-green-500/10 text-green-400 font-inter text-xs font-semibold uppercase tracking-widest rounded-sm border border-green-500/30 transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          Finalizar
        </button>

        {/* Finalizar e Chamar */}
        <button
          onClick={() => {
            if (senhaAtualChamada?.status === 'atendendo') finalizarAtendimento(senhaAtualChamada.id);
            chamarProxima();
          }}
          disabled={aguardando.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#8B3A2A]/20 text-[#C97B6B] font-inter text-xs font-semibold uppercase tracking-widest rounded-sm border border-[#8B3A2A]/30 transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[#8B3A2A]/30"
        >
          <Square className="w-4 h-4" />
          Finalizar e Chamar
        </button>
      </div>

      {/* Seleção de Fila — Glassmorphism */}
      <div className="rounded-sm p-4 space-y-3 bg-[#0D0B08]/40 backdrop-blur-lg border border-white/5">
        <p className="text-sm font-inter text-[#FAF5EC]/60">Fila Ativa</p>
        <div className="flex flex-wrap gap-2">
          {filas.filter((f) => f.ativa).map((fila) => {
            const isActive = filaAtiva === fila.id;
            return (
              <button
                key={fila.id}
                onClick={() => setFilaAtiva(fila.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-inter transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40'
                    : 'bg-[#0D0B08]/60 text-[#FAF5EC]/50 border border-white/5 hover:border-[#C9A227]/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fila.cor }} />
                {fila.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fila de Espera — Glassmorphism */}
      <div className="rounded-sm p-4 space-y-3 bg-[#0D0B08]/40 backdrop-blur-lg border border-white/5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-inter text-[#FAF5EC]/60">Fila de Espera ({aguardando.length})</p>
          <button
            onClick={() => setMostrarZerar(true)}
            className="flex items-center gap-1.5 text-xs font-inter text-[#8B3A2A] hover:text-[#C97B6B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Zerar tudo
          </button>
        </div>

        {aguardando.length === 0 ? (
          <p className="text-sm font-inter text-center py-4 text-[#FAF5EC]/30">Nenhuma senha na fila</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {aguardando.map((senha) => (
              <div key={senha.id} className="flex items-center justify-between p-3 bg-[#0D0B08]/40 rounded-sm border border-[#C9A227]/5 hover:border-[#C9A227]/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-normal font-[var(--font-heading)] text-[#C9A227]">
                    {senha.prefixo}{senha.numero.toString().padStart(3, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-inter text-[#FAF5EC]">{senha.nomePessoa}</p>
                    <p className="text-xs font-inter text-[#FAF5EC]/40">
                      {TIPOS_ATENDIMENTO[senha.tipoAtendimento]?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => chamarSenhaEspecifica(senha.id)}
                    className="p-2 text-[#C9A227]/60 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded-sm transition-all cursor-pointer"
                    title="Chamar agora"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => cancelarSenha(senha.id)}
                    className="p-2 text-[#FAF5EC]/30 hover:text-[#C97B6B] hover:bg-[#8B3A2A]/10 rounded-sm transition-all cursor-pointer"
                    title="Cancelar"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Zerar */}
      {mostrarZerar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative overflow-hidden rounded-sm border border-white/5 bg-[#0D0B08]/95 backdrop-blur-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[#8B3A2A]" />
              <h3 className="text-lg font-normal font-[var(--font-heading)] text-[#FAF5EC]">Zerar todas as senhas?</h3>
            </div>
            <p className="text-sm font-inter text-[#FAF5EC]/60">
              Isso apagará todas as senhas e reiniciará as filas. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarZerar(false)}
                className="flex-1 py-2.5 border border-[#C9A227]/20 text-[#FAF5EC] font-inter text-sm rounded-sm transition-all hover:bg-white/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleZerar}
                className="flex-1 py-2.5 bg-[#8B3A2A] text-[#FAF5EC] font-inter text-sm rounded-sm transition-all hover:bg-[#702E21] cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
