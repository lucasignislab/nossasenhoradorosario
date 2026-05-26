'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/footer";
import { 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Loader2, 
  BookOpen,
  ArrowRight,
  Info,
  ExternalLink
} from "lucide-react";

// Definição dos tokens de cores com escalas 100-900 baseadas em OKLCH
const colorPalette = {
  sacredRed: {
    name: 'Sacred Red (Terracota Profundo)',
    desc: 'Usada para realçar elementos cruciais de ação, CTAs primários e elementos simbólicos.',
    shades: [
      { grade: '100', oklch: 'oklch(0.95 0.02 28)', hex: '#FBF2F0' },
      { grade: '200', oklch: 'oklch(0.85 0.06 28)', hex: '#F4D0CA' },
      { grade: '300', oklch: 'oklch(0.72 0.11 28)', hex: '#E6A295' },
      { grade: '400', oklch: 'oklch(0.60 0.14 28)', hex: '#D07464' },
      { grade: '500', oklch: 'oklch(0.48 0.15 28)', hex: '#B34B39' },
      { grade: '600', oklch: 'oklch(0.38 0.15 28)', hex: '#8B3A2A', isBase: true },
      { grade: '700', oklch: 'oklch(0.32 0.13 28)', hex: '#702E21' },
      { grade: '800', oklch: 'oklch(0.26 0.11 28)', hex: '#572319' },
      { grade: '900', oklch: 'oklch(0.20 0.08 28)', hex: '#3E1911' },
    ]
  },
  sacredGold: {
    name: 'Sacred Gold (Dourado Ancestral)',
    desc: 'Usado para bordas de hover, detalhes decorativos delicados e status ativos.',
    shades: [
      { grade: '100', oklch: 'oklch(0.96 0.04 84)', hex: '#FDF9EB' },
      { grade: '200', oklch: 'oklch(0.91 0.09 84)', hex: '#FAF0C7' },
      { grade: '300', oklch: 'oklch(0.85 0.14 84)', hex: '#F5E296' },
      { grade: '400', oklch: 'oklch(0.78 0.16 84)', hex: '#E9CD60' },
      { grade: '500', oklch: 'oklch(0.72 0.17 84)', hex: '#C9A227', isBase: true },
      { grade: '600', oklch: 'oklch(0.62 0.15 84)', hex: '#A8841B' },
      { grade: '700', oklch: 'oklch(0.52 0.13 84)', hex: '#866712' },
      { grade: '800', oklch: 'oklch(0.42 0.11 84)', hex: '#654D09' },
      { grade: '900', oklch: 'oklch(0.32 0.08 84)', hex: '#443303' },
    ]
  },
  cream: {
    name: 'Cream (Creme Warm Neutrals)',
    desc: 'Cor de fundo principal das páginas claras, mantendo o aspecto acolhedor e limpo.',
    shades: [
      { grade: '100', oklch: 'oklch(0.99 0.005 85)', hex: '#FCFAF7' },
      { grade: '200', oklch: 'oklch(0.97 0.015 85)', hex: '#FAF5EC', isBase: true },
      { grade: '300', oklch: 'oklch(0.93 0.025 85)', hex: '#F2E9D5' },
      { grade: '400', oklch: 'oklch(0.85 0.035 85)', hex: '#DDD3BC' },
      { grade: '500', oklch: 'oklch(0.75 0.040 85)', hex: '#C4B9A1' },
      { grade: '600', oklch: 'oklch(0.63 0.035 85)', hex: '#A39983' },
      { grade: '700', oklch: 'oklch(0.50 0.030 85)', hex: '#7F7766' },
      { grade: '800', oklch: 'oklch(0.35 0.020 85)', hex: '#575144' },
      { grade: '900', oklch: 'oklch(0.20 0.010 85)', hex: '#302D26' },
    ]
  },
  dark: {
    name: 'Dark (Preto Noturno / Cool Neutrals)',
    desc: 'Cor de fundo das seções de destaque e rodapé, criando profundidade e contraste espiritual.',
    shades: [
      { grade: '100', oklch: 'oklch(0.92 0.01 70)', hex: '#EBEAEA' },
      { grade: '200', oklch: 'oklch(0.80 0.01 70)', hex: '#CCCCCC' },
      { grade: '300', oklch: 'oklch(0.65 0.01 70)', hex: '#A6A5A4' },
      { grade: '400', oklch: 'oklch(0.50 0.015 70)', hex: '#7F7E7C' },
      { grade: '500', oklch: 'oklch(0.38 0.015 70)', hex: '#605F5E' },
      { grade: '600', oklch: 'oklch(0.28 0.015 70)', hex: '#464544' },
      { grade: '700', oklch: 'oklch(0.20 0.015 70)', hex: '#30302E' },
      { grade: '800', oklch: 'oklch(0.12 0.01 70)', hex: '#0D0B08', isBase: true },
      { grade: '900', oklch: 'oklch(0.06 0.005 70)', hex: '#030302' },
    ]
  }
};

