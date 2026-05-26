'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre Nós' },
  { href: '/agenda', label: 'Giras' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/blog', label: 'Blog' },
  { href: '/design-system', label: 'Design System' },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-20 w-full relative z-50">
      <header
        className="w-full border-b fixed top-0 left-0 z-50"
        style={{
          backgroundColor: 'var(--color-cream)',
          borderColor: 'rgba(201, 162, 39, 0.25)',
        }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <div className="flex flex-col text-left">
              <span
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-dark-muted)', opacity: 0.8 }}
              >
                T. U.
              </span>
              <span 
                className="text-xl font-bold tracking-tight -mt-1.5"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}
              >
                Senhora do<span style={{ color: 'var(--color-sacred-red)' }}> Rosário</span>
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Navegação principal">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-medium transition-colors duration-200 group"
                style={{ color: 'var(--color-dark-muted)', fontFamily: 'var(--font-body)' }}
              >
                {label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: 'var(--color-sacred-gold)' }}
                />
              </Link>
            ))}
          </nav>

          {/* Botão Desktop */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-sacred-red)',
                color: 'var(--color-cream)',
                borderRadius: '2px',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.04em',
              }}
            >
              Área do Filho
            </Link>
          </div>

          {/* Hamburger Mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 cursor-pointer"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-dark)',
                transform: mobileOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                marginBottom: mobileOpen ? '0' : '5px',
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-dark)',
                opacity: mobileOpen ? 0 : 1,
                marginBottom: mobileOpen ? '0' : '5px',
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-dark)',
                transform: mobileOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? '360px' : '0',
          borderTop: mobileOpen ? '1px solid rgba(201,162,39,0.2)' : 'none',
          backgroundColor: 'var(--color-cream)',
        }}
      >
        <nav className="flex flex-col px-4 py-4 space-y-4" aria-label="Navegação mobile">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-base font-medium py-2 transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-dark-muted)', fontFamily: 'var(--font-body)' }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium mt-2 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-sacred-red)',
              color: 'var(--color-cream)',
              borderRadius: '2px',
              fontFamily: 'var(--font-body)',
            }}
            onClick={() => setMobileOpen(false)}
          >
            Área do Filho
          </Link>
        </nav>
      </div>
    </header>
    </div>
  );
};