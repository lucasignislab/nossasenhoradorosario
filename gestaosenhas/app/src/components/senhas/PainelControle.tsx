import { useSenhaStore } from "@/store/useSenhaStore";
import { STATUS_LABELS, TIPOS_ATENDIMENTO } from "@/types/senhas";
import { 
  SkipForward, RotateCcw, Ban, CheckCircle2, AlertTriangle,
  Play, Square
} from "lucide-react";
import { useState } from "react";

export default function PainelControle() {
  const {
    senhaAtualChamada,
    filas,
    filaAtiva,
    setFilaAtiva,
    chamarProxima,
    chamarSenhaEspecifica,
    finalizarAtendimento,
    cancelarSenha,
    getSenhasAguardando,
    zerarTodasSenhas,
  } = useSenhaStore();

  const [mostrarZerar, setMostrarZerar] = useState(false);
  const aguardando = getSenhasAguardando();

  const handleZerar = () => {
    zerarTodasSenhas();
    setMostrarZerar(false);
  };

  return (
    <div className="space-y-6">
      {/* Fila Atual Display */}
      <div className="glass-sacred rounded-sm p-8 text-center space-y-4">
        <p className="text-sm font-body tracking-[0.2em] uppercase text-sacred-gold">
          Senha em Atendimento
        </p>
        
        {senhaAtualChamada ? (
          <div className="space-y-3">
            <div className="font-heading text-6xl sm:text-7xl text-sacred-gold text-shadow-glow">
              {senhaAtualChamada.prefixo}{senhaAtualChamada.numero.toString().padStart(3, "0")}
            </div>
            <div className="space-y-1">
              <p className="text-sacred-cream font-body">{senhaAtualChamada.nomePessoa}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-body ${
                senhaAtualChamada.status === "atendendo"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-sacred-gold/20 text-sacred-gold border border-sacred-gold/40 animate-pulse"
              }`}>
                {STATUS_LABELS[senhaAtualChamada.status]}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <p className="font-heading text-4xl text-sacred-cream/20">---</p>
            <p className="text-sacred-cream/40 font-body text-sm mt-2">
              Nenhuma senha em atendimento
            </p>
          </div>
        )}
      </div>

      {/* Botões de Controle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={chamarProxima}
          disabled={aguardando.length === 0}
          className="col-span-2 flex items-center justify-center gap-2 py-4 bg-sacred-gold hover:bg-sacred-gold/90 
                   disabled:opacity-30 disabled:cursor-not-allowed
                   text-sacred-dark font-body font-semibold rounded-sm transition-all 
                   duration-300 hover:shadow-lg hover:shadow-sacred-gold/20 active:scale-[0.98]"
        >
          <SkipForward className="w-5 h-5" />
          Chamar Próxima
        </button>

        <button
          onClick={() => senhaAtualChamada && finalizarAtendimento(senhaAtualChamada.id)}
          disabled={!senhaAtualChamada || senhaAtualChamada.status === "finalizado"}
          className="flex items-center justify-center gap-2 py-3 bg-emerald-600/20 hover:bg-emerald-600/30
                   border border-emerald-500/30 hover:border-emerald-500/50
                   disabled:opacity-30 disabled:cursor-not-allowed
                   text-emerald-400 font-body rounded-sm transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="w-4 h-4" />
          Finalizar
        </button>

        <button
          onClick={() => {
            if (senhaAtualChamada && senhaAtualChamada.status === "atendendo") {
              finalizarAtendimento(senhaAtualChamada.id);
            }
            chamarProxima();
          }}
          disabled={aguardando.length === 0}
          className="flex items-center justify-center gap-2 py-3 bg-sacred-red/20 hover:bg-sacred-red/30
                   border border-sacred-red/30 hover:border-sacred-red/50
                   disabled:opacity-30 disabled:cursor-not-allowed
                   text-sacred-red font-body rounded-sm transition-all active:scale-[0.98]"
        >
          <Square className="w-4 h-4" />
          Finalizar e Chamar
        </button>
      </div>

      {/* Seleção de Fila */}
      <div className="glass-dark rounded-sm p-4 space-y-3">
        <p className="text-sm font-body text-sacred-cream/60">Fila Ativa</p>
        <div className="flex flex-wrap gap-2">
          {filas.filter((f) => f.ativa).map((fila) => {
            const Icone = TIPOS_ATENDIMENTO[fila.tipoAtendimento]?.icone;
            return (
              <button
                key={fila.id}
                onClick={() => setFilaAtiva(fila.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body transition-all ${
                  filaAtiva === fila.id
                    ? "bg-sacred-gold/20 text-sacred-gold border border-sacred-gold/40"
                    : "bg-sacred-dark/60 text-sacred-cream/50 border border-white/5 hover:border-sacred-gold/20"
                }`}
              >
                {Icone && (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fila.cor }} />
                )}
                {fila.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fila de Espera - Admin */}
      <div className="glass-dark rounded-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-body text-sacred-cream/60">
            Fila de Espera ({aguardando.length})
          </p>
          <button
            onClick={() => setMostrarZerar(true)}
            className="flex items-center gap-1.5 text-xs font-body text-sacred-red/60 
                     hover:text-sacred-red transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Zerar tudo
          </button>
        </div>

        {aguardando.length === 0 ? (
          <p className="text-sm font-body text-sacred-cream/30 py-4 text-center">
            Nenhuma senha na fila
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {aguardando.map((senha) => (
              <div
                key={senha.id}
                className="flex items-center justify-between p-3 bg-sacred-dark/40 rounded-sm
                         border border-sacred-gold/5 hover:border-sacred-gold/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-heading text-lg text-sacred-gold">
                    {senha.prefixo}{senha.numero.toString().padStart(3, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-body text-sacred-cream">{senha.nomePessoa}</p>
                    <p className="text-xs font-body text-sacred-cream/40">
                      {TIPOS_ATENDIMENTO[senha.tipoAtendimento]?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => chamarSenhaEspecifica(senha.id)}
                    className="p-2 text-sacred-gold/60 hover:text-sacred-gold hover:bg-sacred-gold/10 
                             rounded-sm transition-all"
                    title="Chamar agora"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => cancelarSenha(senha.id)}
                    className="p-2 text-sacred-cream/30 hover:text-sacred-red hover:bg-sacred-red/10 
                             rounded-sm transition-all"
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

      {/* Modal de Confirmação - Zerar */}
      {mostrarZerar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-sacred rounded-sm p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-sacred-red">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg text-sacred-cream">Zerar todas as senhas?</h3>
            </div>
            <p className="text-sm font-body text-sacred-cream/60">
              Isso apagará todas as senhas e reiniciará as filas. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarZerar(false)}
                className="flex-1 py-2.5 border border-sacred-gold/20 text-sacred-cream font-body 
                         rounded-sm hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleZerar}
                className="flex-1 py-2.5 bg-sacred-red hover:bg-sacred-red/90 text-sacred-cream font-body 
                         rounded-sm transition-all"
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
