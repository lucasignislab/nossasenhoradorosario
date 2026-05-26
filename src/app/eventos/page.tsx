'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Header } from "@/components/layout/header/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/footer/footer";
import { EventCard } from "@/components/features/event-card";
import { 
  Calendar, 
  Clock, 
  Heart, 
  Gift, 
  Award, 
  MapPin, 
  X, 
  ChevronDown, 
  MessageCircle, 
  Eye, 
  CheckCircle2 
} from "lucide-react";

interface Evento {
  title: string;
  entity: string;
  date: string;
  time: string;
  status: 'confirmada' | 'cancelada';
  description: string;
  imageUrl: string;
  category: 'Festividades' | 'Ações Sociais' | 'Cursos & Doutrina';
  detalhesLongos: string;
  local: string;
}

const featuredEvents: Evento[] = [
  {
    title: 'Festa de Cosme e Damião',
    entity: 'Festividade Anual',
    date: '27/09/2026',
    time: '14:00',
    status: 'confirmada',
    category: 'Festividades',
    description: 'Celebração tradicional aos Ibejis com distribuição de doces, brinquedos e bolo para as crianças da comunidade.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
    local: 'T. U. Senhora do Rosário (Sede)',
    detalhesLongos: 'A tradicional Festa de Cosme e Damião é um dos momentos mais alegres do nosso terreiro. Dedicada à energia dos Ibejis (Erês), realizamos a distribuição de saquinhos de doces tradicionais, brinquedos e servimos um delicioso bolo de aniversário. O evento é aberto a todas as famílias e crianças da comunidade local, promovendo um dia de brincadeiras, alegria e muita vibração positiva de renovação e pureza espiritual.'
  },
  {
    title: 'Homenagem a Iemanjá',
    entity: 'Saída ao Mar',
    date: '06/12/2026',
    time: '08:00',
    status: 'confirmada',
    category: 'Festividades',
    description: 'Nossa tradicional entrega de oferendas biodegradáveis e preces à beira-mar, agradecendo à Mãe de todas as cabeças.',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800',
    local: 'Praia de Santos (Canal 4)',
    detalhesLongos: 'A saída ao mar para homenagear nossa Mãe Iemanjá é um rito de profunda purificação e agradecimento. Nos reunimos na praia para cantar pontos sagrados, fazer nossas preces e realizar a entrega de barquinhos e oferendas ecológicas e biodegradáveis (flores naturais e frutas), respeitando totalmente o meio ambiente. Um momento de conexão íntima com as forças geradoras das águas salgadas.'
  },
  {
    title: 'Ação Social: Sopa Fraterna',
    entity: 'Ação de Caridade',
    date: '10/06/2026',
    time: '18:00',
    status: 'confirmada',
    category: 'Ações Sociais',
    description: 'Preparação e distribuição de sopa e agasalhos para irmãos em situação de rua. Seja um voluntário nesta corrente de amor.',
    imageUrl: 'https://images.unsplash.com/photo-1541802645-3798e120eb25?q=80&w=800',
    local: 'Cozinha Comunitária e Centro de São Paulo',
    detalhesLongos: 'A prática da caridade é o pilar fundamental da nossa Umbanda. Na ação Sopa Fraterna, reunimos voluntários para o preparo de um caldo nutritivo e quente, embalagem dos kits e distribuição para pessoas em extrema vulnerabilidade nas ruas. Além do alimento, distribuímos cobertores, agasalhos e, acima de tudo, atenção e afeto para quem mais precisa.'
  },
  {
    title: 'Estudo: Fundamentos da Umbanda',
    entity: 'Doutrina e Ensino',
    date: '15/07/2026',
    time: '19:30',
    status: 'confirmada',
    category: 'Cursos & Doutrina',
    description: 'Palestra aberta sobre a história da Umbanda, orixás, linhas de trabalho e a prática da caridade.',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800',
    local: 'T. U. Senhora do Rosário (Salão de Estudos)',
    detalhesLongos: 'Um curso introdutório direcionado a simpatizantes, novos médiuns e curiosos que desejam entender os reais fundamentos da nossa religião. Abordaremos temas como a história da Umbanda no Brasil, a cosmogonia dos Orixás, a atuação dos Guias Espirituais (Caboclos, Pretos Velhos, Baianos, Exus), a lei do karma e a importância do terreiro como polo de cura e caridade.'
  },
  {
    title: 'Homenagem a Xangô',
    entity: 'Festividade da Justiça',
    date: '29/06/2026',
    time: '20:00',
    status: 'confirmada',
    category: 'Festividades',
    description: 'Gira festiva em homenagem ao Orixá da Justiça e da Lei, com queima de velas e cânticos na pedreira simbólica.',
    imageUrl: 'https://images.unsplash.com/photo-1601314167099-232775b3ee61?q=80&w=800',
    local: 'T. U. Senhora do Rosário (Terreiro)',
    detalhesLongos: 'Celebração solene em homenagem ao Pai Xangô, o senhor do trovão e da justiça divina. Uma gira marcada pela força dos cantos sagrados, batidas firmes de tambor e a vibração equilibradora da pedreira. Excelente momento para pedir clareza mental, discernimento e justiça em nossos caminhos e decisões cotidianas.'
  },
  {
    title: 'Ação Social: Arrecadação de Brinquedos',
    entity: 'Campanha Solidária',
    date: '01/09/2026',
    time: '09:00',
    status: 'confirmada',
    category: 'Ações Sociais',
    description: 'Início da arrecadação de brinquedos novos e usados em bom estado para doação no dia das crianças.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
    local: 'T. U. Senhora do Rosário (Secretaria)',
    detalhesLongos: 'Preparando nossa grande festa de Cosme e Damião, abrimos as portas para doação de brinquedos (novos ou usados em ótimo estado) que farão o dia de muitas crianças mais feliz. Você pode trazer sua contribuição nas giras de atendimento ou agendar uma entrega diretamente com o nosso setor de voluntários.'
  }
];

