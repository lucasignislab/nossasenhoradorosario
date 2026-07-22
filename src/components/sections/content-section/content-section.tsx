'use client';

import { useEffect, useRef, useState } from 'react';
import './content-section.css';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  text: string;
  image: string;
  imageCaption?: string;
  quote?: string;
  linkLabel?: string;
  linkHref?: string;
  reverse?: boolean;
  id?: string;
}

export const ContentSection = ({
  title,
  subtitle = '',
  text,
  image,
  imageCaption = 'Casa, comunidade e fundamento',
  quote,
  linkLabel,
  linkHref = '#',
  reverse = false,
  id,
}: ContentSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const paragraphs = text.split(/\\n\\n|\n\n/).filter(Boolean);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`content-editorial${reverse ? ' content-editorial--reverse' : ''}${isVisible ? ' is-visible' : ''}`}
    >
      <div className="content-editorial__container">
        <figure className="content-editorial__visual">
          <div className="content-editorial__image-frame">
            <img
              className="content-editorial__image"
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="content-editorial__caption">
            <span aria-hidden="true">01</span>
            <span>{imageCaption}</span>
          </figcaption>
        </figure>

        <div className="content-editorial__copy">
          {subtitle && (
            <div className="content-editorial__eyebrow">
              <span aria-hidden="true" />
              <p>{subtitle}</p>
            </div>
          )}

          <h2 className="content-editorial__title">{title}</h2>

          <div className="content-editorial__body">
            {paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? 'content-editorial__lead' : undefined} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {quote && <blockquote className="content-editorial__quote">“{quote}”</blockquote>}

          {linkLabel && (
            <a className="content-editorial__link" href={linkHref}>
              {linkLabel}
              <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