const menuAnchors = [
  { href: '#introducao', label: 'Introdução' },
  { href: '#cores', label: 'Cores (OKLCH)' },
  { href: '#tipografia', label: 'Tipografia' },
  { href: '#grid-spacing', label: 'Espaçamento (8px)' },
  { href: '#radius', label: 'Bordas e Radius' },
  { href: '#showcase-botoes', label: 'Showcase: Botões' },
  { href: '#showcase-inputs', label: 'Showcase: Inputs' },
  { href: '#showcase-componentes', label: 'Showcase: Cards & FAQ' }
];

export default function DesignSystemPage() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [faqAberto, setFaqAberto] = useState(false);
  
  // Estados para simular interações de inputs no Showcase
  const [inputNormal, setInputNormal] = useState('');
  const [inputFocus, setInputFocus] = useState('Texto focado...');
  const [inputErro, setInputErro] = useState('Texto inválido');
  const [inputPreenchido, setInputPreenchido] = useState('Preenchido com sucesso');

  const copyToClipboard = (text: string, valueId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(valueId);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const copySnippet = (code: string, codeId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Snippets de Código
  const codeSnippets = {
    btnPrimary: `<button className="px-6 py-3 bg-[#8B3A2A] hover:bg-black text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-[#C9A227] active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
  Botão Primário
</button>`,
    btnSecondary: `<button className="px-6 py-3 border border-[#C9A227]/30 hover:border-[#C9A227] bg-[#FAF5EC] text-black font-inter text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-all duration-300 hover:shadow-md active:scale-95">
  Botão Secundário
</button>`,
    btnGlass: `<button className="px-6 py-3 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg hover:border-[#C9A227]/30 hover:bg-[#2A2318]/25 text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest rounded-[2px] transition-all duration-500 shadow-lg hover:shadow-[#C9A227]/5">
  Glassmorphism Button
</button>`,
    input: `<div>
  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-inter">
    Rótulo do Campo
  </label>
  <input 
    type="text" 
    placeholder="Digite algo..." 
    className="w-full border border-black/10 bg-white/70 rounded-[2px] px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-[#C9A227]/50 focus:bg-white transition-all"
  />
</div>`,
    card: `<div className="relative group overflow-hidden rounded-md border border-black/5 hover:border-[#C9A227]/30 transition-all duration-500 min-h-[350px] p-6 flex flex-col justify-between">
  <div className="absolute inset-0 z-0">
    <img src="/flyer.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25" />
  </div>
  <div className="relative z-10">...</div>
</div>`
  };

  return (
    <main className="min-h-screen bg-[#FAF5EC] text-slate-900 font-sans">
      <Header />

      {/* Hero Simples do Design System */}
      <section className="bg-[var(--color-dark)] text-[var(--color-cream)] py-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--color-sacred-red)_0%,_transparent_75%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-3 block font-inter">
            Documentação Viva
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal font-[var(--font-heading)] leading-tight tracking-tight mb-4">
            Orixá Design System
          </h1>
          <p className="text-sm md:text-base text-white/70 font-inter max-w-2xl leading-relaxed">
            O guia oficial de estilo e biblioteca de componentes do Terreiro de Umbanda Senhora do Rosário. Construído sob a estética do <strong>Sacred Modernism</strong>, combinando tradição ancestral com interfaces digitais limpas e imersivas.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal com Sidebar de Navegação */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Barra Lateral Sumário (Fixo no Desktop) */}
        <aside className="w-full lg:w-3/12 lg:sticky lg:top-28 self-start bg-white/40 border border-black/5 rounded-md p-6 backdrop-blur-md hidden lg:block shadow-sm">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-800 mb-6 font-inter flex items-center gap-2">
            <BookOpen size={14} className="text-[var(--color-sacred-gold)]" /> Sumário
          </h3>
          <nav className="space-y-3.5">
            {menuAnchors.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block text-xs font-medium text-slate-600 hover:text-[var(--color-sacred-gold)] transition-colors font-inter"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Área Principal de Documentação */}
        <div className="w-full lg:w-9/12 space-y-24">
          
          {/* Seção 1: Introdução */}
          <section id="introducao" className="scroll-mt-28 space-y-6">
            <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black border-b border-black/10 pb-3 tracking-wide">
              Introdução ao Estilo
            </h2>
            <p className="text-slate-700 leading-relaxed font-sans text-sm md:text-base">
              A identidade do <strong>T. U. Senhora do Rosário</strong> é fundamentada na união de materiais rústicos e acolhimento ancestral com o minimalismo contemporâneo. No ambiente digital, isso se reflete em:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm">
                <h4 className="text-lg font-normal text-black font-[var(--font-heading)] mb-2">Sacred Modernism</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Uso equilibrado de tipografia de exibição serifada (Cormorant Garamond) para títulos com alto contraste em relação a uma tipografia geométrica sans-serif corporativa (Inter) nos textos de leitura e botões.
                </p>
              </div>
              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm">
                <h4 className="text-lg font-normal text-black font-[var(--font-heading)] mb-2">Dark Glassmorphism</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Painéis escuros translúcidos com bordas ultra finas iluminadas pelo mouse (Efeito Vela) criam um tom intimista de solenidade espiritual e recolhimento de axé.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 2: Cores em OKLCH */}
          <section id="cores" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Cores (OKLCH Scale)
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-inter">
                Escalas geradas matematicamente via sistema OKLCH para consistência de luminosidade nos Orixás. Clique nos botões para copiar os valores.
              </p>
            </div>

            <div className="space-y-12">
              {Object.entries(colorPalette).map(([key, item]) => (
                <div key={key} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-normal font-[var(--font-heading)] text-black mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-600 font-sans">{item.desc}</p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
                    {item.shades.map((shade, idx) => {
                      const isBase = shade.isBase;
                      const uniqueId = `${key}-${shade.grade}`;
                      return (
                        <div 
                          key={idx} 
                          className="flex flex-col rounded-sm overflow-hidden border border-black/5 bg-white shadow-xs"
                        >
                          {/* Cor do bloco */}
                          <div 
                            className="h-16 w-full relative group transition-transform duration-300"
                            style={{ backgroundColor: shade.hex }}
                          >
                            {isBase && (
                              <span className="absolute top-1 left-1 bg-white/70 backdrop-blur-xs text-[7px] font-bold uppercase tracking-wider text-slate-900 px-1 py-0.5 rounded-sm">
                                BASE
                              </span>
                            )}
                            {/* Overlay hover copiar */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                              <button 
                                onClick={() => copyToClipboard(shade.hex, `${uniqueId}-hex`)}
                                className="p-1 rounded-sm bg-white/95 text-black hover:bg-white text-[9px] font-bold flex items-center gap-0.5"
                                title="Copiar HEX"
                              >
                                {copiedValue === `${uniqueId}-hex` ? <Check size={8} /> : <Copy size={8} />} HEX
                              </button>
                              <button 
                                onClick={() => copyToClipboard(shade.oklch, `${uniqueId}-oklch`)}
                                className="p-1 rounded-sm bg-white/95 text-black hover:bg-white text-[9px] font-bold flex items-center gap-0.5"
                                title="Copiar OKLCH"
                              >
                                {copiedValue === `${uniqueId}-oklch` ? <Check size={8} /> : <Copy size={8} />} OKLCH
                              </button>
                            </div>
                          </div>
                          
                          {/* Labels */}
                          <div className="p-1.5 text-center flex flex-col font-inter">
                            <span className="text-[10px] font-bold text-slate-900">{shade.grade}</span>
                            <span className="text-[8px] text-slate-500 font-mono select-all truncate">{shade.hex}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Seção 3: Tipografia */}
          <section id="tipografia" className="scroll-mt-28 space-y-6">
            <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black border-b border-black/10 pb-3 tracking-wide">
              Tipografia
            </h2>
            <div className="space-y-8 pt-4">
              
              {/* Font 1: Heading */}
              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter block">
                  Font Heading
                </span>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-3xl font-serif text-black font-[var(--font-heading)]">Cormorant Garamond</h3>
                    <p className="text-xs text-slate-500 font-inter mt-1">
                      Serifada de exibição. Usada exclusivamente para grandes títulos, heros e chamadas de destaque.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-sm">
                    font-[var(--font-heading)]
                  </span>
                </div>
                
                <div className="border-t border-black/5 pt-4 space-y-2">
                  <h1 className="text-5xl md:text-6xl font-normal font-[var(--font-heading)] text-black">
                    Título Principal H1
                  </h1>
                  <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black">
                    Título Secundário H2
                  </h2>
                  <h3 className="text-2xl font-normal font-[var(--font-heading)] text-black">
                    Subtítulo H3
                  </h3>
                </div>
              </div>

              {/* Font 2: Body */}
              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter block">
                  Font Body
                </span>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-sans text-black font-semibold">Inter</h3>
                    <p className="text-xs text-slate-500 font-inter mt-1">
                      Sans-serif geométrica. Usada para todo o corpo de texto, rótulos de botões, links, tabelas e formulários.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-sm">
                    font-sans ou font-inter
                  </span>
                </div>
                
                <div className="border-t border-black/5 pt-4 space-y-4 text-slate-700 font-sans">
                  <p className="text-base leading-relaxed">
                    Texto de leitura padrão: A Umbanda é uma religião monoteísta e genuinamente brasileira, fundada sob a caridade espiritual, conselhos benévolos de entidades e a luz curadora dos guias de lei.
                  </p>
                  <div className="flex gap-8 text-xs font-bold font-inter uppercase tracking-wider">
                    <span>Menu / Botões (Bold): Me Inscrever</span>
                    <span className="font-medium tracking-normal text-slate-500">Metadata (Medium): 27/09/2026</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Seção 4: Espaçamento (Grid de 8px) */}
          <section id="grid-spacing" className="scroll-mt-28 space-y-6">
            <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black border-b border-black/10 pb-3 tracking-wide">
              Espaçamento (Grid de 8px)
            </h2>
            <p className="text-slate-700 leading-relaxed font-sans text-sm md:text-base">
              Nosso sistema de layout é regido por uma grade de passos de **8 pixels**, que gera consistência e harmonia no espaçamento de elementos e margens de seções.
            </p>

            <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 gap-3.5">
                {[
                  { name: '2xs (padding de formulários)', spacing: 'w-2 h-2', px: '8px', tw: 'p-2' },
                  { name: 'xs (gap entre pequenos botões)', spacing: 'w-4 h-4', px: '16px', tw: 'p-4' },
                  { name: 'sm (gap de grids e listas)', spacing: 'w-6 h-6', px: '24px', tw: 'p-6' },
                  { name: 'md (paddings de cards)', spacing: 'w-8 h-8', px: '32px', tw: 'p-8' },
                  { name: 'lg (paddings de sessões em mobile)', spacing: 'w-12 h-12', px: '48px', tw: 'p-12' },
                  { name: 'xl (distância de seções menores)', spacing: 'w-16 h-16', px: '64px', tw: 'p-16' },
                  { name: '2xl (altura de seções no desktop)', spacing: 'w-24 h-24', px: '96px', tw: 'p-24' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-inter border-b border-black/5 pb-2">
                    <span className="font-semibold text-slate-800 w-1/3">{item.name}</span>
                    <span className="text-slate-500 font-mono w-1/6">{item.px}</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-mono">{item.tw}</span>
                    <div className="w-1/3 flex justify-start">
                      <div className={`bg-[var(--color-sacred-gold)] opacity-35 rounded-xs ${item.spacing}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 5: Border Radius */}
          <section id="radius" className="scroll-mt-28 space-y-6">
            <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black border-b border-black/10 pb-3 tracking-wide">
              Bordas & Raios (Radius)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter block">
                  Raios Quadrados (Rústico/Editorial)
                </span>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold font-inter rounded-none border border-white/10 shadow-md">
                    None (0px)
                  </div>
                  <div className="w-20 h-20 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold font-inter rounded-sm border border-white/10 shadow-md">
                    SM (2px)
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-2">
                  Usados para **botões, campos de entrada de formulários e cards de glassmorphism**. A borda quase reta e reta transmite o modernismo refinado e a seriedade litúrgica da nossa casa.
                </p>
              </div>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter block">
                  Raios Arredondados (Fluidez)
                </span>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold font-inter rounded-md border border-white/10 shadow-md">
                    MD (6px)
                  </div>
                  <div className="w-20 h-20 bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold font-inter rounded-full border border-white/10 shadow-md">
                    Full
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-2">
                  Usado em **cards normais de giras** (`rounded-md`) e em **botões pílula de navegação secundária / categorias** (`rounded-full`), criando flexibilidade e contraste visual.
                </p>
              </div>

            </div>
          </section>

          {/* Seção 6: Showcase de Botões */}
          <section id="showcase-botoes" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Showcase: Estados de Botões
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-inter">
                Renderizações interativas em tempo real de todas as variantes de botões e seus estados funcionais.
              </p>
            </div>

            <div className="space-y-12">
              
              {/* Variante 1: Primário Terracota */}
              <div className="space-y-4 p-6 bg-white rounded-md border border-black/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-normal text-black font-[var(--font-heading)]">Primário Terracota</h4>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">bg-[#8B3A2A]</span>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Normal */}
                  <div className="flex flex-col gap-1 items-center">
                    <button className="px-5 py-2.5 bg-[#8B3A2A] hover:bg-black text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer">
                      Normal / Hover
                    </button>
                    <span className="text-[9px] text-slate-500 font-inter mt-1">Interativo</span>
                  </div>

                  {/* Active / Pressionado */}
                  <div className="flex flex-col gap-1 items-center">
                    <button className="px-5 py-2.5 bg-black text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm scale-95 shadow-lg">
                      Active
                    </button>
                    <span className="text-[9px] text-slate-500 font-inter mt-1">Simulado</span>
                  </div>

                  {/* Disabled */}
                  <div className="flex flex-col gap-1 items-center">
                    <button disabled className="px-5 py-2.5 bg-[#8B3A2A] text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm opacity-50 cursor-not-allowed">
                      Disabled
                    </button>
                    <span className="text-[9px] text-slate-500 font-inter mt-1">Estático</span>
                  </div>

                  {/* Loading */}
                  <div className="flex flex-col gap-1 items-center">
                    <button disabled className="px-5 py-2.5 bg-[#8B3A2A] text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm opacity-80 cursor-wait flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" /> Carregando
                    </button>
                    <span className="text-[9px] text-slate-500 font-inter mt-1">Estático</span>
                  </div>
                </div>

                {/* Copiador de código */}
                <div className="mt-6 pt-4 border-t border-black/5">
                  <button 
                    onClick={() => copySnippet(codeSnippets.btnPrimary, 'btn-primary-code')}
                    className="text-[10px] font-bold text-[var(--color-sacred-gold)] uppercase tracking-wider font-inter flex items-center gap-1 focus:outline-none hover:text-black transition-colors"
                  >
                    {copiedCode === 'btn-primary-code' ? <Check size={10} /> : <Copy size={10} />} Copiar Snippet React/Tailwind
                  </button>
                </div>
              </div>

              {/* Variante 2: Secundário Gold */}
              <div className="space-y-4 p-6 bg-white rounded-md border border-black/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-normal text-black font-[var(--font-heading)]">Secundário Dourado Outlined</h4>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">border-[#C9A227]</span>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Normal */}
                  <div className="flex flex-col gap-1 items-center">
                    <button className="px-5 py-2.5 border border-[#C9A227]/30 hover:border-[#C9A227] bg-[#FAF5EC] hover:bg-white text-black font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 hover:shadow-md active:scale-95 cursor-pointer">
                      Normal / Hover
                    </button>
                    <span className="text-[9px] text-slate-500 font-inter mt-1">Interativo</span>
                  </div>

                  {/* Disabled */}
                  <div className="flex flex-col gap-1 items-center">
                    <button disabled className="px-5 py-2.5 border border-[#C9A227]/10 bg-[#FAF5EC] text-slate-400 font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm opacity-50 cursor-not-allowed">
                      Disabled
                    </button>
                    <span className="text-[9px] text-slate-500 font-inter mt-1">Estático</span>
                  </div>
                </div>

                {/* Copiador de código */}
                <div className="mt-6 pt-4 border-t border-black/5">
                  <button 
                    onClick={() => copySnippet(codeSnippets.btnSecondary, 'btn-secondary-code')}
                    className="text-[10px] font-bold text-[var(--color-sacred-gold)] uppercase tracking-wider font-inter flex items-center gap-1 focus:outline-none hover:text-black transition-colors"
                  >
                    {copiedCode === 'btn-secondary-code' ? <Check size={10} /> : <Copy size={10} />} Copiar Snippet React/Tailwind
                  </button>
                </div>
              </div>

              {/* Variante 3: Dark Glassmorphism */}
              <div className="space-y-4 p-6 bg-[var(--color-dark)] text-white rounded-md border border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-normal text-[var(--color-cream)] font-[var(--font-heading)]">Dark Glassmorphism</h4>
                  <span className="text-[10px] font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded-sm">bg-black/40 backdrop-blur</span>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Normal */}
                  <div className="flex flex-col gap-1 items-center">
                    <button className="px-5 py-2.5 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg hover:border-[var(--color-sacred-gold)]/30 hover:bg-[#2A2318]/25 text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm transition-all duration-500 shadow-lg hover:shadow-[var(--color-sacred-gold)]/5 cursor-pointer">
                      Normal / Hover
                    </button>
                    <span className="text-[9px] text-white/50 font-inter mt-1">Interativo</span>
                  </div>

                  {/* Active */}
                  <div className="flex flex-col gap-1 items-center">
                    <button className="px-5 py-2.5 border border-[var(--color-sacred-gold)]/40 bg-[#2A2318]/40 text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-widest rounded-sm shadow-xl shadow-[var(--color-sacred-gold)]/5">
                      Active
                    </button>
                    <span className="text-[9px] text-white/50 font-inter mt-1">Simulado</span>
                  </div>
                </div>

                {/* Copiador de código */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => copySnippet(codeSnippets.btnGlass, 'btn-glass-code')}
                    className="text-[10px] font-bold text-[var(--color-sacred-gold)] uppercase tracking-wider font-inter flex items-center gap-1 focus:outline-none hover:text-white transition-colors"
                  >
                    {copiedCode === 'btn-glass-code' ? <Check size={10} /> : <Copy size={10} />} Copiar Snippet React/Tailwind
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Seção 7: Showcase de Inputs */}
          <section id="showcase-inputs" className="scroll-mt-28 space-y-6">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Showcase: Campos de Formulário (Inputs)
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-inter">
                Demonstração viva e interativa dos campos de texto com todos os estados funcionais mapeados.
              </p>
            </div>

            <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Estado Normal / Interativo */}
                <div>
                  <label htmlFor="input-norm" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-inter">
                    Campo Interativo (Normal)
                  </label>
                  <input
                    id="input-norm"
                    type="text"
                    value={inputNormal}
                    onChange={(e) => setInputNormal(e.target.value)}
                    placeholder="Digite aqui e interaja..."
                    className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all duration-300"
                  />
                  <span className="block text-[9px] text-slate-400 font-inter mt-1">Interativo (teste o foco e digitação)</span>
                </div>

                {/* 2. Estado Focus (Simulado) */}
                <div>
                  <label htmlFor="input-foc" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-inter">
                    Estado Focus (Focado)
                  </label>
                  <input
                    id="input-foc"
                    type="text"
                    value={inputFocus}
                    onChange={(e) => setInputFocus(e.target.value)}
                    className="w-full border border-[var(--color-sacred-gold)]/50 bg-white rounded-sm px-3.5 py-2.5 text-sm font-sans focus:outline-none"
                  />
                  <span className="block text-[9px] text-[var(--color-sacred-gold)] font-inter mt-1">Borda com brilho dourado sutil</span>
                </div>

                {/* 3. Estado Erro */}
                <div>
                  <label htmlFor="input-err" className="block text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-1.5 font-inter">
                    Nome Completo (Erro)
                  </label>
                  <input
                    id="input-err"
                    type="text"
                    value={inputErro}
                    onChange={(e) => setInputErro(e.target.value)}
                    className="w-full border border-red-500 bg-red-500/5 rounded-sm px-3.5 py-2.5 text-sm font-sans text-red-900 focus:outline-none"
                  />
                  <span className="block text-[10px] text-red-600 font-sans mt-1">O preenchimento deste campo é obrigatório.</span>
                </div>

                {/* 4. Estado Desabilitado */}
                <div>
                  <label htmlFor="input-dis" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-inter">
                    Campo Desabilitado
                  </label>
                  <input
                    id="input-dis"
                    disabled
                    type="text"
                    value="Não editável"
                    className="w-full border border-black/5 bg-slate-100 text-slate-400 rounded-sm px-3.5 py-2.5 text-sm font-sans cursor-not-allowed"
                  />
                  <span className="block text-[9px] text-slate-400 font-inter mt-1">Estático</span>
                </div>

              </div>

              {/* Copiador de código */}
              <div className="mt-6 pt-4 border-t border-black/5">
                <button 
                  onClick={() => copySnippet(codeSnippets.input, 'input-code')}
                  className="text-[10px] font-bold text-[var(--color-sacred-gold)] uppercase tracking-wider font-inter flex items-center gap-1 focus:outline-none hover:text-black transition-colors"
                >
                  {copiedCode === 'input-code' ? <Check size={10} /> : <Copy size={10} />} Copiar Snippet React/Tailwind
                </button>
              </div>

            </div>
          </section>

          {/* Seção 8: Cards & FAQ */}
          <section id="showcase-componentes" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Showcase: Cards & FAQ
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-inter">
                Biblioteca de componentes estruturais e organizacionais do site.
              </p>
            </div>

            {/* Sub-Showcase: EventCard */}
            <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-normal text-black font-[var(--font-heading)]">Flyer EventCard (Agenda/Eventos)</h4>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">Card com Flyer</span>
              </div>

              <div className="max-w-md mx-auto">
                {/* Elemento Renderizado */}
                <div className="relative group overflow-hidden rounded-md border border-black/5 hover:border-[var(--color-sacred-gold)]/30 transition-all duration-500 ease-out shadow-md hover:shadow-2xl flex flex-col justify-between min-h-[350px] p-6 cursor-pointer">
                  {/* Background Flyer */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800" 
                      alt="Gira de Pretos Velhos" 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 pointer-events-none" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 flex justify-between items-start w-full">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter bg-black/40 px-2.5 py-1 rounded-sm border border-white/5">
                      Pretos Velhos e Almas
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-green-500/20 text-green-400 bg-green-500/10">
                      Confirmada
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 w-full mt-auto text-left">
                    <h3 className="text-2xl md:text-3xl font-normal text-white font-[var(--font-heading)] leading-tight tracking-wide mb-3">
                      Gira de Pretos Velhos
                    </h3>
                    <p className="text-xs text-[#FAF5EC]/70 font-inter leading-relaxed line-clamp-2 mb-4">
                      Acolhimento, passes e aconselhamento amoroso com a sabedoria ancestral das almas.
                    </p>
                    <div className="w-full h-[1px] bg-white/10 mb-4" />
                    
                    <div className="flex gap-4 text-xs text-[#FAF5EC]/85 font-inter">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} className="text-[var(--color-sacred-gold)]" /> 27/09/2026
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-[var(--color-sacred-gold)]" /> 20:00h
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copiador de código */}
              <div className="mt-6 pt-4 border-t border-black/5">
                <button 
                  onClick={() => copySnippet(codeSnippets.card, 'card-code')}
                  className="text-[10px] font-bold text-[var(--color-sacred-gold)] uppercase tracking-wider font-inter flex items-center gap-1 focus:outline-none hover:text-black transition-colors"
                >
                  {copiedCode === 'card-code' ? <Check size={10} /> : <Copy size={10} />} Copiar Estrutura React/Tailwind
                </button>
              </div>
            </div>

            {/* Sub-Showcase: FAQ Accordion */}
            <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-normal text-black font-[var(--font-heading)]">Acordeão Sanfona (FAQ)</h4>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">Accordion Colapsável</span>
              </div>

              <div className="max-w-2xl mx-auto border-b border-black/10 pb-4">
                <button
                  onClick={() => setFaqAberto(!faqAberto)}
                  className="w-full flex justify-between items-center text-left py-4 focus:outline-none group"
                >
                  <h3 className="text-lg font-normal text-black font-sans group-hover:text-[var(--color-sacred-gold)] transition-colors">
                    Pergunta de Exemplo do Design System?
                  </h3>
                  <span className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-all duration-500 ${
                    faqAberto ? 'bg-black text-[#FAF5EC] border-black rotate-180' : 'bg-transparent text-slate-700'
                  }`}>
                    <ChevronDown size={16} />
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  faqAberto ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                  <p className="text-slate-600 leading-relaxed font-sans text-sm pb-4">
                    Este é um exemplo de resposta contida dentro de um componente de acordeão expansível. Ele utiliza transições suaves de altura máxima (`max-h`) e opacidade para revelar informações ocultas.
                  </p>
                </div>
              </div>
            </div>

          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