const galeriaImagens = [
  {
    title: 'Gira de Preto Velho',
    year: '2025',
    url: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=800',
    description: 'Luz, sabedoria e acolhimento das almas.'
  },
  {
    title: 'Entrega na Mata',
    year: '2025',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800',
    description: 'Saudação à mata sagrada e ao Pai Oxóssi.'
  },
  {
    title: 'Homenagem à Iemanjá',
    year: '2025',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
    description: 'Preces e flores entregues à Rainha das Águas.'
  },
  {
    title: 'Ação Social Sopa Fraterna',
    year: '2026',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800',
    description: 'Preparação do alimento com amor e caridade.'
  },
  {
    title: 'Confraternização de Fim de Ano',
    year: '2025',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
    description: 'Comunidade reunida vibrando amor e união.'
  },
  {
    title: 'Estudos Doutrinários',
    year: '2026',
    url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800',
    description: 'Médiuns e assistência compartilhando ensinamentos.'
  }
];

const faqs = [
  {
    question: 'Qualquer pessoa pode frequentar os eventos e festas?',
    answer: 'Sim! Todas as nossas festas públicas e sessões são totalmente abertas à comunidade, sem distinção de crença, etnia ou orientação. Todos são bem-vindos para receber o Axé.'
  },
  {
    question: 'Como posso me voluntariar para as ações sociais?',
    answer: 'Você pode se inscrever clicando no evento social de sua escolha e preenchendo o formulário de cadastro, ou falar diretamente com a administração da casa nos dias de giras regulares.'
  },
  {
    question: 'Há algum custo para participar das celebrações?',
    answer: 'Não. Todas as atividades espirituais, passes, orientações e festividades públicas no T. U. Senhora do Rosário são totalmente gratuitos. A Umbanda é praticada sob a égide da caridade espontânea.'
  },
  {
    question: 'Qual o traje recomendado para comparecer aos eventos?',
    answer: 'Recomendamos o uso de roupas claras, confortáveis e respeitosas (evitar roupas curtas, escuras, transparentes ou decotadas). Não é necessário vestir branco completo (uso reservado aos médiuns da corrente).'
  }
];

