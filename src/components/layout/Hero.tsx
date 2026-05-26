'use client';

import React, { useEffect, useRef, useState } from 'react';
import '../../styles/hero.css';

export interface HeroProps {
  /** Imagem de background (URL) */
  backgroundImage?: string;
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
 * Hero Section
 * Componente de boas-vindas com imagem de fundo e call-to-action
 */
export const Hero = ({
  backgroundImage,
  title,
  subtitle,
  buttonLabel = 'Ver Agenda de Giras',
  buttonHref = '#agenda',
}: HeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const updateOpacity = () => {
      if (video.duration) {
        const currentTime = video.currentTime;
        const duration = video.duration;

        // Fade in sobre 0.5s no início (opacidade 0 a 1)
        if (currentTime < 0.5) {
          setVideoOpacity(currentTime / 0.5);
        }
        // Fade out sobre 0.5s antes do final (opacidade 1 a 0)
        else if (currentTime > duration - 0.5) {
          setVideoOpacity(Math.max(0, (duration - currentTime) / 0.5));
        }
        // Opacidade cheia no meio
        else {
          setVideoOpacity(1);
        }
      }
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const handlePlay = () => {
      setIsVideoLoading(false);
      updateOpacity();
    };

    const handleEnded = () => {
      // Define opacidade em 0, cancela o frame de animação, espera 100ms, redefine tempo e reinicia
      setVideoOpacity(0);
      cancelAnimationFrame(animationFrameId);

      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play()
            .then(() => {
              animationFrameId = requestAnimationFrame(updateOpacity);
            })
            .catch((err) => console.error("Error playing video:", err));
        }
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);

    // Inicia a reprodução
    video.play().catch((err) => {
      console.log("Autoplay aguardando interação do usuário:", err);
    });

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      className="hero"
      aria-label="Introdução do Terreiro"
      style={
        // Mantemos o background-image original como um fallback atrás do vídeo
        backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined
      }
    >
      {/* Camada do Vídeo de Fundo com posicionamento absoluto específico */}
      <div 
        className="absolute overflow-hidden" 
        style={{ 
          top: '300px', 
          inset: 'auto 0 0 0',
          zIndex: 0
        }}
      >
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: videoOpacity }}
          muted
          playsInline
          autoPlay
        />
        
        {/* Camada de Gradiente sobre o vídeo exigida pelo prompt */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5EC] via-transparent to-[#FAF5EC] pointer-events-none opacity-60" />

        {/* Indicador de Carregamento Premium */}
        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Overlay com gradiente é aplicado via pseudo-elemento no CSS (z-index 1) */}
      <div className="hero__content">
        <span className="hero__eyebrow">T. U. Senhora do Rosário</span>
        <h1 className="hero__title">{title}</h1>
        <div className="hero__divider" aria-hidden="true" />
        <p className="hero__subtitle">{subtitle}</p>

        <a className="hero__button" href={buttonHref}>
          {buttonLabel}
          <span className="hero__button-arrow">→</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
