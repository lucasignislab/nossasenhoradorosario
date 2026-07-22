/**
 * STORE ZUSTAND - GESTÃO DE SENHAS
 * Copie este arquivo para: src/store/useSenhaStore.ts
 * 
 * Pré-requisito: npm install zustand
 */

'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Senha, Fila, TipoAtendimento, StatusSenha, HistoricoAtendimento } from "@/types/senhas";

interface SenhaState {
  filas: Fila[];
  filaAtiva: string | null;
  senhas: Senha[];
  senhaAtualChamada: Senha | null;
  historico: HistoricoAtendimento[];

  adicionarFila: (fila: Omit<Fila, "id">) => void;
  removerFila: (id: string) => void;
  toggleFila: (id: string) => void;
  setFilaAtiva: (id: string) => void;

  gerarSenha: (nomePessoa: string, tipoAtendimento: TipoAtendimento, observacao?: string) => Senha | null;
  chamarProxima: () => Senha | null;
  chamarSenhaEspecifica: (senhaId: string) => Senha | null;
  finalizarAtendimento: (senhaId: string) => void;
  cancelarSenha: (senhaId: string) => void;

  getSenhasPorFila: (filaId: string) => Senha[];
  getSenhasAguardando: () => Senha[];
  getSenhasHoje: () => Senha[];
  getEstatisticasHoje: () => { total: number; atendidos: number; aguardando: number; tempoMedio: number };

  zerarTodasSenhas: () => void;
}

const gerarId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const TIPO_PARA_FILA: Record<TipoAtendimento, string> = {
  consulta_espiritual: "CE",
  gira: "GR",
  desenvolvimento: "DM",
  evento: "EV",
  acao_social: "AS",
};

