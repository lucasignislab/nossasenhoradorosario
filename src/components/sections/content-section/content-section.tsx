'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  text: string;
  image: string;
  reverse?: boolean;
}

export const ContentSection = ({ title, subtitle = '', text, image, reverse = false }: ContentSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.5);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calcula a distância desde a entrada no viewport até a saída total
      const distanceFromBottom = viewportHeight - rect.top;
      const totalDistance = rect.height + viewportHeight;
      
      // Normaliza o progresso entre 0 e 1
      const rawProgress = distanceFromBottom / totalDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Executa uma vez inicialmente para pegar o estado atual
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cálculos dinâmicos baseados no progresso do Scroll
  const imageScale = 1.05 + (scrollProgress - 0.5) * 0.12; // Efeito de zoom-in sutil
  const borderX = 16 + (scrollProgress - 0.5) * -30; // Borda se move no sentido contrário ao scroll
  const borderY = 16 + (scrollProgress - 0.5) * -30;
  const textY = (scrollProgress - 0.5) * -50; // Texto move mais devagar, criando profundidade 3D
  const lightSweepX = (scrollProgress * 250) - 100; // Movimento de luz que varre a foto de -100% a 150%

  return (
    <section 
      ref={sectionRef}
      className="py-32 md:py-44 lg:py-52 relative bg-[#FAF5EC] overflow-hidden"
    >
      <div className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center gap-16 md:gap-24 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Bloco de Imagem - Zoom Cinemático, Parallax de Borda e Varredura de Luz */}
        <div className="w-full md:w-5/12 relative group">
          {/* Borda fina de offset minimalista com paralaxe reverso */}
          <div 
            className="absolute inset-0 border border-black/10 rounded-sm pointer-events-none transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${borderX}px, ${borderY}px)`,
            }}
          />
          
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-black shadow-2xl z-20">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover opacity-90 grayscale contrast-110 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out"
              style={{
                transform: `scale(${imageScale})`,
                transition: 'transform 0.1s ease-out, filter 0.7s, opacity 0.7s',
              }}
            />
            {/* Varredura de Luz Cinemática (Light Sweep) */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30"
              style={{
                transform: `translateX(${lightSweepX}%) skewX(-30deg)`,
                mixBlendMode: 'overlay',
                transition: 'transform 0.1s ease-out',
              }}
            />
            {/* Gradiente escuro para profundidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none z-25" />
          </div>
        </div>

        {/* Bloco de Texto - Tipografia com deslocamento Parallax vertical */}
        <div 
          className="w-full md:w-7/12 text-left relative z-30 transition-transform duration-150 ease-out"
          style={{
            transform: `translateY(${textY}px)`,
          }}
        >
          {subtitle && (
            <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[#6F6F6F] mb-4 font-inter">
              {subtitle}
            </span>
          )}
          
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-normal font-[var(--font-heading)] leading-[0.95] tracking-[-1.5px] text-black mb-8"
          >
            {title}
          </h2>
          
          {/* Divisor minimalista de linha fina */}
          <div className="w-16 h-[1px] bg-black/15 mb-8" />
          
          <p 
            className="text-base md:text-lg text-[#6F6F6F] leading-relaxed whitespace-pre-line font-inter max-w-xl"
          >
            {text}
          </p>
        </div>

      </div>
    </section>
  );
};