import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSenhaStore } from "@/store/useSenhaStore";
import { TIPOS_ATENDIMENTO, STATUS_LABELS } from "@/types/senhas";
import { History, Search, Calendar, Clock, Filter } from "lucide-react";

export default function HistoricoPage() {
  const { historico, senhas } = useSenhaStore();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroData, setFiltroData] = useState<string>("hoje");

  // Combinar histórico + senhas finalizadas/canceladas
  const todasSenhas = [
    ...historico.map((h) => ({
      id: h.id,
      senha: h.senha,
      fila: h.fila,
      data: h.data,
      tempoEspera: h.tempoEsperaMinutos,
      tempoAtendimento: h.tempoAtendimentoMinutos,
      origem: "historico" as const,
    })),
    ...senhas
      .filter((s) => s.status === "cancelado")
      .map((s) => ({
        id: s.id,
        senha: s,
        fila: null,
        data: s.dataCriacao,
        tempoEspera: 0,
        tempoAtendimento: 0,
        origem: "senha" as const,
      })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Filtros
  const senhasFiltradas = todasSenhas.filter((item) => {
    // Busca por nome ou número
    const matchBusca = 
      item.senha.nomePessoa.toLowerCase().includes(busca.toLowerCase()) ||
      `${item.senha.prefixo}${item.senha.numero.toString().padStart(3, "0")}`.includes(busca);
    
    // Filtro status
    const matchStatus = filtroStatus === "todos" || item.senha.status === filtroStatus;
    
    // Filtro data
    const dataItem = new Date(item.data);
    const hoje = new Date();
    let matchData = true;
    
    if (filtroData === "hoje") {
      matchData = dataItem.toDateString() === hoje.toDateString();
    } else if (filtroData === "semana") {
      const diff = (hoje.getTime() - dataItem.getTime()) / (1000 * 60 * 60 * 24);
      matchData = diff <= 7;
    } else if (filtroData === "mes") {
      matchData = dataItem.getMonth() === hoje.getMonth() && dataItem.getFullYear() === hoje.getFullYear();
    }
    
    return matchBusca && matchStatus && matchData;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-sacred-dark">
      <Header />
      <div className="h-20" />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sacred-gold">
              <History className="w-5 h-5" />
              <span className="text-sm font-body tracking-[0.2em] uppercase">Registros</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-sacred-cream">Histórico de Atendimentos</h1>
          </div>

          {/* Filtros */}
          <div className="glass-dark rounded-sm p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sacred-cream/30" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou senha..."
                  className="w-full pl-10 pr-4 py-2.5 bg-sacred-dark/60 border border-sacred-gold/20 rounded-sm
                           text-sacred-cream font-body placeholder:text-sacred-cream/20
                           focus:outline-none focus:border-sacred-gold/50 text-sm"
                />
              </div>

              {/* Filtro Data */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sacred-cream/40" />
                <select
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="px-3 py-2.5 bg-sacred-dark/60 border border-sacred-gold/20 rounded-sm
                           text-sacred-cream font-body text-sm focus:outline-none focus:border-sacred-gold/50"
                >
                  <option value="hoje">Hoje</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Este mês</option>
                  <option value="todos">Todas as datas</option>
                </select>
              </div>

              {/* Filtro Status */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-sacred-cream/40" />
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-3 py-2.5 bg-sacred-dark/60 border border-sacred-gold/20 rounded-sm
                           text-sacred-cream font-body text-sm focus:outline-none focus:border-sacred-gold/50"
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
              <div className="glass-dark rounded-sm p-12 text-center">
                <History className="w-12 h-12 text-sacred-cream/10 mx-auto mb-4" />
                <p className="text-sacred-cream/40 font-body">
                  Nenhum registro encontrado
                </p>
              </div>
            ) : (
              senhasFiltradas.map((item) => (
                <div
                  key={item.id}
                  className="glass-dark rounded-sm p-4 flex flex-col sm:flex-row sm:items-center 
                           justify-between gap-4 hover:border-sacred-gold/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[80px]">
                      <p className="font-heading text-2xl text-sacred-gold">
                        {item.senha.prefixo}{item.senha.numero.toString().padStart(3, "0")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-sacred-cream">{item.senha.nomePessoa}</p>
                      <div className="flex items-center gap-2 text-xs font-body">
                        <span className="text-sacred-cream/40">
                          {TIPOS_ATENDIMENTO[item.senha.tipoAtendimento]?.label}
                        </span>
                        {item.fila && (
                          <>
                            <span className="text-sacred-cream/20">|</span>
                            <span className="text-sacred-cream/40">{item.fila.nome}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-body text-sacred-cream/30">
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

                  <span className={`self-start sm:self-center inline-flex px-3 py-1 rounded-full text-xs 
                                 font-body font-medium border ${
                    item.senha.status === "finalizado"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : item.senha.status === "cancelado"
                      ? "bg-sacred-red/10 text-sacred-red border-sacred-red/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}>
                    {STATUS_LABELS[item.senha.status]}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Contador */}
          {senhasFiltradas.length > 0 && (
            <p className="text-center text-sm font-body text-sacred-cream/30">
              {senhasFiltradas.length} registro{senhasFiltradas.length !== 1 ? "s" : ""} encontrado{senhasFiltradas.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
