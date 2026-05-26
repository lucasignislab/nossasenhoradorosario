'use client';

import React, { useRef } from 'react';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-sacred-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-sacred-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-sacred-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

interface ValueCardProps {
  title: string;
  description: string;
  Icon: React.ReactNode;
}

const ValueCard = ({ title, description, Icon }: ValueCardProps) => (
  <div className="relative group p-8 lg:p-10 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg hover:border-[var(--color-sacred-gold)]/20 hover:bg-[#2A2318]/25 transition-all duration-500 rounded-sm overflow-hidden shadow-lg hover:shadow-[var(--color-sacred-gold)]/5">
    {/* Decoração superior - linha fina dourada acendendo no hover */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--color-sacred-gold)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
    
    {/* Ícone flutuando levemente no hover */}
    <div className="mb-8 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 ease-out">
      {Icon}
    </div>
    
    <h3 className="text-2xl font-normal text-[var(--color-cream)] mb-4 font-[var(--font-heading)] leading-tight tracking-wide">
      {title}
    </h3>
    
    <p className="text-[var(--color-cream)] opacity-65 font-sans leading-relaxed text-sm md:text-base group-hover:opacity-85 transition-opacity">
      {description}
    </p>
  </div>
);

export const ValuesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    section.style.setProperty('--mouse-x', `${x}px`);
    section.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="py-32 md:py-40 bg-[var(--color-dark)] relative overflow-hidden"
    >
      {/* Luz ambiente estática em vermelho terracota */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--color-sacred-red)_0%,_transparent_75%)] pointer-events-none" />
      
      {/* Spotlight interativo dourado guiado pelo mouse (Efeito Vela) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45 transition-opacity duration-300"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201, 162, 39, 0.12), transparent 80%)`,
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-4 font-inter">
            Nossos Pilares
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[var(--color-cream)] mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
            O Tripé da Umbanda
          </h2>
          {/* Divisor minimalista fino */}
          <div className="w-16 h-[1px] bg-white/10 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <ValueCard 
            title="Caridade" 
            description="O amor em ação. Acolhemos a todos sem distinção, entregando energia, passe e aconselhamento com o coração aberto."
            Icon={<HeartIcon />}
          />
          <ValueCard 
            title="Estudo" 
            description="A fé não é cega. Buscamos o entendimento dos mistérios, das ervas e da teologia umbandista para servir melhor."
            Icon={<BookOpenIcon />}
          />
          <ValueCard 
            title="Comunidade" 
            description="O terreiro é um quilombo moderno. Somos uma família que se apoia, trabalhando a evolução através da fraternidade."
            Icon={<UsersIcon />}
          />
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
