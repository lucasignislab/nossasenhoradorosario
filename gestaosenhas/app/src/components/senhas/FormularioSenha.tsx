import { useState } from "react";
import { useSenhaStore } from "@/store/useSenhaStore";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types/senhas";
import { UserPlus, CheckCircle2, Sparkles, Flame, Eye, Calendar, Heart } from "lucide-react";

const ICONE_MAP = {
  Sparkles,
  Flame,
  Eye,
  Calendar,
  Heart,
};

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

    const filaExiste = filas.some(
      (f) => f.tipoAtendimento === tipo && f.ativa
    );
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

  return (
    <div className="glass-sacred rounded-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sacred-gold/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-sacred-gold" />
        </div>
        <div>
          <h2 className="font-heading text-xl text-sacred-cream">Nova Senha</h2>
          <p className="text-sm font-body text-sacred-cream/50">
            Gere uma senha para atendimento
          </p>
        </div>
      </div>

      {sucesso && ultimaSenha && (
        <div className="animate-ticket bg-sacred-gold/10 border border-sacred-gold/30 rounded-sm p-4 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-sacred-gold mx-auto" />
          <p className="font-body text-sm text-sacred-gold">Senha gerada com sucesso!</p>
          <p className="font-heading text-4xl text-sacred-gold text-shadow-glow">{ultimaSenha}</p>
          <p className="text-xs font-body text-sacred-cream/50">
            Aguarde ser chamado. Boa sorte!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <label className="text-sm font-body text-sacred-cream/70">Nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da pessoa"
            className="w-full px-4 py-3 bg-sacred-dark/60 border border-sacred-gold/20 rounded-sm
                     text-sacred-cream font-body placeholder:text-sacred-cream/20
                     focus:outline-none focus:border-sacred-gold/60 focus:ring-1 focus:ring-sacred-gold/30
                     transition-all"
            required
          />
        </div>

        {/* Tipo de Atendimento */}
        <div className="space-y-2">
          <label className="text-sm font-body text-sacred-cream/70">Tipo de atendimento</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.entries(TIPOS_ATENDIMENTO) as [TipoAtendimento, typeof TIPOS_ATENDIMENTO[TipoAtendimento]][])
              .filter(([key]) => filas.some((f) => f.tipoAtendimento === key && f.ativa))
              .map(([key, value]) => {
                const Icone = ICONE_MAP[value.icone as keyof typeof ICONE_MAP];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTipo(key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-sm border text-left transition-all ${
                      tipo === key
                        ? "border-sacred-gold/60 bg-sacred-gold/10 text-sacred-gold"
                        : "border-sacred-gold/10 bg-sacred-dark/40 text-sacred-cream/60 hover:border-sacred-gold/30 hover:bg-sacred-dark/60"
                    }`}
                  >
                    <Icone className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-body">{value.label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Observação */}
        <div className="space-y-2">
          <label className="text-sm font-body text-sacred-cream/70">
            Observação <span className="text-sacred-cream/30">(opcional)</span>
          </label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Alguma informação adicional..."
            rows={2}
            className="w-full px-4 py-3 bg-sacred-dark/60 border border-sacred-gold/20 rounded-sm
                     text-sacred-cream font-body placeholder:text-sacred-cream/20 resize-none
                     focus:outline-none focus:border-sacred-gold/60 focus:ring-1 focus:ring-sacred-gold/30
                     transition-all"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full py-3.5 bg-sacred-gold hover:bg-sacred-gold/90 text-sacred-dark font-body 
                   font-semibold rounded-sm transition-all duration-300 hover:shadow-lg 
                   hover:shadow-sacred-gold/20 active:scale-[0.98]"
        >
          Gerar Senha
        </button>
      </form>
    </div>
  );
}
