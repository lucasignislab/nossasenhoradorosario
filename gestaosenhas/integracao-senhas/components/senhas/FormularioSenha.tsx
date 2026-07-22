/**
 * FORMULÁRIO DE GERAÇÃO DE NOVA SENHA
 * Copie para: src/components/senhas/FormularioSenha.tsx
 * 
 * Estilo: Cards brancos + inputs conforme Design System Orixá.
 */

'use client';

import { useState } from "react";
import { useSenhaStore } from "@/store/useSenhaStore";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types/senhas";
import { UserPlus, CheckCircle2, Sparkles, Flame, Eye, Calendar, Heart } from "lucide-react";

const ICONE_MAP = { Sparkles, Flame, Eye, Calendar, Heart };

export default function FormularioSenha() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoAtendimento>("consulta_espiritual");
  const [observacao, setObservacao] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [ultimaSenha, setUltimaSenha] = useState<string | null>(null);

  const { gerarSenha, filas } = useSenhaStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const filaExiste = filas.some((f) => f.tipoAtendimento === tipo && f.ativa);
    if (!filaExiste) {
      alert("Não há fila ativa para este tipo de atendimento.");
      return;
    }

    const senha = gerarSenha(nome.trim(), tipo, observacao.trim() || undefined);
    if (senha) {
      setUltimaSenha(`${senha.prefixo}${senha.numero.toString().padStart(3, "0")}`);
      setSucesso(true);
      setNome("");
      setObservacao("");
      setTimeout(() => setSucesso(false), 5000);
    }
  };

  const filasAtivas = filas.filter((f) => f.ativa);

  return (
    <div className="bg-white rounded-md border border-black/5 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-[#C9A227]" />
        </div>
        <div>
          <h2 className="text-xl font-normal font-[var(--font-heading)] text-black">Nova Senha</h2>
          <p className="text-sm font-inter text-slate-500">Gere uma senha para atendimento</p>
        </div>
      </div>

      {/* Sucesso */}
      {sucesso && ultimaSenha && (
        <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-sm p-4 text-center space-y-2 animate-[ticket-print_0.5s_ease-out]">
          <CheckCircle2 className="w-8 h-8 text-[#C9A227] mx-auto" />
          <p className="text-sm font-inter text-[#C9A227]">Senha gerada com sucesso!</p>
          <p className="text-4xl font-normal font-[var(--font-heading)] text-[#C9A227]"
            style={{ textShadow: '0 0 30px rgba(201,162,39,0.3)' }}>
            {ultimaSenha}
          </p>
          <p className="text-xs font-inter text-slate-500">Aguarde ser chamado. Boa sorte!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-inter">
            Nome completo
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da pessoa"
            required
            className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans text-black placeholder:text-slate-400 focus:outline-none focus:border-[#C9A227]/50 focus:bg-white transition-all duration-300"
          />
        </div>

        {/* Tipo de Atendimento */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-inter">
            Tipo de atendimento
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filasAtivas.map((fila) => {
              const Icone = ICONE_MAP[fila.tipoAtendimento === 'consulta_espiritual' ? 'Sparkles' : fila.tipoAtendimento === 'gira' ? 'Flame' : 'Eye'];
              const isSelected = tipo === fila.tipoAtendimento;

              return (
                <button
                  key={fila.id}
                  type="button"
                  onClick={() => setTipo(fila.tipoAtendimento)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm border text-left text-sm font-inter transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#C9A227]/60 bg-[#C9A227]/10 text-[#C9A227]'
                      : 'border-black/5 bg-white/70 text-slate-600 hover:border-[#C9A227]/30 hover:bg-white'
                  }`}
                >
                  <Icone className="w-5 h-5 shrink-0" />
                  {fila.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Observação */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-inter">
            Observação <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Alguma informação adicional..."
            rows={2}
            className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans text-black placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#C9A227]/50 focus:bg-white transition-all duration-300"
          />
        </div>

        {/* Botão Primário Terracota — conforme Design System */}
        <button
          type="submit"
          className="w-full px-6 py-3.5 bg-[#8B3A2A] hover:bg-black text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          Gerar Senha
        </button>
      </form>
    </div>
  );
}
