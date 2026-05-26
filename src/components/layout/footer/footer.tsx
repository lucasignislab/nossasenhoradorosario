import React from 'react';
import Link from 'next/link';

// SVGs Inline para não depender de pacotes externos na Home
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-sacred-red)]"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-24 pb-12 bg-[var(--color-dark)] text-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 font-inter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Coluna 1: Sobre / Logo */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 font-inter">
                T. U.
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-[var(--font-heading)] -mt-1.5">
                Senhora do<span className="text-[var(--color-sacred-red)] font-semibold"> Rosário</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-cream)]/70">
              Um espaço dedicado à caridade, ao amor e ao desenvolvimento espiritual através dos fundamentos da Umbanda e Guias de Luz.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-6">Navegação</h4>
            <ul className="space-y-4 text-sm text-[var(--color-cream)]/75">
              <li><Link href="/" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Início</Link></li>
              <li><Link href="/sobre" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">A Nossa Casa</Link></li>
              <li><Link href="/agenda" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Agenda de Giras</Link></li>
              <li><Link href="/eventos" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Eventos</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Fundamentos e Blog</Link></li>
              <li><Link href="/design-system" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Design System</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Área Administrativa */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-6">Membros</h4>
            <ul className="space-y-4 text-sm text-[var(--color-cream)]/75">
              <li><Link href="/login" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Área do Filho</Link></li>
              <li><Link href="/financeiro" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Mensalidades</Link></li>
              <li><Link href="/materiais" className="hover:text-[var(--color-sacred-gold)] transition-colors duration-300">Materiais de Estudo</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-6">Redes Sociais</h4>
            <div className="flex space-x-3">
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-full border border-white/10 hover:border-[var(--color-sacred-gold)] hover:bg-[var(--color-sacred-gold)]/10 text-[var(--color-cream)] transition-all duration-300">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Facebook" className="p-2.5 rounded-full border border-white/10 hover:border-[var(--color-sacred-gold)] hover:bg-[var(--color-sacred-gold)]/10 text-[var(--color-cream)] transition-all duration-300">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Youtube" className="p-2.5 rounded-full border border-white/10 hover:border-[var(--color-sacred-gold)] hover:bg-[var(--color-sacred-gold)]/10 text-[var(--color-cream)] transition-all duration-300">
                <YoutubeIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Linha Inferior: Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-cream)]/60">
          <p>© {currentYear} Terreiro Senhora do Rosário. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5 italic">
            Desenvolvido com <HeartIcon /> para a comunidade.
          </p>
        </div>
      </div>
    </footer>
  );
};