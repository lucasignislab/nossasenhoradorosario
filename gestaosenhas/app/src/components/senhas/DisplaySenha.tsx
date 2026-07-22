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
  const tipoInfo = senhaAtualChamada 
    ? TIPOS_ATENDIMENTO[senhaAtualChamada.tipoAtendimento] 
    : null;

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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header do Display */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sacred-gold">
          <Clock className="w-4 h-4" />
          <span className="font-body text-sm tracking-wider">
            {horaAtual.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <h2 className="font-heading text-2xl text-sacred-cream">
          Sistema de Atendimento
        </h2>
        {filaAtual && (
          <p className="text-sm text-sacred-gold font-body">{filaAtual.nome}</p>
        )}
      </div>

      {/* Card Principal da Senha */}
      <div className={`relative rounded-sm overflow-hidden transition-all duration-500 ${
        piscar ? "ring-2 ring-sacred-gold animate-pulse-gold" : ""
      }`}>
        <div className="glass-sacred p-8 sm:p-12 text-center space-y-6">
          {/* Label */}
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-sacred-gold" />
            <span className="text-sm font-body tracking-[0.2em] uppercase text-sacred-gold">
              Senha Atual
            </span>
            <Sparkles className="w-5 h-5 text-sacred-gold" />
          </div>

          {/* Número da Senha */}
          {senhaAtualChamada ? (
            <div className="space-y-4">
              <div className="font-heading text-7xl sm:text-8xl text-sacred-gold text-shadow-glow tracking-wider">
                {senhaAtualChamada.prefixo}{senhaAtualChamada.numero.toString().padStart(3, "0")}
              </div>
              
              <div className="space-y-2">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-body font-medium ${
                  senhaAtualChamada.status === "chamando"
                    ? "bg-sacred-gold/20 text-sacred-gold border border-sacred-gold/40 animate-pulse"
                    : senhaAtualChamada.status === "atendendo"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-sacred-red/20 text-sacred-red border border-sacred-red/40"
                }`}>
                  {STATUS_LABELS[senhaAtualChamada.status]}
                </span>
                
                {tipoInfo && (
                  <p className="text-sacred-cream/60 font-body text-sm">
                    {tipoInfo.label}
                  </p>
                )}
                
                {senhaAtualChamada.nomePessoa && (
                  <p className="text-sacred-cream font-body text-lg">
                    {senhaAtualChamada.nomePessoa}
                  </p>
                )}
              </div>

              {/* Botão de voz */}
              <button
                onClick={falarSenha}
                className="inline-flex items-center gap-2 px-6 py-3 bg-sacred-gold/10 hover:bg-sacred-gold/20 
                         border border-sacred-gold/30 hover:border-sacred-gold/60 rounded-sm
                         text-sacred-gold text-sm font-body transition-all duration-300
                         hover:scale-105 active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                Chamar por Voz
              </button>
            </div>
          ) : (
            <div className="py-12 space-y-4">
              <div className="font-heading text-5xl text-sacred-cream/20">
                ---
              </div>
              <p className="text-sacred-cream/40 font-body">
                Nenhuma senha chamada
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contador de Aguardando */}
      <div className="glass-dark rounded-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sacred-gold/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-sacred-gold" />
            </div>
            <div>
              <p className="text-sm font-body text-sacred-cream/60">Pessoas na fila</p>
              <p className="text-2xl font-heading text-sacred-cream">{aguardando.length}</p>
            </div>
          </div>
          
          {aguardando.length > 0 && (
            <div className="text-right">
              <p className="text-xs font-body text-sacred-cream/40">Próxima senha</p>
              <p className="text-lg font-heading text-sacred-gold">
                {aguardando[0]?.prefixo}{aguardando[0]?.numero.toString().padStart(3, "0")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lista das próximas senhas */}
      {aguardando.length > 1 && (
        <div className="glass-dark rounded-sm p-6 space-y-4">
          <h3 className="font-heading text-lg text-sacred-cream">Próximas Senhas</h3>
          <div className="flex flex-wrap gap-2">
            {aguardando.slice(1, 10).map((senha) => (
              <span
                key={senha.id}
                className="px-3 py-1.5 bg-sacred-dark/60 border border-sacred-gold/10 
                         rounded-sm text-sm font-body text-sacred-cream/70"
              >
                {senha.prefixo}{senha.numero.toString().padStart(3, "0")}
              </span>
            ))}
            {aguardando.length > 10 && (
              <span className="px-3 py-1.5 text-sm font-body text-sacred-cream/40">
                +{aguardando.length - 10} mais
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
