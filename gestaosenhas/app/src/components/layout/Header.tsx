import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Menu, X, Home, Monitor, BarChart3, History } from "lucide-react";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Início", icone: Home },
    { href: "/painel", label: "Painel de Controle", icone: Monitor },
    { href: "/historico", label: "Histórico", icone: History },
    { href: "/relatorios", label: "Relatórios", icone: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-sacred border-b border-sacred-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start">
            <span className="text-[10px] font-body font-semibold tracking-[0.3em] text-sacred-gold uppercase">
              T. U.
            </span>
            <span className="font-heading text-xl text-sacred-cream leading-tight">
              Senhora do Rosário
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-body transition-all duration-300 ${
                  isActive(link.href)
                    ? "text-sacred-gold bg-sacred-gold/10 border border-sacred-gold/30"
                    : "text-sacred-cream/70 hover:text-sacred-gold hover:bg-white/5"
                }`}
              >
                <link.icone className="w-4 h-4" />
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 text-sacred-cream hover:text-sacred-gold transition-colors"
          >
            {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuAberto && (
        <div className="md:hidden glass-sacred border-t border-sacred-gold/20">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-body transition-all ${
                  isActive(link.href)
                    ? "text-sacred-gold bg-sacred-gold/10"
                    : "text-sacred-cream/70 hover:text-sacred-gold hover:bg-white/5"
                }`}
              >
                <link.icone className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
