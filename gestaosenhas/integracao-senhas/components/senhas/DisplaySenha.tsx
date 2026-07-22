/**
 * DISPLAY PÚBLICO DA SENHA ATUAL
 * Copie para: src/components/senhas/DisplaySenha.tsx
 * 
 * Página pública para consulentes acompanharem a fila.
 * Estilo: Dark Glassmorphism conforme Design System Orixá.
 */

'use client';

import { useSenhaStore } from "@/store/useSenhaStore";
import { TIPOS_ATENDIMENTO, STATUS_LABELS } from "@/types/senhas";
import { Volume2, Users, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function DisplaySenha() {
  const { senhaAtualChamada, getSenhasAguardando, filas, filaAtiva } = useSenhaStore();
  const [horaAtual, setHoraAtual] = useState(new Date());
  const [piscar, setPiscar] = useState(false);

  const aguardando = getSenhasAguardando();
  const filaAtual = filas.find((f) => f.id === filaAtiva);
  const tipoInfo = senhaAtualChamada ? TIPOS_ATENDIMENTO[senhaAtualChamada.tipoAtendimento] : null;

  useEffect(() => {
    const timer = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (senhaAtualChamada?.status === "chamando") {
      setPiscar(true);
      const timer = setTimeout(() => setPiscar(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [senhaAtualChamada?.id, senhaAtualChamada?.status]);

  const falarSenha = () => {
    if (!senhaAtualChamada) return;
    const texto = `Senha ${senhaAtualChamada.prefixo} ${senhaAtualChamada.numero.toString().padStart(3, "0")}`;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const statusStyle = (status: string) => {
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header do Display */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#C9A227]">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-inter tracking-wider">
            {horaAtual.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <h2 className="text-2xl font-normal font-[var(--font-heading)] text-[#FAF5EC]">
          Sistema de Atendimento
        </h2>
        {filaAtual && (
          <p className="text-sm font-inter text-[#C9A227]">{filaAtual.nome}</p>
        )}
      </div>

      {/* Card Principal da Senha — Glassmorphism */}
      <div className={`relative overflow-hidden rounded-sm border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg transition-all duration-500 ${piscar ? 'animate-pulse shadow-[0_0_30px_rgba(201,162,39,0.2)]' : 'shadow-lg'}`}>
        <div className="p-8 sm:p-12 text-center space-y-6">
          {/* Label */}
          <div className="flex items-center justify-center gap-2 text-[#C9A227]">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-inter tracking-[0.2em] uppercase">Senha Atual</span>
            <Sparkles className="w-5 h-5" />
          </div>

          {/* Número da Senha */}
          {senhaAtualChamada ? (
            <div className="space-y-4">
              <div className="font-normal font-[var(--font-heading)] text-7xl sm:text-8xl text-[#C9A227] tracking-wider"
                style={{ textShadow: '0 0 30px rgba(201,162,39,0.3), 0 0 60px rgba(201,162,39,0.1)' }}>
                {senhaAtualChamada.prefixo}{senhaAtualChamada.numero.toString().padStart(3, "0")}
              </div>

              <div className="space-y-2">
                <span className={`inline-block px-4 py-1.5 rounded-sm text-xs font-inter font-medium border ${statusStyle(senhaAtualChamada.status)}`}>
                  {STATUS_LABELS[senhaAtualChamada.status]}
                </span>

                {tipoInfo && (
                  <p className="text-sm font-inter text-[#FAF5EC]/60">{tipoInfo.label}</p>
                )}

                {senhaAtualChamada.nomePessoa && (
                  <p className="text-lg font-inter text-[#FAF5EC]">{senhaAtualChamada.nomePessoa}</p>
                )}
              </div>

              {/* Botão de voz — Glassmorphism */}
              <button
                onClick={falarSenha}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-500 hover:border-[#C9A227]/30 hover:bg-[#2A2318]/25 hover:shadow-[#C9A227]/5 active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#C9A227]" />
                Chamar por Voz
              </button>
            </div>
          ) : (
            <div className="py-12 space-y-4">
              <div className="text-5xl font-normal font-[var(--font-heading)] text-[#FAF5EC]/20">---</div>
              <p className="text-sm font-inter text-[#FAF5EC]/40">Nenhuma senha chamada</p>
            </div>
          )}
        </div>
      </div>

      {/* Contador de Aguardando — Glassmorphism */}
      <div className="rounded-sm p-6 bg-[#0D0B08]/40 backdrop-blur-lg border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <p className="text-sm font-inter text-[#FAF5EC]/60">Pessoas na fila</p>
              <p className="text-2xl font-normal font-[var(--font-heading)] text-[#FAF5EC]">{aguardando.length}</p>
            </div>
          </div>

          {aguardando.length > 0 && (
            <div className="text-right">
              <p className="text-xs font-inter text-[#FAF5EC]/40">Próxima senha</p>
              <p className="text-lg font-normal font-[var(--font-heading)] text-[#C9A227]">
                {aguardando[0]?.prefixo}{aguardando[0]?.numero.toString().padStart(3, "0")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lista das próximas senhas */}
      {aguardando.length > 1 && (
        <div className="rounded-sm p-6 space-y-4 bg-[#0D0B08]/40 backdrop-blur-lg border border-white/5">
          <h3 className="text-lg font-normal font-[var(--font-heading)] text-[#FAF5EC]">Próximas Senhas</h3>
          <div className="flex flex-wrap gap-2">
            {aguardando.slice(1, 10).map((senha) => (
              <span key={senha.id} className="px-3 py-1.5 bg-[#0D0B08]/60 border border-[#C9A227]/10 rounded-sm text-sm font-inter text-[#FAF5EC]/70">
                {senha.prefixo}{senha.numero.toString().padStart(3, "0")}
              </span>
            ))}
            {aguardando.length > 10 && (
              <span className="px-3 py-1.5 text-sm font-inter text-[#FAF5EC]/40">+{aguardando.length - 10} mais</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
