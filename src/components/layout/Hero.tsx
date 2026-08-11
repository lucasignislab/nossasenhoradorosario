'use client';

import type { CSSProperties } from 'react';
import '../../styles/hero.css';

export interface HeroProps {
  /** Imagem de fundo usada como versão estática ou fallback */
  backgroundImage?: string;
  /** Fotografias que formam o painel editorial da hero */
  backgroundImages?: string[];
  /** Título principal (H1) */
  title: string;
  /** Subtítulo descritivo */
  subtitle: string;
  /** Texto do botão primário */
  buttonLabel?: string;
  /** Callback do botão primário */
  onButtonClick?: () => void;
  /** Link do botão (alternativa ao callback) */
  buttonHref?: string;
  /** Overlay de escurecimento (intensidade 0-1) */
  overlayOpacity?: number;
}

/**
 * Hero institucional com fotografia autoral e movimento editorial sutil.
 */
export const Hero = ({
  backgroundImage,
  backgroundImages = [],
  title,
  subtitle,
  buttonLabel = 'Ver Agenda de Giras',
  onButtonClick,
  buttonHref = '#agenda',
  overlayOpacity = 0.58,
}: HeroProps) => {
  const hasGallery = backgroundImages.length > 0;
  const heroStyle = {
    '--hero-overlay-opacity': overlayOpacity,
    ...(backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}),
  } as CSSProperties;

  return (
    <section
      className={`hero${hasGallery ? ' hero--gallery' : ''}`}
      aria-label="Introdução do Terreiro"
      style={heroStyle}
    >
      {hasGallery && (
        <div className="hero__media" aria-hidden="true">
          {backgroundImages.slice(0, 3).map((image, index) => (
            <div className="hero__panel" key={image}>
              <img
                className="hero__image"
                src={image}
                alt=""
                data-panel={index + 1}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      )}

      <div className="hero__atmosphere" aria-hidden="true" />

      <div className="hero__content">
        <span className="hero__eyebrow">T. U. Senhora do Rosário</span>
        <h1 className="hero__title">{title}</h1>
        <div className="hero__divider" aria-hidden="true" />
        <p className="hero__subtitle">{subtitle}</p>

        {onButtonClick ? (
          <button className="hero__button" type="button" onClick={onButtonClick}>
            {buttonLabel}
            <span className="hero__button-arrow" aria-hidden="true">→</span>
          </button>
        ) : (
          <a className="hero__button" href={buttonHref}>
            {buttonLabel}
            <span className="hero__button-arrow" aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </section>
  );
};

export default Hero;
