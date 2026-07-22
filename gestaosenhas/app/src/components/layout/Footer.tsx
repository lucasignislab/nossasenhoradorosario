import { Link } from "react-router";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-sacred-gold/10 bg-sacred-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-body font-semibold tracking-[0.3em] text-sacred-gold uppercase">
                T. U.
              </span>
              <span className="font-heading text-lg text-sacred-cream">
                Senhora do Rosário
              </span>
            </div>
            <p className="text-sm text-sacred-cream/50 font-body leading-relaxed">
              Sistema de Gestão de Senhas e Atendimentos
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-sacred-gold text-sm mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Início" },
                { to: "/painel", label: "Painel de Controle" },
                { to: "/historico", label: "Histórico" },
                { to: "/relatorios", label: "Relatórios" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-sacred-cream/50 hover:text-sacred-gold transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading text-sacred-gold text-sm mb-4">Sobre</h4>
            <p className="text-sm text-sacred-cream/50 font-body leading-relaxed">
              Sistema desenvolvido exclusivamente para o Terreiro de Umbanda 
              Senhora do Rosário. Tecnologia a serviço da espiritualidade.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-sacred-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sacred-cream/30 font-body">
            &copy; {new Date().getFullYear()} T. U. Senhora do Rosário. Todos os direitos reservados.
          </p>
          <p className="text-xs text-sacred-cream/30 font-body flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-sacred-red fill-sacred-red" /> para a nossa casa
          </p>
        </div>
      </div>
    </footer>
  );
}