export const useSenhaStore = create<SenhaState>()(
  persist(
    (set, get) => ({
      // ─── Estado Inicial ───
      filas: [
        { id: "fila-1", nome: "Consultas Espirituais", tipoAtendimento: "consulta_espiritual", prefixo: "CE", senhaAtual: 0, ativa: true, cor: "#C9A227" },
        { id: "fila-2", nome: "Giras", tipoAtendimento: "gira", prefixo: "GR", senhaAtual: 0, ativa: true, cor: "#8B3A2A" },
        { id: "fila-3", nome: "Desenvolvimento", tipoAtendimento: "desenvolvimento", prefixo: "DM", senhaAtual: 0, ativa: true, cor: "#4A7C59" },
      ],
      filaAtiva: "fila-1",
      senhas: [],
      senhaAtualChamada: null,
      historico: [],

      // ─── Filas ───
      adicionarFila: (fila) => {
        const newFila: Fila = { ...fila, id: gerarId() };
        set((state) => ({ filas: [...state.filas, newFila] }));
      },

      removerFila: (id) => {
        set((state) => ({
          filas: state.filas.filter((f) => f.id !== id),
          filaAtiva: state.filaAtiva === id ? state.filas[0]?.id || null : state.filaAtiva,
        }));
      },

      toggleFila: (id) => {
        set((state) => ({
          filas: state.filas.map((f) => f.id === id ? { ...f, ativa: !f.ativa } : f),
        }));
      },

      setFilaAtiva: (id) => set({ filaAtiva: id }),

      // ─── Senhas ───
      gerarSenha: (nomePessoa, tipoAtendimento, observacao) => {
        const state = get();
        const fila = state.filas.find((f) => f.tipoAtendimento === tipoAtendimento && f.ativa);
        if (!fila) return null;

        const novoNumero = fila.senhaAtual + 1;
        const prefixo = TIPO_PARA_FILA[tipoAtendimento];

        const novaSenha: Senha = {
          id: gerarId(),
          numero: novoNumero,
          prefixo,
          tipoAtendimento,
          nomePessoa,
          status: "aguardando",
          dataCriacao: new Date().toISOString(),
          observacao,
        };

        set((s) => ({
          senhas: [...s.senhas, novaSenha],
          filas: s.filas.map((f) => f.id === fila.id ? { ...f, senhaAtual: novoNumero } : f),
        }));

        return novaSenha;
      },

      chamarProxima: () => {
        const state = get();
        const filaAtiva = state.filas.find((f) => f.id === state.filaAtiva && f.ativa);
        if (!filaAtiva) return null;

        const proxima = state.senhas
          .filter((s) => s.tipoAtendimento === filaAtiva.tipoAtendimento && s.status === "aguardando")
          .sort((a, b) => a.numero - b.numero)[0];

        if (!proxima) return null;

        const senhaChamada: Senha = {
          ...proxima,
          status: "chamando",
          dataChamada: new Date().toISOString(),
        };

        const senhaAnterior = state.senhaAtualChamada;

        set((s) => ({
          senhas: s.senhas.map((sen) => sen.id === proxima.id ? senhaChamada : sen),
          senhaAtualChamada: senhaChamada,
        }));

        if (senhaAnterior?.status === "atendendo") {
          get().finalizarAtendimento(senhaAnterior.id);
        }

        setTimeout(() => {
          set((s) => ({
            senhas: s.senhas.map((sen) => sen.id === proxima.id ? { ...sen, status: "atendendo" } : sen),
            senhaAtualChamada: { ...senhaChamada, status: "atendendo" },
          }));
        }, 3000);

        return senhaChamada;
      },

      chamarSenhaEspecifica: (senhaId) => {
        const state = get();
        const senha = state.senhas.find((s) => s.id === senhaId);
        if (!senha || senha.status !== "aguardando") return null;

        const senhaChamada: Senha = {
          ...senha,
          status: "chamando",
          dataChamada: new Date().toISOString(),
        };

        const senhaAnterior = state.senhaAtualChamada;

        set((s) => ({
          senhas: s.senhas.map((sen) => sen.id === senhaId ? senhaChamada : sen),
          senhaAtualChamada: senhaChamada,
        }));

        if (senhaAnterior?.status === "atendendo") {
          get().finalizarAtendimento(senhaAnterior.id);
        }

        setTimeout(() => {
          set((s) => ({
            senhas: s.senhas.map((sen) => sen.id === senhaId ? { ...sen, status: "atendendo" } : sen),
            senhaAtualChamada: { ...senhaChamada, status: "atendendo" },
          }));
        }, 3000);

        return senhaChamada;
      },

      finalizarAtendimento: (senhaId) => {
        const state = get();
        const senha = state.senhas.find((s) => s.id === senhaId);
        if (!senha) return;

        const senhaFinalizada: Senha = {
          ...senha,
          status: "finalizado",
          dataFinalizacao: new Date().toISOString(),
        };

        const fila = state.filas.find((f) => f.tipoAtendimento === senha.tipoAtendimento);
        const tempoEspera = senha.dataChamada
          ? Math.round((new Date(senha.dataChamada).getTime() - new Date(senha.dataCriacao).getTime()) / 60000)
          : 0;
        const tempoAtendimento = senha.dataChamada
          ? Math.round((new Date().getTime() - new Date(senha.dataChamada).getTime()) / 60000)
          : 0;

        const registroHistorico: HistoricoAtendimento = {
          id: gerarId(),
          senha: senhaFinalizada,
          fila: fila || state.filas[0],
          tempoEsperaMinutos: tempoEspera,
          tempoAtendimentoMinutos: tempoAtendimento,
          data: new Date().toISOString(),
        };

        set((s) => ({
          senhas: s.senhas.map((sen) => sen.id === senhaId ? senhaFinalizada : sen),
          historico: [...s.historico, registroHistorico],
        }));
      },

      cancelarSenha: (senhaId) => {
        set((s) => ({
          senhas: s.senhas.map((sen) =>
            sen.id === senhaId && sen.status === "aguardando"
              ? { ...sen, status: "cancelado" as StatusSenha }
              : sen
          ),
        }));
      },

      // ─── Getters ───
      getSenhasPorFila: (filaId) => {
        const state = get();
        const fila = state.filas.find((f) => f.id === filaId);
        if (!fila) return [];
        return state.senhas
          .filter((s) => s.tipoAtendimento === fila.tipoAtendimento)
          .sort((a, b) => b.numero - a.numero);
      },

      getSenhasAguardando: () => {
        return get().senhas
          .filter((s) => s.status === "aguardando")
          .sort((a, b) => a.numero - b.numero);
      },

      getSenhasHoje: () => {
        const hoje = new Date().toDateString();
        return get().senhas.filter((s) => new Date(s.dataCriacao).toDateString() === hoje);
      },

      getEstatisticasHoje: () => {
        const senhasHoje = get().getSenhasHoje();
        const atendidos = senhasHoje.filter((s) => s.status === "finalizado");
        const aguardando = senhasHoje.filter((s) => s.status === "aguardando" || s.status === "chamando" || s.status === "atendendo");

        const temposEspera = get().historico
          .filter((h) => new Date(h.data).toDateString() === new Date().toDateString())
          .map((h) => h.tempoEsperaMinutos)
          .filter((t) => t > 0);

        const tempoMedio = temposEspera.length > 0
          ? Math.round(temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length)
          : 0;

        return { total: senhasHoje.length, atendidos: atendidos.length, aguardando: aguardando.length, tempoMedio };
      },

      zerarTodasSenhas: () => {
        set((s) => ({
          senhas: [],
          senhaAtualChamada: null,
          filas: s.filas.map((f) => ({ ...f, senhaAtual: 0 })),
        }));
      },
    }),
    {
      name: "senhas-storage",
      partialize: (state) => ({
        filas: state.filas,
        senhas: state.senhas,
        historico: state.historico,
        filaAtiva: state.filaAtiva,
      }),
    }
  )
);
