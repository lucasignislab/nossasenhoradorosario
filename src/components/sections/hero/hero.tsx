interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
  backgroundImage: string;
}

export const Hero = ({ title, subtitle, ctaText, onCtaClick, backgroundImage }: HeroProps) => {
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Imagem de Fundo com Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* Camada de escurecimento (UX: Acessibilidade de leitura) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Conteúdo Centralizado */}
      <div className="relative z-10 max-w-4xl px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
          {subtitle}
        </p>

        <button
          onClick={onCtaClick}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-xl"
        >
          {ctaText}
        </button>
      </div>

      {/* Detalhe visual inferior (Opcional: Arco de suavização) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};