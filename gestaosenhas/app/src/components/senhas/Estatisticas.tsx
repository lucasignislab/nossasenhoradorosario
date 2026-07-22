import { useSenhaStore } from "@/store/useSenhaStore";
import { TIPOS_ATENDIMENTO } from "@/types/senhas";
import { Users, CheckCircle2, Clock, TrendingUp, Activity } from "lucide-react";

export default function Estatisticas() {
  const { getEstatisticasHoje, filas, senhas } = useSenhaStore();
  const stats = getEstatisticasHoje();

  // Senhas por tipo hoje
  const hoje = new Date().toDateString();
  const senhasHoje = senhas.filter((s) => new Date(s.dataCriacao).toDateString() === hoje);
  
  const porTipo = filas.map((fila) => {
    const count = senhasHoje.filter((s) => s.tipoAtendimento === fila.tipoAtendimento).length;
    return { ...fila, count };
  }).filter((f) => f.count > 0);

  const cards = [
    {
      label: "Total de Senhas",
      value: stats.total,
      icone: Users,
      cor: "text-sacred-gold",
      bg: "bg-sacred-gold/10",
    },
    {
      label: "Atendidos",
      value: stats.atendidos,
      icone: CheckCircle2,
      cor: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Aguardando",
      value: stats.aguardando,
      icone: Clock,
      cor: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Tempo Médio",
      value: `${stats.tempoMedio}min`,
      icone: TrendingUp,
      cor: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="glass-dark rounded-sm p-4 space-y-3 hover:border-sacred-gold/20 transition-all"
          >
            <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}>
              <card.icone className={`w-5 h-5 ${card.cor}`} />
            </div>
            <div>
              <p className="text-2xl font-heading text-sacred-cream">{card.value}</p>
              <p className="text-xs font-body text-sacred-cream/50">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Distribuição por Tipo */}
      {porTipo.length > 0 && (
        <div className="glass-dark rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sacred-gold" />
            <h3 className="font-heading text-lg text-sacred-cream">
              Distribuição por Tipo
            </h3>
          </div>
          
          <div className="space-y-3">
            {porTipo.map((fila) => {
              const percentual = Math.round((fila.count / stats.total) * 100);
              return (
                <div key={fila.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body text-sacred-cream/70">
                      {TIPOS_ATENDIMENTO[fila.tipoAtendimento]?.label || fila.nome}
                    </span>
                    <span className="font-body text-sacred-cream/50">
                      {fila.count} ({percentual}%)
                    </span>
                  </div>
                  <div className="h-2 bg-sacred-dark rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${percentual}%`, 
                        backgroundColor: fila.cor 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status das Filas */}
      <div className="glass-dark rounded-sm p-6 space-y-4">
        <h3 className="font-heading text-lg text-sacred-cream">Status das Filas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filas.map((fila) => {
            const senhasFila = senhasHoje.filter((s) => s.tipoAtendimento === fila.tipoAtendimento);
            const aguardando = senhasFila.filter((s) => s.status === "aguardando").length;
            const atendidos = senhasFila.filter((s) => s.status === "finalizado").length;
            
            return (
              <div
                key={fila.id}
                className={`p-4 rounded-sm border ${
                  fila.ativa 
                    ? "border-sacred-gold/20 bg-sacred-gold/5" 
                    : "border-white/5 bg-sacred-dark/40 opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: fila.cor }} 
                  />
                  <span className="text-sm font-body text-sacred-cream">
                    {fila.nome}
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-body">
                  <span className="text-amber-400">{aguardando} aguardando</span>
                  <span className="text-emerald-400">{atendidos} atendidos</span>
                </div>
                <div className="mt-2 text-xs font-body text-sacred-cream/30">
                  Última senha: {fila.prefixo}{fila.senhaAtual.toString().padStart(3, "0")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