export default function EventosPage() {
  const spotlightRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const galeriaRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  const [introVisible, setIntroVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [galeriaVisible, setGaleriaVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);

  // Estados de Interação
  const [filtroAtivo, setFiltroAtivo] = useState<string>('Todos');
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<typeof galeriaImagens[0] | null>(null);

  // Estados do Formulário
  const [formNome, setFormNome] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formMensagem, setFormMensagem] = useState('');
  const [formSucesso, setFormSucesso] = useState(false);

  useEffect(() => {
    // Observer para revelação gradual das seções (Scroll Reveal com desfoque e fade)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === introRef.current) setIntroVisible(true);
            if (entry.target === gridRef.current) setGridVisible(true);
            if (entry.target === galeriaRef.current) setGaleriaVisible(true);
            if (entry.target === faqRef.current) setFaqVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    if (introRef.current) observer.observe(introRef.current);
    if (gridRef.current) observer.observe(gridRef.current);
    if (galeriaRef.current) observer.observe(galeriaRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const section = spotlightRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    section.style.setProperty('--mouse-x', `${x}px`);
    section.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleOpenModal = (event: Evento) => {
    setSelectedEvent(event);
    setIsRegistering(false);
    setFormSucesso(false);
    setFormNome('');
    setFormTelefone('');
    setFormMensagem('');
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsRegistering(false);
    document.body.style.overflow = 'auto';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setFormSucesso(true);

    // Formatar a mensagem do WhatsApp
    const message = `Olá! Gostaria de me inscrever no evento *${selectedEvent.title}* (${selectedEvent.date}).\n\n*Nome:* ${formNome}\n*WhatsApp:* ${formTelefone}\n*Mensagem/Obs:* ${formMensagem || 'Nenhuma'}`;
    const encodedMessage = encodeURIComponent(message);
    
    // REDIRECT - O número a seguir é o telefone oficial fictício do Terreiro.
    // Pode ser alterado futuramente.
    const whatsappNumber = '5511999999999'; 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      handleCloseModal();
    }, 1500);
  };

  // Filtragem dos eventos
  const eventosFiltrados = featuredEvents.filter(event => {
    if (filtroAtivo === 'Todos') return true;
    return event.category === filtroAtivo;
  });

  return (
    <main className="min-h-screen bg-[#FAF5EC] text-slate-900 overflow-x-hidden font-sans" aria-label="Eventos e Festividades">
      <Header />

      {/* Hero Section Cinemática */}
      <Hero
        title="Eventos & Festas"
        subtitle="Celebrações de fé, confraternizações tradicionais e ações sociais do T. U. Senhora do Rosário. Participe e compartilhe do Axé."
        buttonLabel="Ver Próximos Eventos"
        buttonHref="#calendario"
        backgroundImage="https://images.unsplash.com/photo-1601314167099-232775b3ee61?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Seção Principal: Eventos & Filtros */}
      <section 
        ref={gridRef}
        className="py-24 md:py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" 
        id="calendario"
      >
        <div className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 transition-all duration-1000 ease-out transform ${
          gridVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
        }`}>
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-4 font-inter">
            Calendário Festivo
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
            Próximas Celebrações
          </h2>
          <div className="w-16 h-[1px] bg-black/15 mx-auto mb-10" />
          
          {/* Barra de Filtros Interativos */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
            {['Todos', 'Festividades', 'Ações Sociais', 'Cursos & Doutrina'].map((categoria) => (
              <button
                key={categoria}
                onClick={() => setFiltroAtivo(categoria)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase font-inter transition-all duration-500 border ${
                  filtroAtivo === categoria
                    ? 'bg-black text-[#FAF5EC] border-black shadow-md scale-105'
                    : 'bg-white/50 text-slate-700 border-black/10 hover:border-black/30 hover:bg-white hover:text-black'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Eventos com Animação de Mudança de Filtro */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ease-out transform ${
            gridVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-12'
          }`}
        >
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((event, index) => (
              <div 
                key={`${event.title}-${index}`} 
                className="transition-all duration-500 hover:-translate-y-2 opacity-100 scale-100 transform"
              >
                <EventCard 
                  entity={event.entity}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  status={event.status}
                  description={event.description}
                  imageUrl={event.imageUrl}
                  onClick={() => handleOpenModal(event)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 font-inter">
              Nenhum evento agendado para esta categoria no momento.
            </div>
          )}
        </div>
      </section>

      {/* Seção Como Participar com Spotlight Interativo (Brilho do Mouse/Efeito Vela) */}
      <section 
        ref={spotlightRef}
        onMouseMove={handleMouseMove}
        className="py-24 md:py-32 bg-[var(--color-dark)] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--color-sacred-red)_0%,_transparent_75%)] pointer-events-none" />
        
        <div 
          className="absolute inset-0 pointer-events-none opacity-45 transition-opacity duration-300"
          style={{
            background: `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(201, 162, 39, 0.12), transparent 80%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-4 font-inter">
              União e Ação
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[var(--color-cream)] mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
              Como Você Pode Participar
            </h2>
            <div className="w-16 h-[1px] bg-white/10 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Doações */}
            <div className="relative group p-8 lg:p-10 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg hover:border-[var(--color-sacred-gold)]/20 hover:bg-[#2A2318]/25 transition-all duration-500 rounded-sm overflow-hidden shadow-lg hover:shadow-[var(--color-sacred-gold)]/5">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--color-sacred-gold)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="mb-8 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 ease-out text-[var(--color-sacred-gold)]">
                <Gift size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-normal text-[var(--color-cream)] mb-4 font-[var(--font-heading)] leading-tight tracking-wide">
                Doação de Insumos
              </h3>
              <p className="text-[var(--color-cream)]/65 font-sans leading-relaxed text-sm md:text-base group-hover:opacity-85 transition-opacity">
                Para as festas das crianças e ações sociais, arrecadamos doces, brinquedos, alimentos não perecíveis e agasalhos. Traga sua contribuição nas giras regulares.
              </p>
            </div>

            {/* Card 2: Voluntariado */}
            <div className="relative group p-8 lg:p-10 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg hover:border-[var(--color-sacred-gold)]/20 hover:bg-[#2A2318]/25 transition-all duration-500 rounded-sm overflow-hidden shadow-lg hover:shadow-[var(--color-sacred-gold)]/5">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--color-sacred-gold)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="mb-8 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 ease-out text-[var(--color-sacred-gold)]">
                <Heart size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-normal text-[var(--color-cream)] mb-4 font-[var(--font-heading)] leading-tight tracking-wide">
                Voluntariado Social
              </h3>
              <p className="text-[var(--color-cream)]/65 font-sans leading-relaxed text-sm md:text-base group-hover:opacity-85 transition-opacity">
                A caridade se faz com mãos unidas. Auxilie na preparação e na logística das ações sociais para a comunidade nas ruas. Fale com a nossa administração para se inscrever.
              </p>
            </div>

            {/* Card 3: Assistência */}
            <div className="relative group p-8 lg:p-10 border border-white/5 bg-[#0D0B08]/40 backdrop-blur-lg hover:border-[var(--color-sacred-gold)]/20 hover:bg-[#2A2318]/25 transition-all duration-500 rounded-sm overflow-hidden shadow-lg hover:shadow-[var(--color-sacred-gold)]/5">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--color-sacred-gold)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              <div className="mb-8 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 ease-out text-[var(--color-sacred-gold)]">
                <Award size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-normal text-[var(--color-cream)] mb-4 font-[var(--font-heading)] leading-tight tracking-wide">
                Presença e Axé
              </h3>
              <p className="text-[var(--color-cream)]/65 font-sans leading-relaxed text-sm md:text-base group-hover:opacity-85 transition-opacity">
                Sua presença vibratória e orações são nossa maior sustentação. Venha vibrar amor, cantar os pontos sagrados e receber a energia de cura dos Guias de Lei.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Nova Seção: Galeria de Memórias (Eventos Passados) */}
      <section 
        ref={galeriaRef}
        className="py-24 md:py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ease-out transform ${
          galeriaVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
        }`}>
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-4 font-inter">
            Nossa História em Imagens
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
            Momentos da Nossa Casa
          </h2>
          <div className="w-16 h-[1px] bg-black/15 mx-auto" />
        </div>

        {/* Grid Interativo com transição de cores e zoom no hover */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ease-out transform ${
            galeriaVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-12'
          }`}
        >
          {galeriaImagens.map((img, index) => (
            <div 
              key={index}
              onClick={() => setSelectedImage(img)}
              className="group relative h-72 rounded-md overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-black/5"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-105 grayscale group-hover:grayscale-0"
              />
              {/* Overlay de gradiente que surge no hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B08]/90 via-[#0D0B08]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Informações que surgem suavemente */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter block mb-1">
                  {img.year}
                </span>
                <h4 className="text-xl font-normal font-[var(--font-heading)] mb-1 leading-tight">
                  {img.title}
                </h4>
                <p className="text-[10px] text-[#FAF5EC]/70 font-inter line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {img.description}
                </p>
              </div>

              {/* Ícone de ampliar discreto no topo */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0D0B08]/60 backdrop-blur-xs flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <Eye size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nova Seção: FAQ (Dúvidas Frequentes sobre Eventos) */}
      <section 
        ref={faqRef}
        className="py-24 md:py-32 bg-white/40 border-t border-b border-black/5"
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
            faqVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-8'
          }`}>
            <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-sacred-gold)] mb-4 font-inter">
              Dúvidas Comuns
            </span>
            <h2 className="text-4xl md:text-5xl font-normal text-black mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
              Perguntas Frequentes
            </h2>
            <div className="w-16 h-[1px] bg-black/15 mx-auto" />
          </div>

          {/* Acordeões Interativos com Transições Suaves */}
          <div 
            className={`space-y-4 transition-all duration-1000 delay-200 ease-out transform ${
              faqVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-12'
            }`}
          >
            {faqs.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="border-b border-black/10 pb-4 transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left py-4 focus:outline-none group"
                  >
                    <h3 className="text-lg md:text-xl font-normal text-black font-sans group-hover:text-[var(--color-sacred-gold)] transition-colors">
                      {faq.question}
                    </h3>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-all duration-500 ${
                      isOpen ? 'bg-black text-[#FAF5EC] border-black rotate-180' : 'bg-transparent text-slate-700'
                    }`}>
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  
                  {/* Conteúdo Expansível com Transição de Altura */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <p className="text-slate-600 leading-relaxed font-sans text-sm md:text-base pb-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL DE DETALHES E INSCRIÇÃO DO EVENTO */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay Desfocado e Escuro */}
          <div 
            className="fixed inset-0 bg-[#0D0B08]/80 backdrop-blur-md transition-opacity duration-500 opacity-100"
            onClick={handleCloseModal}
          />
          
          {/* Caixa do Modal com efeito Glassmorphism */}
          <div className="relative w-full max-w-3xl bg-[#FAF5EC] rounded-md shadow-2xl border border-black/10 overflow-hidden z-10 transition-all duration-500 scale-100 max-h-[90vh] flex flex-col md:flex-row">
            
            {/* Botão de Fechar Absoluto */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#0D0B08]/75 backdrop-blur-xs text-white/95 flex items-center justify-center hover:bg-black transition-colors focus:outline-none"
              aria-label="Fechar Modal"
            >
              <X size={16} />
            </button>

            {/* Lado Esquerdo/Topo: Imagem do Flyer */}
            <div className="w-full md:w-5/12 relative h-48 md:h-auto min-h-[200px] bg-[#0D0B08]">
              <img 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out scale-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 md:hidden">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter bg-black/40 px-2 py-1 rounded-sm">
                  {selectedEvent.entity}
                </span>
              </div>
            </div>

            {/* Lado Direito: Conteúdo e Formulário */}
            <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-h-[calc(90vh-12rem)] md:max-h-[90vh]">
              
              {!isRegistering ? (
                // TELA 1: Detalhes do Evento
                <div className="flex-1 flex flex-col">
                  <div className="mb-4 hidden md:block">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter bg-[#0D0B08] px-2.5 py-1 rounded-sm border border-white/5 inline-block">
                      {selectedEvent.entity}
                    </span>
                  </div>

                  <h3 className="text-3xl font-normal text-black font-[var(--font-heading)] leading-tight tracking-wide mb-4">
                    {selectedEvent.title}
                  </h3>

                  {/* Informações Rápidas */}
                  <div className="grid grid-cols-1 gap-2.5 mb-6 text-sm text-slate-700 font-inter">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[var(--color-sacred-gold)] flex-shrink-0" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[var(--color-sacred-gold)] flex-shrink-0" />
                      <span>{selectedEvent.time}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[var(--color-sacred-gold)] flex-shrink-0" />
                      <span className="line-clamp-1">{selectedEvent.local}</span>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-black/10 mb-5" />

                  <p className="text-slate-600 font-sans leading-relaxed text-sm md:text-base mb-6 flex-1">
                    {selectedEvent.detalhesLongos}
                  </p>

                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => setIsRegistering(true)}
                      className="w-full bg-[#0D0B08] hover:bg-black text-[#FAF5EC] font-inter text-xs font-semibold uppercase tracking-widest py-3 px-6 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Me Inscrever
                    </button>
                  </div>
                </div>
              ) : (
                // TELA 2: Formulário de Inscrição
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-2xl font-normal text-black font-[var(--font-heading)] tracking-wide mb-2">
                    Inscrição
                  </h4>
                  <p className="text-xs text-slate-500 font-inter mb-6">
                    Inscreva-se em: <strong className="text-black">{selectedEvent.title}</strong>
                  </p>

                  {formSucesso ? (
                    // Sucesso temporário (mensagem de redirecionamento)
                    <div className="text-center py-8 animate-fade-rise flex flex-col items-center justify-center">
                      <CheckCircle2 size={48} className="text-green-600 mb-4 animate-bounce" />
                      <h5 className="text-xl font-normal text-black font-[var(--font-heading)] mb-2">
                        Inscrição Enviada!
                      </h5>
                      <p className="text-sm text-slate-600 font-sans">
                        Redirecionando você para o WhatsApp oficial para concluir...
                      </p>
                    </div>
                  ) : (
                    // Campos do Formulário
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="modal-nome" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-inter">
                          Nome Completo
                        </label>
                        <input
                          id="modal-nome"
                          type="text"
                          required
                          value={formNome}
                          onChange={(e) => setFormNome(e.target.value)}
                          placeholder="Digite seu nome completo"
                          className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-telefone" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-inter">
                          Seu WhatsApp
                        </label>
                        <input
                          id="modal-telefone"
                          type="tel"
                          required
                          value={formTelefone}
                          onChange={(e) => setFormTelefone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-msg" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-inter">
                          Mensagem ou Observação
                        </label>
                        <textarea
                          id="modal-msg"
                          rows={3}
                          value={formMensagem}
                          onChange={(e) => setFormMensagem(e.target.value)}
                          placeholder="Ex: Vou com mais 2 acompanhantes..."
                          className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsRegistering(false)}
                          className="w-1/3 border border-black/15 hover:border-black/30 hover:bg-black/5 text-slate-800 font-inter text-[10px] font-semibold uppercase tracking-wider py-3 rounded-sm transition-all"
                        >
                          Voltar
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 bg-[#0D0B08] hover:bg-black text-[#FAF5EC] font-inter text-[10px] font-semibold uppercase tracking-wider py-3 rounded-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          Confirmar Inscrição
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* LIGHTBOX DE IMAGENS DA GALERIA */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay Desfocado e Escuro */}
          <div 
            className="fixed inset-0 bg-[#0D0B08]/90 backdrop-blur-md transition-opacity duration-500 opacity-100"
            onClick={() => setSelectedImage(null)}
          />

          {/* Visualizador de Imagem */}
          <div className="relative max-w-4xl w-full z-10 transition-all duration-500 scale-100 flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-[-3.5rem] right-0 z-20 w-10 h-10 rounded-full bg-[#FAF5EC]/10 hover:bg-[#FAF5EC]/20 text-white flex items-center justify-center transition-colors focus:outline-none border border-white/10"
              aria-label="Fechar Galeria"
            >
              <X size={20} />
            </button>

            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm border border-white/10 shadow-2xl"
            />
            
            <div className="text-center mt-6 max-w-xl px-4">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter mb-1 block">
                {selectedImage.year}
              </span>
              <h4 className="text-2xl font-normal text-white font-[var(--font-heading)] leading-tight mb-2">
                {selectedImage.title}
              </h4>
              <p className="text-sm text-white/70 font-inter font-light">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
