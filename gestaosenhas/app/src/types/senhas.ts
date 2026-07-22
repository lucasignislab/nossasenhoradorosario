export type TipoAtendimento = 
  | "consulta_espiritual" 
  | "gira" 
  | "desenvolvimento" 
  | "evento" 
  | "acao_social";

export type StatusSenha = "aguardando" | "chamando" | "atendendo" | "finalizado" | "cancelado";

export interface Senha {
  id: string;
  numero: number;
  prefixo: string;
  tipoAtendimento: TipoAtendimento;
  nomePessoa: string;
  status: StatusSenha;
  dataCriacao: string;
  dataChamada?: string;
  dataFinalizacao?: string;
  observacao?: string;
}

export interface Fila {
  id: string;
  nome: string;
  tipoAtendimento: TipoAtendimento;
  prefixo: string;
  senhaAtual: number;
  ativa: boolean;
  cor: string;
}

export interface HistoricoAtendimento {
  id: string;
  senha: Senha;
  fila: Fila;
  tempoEsperaMinutos: number;
  tempoAtendimentoMinutos?: number;
  data: string;
}

export const TIPOS_ATENDIMENTO: Record<TipoAtendimento, { label: string; icone: string }> = {
  consulta_espiritual: { label: "Consulta Espiritual", icone: "Sparkles" },
  gira: { label: "Gira", icone: "Flame" },
  desenvolvimento: { label: "Desenvolvimento Mediúnico", icone: "Eye" },
  evento: { label: "Evento", icone: "Calendar" },
  acao_social: { label: "Ação Social", icone: "Heart" },
};

export const STATUS_LABELS: Record<StatusSenha, string> = {
  aguardando: "Aguardando",
  chamando: "Chamando",
  atendendo: "Em Atendimento",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};
