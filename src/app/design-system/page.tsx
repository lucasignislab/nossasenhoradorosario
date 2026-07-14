'use client';

import React, { useMemo, useState } from 'react';
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
  ExternalLink,
  Search,
} from "lucide-react";

// Foundation color tokens — Sacred Modernism Design System
// Fonte: globals.css (--color-{family}-{scale})
type Shade = {
  grade: string;
  oklch: string;
  hex: string;
  isAnchor: boolean;
  cssVar: string;
};
type Family = {
  key: string;
  name: string;
  desc: string;
  status: 'approved' | 'provisional';
  source: string;
  role: string;
  anchorGrade: string;
  shades: Shade[];
};

const GRADES = ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
type Grade = (typeof GRADES)[number];

function buildFamily(
  key: string,
  name: string,
  desc: string,
  status: 'approved' | 'provisional',
  source: string,
  role: string,
  anchorGrade: string,
  hexes: Record<Grade, string>,
  oklch: Record<Grade, string>,
): Family {
  return {
    key, name, desc, status, source, role, anchorGrade,
    shades: GRADES.map((g) => ({
      grade: g,
      oklch: oklch[g],
      hex: hexes[g],
      isAnchor: g === anchorGrade,
      cssVar: `--color-${key}-${g}`,
    })),
  };
}

const colorPalette: Record<string, Family> = {
  terracotta: buildFamily(
    'terracotta', 'Terracotta',
    'Família principal da marca, derivada do terracota profundo documentado. Usada para CTAs primários, foco dourado ancestral e estados ativos.',
    'approved', 'project-documentation', 'Primary · brand', '600',
    {
      '050': '#FFF4F1', '100': '#FFE4DE', '200': '#F8CABF', '300': '#E9A89A',
      '400': '#D58776', '500': '#BE6755', '600': '#8B3A2A', '700': '#7F3627',
      '800': '#5E2317', '900': '#3D1109', '950': '#1F0401',
    },
    {
      '050': 'oklch(0.975 0.012 32.9)', '100': 'oklch(0.940 0.031 32.9)',
      '200': 'oklch(0.875 0.055 32.9)', '300': 'oklch(0.790 0.080 32.9)',
      '400': 'oklch(0.700 0.101 32.9)', '500': 'oklch(0.610 0.114 32.9)',
      '600': 'oklch(0.456 0.114 32.9)', '700': 'oklch(0.430 0.105 32.9)',
      '800': 'oklch(0.340 0.089 32.9)', '900': 'oklch(0.250 0.071 32.9)',
      '950': 'oklch(0.160 0.051 32.9)',
    },
  ),
  'ancestral-gold': buildFamily(
    'ancestral-gold', 'Ancestral Gold',
    'Família de destaque, derivada do dourado ancestral documentado. Realces, ícones rituais, brilhos, gradientes com parcimônia.',
    'approved', 'project-documentation', 'Accent · highlight', '500',
    {
      '050': '#FDF6E6', '100': '#F5EBCF', '200': '#E7D5A4', '300': '#D3B870',
      '400': '#BC9A37', '500': '#C9A227', '600': '#816500', '700': '#634D00',
      '800': '#463600', '900': '#2B2000', '950': '#130C00',
    },
    {
      '050': 'oklch(0.975 0.022 89.7)', '100': 'oklch(0.940 0.039 89.7)',
      '200': 'oklch(0.875 0.066 89.7)', '300': 'oklch(0.790 0.097 89.7)',
      '400': 'oklch(0.700 0.121 89.7)', '500': 'oklch(0.728 0.138 89.7)',
      '600': 'oklch(0.520 0.106 89.7)', '700': 'oklch(0.430 0.088 89.7)',
      '800': 'oklch(0.340 0.069 89.7)', '900': 'oklch(0.250 0.051 89.7)',
      '950': 'oklch(0.160 0.033 89.7)',
    },
  ),
  parchment: buildFamily(
    'parchment', 'Parchment',
    'Família de superfícies claras, derivada do creme off-white documentado. Fundos de páginas, cards de conteúdo, papel envelhecido.',
    'approved', 'project-documentation', 'Surface · light', '050',
    {
      '050': '#FAF5EC', '100': '#EEEBE4', '200': '#DBD5CA', '300': '#C2B9AA',
      '400': '#A79D8A', '500': '#8D826D', '600': '#726754', '700': '#584E3D',
      '800': '#3F3729', '900': '#262116', '950': '#100D06',
    },
    {
      '050': 'oklch(0.972 0.013 82.4)', '100': 'oklch(0.940 0.009 82.4)',
      '200': 'oklch(0.875 0.016 82.4)', '300': 'oklch(0.790 0.023 82.4)',
      '400': 'oklch(0.700 0.029 82.4)', '500': 'oklch(0.610 0.033 82.4)',
      '600': 'oklch(0.520 0.033 82.4)', '700': 'oklch(0.430 0.030 82.4)',
      '800': 'oklch(0.340 0.026 82.4)', '900': 'oklch(0.250 0.020 82.4)',
      '950': 'oklch(0.160 0.015 82.4)',
    },
  ),
  'warm-neutral': buildFamily(
    'warm-neutral', 'Warm Neutral',
    'Família neutra aquecida; incorpora os tons escuros documentados do projeto. Texto, divisórias, glassmorphism escuro, molduras.',
    'approved', 'project-documentation', 'Neutral · ink', '900',
    {
      '050': '#F9F6F3', '100': '#EEEBE5', '200': '#DBD5CB', '300': '#C3B9AB',
      '400': '#A89D8B', '500': '#8E816E', '600': '#736754', '700': '#594E3D',
      '800': '#3F3729', '900': '#2A2318', '950': '#0D0B08',
    },
    {
      '050': 'oklch(0.975 0.005 78.8)', '100': 'oklch(0.940 0.009 78.8)',
      '200': 'oklch(0.875 0.016 78.8)', '300': 'oklch(0.790 0.023 78.8)',
      '400': 'oklch(0.700 0.029 78.8)', '500': 'oklch(0.610 0.033 78.8)',
      '600': 'oklch(0.520 0.033 78.8)', '700': 'oklch(0.430 0.030 78.8)',
      '800': 'oklch(0.340 0.025 78.8)', '900': 'oklch(0.261 0.022 78.8)',
      '950': 'oklch(0.151 0.007 79.1)',
    },
  ),
  ember: buildFamily(
    'ember', 'Ember',
    'Família funcional provisória para erro, alerta destrutivo e estados críticos. Substitui o uso pontual de red-500.',
    'provisional', 'proposed-functional-family', 'Danger · error', '600',
    {
      '050': '#FFF4F2', '100': '#FFE4DF', '200': '#FFC6BB', '300': '#F4A394',
      '400': '#E17F6E', '500': '#CA5D4C', '600': '#A33A2B', '700': '#892B1E',
      '800': '#65190F', '900': '#430904', '950': '#220100',
    },
    {
      '050': 'oklch(0.975 0.012 30.8)', '100': 'oklch(0.940 0.030 30.8)',
      '200': 'oklch(0.875 0.067 30.8)', '300': 'oklch(0.790 0.099 30.8)',
      '400': 'oklch(0.700 0.125 30.8)', '500': 'oklch(0.610 0.142 30.8)',
      '600': 'oklch(0.495 0.142 30.8)', '700': 'oklch(0.430 0.131 30.8)',
      '800': 'oklch(0.340 0.111 30.8)', '900': 'oklch(0.250 0.088 30.8)',
      '950': 'oklch(0.160 0.063 30.8)',
    },
  ),
  sun: buildFamily(
    'sun', 'Sun',
    'Família funcional provisória para avisos. Atenção, confirmação pendente, mensagens neutras positivas.',
    'provisional', 'proposed-functional-family', 'Warning · pending', '500',
    {
      '050': '#FFF5E8', '100': '#FAE9CF', '200': '#EED1A6', '300': '#DDB373',
      '400': '#C8943D', '500': '#C58A16', '600': '#8B5F00', '700': '#6B4800',
      '800': '#4C3200', '900': '#2F1E00', '950': '#150B00',
    },
    {
      '050': 'oklch(0.975 0.021 77.1)', '100': 'oklch(0.940 0.038 77.1)',
      '200': 'oklch(0.875 0.065 77.1)', '300': 'oklch(0.790 0.095 77.1)',
      '400': 'oklch(0.700 0.120 77.1)', '500': 'oklch(0.675 0.136 77.1)',
      '600': 'oklch(0.520 0.109 77.1)', '700': 'oklch(0.430 0.090 77.1)',
      '800': 'oklch(0.340 0.071 77.1)', '900': 'oklch(0.250 0.052 77.1)',
      '950': 'oklch(0.160 0.033 77.1)',
    },
  ),
  river: buildFamily(
    'river', 'River',
    'Família funcional provisória para informação. Mensagens de contexto, links informativos, badges neutros de status.',
    'provisional', 'proposed-functional-family', 'Info · context', '600',
    {
      '050': '#F0F8FB', '100': '#DFEEF3', '200': '#C2DBE3', '300': '#9DC2CD',
      '400': '#79A7B5', '500': '#578C9C', '600': '#2F6473', '700': '#275765',
      '800': '#163E49', '900': '#08262E', '950': '#011015',
    },
    {
      '050': 'oklch(0.975 0.010 218.8)', '100': 'oklch(0.940 0.017 218.8)',
      '200': 'oklch(0.875 0.029 218.8)', '300': 'oklch(0.790 0.043 218.8)',
      '400': 'oklch(0.700 0.054 218.8)', '500': 'oklch(0.610 0.061 218.8)',
      '600': 'oklch(0.473 0.061 218.8)', '700': 'oklch(0.430 0.056 218.8)',
      '800': 'oklch(0.340 0.048 218.8)', '900': 'oklch(0.250 0.038 218.8)',
      '950': 'oklch(0.160 0.027 218.8)',
    },
  ),
};

/* Tabela de aliases semânticos — REMOVIDA: substituída por `semanticTokens`
   (alinhada ao JSON semantic fornecido). */

const menuAnchors = [
  { href: '#introducao',      label: 'Introdução' },
  { href: '#familias',        label: '8 Famílias de Cor' },
  { href: '#aprovadas',       label: 'Aprovadas (4)' },
  { href: '#funcionais',      label: 'Funcionais (4)' },
  { href: '#roles',           label: 'Color Roles' },
  { href: '#contraste',       label: 'Matriz de Contraste' },
  { href: '#tipografia',      label: 'Tipografia' },
  { href: '#grid-spacing',    label: 'Espaçamento' },
  { href: '#shape',           label: 'Shape (Radius + Border)' },
  { href: '#opacity',         label: 'Opacidade' },
  { href: '#motion',          label: 'Motion / Animação' },
  { href: '#shadow',          label: 'Sombras' },
  { href: '#z-index',         label: 'Z-Index / Camadas' },
  { href: '#components',       label: 'Component Tokens' },
  { href: '#components-button', label: '  · Button' },
  { href: '#components-input',  label: '  · Input' },
  { href: '#components-card',   label: '  · Card' },
  { href: '#components-modal',  label: '  · Modal' },
  { href: '#components-tabs',   label: '  · Tabs' },
  { href: '#components-nav',    label: '  · Navigation' },
  { href: '#showcase-botoes', label: 'Showcase: Botões' },
  { href: '#showcase-inputs', label: 'Showcase: Inputs' },
  { href: '#showcase-cards',  label: 'Showcase: Cards & FAQ' },
  { href: '#proximos-passos', label: 'Próximos Componentes' },
];

const STATUS_LABEL: Record<'approved' | 'provisional', string> = {
  approved: 'Aprovada',
  provisional: 'Provisória',
};
const STATUS_CLASS: Record<'approved' | 'provisional', string> = {
  approved: 'border-[#3F6B4F]/30 bg-[#3F6B4F]/10 text-[#20402C]',
  provisional: 'border-[#C58A16]/30 bg-[#C58A16]/10 text-[#6B4800]',
};
const SOURCE_LABEL: Record<string, string> = {
  'project-documentation': 'Documentação do projeto',
  'proposed-functional-family': 'Família funcional proposta',
  'system-proposal': 'Proposta do sistema',
};

// ─────────────────────────────────────────────────────────────────────────────
// Motion tokens — Sacred Modernism
// Fonte: design-system/foundation/motion.tokens.json
// ─────────────────────────────────────────────────────────────────────────────
type MotionStatus = 'approved' | 'provisional';
type DurationToken = {
  name: string;
  /** Valor em milissegundos */
  ms: number;
  status: MotionStatus;
  source: string;
  description?: string;
};
type CubicBezierToken = {
  name: string;
  /** Curva cubic-bezier(x1, y1, x2, y2) */
  points: [number, number, number, number];
  status: MotionStatus;
  source: string;
};

const durationTokens: DurationToken[] = [
  { name: 'instant',    ms: 0,    status: 'provisional', source: 'system-proposal' },
  { name: 'fast',       ms: 150,  status: 'provisional', source: 'system-proposal' },
  { name: 'moderate',   ms: 250,  status: 'provisional', source: 'system-proposal' },
  { name: 'slow',       ms: 500,  status: 'approved',    source: 'project-documentation', description: 'Usado no fade inicial/final do hero.' },
  { name: 'deliberate', ms: 700,  status: 'approved',    source: 'project-documentation', description: 'Usado em transições visuais suaves.' },
  { name: 'ambient',    ms: 1200, status: 'provisional', source: 'system-proposal' },
];

const cubicBezierTokens: CubicBezierToken[] = [
  { name: 'standard',    points: [0.2, 0, 0, 1],       status: 'provisional', source: 'system-proposal' },
  { name: 'enter',       points: [0, 0, 0, 1],         status: 'provisional', source: 'system-proposal' },
  { name: 'exit',        points: [0.3, 0, 1, 1],       status: 'provisional', source: 'system-proposal' },
  { name: 'emphasized',  points: [0.2, 0.8, 0.2, 1],   status: 'provisional', source: 'system-proposal' },
];

// Constrói a string CSS a partir dos pontos
function cubicBezierCss(pts: [number, number, number, number]): string {
  return `cubic-bezier(${pts.join(', ')})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Opacity tokens — Sacred Modernism
// Fonte: design-system/foundation/opacity.tokens.json
// ─────────────────────────────────────────────────────────────────────────────
type OpacityToken = {
  name: string;
  /** Valor entre 0 e 1 */
  value: number;
  status: MotionStatus;
  source: string;
  description?: string;
};

const opacityTokens: OpacityToken[] = [
  { name: 'transparent', value: 0,    status: 'provisional', source: 'system-proposal' },
  { name: 'subtle',      value: 0.08, status: 'provisional', source: 'system-proposal' },
  { name: 'muted',       value: 0.16, status: 'provisional', source: 'system-proposal' },
  { name: 'soft',        value: 0.35, status: 'approved',    source: 'project-documentation', description: 'Overlay escuro documentado no hero.' },
  { name: 'medium',      value: 0.5,  status: 'provisional', source: 'system-proposal' },
  { name: 'strong',      value: 0.72, status: 'provisional', source: 'system-proposal' },
  { name: 'opaque',      value: 1,    status: 'provisional', source: 'system-proposal' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shadow tokens — Sacred Modernism
// Fonte: design-system/foundation/shadow.tokens.json
// ─────────────────────────────────────────────────────────────────────────────
type ShadowValue = {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
};
type ShadowToken = {
  name: string;
  value: ShadowValue;
  status: MotionStatus;
  source: string;
  description?: string;
};

const shadowTokens: ShadowToken[] = [
  { name: 'none',   value: { color: '#00000000', offsetX: '0px', offsetY: '0px',  blur: '0px',  spread: '0px'  }, status: 'provisional', source: 'system-proposal' },
  { name: 'low',    value: { color: '#0D0B081F', offsetX: '0px', offsetY: '2px',  blur: '8px',  spread: '0px'  }, status: 'provisional', source: 'system-proposal' },
  { name: 'medium', value: { color: '#0D0B0829', offsetX: '0px', offsetY: '8px',  blur: '24px', spread: '-4px' }, status: 'provisional', source: 'system-proposal' },
  { name: 'high',   value: { color: '#0D0B083D', offsetX: '0px', offsetY: '20px', blur: '48px', spread: '-8px' }, status: 'provisional', source: 'system-proposal' },
  { name: 'focus',  value: { color: '#C9A22766', offsetX: '0px', offsetY: '0px',  blur: '0px',  spread: '3px'  }, status: 'provisional', source: 'system-proposal' },
];

// Constrói o valor CSS de box-shadow a partir do token
function shadowCss(v: ShadowValue): string {
  return `${v.offsetX} ${v.offsetY} ${v.blur} ${v.spread} ${v.color}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shape tokens — Sacred Modernism
// Fonte: design-system/foundation/shape.tokens.json
// Cobre radius (border-radius) e border-width.
// ─────────────────────────────────────────────────────────────────────────────
type ShapeToken = {
  name: string;
  /** Valor em CSS (ex.: "2px", "999px") */
  value: string;
  status: MotionStatus;
  source: string;
  /** Uso recomendado (gerado a partir do nome) */
  use: string;
};

const radiusTokens: ShapeToken[] = [
  { name: 'none', value: '0px',   status: 'provisional', source: 'system-proposal', use: 'Bordas retas, divisórias.' },
  { name: '050',  value: '2px',   status: 'provisional', source: 'system-proposal', use: 'Botões, inputs, glassmorphism.' },
  { name: '100',  value: '4px',   status: 'provisional', source: 'system-proposal', use: 'Badges pequenos, tags.' },
  { name: '200',  value: '8px',   status: 'provisional', source: 'system-proposal', use: 'Cards de conteúdo, painéis.' },
  { name: '300',  value: '12px',  status: 'provisional', source: 'system-proposal', use: 'Modais, drawers, popovers.' },
  { name: '400',  value: '16px',  status: 'provisional', source: 'system-proposal', use: 'Containers generosos, hero boxes.' },
  { name: '500',  value: '24px',  status: 'provisional', source: 'system-proposal', use: 'Superfícies orgânicas, ilustrações.' },
  { name: 'pill', value: '999px', status: 'provisional', source: 'system-proposal', use: 'Botões pílula, avatares, categorias.' },
];

const borderWidthTokens: ShapeToken[] = [
  { name: 'none',   value: '0px', status: 'provisional', source: 'system-proposal', use: 'Reset de borda.' },
  { name: 'thin',   value: '1px', status: 'provisional', source: 'system-proposal', use: 'Bordas padrão, divisórias.' },
  { name: 'medium', value: '2px', status: 'provisional', source: 'system-proposal', use: 'Bordas de ênfase, controles.' },
  { name: 'thick',  value: '4px', status: 'provisional', source: 'system-proposal', use: 'Indicadores laterais, destaques.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Space tokens — Sacred Modernism
// Fonte: design-system/foundation/space.tokens.json
// Escala baseada no grid de 8px documentado.
// ─────────────────────────────────────────────────────────────────────────────
type SpaceToken = {
  name: string;
  /** Valor em pixels (numérico para facilitar cálculos) */
  px: number;
  status: MotionStatus;
  source: string;
  description?: string;
};

const spaceTokens: SpaceToken[] = [
  { name: '000',  px: 0,   status: 'approved', source: 'project-documentation' },
  { name: '025',  px: 2,   status: 'provisional', source: 'derived-scale' },
  { name: '050',  px: 4,   status: 'provisional', source: 'derived-scale' },
  { name: '100',  px: 8,   status: 'approved', source: 'project-documentation' },
  { name: '150',  px: 12,  status: 'provisional', source: 'derived-scale' },
  { name: '200',  px: 16,  status: 'approved', source: 'project-documentation' },
  { name: '300',  px: 24,  status: 'approved', source: 'project-documentation' },
  { name: '400',  px: 32,  status: 'provisional', source: 'derived-scale' },
  { name: '500',  px: 40,  status: 'provisional', source: 'derived-scale' },
  { name: '600',  px: 48,  status: 'provisional', source: 'derived-scale' },
  { name: '800',  px: 64,  status: 'provisional', source: 'derived-scale' },
  { name: '1000', px: 80,  status: 'approved', source: 'project-documentation', description: 'Altura estrutural documentada do header.' },
  { name: '1200', px: 96,  status: 'provisional', source: 'derived-scale' },
  { name: '1600', px: 128, status: 'provisional', source: 'derived-scale' },
];

// Converte px em rem (assumindo base 16px)
function pxToRem(px: number): string {
  return `${(px / 16).toFixed(2)}rem`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typography tokens — Sacred Modernism
// Fonte: design-system/foundation/typography.tokens.json
// Cobre font-family, font-weight, font-size, line-height, letter-spacing
// e composições tipográficas prontas.
// ─────────────────────────────────────────────────────────────────────────────
type FontFamilyToken = {
  name: string;
  stack: string[];
  status: MotionStatus;
  source: string;
};
type FontWeightToken = {
  name: string;
  value: number;
  status: MotionStatus;
  source: string;
};
type FontSizeToken = {
  name: string;
  px: number;
  status: MotionStatus;
  source: string;
};
type LineHeightToken = {
  name: string;
  value: number;
  status: MotionStatus;
  source: string;
};
type LetterSpacingToken = {
  name: string;
  value: string;
  status: MotionStatus;
  source: string;
};
type TypographyComposition = {
  name: string;
  fontFamily: string;          // nome do font-family token referenciado
  fontSizePx: number;          // resolvido
  fontWeight: number;          // resolvido
  letterSpacing: string;       // resolvido
  lineHeight: number;          // resolvido
  status: MotionStatus;
  source: string;
};

const fontFamilyTokens: FontFamilyToken[] = [
  { name: 'heading', stack: ['Cormorant Garamond', 'Georgia', 'serif'],      status: 'approved', source: 'project-documentation' },
  { name: 'body',    stack: ['Inter', 'Arial', 'sans-serif'],                status: 'approved', source: 'project-documentation' },
];

const fontWeightTokens: FontWeightToken[] = [
  { name: 'regular',  value: 400, status: 'provisional', source: 'system-proposal' },
  { name: 'medium',   value: 500, status: 'provisional', source: 'system-proposal' },
  { name: 'semibold', value: 600, status: 'provisional', source: 'system-proposal' },
  { name: 'bold',     value: 700, status: 'provisional', source: 'system-proposal' },
];

const fontSizeTokens: FontSizeToken[] = [
  { name: '100',  px: 12,  status: 'provisional', source: 'modular-scale' },
  { name: '200',  px: 14,  status: 'provisional', source: 'modular-scale' },
  { name: '300',  px: 16,  status: 'provisional', source: 'modular-scale' },
  { name: '400',  px: 18,  status: 'provisional', source: 'modular-scale' },
  { name: '500',  px: 20,  status: 'provisional', source: 'modular-scale' },
  { name: '600',  px: 24,  status: 'provisional', source: 'modular-scale' },
  { name: '700',  px: 32,  status: 'provisional', source: 'modular-scale' },
  { name: '800',  px: 40,  status: 'provisional', source: 'modular-scale' },
  { name: '900',  px: 48,  status: 'provisional', source: 'modular-scale' },
  { name: '1000', px: 64,  status: 'provisional', source: 'modular-scale' },
  { name: '1100', px: 80,  status: 'provisional', source: 'modular-scale' },
];

const lineHeightTokens: LineHeightToken[] = [
  { name: 'tight',   value: 1.1,  status: 'provisional', source: 'system-proposal' },
  { name: 'snug',    value: 1.25, status: 'provisional', source: 'system-proposal' },
  { name: 'normal',  value: 1.5,  status: 'provisional', source: 'system-proposal' },
  { name: 'relaxed', value: 1.7,  status: 'provisional', source: 'system-proposal' },
];

const letterSpacingTokens: LetterSpacingToken[] = [
  { name: 'tight',  value: '-0.02em', status: 'provisional', source: 'system-proposal' },
  { name: 'normal', value: '0em',     status: 'provisional', source: 'system-proposal' },
  { name: 'wide',   value: '0.04em',  status: 'provisional', source: 'system-proposal' },
  { name: 'caps',   value: '0.12em',  status: 'provisional', source: 'system-proposal' },
];

// Composições tipográficas — referencias resolvidas
const typographyCompositions: TypographyComposition[] = [
  { name: 'display-large',  fontFamily: 'heading', fontSizePx: 80, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1,  status: 'provisional', source: 'system-proposal' },
  { name: 'display-medium', fontFamily: 'heading', fontSizePx: 48, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1,  status: 'provisional', source: 'system-proposal' },
  { name: 'heading-large',  fontFamily: 'heading', fontSizePx: 40, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.25, status: 'provisional', source: 'system-proposal' },
  { name: 'heading-medium', fontFamily: 'heading', fontSizePx: 32, fontWeight: 500, letterSpacing: '0em',     lineHeight: 1.25, status: 'provisional', source: 'system-proposal' },
  { name: 'body-large',     fontFamily: 'body',    fontSizePx: 18, fontWeight: 400, letterSpacing: '0em',     lineHeight: 1.7,  status: 'provisional', source: 'system-proposal' },
  { name: 'body-medium',    fontFamily: 'body',    fontSizePx: 16, fontWeight: 400, letterSpacing: '0em',     lineHeight: 1.5,  status: 'provisional', source: 'system-proposal' },
  { name: 'label-medium',   fontFamily: 'body',    fontSizePx: 14, fontWeight: 600, letterSpacing: '0.04em',  lineHeight: 1.25, status: 'provisional', source: 'system-proposal' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Z-Index tokens — Sacred Modernism
// Fonte: design-system/foundation/z-index.tokens.json
// Hierarquia de empilhamento que define quem fica por cima de quem.
// ─────────────────────────────────────────────────────────────────────────────
type ZIndexToken = {
  name: string;
  value: number;
  status: MotionStatus;
  source: string;
  description?: string;
};

const zIndexTokens: ZIndexToken[] = [
  { name: 'base',     value: 0,  status: 'provisional', source: 'system-proposal' },
  { name: 'raised',   value: 10, status: 'provisional', source: 'system-proposal' },
  { name: 'dropdown', value: 30, status: 'provisional', source: 'system-proposal' },
  { name: 'sticky',   value: 40, status: 'provisional', source: 'system-proposal' },
  { name: 'header',   value: 50, status: 'approved',    source: 'project-documentation', description: 'Header documentado com z-50.' },
  { name: 'overlay',  value: 60, status: 'provisional', source: 'system-proposal' },
  { name: 'modal',    value: 70, status: 'provisional', source: 'system-proposal' },
  { name: 'toast',    value: 80, status: 'provisional', source: 'system-proposal' },
];

// Padrão de uso recomendado por camada
const ZINDEX_USE: Record<string, string> = {
  base:     'Camada base. Conteúdo padrão em fluxo normal.',
  raised:   'Cards em hover, elementos com sombra elevada.',
  dropdown: 'Menus dropdown, popovers, listas suspensas.',
  sticky:   'Elementos fixos durante scroll (tabela, sidebar).',
  header:   'Cabeçalho fixo do site (documentado em 50).',
  overlay:  'Backdrop de modais, scrims sobre o conteúdo.',
  modal:    'Caixa de diálogo modal centralizada.',
  toast:    'Notificações efêmeras, snackbars, alerts globais.',
};

// Semantic color tokens — Sacred Modernism (light + dark themes)
// Fonte: design-system/semantic/color.json (light) | color.dark.json (dark)
// Cada token aponta para um foundation token; aqui resolvemos para HEX.
type SemanticRole = {
  /** Caminho do token, ex.: "background.canvas" */
  path: string;
  /** Referência original ao foundation token, ex.: "{color.base.parchment.050}" */
  foundationRef: string;
  /** Hex resolvido a partir do foundation token */
  hex: string;
  /** Descrição semântica */
  desc: string;
  /** Status: approved ou provisional */
  status: 'approved' | 'provisional';
  /** Categoria macro para agrupamento na documentação */
  category: 'background' | 'surface' | 'text' | 'icon' | 'border' | 'action' | 'feedback' | 'focus' | 'overlay';
};

type Theme = 'light' | 'dark';

const semanticTokens: Record<Theme, SemanticRole[]> = {
  light: [
  // background
  { path: 'background.canvas',     foundationRef: '{color.base.parchment.050}',     hex: '#FAF5EC', desc: 'Fundo principal das páginas.',                                       status: 'approved',    category: 'background' },
  { path: 'background.subtle',     foundationRef: '{color.base.parchment.100}',     hex: '#EEEBE4', desc: 'Fundo secundário de baixa ênfase.',                                 status: 'approved',    category: 'background' },
  { path: 'background.inverse',    foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Fundo de alto contraste ou seção invertida.',                        status: 'approved',    category: 'background' },
  { path: 'background.brand',      foundationRef: '{color.base.terracotta.600}',    hex: '#8B3A2A', desc: 'Fundo institucional de marca.',                                     status: 'approved',    category: 'background' },

  // surface
  { path: 'surface.default',       foundationRef: '{color.base.parchment.050}',     hex: '#FAF5EC', desc: 'Superfície padrão de cards e painéis.',                             status: 'approved',    category: 'surface' },
  { path: 'surface.subtle',        foundationRef: '{color.base.parchment.100}',     hex: '#EEEBE4', desc: 'Superfície discreta.',                                              status: 'approved',    category: 'surface' },
  { path: 'surface.raised',        foundationRef: '{color.base.parchment.050}',     hex: '#FAF5EC', desc: 'Superfície elevada.',                                               status: 'approved',    category: 'surface' },
  { path: 'surface.inverse',       foundationRef: '{color.base.warm-neutral.900}',  hex: '#2A2318', desc: 'Superfície invertida.',                                             status: 'approved',    category: 'surface' },
  { path: 'surface.brand-subtle',  foundationRef: '{color.base.terracotta.100}',    hex: '#FFE4DE', desc: 'Superfície suave associada à marca.',                               status: 'approved',    category: 'surface' },

  // text
  { path: 'text.primary',          foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Texto principal.',                                                  status: 'approved',    category: 'text' },
  { path: 'text.secondary',        foundationRef: '{color.base.warm-neutral.800}',  hex: '#3F3729', desc: 'Texto secundário.',                                                 status: 'approved',    category: 'text' },
  { path: 'text.tertiary',         foundationRef: '{color.base.warm-neutral.700}',  hex: '#594E3D', desc: 'Texto de menor ênfase.',                                            status: 'approved',    category: 'text' },
  { path: 'text.inverse',          foundationRef: '{color.base.parchment.050}',     hex: '#FAF5EC', desc: 'Texto sobre fundos escuros.',                                       status: 'approved',    category: 'text' },
  { path: 'text.brand',            foundationRef: '{color.base.terracotta.700}',    hex: '#7F3627', desc: 'Texto institucional ou de marca.',                                  status: 'approved',    category: 'text' },
  { path: 'text.link',             foundationRef: '{color.base.terracotta.700}',    hex: '#7F3627', desc: 'Links de texto.',                                                   status: 'approved',    category: 'text' },
  { path: 'text.disabled',         foundationRef: '{color.base.warm-neutral.500}',  hex: '#8E816E', desc: 'Texto desabilitado.',                                               status: 'approved',    category: 'text' },

  // icon
  { path: 'icon.primary',          foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Ícone principal.',                                                  status: 'approved',    category: 'icon' },
  { path: 'icon.secondary',        foundationRef: '{color.base.warm-neutral.700}',  hex: '#594E3D', desc: 'Ícone secundário.',                                                 status: 'approved',    category: 'icon' },
  { path: 'icon.inverse',          foundationRef: '{color.base.parchment.050}',     hex: '#FAF5EC', desc: 'Ícone sobre fundo escuro.',                                         status: 'approved',    category: 'icon' },
  { path: 'icon.brand',            foundationRef: '{color.base.ancestral-gold.600}',hex: '#816500', desc: 'Ícone de destaque institucional.',                                  status: 'approved',    category: 'icon' },
  { path: 'icon.disabled',         foundationRef: '{color.base.warm-neutral.500}',  hex: '#8E816E', desc: 'Ícone desabilitado.',                                               status: 'approved',    category: 'icon' },

  // border
  { path: 'border.subtle',         foundationRef: '{color.base.warm-neutral.200}',  hex: '#DBD5CB', desc: 'Divisória ou borda discreta.',                                       status: 'approved',    category: 'border' },
  { path: 'border.default',        foundationRef: '{color.base.warm-neutral.300}',  hex: '#C3B9AB', desc: 'Borda padrão.',                                                     status: 'approved',    category: 'border' },
  { path: 'border.strong',         foundationRef: '{color.base.warm-neutral.600}',  hex: '#736754', desc: 'Borda de alta ênfase.',                                             status: 'approved',    category: 'border' },
  { path: 'border.focus',          foundationRef: '{color.base.ancestral-gold.600}',hex: '#816500', desc: 'Borda de foco.',                                                    status: 'approved',    category: 'border' },
  { path: 'border.error',          foundationRef: '{color.base.ember.600}',         hex: '#A33A2B', desc: 'Borda de erro.',                                                    status: 'provisional', category: 'border' },

  // action.primary
  { path: 'action.primary.default',  foundationRef: '{color.base.terracotta.600}',  hex: '#8B3A2A', desc: 'Ação primária padrão.',                                              status: 'approved',    category: 'action' },
  { path: 'action.primary.hover',    foundationRef: '{color.base.terracotta.700}',  hex: '#7F3627', desc: 'Ação primária em hover.',                                            status: 'approved',    category: 'action' },
  { path: 'action.primary.active',   foundationRef: '{color.base.terracotta.800}',  hex: '#5E2317', desc: 'Ação primária ativa.',                                               status: 'approved',    category: 'action' },
  { path: 'action.primary.disabled', foundationRef: '{color.base.warm-neutral.300}',hex: '#C3B9AB', desc: 'Ação primária desabilitada.',                                        status: 'approved',    category: 'action' },
  // action.secondary
  { path: 'action.secondary.default',  foundationRef: '{color.base.ancestral-gold.600}',hex: '#816500', desc: 'Ação secundária padrão.',                                         status: 'approved',    category: 'action' },
  { path: 'action.secondary.hover',    foundationRef: '{color.base.ancestral-gold.700}',hex: '#634D00', desc: 'Ação secundária em hover.',                                       status: 'approved',    category: 'action' },
  { path: 'action.secondary.active',   foundationRef: '{color.base.ancestral-gold.800}',hex: '#463600', desc: 'Ação secundária ativa.',                                          status: 'approved',    category: 'action' },
  { path: 'action.secondary.disabled', foundationRef: '{color.base.warm-neutral.300}',hex: '#C3B9AB', desc: 'Ação secundária desabilitada.',                                     status: 'approved',    category: 'action' },
  // action.tertiary
  { path: 'action.tertiary.default',  foundationRef: '{color.base.warm-neutral.900}', hex: '#2A2318', desc: 'Ação terciária padrão.',                                              status: 'approved',    category: 'action' },
  { path: 'action.tertiary.hover',    foundationRef: '{color.base.warm-neutral.800}', hex: '#3F3729', desc: 'Ação terciária em hover.',                                            status: 'approved',    category: 'action' },
  { path: 'action.tertiary.active',   foundationRef: '{color.base.warm-neutral.950}', hex: '#0D0B08', desc: 'Ação terciária ativa.',                                               status: 'approved',    category: 'action' },
  { path: 'action.tertiary.disabled', foundationRef: '{color.base.warm-neutral.400}', hex: '#A89D8B', desc: 'Ação terciária desabilitada.',                                        status: 'approved',    category: 'action' },
  // action content
  { path: 'action.on-primary',   foundationRef: '{color.base.parchment.050}',      hex: '#FAF5EC', desc: 'Conteúdo sobre ação primária.',                                       status: 'approved',    category: 'action' },
  { path: 'action.on-secondary', foundationRef: '{color.base.warm-neutral.950}',   hex: '#0D0B08', desc: 'Conteúdo sobre ação secundária.',                                     status: 'approved',    category: 'action' },

  // feedback.success
  { path: 'feedback.success.subtle',    foundationRef: '{color.base.forest.100}', hex: '#E2EFE6', desc: 'Fundo suave de sucesso.',                                              status: 'provisional', category: 'feedback' },
  { path: 'feedback.success.default',   foundationRef: '{color.base.forest.600}', hex: '#3F6B4F', desc: 'Cor padrão de sucesso.',                                               status: 'provisional', category: 'feedback' },
  { path: 'feedback.success.strong',    foundationRef: '{color.base.forest.800}', hex: '#20402C', desc: 'Cor forte de sucesso.',                                                status: 'provisional', category: 'feedback' },
  { path: 'feedback.success.on-strong', foundationRef: '{color.base.parchment.050}', hex: '#FAF5EC', desc: 'Conteúdo sobre sucesso forte.',                                    status: 'provisional', category: 'feedback' },
  // feedback.warning
  { path: 'feedback.warning.subtle',    foundationRef: '{color.base.sun.100}',   hex: '#FAE9CF', desc: 'Fundo suave de aviso.',                                                status: 'provisional', category: 'feedback' },
  { path: 'feedback.warning.default',   foundationRef: '{color.base.sun.600}',   hex: '#8B5F00', desc: 'Cor padrão de aviso.',                                                 status: 'provisional', category: 'feedback' },
  { path: 'feedback.warning.strong',    foundationRef: '{color.base.sun.800}',   hex: '#4C3200', desc: 'Cor forte de aviso.',                                                  status: 'provisional', category: 'feedback' },
  { path: 'feedback.warning.on-strong', foundationRef: '{color.base.warm-neutral.950}', hex: '#0D0B08', desc: 'Conteúdo sobre aviso forte.',                                    status: 'provisional', category: 'feedback' },
  // feedback.error
  { path: 'feedback.error.subtle',    foundationRef: '{color.base.ember.100}',   hex: '#FFE4DF', desc: 'Fundo suave de erro.',                                                  status: 'provisional', category: 'feedback' },
  { path: 'feedback.error.default',   foundationRef: '{color.base.ember.600}',   hex: '#A33A2B', desc: 'Cor padrão de erro.',                                                   status: 'provisional', category: 'feedback' },
  { path: 'feedback.error.strong',    foundationRef: '{color.base.ember.800}',   hex: '#65190F', desc: 'Cor forte de erro.',                                                    status: 'provisional', category: 'feedback' },
  { path: 'feedback.error.on-strong', foundationRef: '{color.base.parchment.050}', hex: '#FAF5EC', desc: 'Conteúdo sobre erro forte.',                                        status: 'provisional', category: 'feedback' },
  // feedback.info
  { path: 'feedback.info.subtle',    foundationRef: '{color.base.river.100}',     hex: '#DFEEF3', desc: 'Fundo suave de informação.',                                            status: 'provisional', category: 'feedback' },
  { path: 'feedback.info.default',   foundationRef: '{color.base.river.600}',     hex: '#2F6473', desc: 'Cor padrão de informação.',                                             status: 'provisional', category: 'feedback' },
  { path: 'feedback.info.strong',    foundationRef: '{color.base.river.800}',     hex: '#163E49', desc: 'Cor forte de informação.',                                              status: 'provisional', category: 'feedback' },
  { path: 'feedback.info.on-strong', foundationRef: '{color.base.parchment.050}', hex: '#FAF5EC', desc: 'Conteúdo sobre informação forte.',                                  status: 'provisional', category: 'feedback' },

  // focus
  { path: 'focus.ring',       foundationRef: '{color.base.ancestral-gold.600}', hex: '#816500', desc: 'Anel de foco visível.',                                                  status: 'approved',    category: 'focus' },
  { path: 'focus.ring-offset',foundationRef: '{color.base.parchment.050}',      hex: '#FAF5EC', desc: 'Separação entre o foco e o componente.',                                status: 'approved',    category: 'focus' },

  // overlay
  { path: 'overlay.scrim',     foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Base cromática de scrims e modais.',                                     status: 'approved',    category: 'overlay' },
  { path: 'overlay.highlight', foundationRef: '{color.base.ancestral-gold.300}', hex: '#D3B870', desc: 'Luz de destaque e efeitos atmosféricos.',                               status: 'approved',    category: 'overlay' },
  ],

  // ─── DARK THEME ────────────────────────────────────────────────────────
  // Espelha a estrutura do light; foundationRefs e hex resolvem para a
  // base escura correspondente.
  dark: [
  // background
  { path: 'background.canvas',     foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Fundo principal das páginas.',                                          status: 'approved',    category: 'background' },
  { path: 'background.subtle',     foundationRef: '{color.base.warm-neutral.900}',  hex: '#2A2318', desc: 'Fundo secundário de baixa ênfase.',                                     status: 'approved',    category: 'background' },
  { path: 'background.inverse',    foundationRef: '{color.base.parchment.050}',     hex: '#FAF5EC', desc: 'Fundo de alto contraste ou seção invertida.',                          status: 'approved',    category: 'background' },
  { path: 'background.brand',      foundationRef: '{color.base.terracotta.700}',    hex: '#7F3627', desc: 'Fundo institucional de marca.',                                         status: 'approved',    category: 'background' },

  // surface
  { path: 'surface.default',       foundationRef: '{color.base.warm-neutral.900}',  hex: '#2A2318', desc: 'Superfície padrão de cards e painéis.',                                 status: 'approved',    category: 'surface' },
  { path: 'surface.subtle',        foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Superfície discreta.',                                                  status: 'approved',    category: 'surface' },
  { path: 'surface.raised',        foundationRef: '{color.base.warm-neutral.800}',  hex: '#3F3729', desc: 'Superfície elevada.',                                                   status: 'approved',    category: 'surface' },
  { path: 'surface.inverse',       foundationRef: '{color.base.parchment.100}',     hex: '#EEEBE4', desc: 'Superfície invertida.',                                                 status: 'approved',    category: 'surface' },
  { path: 'surface.brand-subtle',  foundationRef: '{color.base.terracotta.900}',    hex: '#3D1109', desc: 'Superfície suave associada à marca.',                                   status: 'approved',    category: 'surface' },

  // text
  { path: 'text.primary',          foundationRef: '{color.base.parchment.050}',      hex: '#FAF5EC', desc: 'Texto principal.',                                                      status: 'approved',    category: 'text' },
  { path: 'text.secondary',        foundationRef: '{color.base.parchment.200}',      hex: '#DBD5CA', desc: 'Texto secundário.',                                                     status: 'approved',    category: 'text' },
  { path: 'text.tertiary',         foundationRef: '{color.base.parchment.300}',      hex: '#C2B9AA', desc: 'Texto de menor ênfase.',                                                status: 'approved',    category: 'text' },
  { path: 'text.inverse',          foundationRef: '{color.base.warm-neutral.950}',   hex: '#0D0B08', desc: 'Texto sobre fundos claros.',                                            status: 'approved',    category: 'text' },
  { path: 'text.brand',            foundationRef: '{color.base.ancestral-gold.400}', hex: '#BC9A37', desc: 'Texto institucional ou de marca.',                                      status: 'approved',    category: 'text' },
  { path: 'text.link',             foundationRef: '{color.base.ancestral-gold.400}', hex: '#BC9A37', desc: 'Links de texto.',                                                       status: 'approved',    category: 'text' },
  { path: 'text.disabled',         foundationRef: '{color.base.warm-neutral.500}',   hex: '#8E816E', desc: 'Texto desabilitado.',                                                   status: 'approved',    category: 'text' },

  // icon
  { path: 'icon.primary',          foundationRef: '{color.base.parchment.050}',      hex: '#FAF5EC', desc: 'Ícone principal.',                                                      status: 'approved',    category: 'icon' },
  { path: 'icon.secondary',        foundationRef: '{color.base.parchment.300}',      hex: '#C2B9AA', desc: 'Ícone secundário.',                                                     status: 'approved',    category: 'icon' },
  { path: 'icon.inverse',          foundationRef: '{color.base.warm-neutral.950}',   hex: '#0D0B08', desc: 'Ícone sobre fundo claro.',                                              status: 'approved',    category: 'icon' },
  { path: 'icon.brand',            foundationRef: '{color.base.ancestral-gold.400}', hex: '#BC9A37', desc: 'Ícone de destaque institucional.',                                      status: 'approved',    category: 'icon' },
  { path: 'icon.disabled',         foundationRef: '{color.base.warm-neutral.500}',   hex: '#8E816E', desc: 'Ícone desabilitado.',                                                   status: 'approved',    category: 'icon' },

  // border
  { path: 'border.subtle',         foundationRef: '{color.base.warm-neutral.800}',   hex: '#3F3729', desc: 'Divisória ou borda discreta.',                                          status: 'approved',    category: 'border' },
  { path: 'border.default',        foundationRef: '{color.base.warm-neutral.700}',   hex: '#594E3D', desc: 'Borda padrão.',                                                         status: 'approved',    category: 'border' },
  { path: 'border.strong',         foundationRef: '{color.base.parchment.400}',      hex: '#A79D8A', desc: 'Borda de alta ênfase.',                                                 status: 'approved',    category: 'border' },
  { path: 'border.focus',          foundationRef: '{color.base.ancestral-gold.400}', hex: '#BC9A37', desc: 'Borda de foco.',                                                        status: 'approved',    category: 'border' },
  { path: 'border.error',          foundationRef: '{color.base.ember.400}',          hex: '#E17F6E', desc: 'Borda de erro.',                                                        status: 'provisional', category: 'border' },

  // action.primary
  { path: 'action.primary.default',  foundationRef: '{color.base.terracotta.500}',  hex: '#BE6755', desc: 'Ação primária padrão.',                                                  status: 'approved',    category: 'action' },
  { path: 'action.primary.hover',    foundationRef: '{color.base.terracotta.400}',  hex: '#D58776', desc: 'Ação primária em hover.',                                                status: 'approved',    category: 'action' },
  { path: 'action.primary.active',   foundationRef: '{color.base.terracotta.300}',  hex: '#E9A89A', desc: 'Ação primária ativa.',                                                   status: 'approved',    category: 'action' },
  { path: 'action.primary.disabled', foundationRef: '{color.base.warm-neutral.700}',hex: '#594E3D', desc: 'Ação primária desabilitada.',                                            status: 'approved',    category: 'action' },
  // action.secondary
  { path: 'action.secondary.default',  foundationRef: '{color.base.ancestral-gold.500}',hex: '#C9A227', desc: 'Ação secundária padrão.',                                            status: 'approved',    category: 'action' },
  { path: 'action.secondary.hover',    foundationRef: '{color.base.ancestral-gold.400}',hex: '#BC9A37', desc: 'Ação secundária em hover.',                                          status: 'approved',    category: 'action' },
  { path: 'action.secondary.active',   foundationRef: '{color.base.ancestral-gold.300}',hex: '#D3B870', desc: 'Ação secundária ativa.',                                             status: 'approved',    category: 'action' },
  { path: 'action.secondary.disabled', foundationRef: '{color.base.warm-neutral.700}',hex: '#594E3D', desc: 'Ação secundária desabilitada.',                                        status: 'approved',    category: 'action' },
  // action.tertiary
  { path: 'action.tertiary.default',  foundationRef: '{color.base.parchment.100}',  hex: '#EEEBE4', desc: 'Ação terciária padrão.',                                                  status: 'approved',    category: 'action' },
  { path: 'action.tertiary.hover',    foundationRef: '{color.base.parchment.200}',  hex: '#DBD5CA', desc: 'Ação terciária em hover.',                                                status: 'approved',    category: 'action' },
  { path: 'action.tertiary.active',   foundationRef: '{color.base.parchment.300}',  hex: '#C2B9AA', desc: 'Ação terciária ativa.',                                                   status: 'approved',    category: 'action' },
  { path: 'action.tertiary.disabled', foundationRef: '{color.base.warm-neutral.600}',hex: '#736754', desc: 'Ação terciária desabilitada.',                                          status: 'approved',    category: 'action' },
  // action content
  { path: 'action.on-primary',   foundationRef: '{color.base.parchment.050}',      hex: '#FAF5EC', desc: 'Conteúdo sobre ação primária.',                                         status: 'approved',    category: 'action' },
  { path: 'action.on-secondary', foundationRef: '{color.base.warm-neutral.950}',   hex: '#0D0B08', desc: 'Conteúdo sobre ação secundária.',                                       status: 'approved',    category: 'action' },

  // feedback.success
  { path: 'feedback.success.subtle',    foundationRef: '{color.base.forest.900}', hex: '#0F2719', desc: 'Fundo suave de sucesso.',                                                status: 'provisional', category: 'feedback' },
  { path: 'feedback.success.default',   foundationRef: '{color.base.forest.400}', hex: '#82AA8F', desc: 'Cor padrão de sucesso.',                                                 status: 'provisional', category: 'feedback' },
  { path: 'feedback.success.strong',    foundationRef: '{color.base.forest.300}', hex: '#A4C4AE', desc: 'Cor forte de sucesso.',                                                  status: 'provisional', category: 'feedback' },
  { path: 'feedback.success.on-strong', foundationRef: '{color.base.warm-neutral.950}', hex: '#0D0B08', desc: 'Conteúdo sobre sucesso forte.',                                    status: 'provisional', category: 'feedback' },
  // feedback.warning
  { path: 'feedback.warning.subtle',    foundationRef: '{color.base.sun.900}',   hex: '#2F1E00', desc: 'Fundo suave de aviso.',                                                  status: 'provisional', category: 'feedback' },
  { path: 'feedback.warning.default',   foundationRef: '{color.base.sun.400}',   hex: '#C8943D', desc: 'Cor padrão de aviso.',                                                   status: 'provisional', category: 'feedback' },
  { path: 'feedback.warning.strong',    foundationRef: '{color.base.sun.300}',   hex: '#DDB373', desc: 'Cor forte de aviso.',                                                    status: 'provisional', category: 'feedback' },
  { path: 'feedback.warning.on-strong', foundationRef: '{color.base.warm-neutral.950}', hex: '#0D0B08', desc: 'Conteúdo sobre aviso forte.',                                    status: 'provisional', category: 'feedback' },
  // feedback.error
  { path: 'feedback.error.subtle',    foundationRef: '{color.base.ember.900}',   hex: '#430904', desc: 'Fundo suave de erro.',                                                    status: 'provisional', category: 'feedback' },
  { path: 'feedback.error.default',   foundationRef: '{color.base.ember.400}',   hex: '#E17F6E', desc: 'Cor padrão de erro.',                                                     status: 'provisional', category: 'feedback' },
  { path: 'feedback.error.strong',    foundationRef: '{color.base.ember.300}',   hex: '#F4A394', desc: 'Cor forte de erro.',                                                      status: 'provisional', category: 'feedback' },
  { path: 'feedback.error.on-strong', foundationRef: '{color.base.warm-neutral.950}', hex: '#0D0B08', desc: 'Conteúdo sobre erro forte.',                                        status: 'provisional', category: 'feedback' },
  // feedback.info
  { path: 'feedback.info.subtle',    foundationRef: '{color.base.river.900}',     hex: '#08262E', desc: 'Fundo suave de informação.',                                              status: 'provisional', category: 'feedback' },
  { path: 'feedback.info.default',   foundationRef: '{color.base.river.400}',     hex: '#79A7B5', desc: 'Cor padrão de informação.',                                               status: 'provisional', category: 'feedback' },
  { path: 'feedback.info.strong',    foundationRef: '{color.base.river.300}',     hex: '#9DC2CD', desc: 'Cor forte de informação.',                                                status: 'provisional', category: 'feedback' },
  { path: 'feedback.info.on-strong', foundationRef: '{color.base.warm-neutral.950}', hex: '#0D0B08', desc: 'Conteúdo sobre informação forte.',                                  status: 'provisional', category: 'feedback' },

  // focus
  { path: 'focus.ring',       foundationRef: '{color.base.ancestral-gold.400}', hex: '#BC9A37', desc: 'Anel de foco visível.',                                                   status: 'approved',    category: 'focus' },
  { path: 'focus.ring-offset',foundationRef: '{color.base.warm-neutral.950}',   hex: '#0D0B08', desc: 'Separação entre o foco e o componente.',                                 status: 'approved',    category: 'focus' },

  // overlay
  { path: 'overlay.scrim',     foundationRef: '{color.base.warm-neutral.950}',  hex: '#0D0B08', desc: 'Base cromática de scrims e modais.',                                      status: 'approved',    category: 'overlay' },
  { path: 'overlay.highlight', foundationRef: '{color.base.ancestral-gold.400}',hex: '#BC9A37', desc: 'Luz de destaque e efeitos atmosféricos.',                                status: 'approved',    category: 'overlay' },
  ],
};

const SEMANTIC_CATEGORIES: Array<{
  key: SemanticRole['category'];
  label: string;
  desc: string;
}> = [
  { key: 'background', label: 'Background',     desc: 'Fundos de páginas e seções.' },
  { key: 'surface',    label: 'Surface',        desc: 'Superfícies de cards, painéis e containers.' },
  { key: 'text',       label: 'Text',           desc: 'Cores de texto conforme hierarquia e contexto.' },
  { key: 'icon',       label: 'Icon',           desc: 'Cores de ícones.' },
  { key: 'border',     label: 'Border',         desc: 'Divisórias e contornos.' },
  { key: 'action',     label: 'Action',         desc: 'Estados de elementos interativos (botões, links).' },
  { key: 'feedback',   label: 'Feedback',       desc: 'Estados de feedback (sucesso, aviso, erro, informação).' },
  { key: 'focus',      label: 'Focus',          desc: 'Indicadores de foco acessível.' },
  { key: 'overlay',    label: 'Overlay',        desc: 'Camadas atmosféricas e overlays.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component tokens — Button
// Fonte: design-system/component/button.tokens.json
// Estes tokens são REFERÊNCIAS a outros tokens (space, radius, color, etc.).
// Abaixo eles são resolvidos para valores literais a partir dos arrays
// já definidos (foundation + semantic).
// ─────────────────────────────────────────────────────────────────────────────

// Helpers de resolução
const getSpace = (name: string): string => {
  const t = spaceTokens.find((s) => s.name === name);
  return t ? `${t.px}px` : '0px';
};
const getRadius = (name: string): string => {
  const t = radiusTokens.find((r) => r.name === name);
  return t ? t.value : '0px';
};
const getBorderWidth = (name: string): string => {
  const t = borderWidthTokens.find((b) => b.name === name);
  return t ? t.value : '0px';
};
const getColor = (path: string): string => {
  // Procura nos semantic tokens (light theme)
  const t = semanticTokens.light.find((r) => r.path === path);
  if (t) return t.hex;
  // Fallback: foundation direto (path = "family.grade")
  const [family, grade] = path.split('.');
  const f = colorPalette[family as keyof typeof colorPalette];
  if (!f) return '#000000';
  const s = f.shades.find((sh) => sh.grade === grade);
  return s ? s.hex : '#000000';
};

// Anatomia do botão — referências resolvidas
const buttonAnatomy = {
  height: {
    small:  getSpace('400'),   // 32px
    medium: getSpace('600'),   // 48px
    large:  getSpace('800'),   // 64px
  },
  paddingInline: {
    small:  getSpace('200'),   // 16px
    medium: getSpace('300'),   // 24px
    large:  getSpace('400'),   // 32px
  },
  gap:           getSpace('100'),          // 8px
  radius:        getRadius('200'),         // 8px
  borderWidth:   getBorderWidth('thin'),   // 1px
};

// Variantes — referências resolvidas (cores + motion)
const buttonVariants = {
  primary: {
    background: {
      default:  getColor('action.primary.default'),
      hover:    getColor('action.primary.hover'),
      active:   getColor('action.primary.active'),
      disabled: getColor('action.primary.disabled'),
    },
    text: {
      default:  getColor('action.on-primary'),
      disabled: getColor('text.disabled'),
    },
    border: {
      default: getColor('action.primary.default'),
      hover:   getColor('action.primary.hover'),
      active:  getColor('action.primary.active'),
    },
  },
  secondary: {
    background: {
      default:  getColor('surface.default'),
      hover:    getColor('surface.subtle'),
      active:   getColor('surface.brand-subtle'),
      disabled: getColor('surface.subtle'),
    },
    text: {
      default:  getColor('action.secondary.default'),
      disabled: getColor('text.disabled'),
    },
    border: {
      default: getColor('action.secondary.default'),
      hover:   getColor('action.secondary.hover'),
      active:  getColor('action.secondary.active'),
    },
  },
  ghost: {
    background: {
      default: getColor('surface.default'),
      hover:   getColor('surface.subtle'),
      active:  getColor('surface.brand-subtle'),
    },
    text: {
      default:  getColor('action.tertiary.default'),
      disabled: getColor('text.disabled'),
    },
  },
};

const buttonFocusRing = getColor('focus.ring');
const buttonDuration  = durationTokens.find((d) => d.name === 'fast')?.ms ?? 150;
const buttonEasing    = cubicBezierCss(
  cubicBezierTokens.find((c) => c.name === 'standard')?.points ?? [0.2, 0, 0, 1]
);

// ─────────────────────────────────────────────────────────────────────────────
// Component tokens — Card
// Fonte: design-system/component/card.tokens.json
// ─────────────────────────────────────────────────────────────────────────────

const getShadow = (name: string): ShadowValue | null => {
  return shadowTokens.find((s) => s.name === name)?.value ?? null;
};

const cardTokens = {
  background: {
    default: getColor('surface.default'),
    subtle:  getColor('surface.subtle'),
    inverse: getColor('surface.inverse'),
    glass:   getColor('overlay.scrim'),
  },
  text: {
    title:   getColor('text.primary'),
    body:    getColor('text.secondary'),
    inverse: getColor('text.inverse'),
  },
  border: {
    default: getColor('border.subtle'),
    hover:   getColor('border.focus'),
  },
  radius: {
    default: getRadius('300'),
    large:   getRadius('400'),
  },
  padding: {
    small:  getSpace('200'),
    medium: getSpace('300'),
    large:  getSpace('400'),
  },
  gap:        getSpace('200'),
  shadow: {
    default: getShadow('low'),
    hover:   getShadow('medium'),
  },
  motion: {
    duration: durationTokens.find((d) => d.name === 'deliberate')?.ms ?? 700,
    easing: cubicBezierCss(
      cubicBezierTokens.find((c) => c.name === 'emphasized')?.points ?? [0.2, 0.8, 0.2, 1]
    ),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component tokens — Input
// Fonte: design-system/component/input.tokens.json
// ─────────────────────────────────────────────────────────────────────────────

const inputTokens = {
  height: {
    small:  getSpace('500'),  // 40px
    medium: getSpace('600'),  // 48px
    large:  getSpace('800'),  // 64px
  },
  paddingInline: getSpace('200'),          // 16px
  gap:           getSpace('100'),          // 8px
  radius:        getRadius('200'),         // 8px
  borderWidth:   getBorderWidth('thin'),   // 1px
  background: {
    default:  getColor('surface.default'),
    disabled: getColor('surface.subtle'),
  },
  text: {
    value:      getColor('text.primary'),
    placeholder: getColor('text.tertiary'),
    disabled:   getColor('text.disabled'),
    label:      getColor('text.secondary'),
    helper:     getColor('text.tertiary'),
    error:      getColor('feedback.error.default'),
  },
  border: {
    default: getColor('border.default'),
    hover:   getColor('border.strong'),
    focus:   getColor('border.focus'),
    error:   getColor('border.error'),
    disabled: getColor('border.subtle'),
  },
  focusRing: getColor('focus.ring'),
  motion: {
    duration: durationTokens.find((d) => d.name === 'fast')?.ms ?? 150,
    easing: cubicBezierCss(
      cubicBezierTokens.find((c) => c.name === 'standard')?.points ?? [0.2, 0, 0, 1]
    ),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component tokens — Modal
// Fonte: design-system/component/modal.tokens.json
// ─────────────────────────────────────────────────────────────────────────────

const getOpacity = (name: string): number => {
  const t = opacityTokens.find((o) => o.name === name);
  return t ? t.value : 1;
};
const getZIndex = (name: string): number => {
  const t = zIndexTokens.find((z) => z.name === name);
  return t ? t.value : 0;
};

const modalTokens = {
  overlay: {
    background: getColor('overlay.scrim'),
    opacity:    getOpacity('strong'),   // 0.72
  },
  container: {
    background: getColor('surface.raised'),
    text:       getColor('text.primary'),
    radius:     getRadius('400'),          // 16px
    padding:    getSpace('400'),           // 32px
    shadow:     getShadow('high'),
    maxWidth:   '640px',
  },
  header: {
    gap:        getSpace('200'),           // 16px
    typography: 'typography.heading-medium',
  },
  body: {
    gap:        getSpace('300'),           // 24px
    typography: 'typography.body-medium',
  },
  footer: {
    gap: getSpace('200'),                  // 16px
  },
  zIndex: getZIndex('modal'),              // 70
  motion: {
    duration: durationTokens.find((d) => d.name === 'moderate')?.ms ?? 250,
    easing: cubicBezierCss(
      cubicBezierTokens.find((c) => c.name === 'enter')?.points ?? [0, 0, 0, 1]
    ),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component tokens — Navigation (Header, Links, Footer, Mobile menu)
// Fonte: design-system/component/navigation.tokens.json
// ─────────────────────────────────────────────────────────────────────────────

const navigationTokens = {
  header: {
    height:        getSpace('1000'),                // 80px (approved)
    background:    getColor('background.canvas'),  // #FAF5EC
    text:          getColor('text.primary'),       // #0D0B08
    border:        getColor('border.subtle'),      // #DBD5CB
    zIndex:        getZIndex('header'),            // 50 (approved)
    paddingInline: getSpace('300'),                // 24px
    shadow:        getShadow('low'),
  },
  link: {
    text: {
      default: getColor('text.secondary'),
      hover:   getColor('text.brand'),
      active:  getColor('text.brand'),
    },
    typography: 'typography.label-medium',
  },
  footer: {
    background:  getColor('background.inverse'),  // #FAF5EC
    text:        getColor('text.inverse'),
    link:        getColor('text.inverse'),
    accent:      getColor('icon.brand'),
    paddingBlock: getSpace('800'),                 // 64px
  },
  mobileMenu: {
    background: getColor('surface.raised'),
    zIndex:     getZIndex('overlay'),              // 60
    shadow:     getShadow('high'),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component tokens — Tabs
// Fonte: design-system/component/tabs.tokens.json
// ─────────────────────────────────────────────────────────────────────────────

const tabsTokens = {
  list: {
    gap:    getSpace('100'),                  // 8px
    border: getColor('border.subtle'),
  },
  item: {
    paddingInline: getSpace('200'),           // 16px
    paddingBlock:  getSpace('150'),           // 12px
    radius:        getRadius('100'),          // 4px
    typography:    'typography.label-medium',
    text: {
      default: getColor('text.secondary'),
      hover:   getColor('text.primary'),
      active:  getColor('text.brand'),
      disabled: getColor('text.disabled'),
    },
    indicator: {
      default: getColor('action.primary.default'),
      height:  getBorderWidth('medium'),      // 2px
    },
  },
  motion: {
    duration: durationTokens.find((d) => d.name === 'fast')?.ms ?? 150,
    easing: cubicBezierCss(
      cubicBezierTokens.find((c) => c.name === 'standard')?.points ?? [0.2, 0, 0, 1]
    ),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilitário WCAG: converte HEX → luminance relativa e calcula contrast ratio
// ─────────────────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la >= lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

function rateContrast(ratio: number): 'AAA' | 'AA' | 'FAIL' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
}

// Matriz de contraste entre roles semânticos principais
type ContrastCol = { role: string; label: string; hex: string };
type ContrastCell = { bgRole: string; ratio: number; rating: 'AAA' | 'AA' | 'FAIL' };
type ContrastRow = ContrastCol & { cells: ContrastCell[] };

const contrastColDefs: ContrastCol[] = [
  { role: 'background.canvas',  label: 'canvas (parchment.050)', hex: '#FAF5EC' },
  { role: 'background.subtle',  label: 'subtle (parchment.100)', hex: '#EEEBE4' },
  { role: 'surface.inverse',    label: 'inverse (warm-neutral.900)', hex: '#2A2318' },
  { role: 'background.inverse', label: 'inverse dark (warm-neutral.950)', hex: '#0D0B08' },
  { role: 'background.brand',   label: 'brand (terracotta.600)', hex: '#8B3A2A' },
];

const contrastRowDefs: ContrastCol[] = [
  { role: 'text.primary',   label: 'primary (warm-neutral.950)',  hex: '#0D0B08' },
  { role: 'text.secondary', label: 'secondary (warm-neutral.800)', hex: '#3F3729' },
  { role: 'text.tertiary',  label: 'tertiary (warm-neutral.700)',  hex: '#594E3D' },
  { role: 'text.brand',     label: 'brand (terracotta.700)',       hex: '#7F3627' },
  { role: 'text.disabled',  label: 'disabled (warm-neutral.500)', hex: '#8E816E' },
  { role: 'text.inverse',   label: 'inverse (parchment.050)',      hex: '#FAF5EC' },
];

const contrastMatrix: ContrastRow[] = contrastRowDefs.map((row) => ({
  ...row,
  cells: contrastColDefs.map((col) => {
    const ratio = contrastRatio(row.hex, col.hex);
    return { bgRole: col.role, ratio, rating: rateContrast(ratio) };
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponente: card de um Color Role (semantic token)
// ─────────────────────────────────────────────────────────────────────────────
type RoleCardProps = {
  role: SemanticRole;
  copiedValue: string | null;
  copyToClipboard: (text: string, id: string) => void;
};

function RoleCard({ role, copiedValue, copyToClipboard }: RoleCardProps) {
  const statusKey = role.status;
  const isLight = contrastRatio(role.hex, '#FFFFFF') < 1.4;
  const textOnSwatch = isLight ? '#0D0B08' : '#FAF5EC';

  return (
    <div className="p-4 bg-white rounded-md border border-black/5 shadow-xs hover:shadow-sm transition flex gap-3">
      {/* Swatch da cor */}
      <div
        className="w-16 h-16 shrink-0 rounded-sm relative group cursor-pointer border border-black/10"
        style={{ backgroundColor: role.hex }}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <button
            onClick={() => copyToClipboard(role.hex, `${role.path}-hex`)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-sm text-[8px] font-bold uppercase flex items-center gap-0.5"
            style={{ backgroundColor: textOnSwatch, color: role.hex }}
            title="Copiar HEX"
          >
            {copiedValue === `${role.path}-hex` ? <Check size={8} /> : <Copy size={8} />}
            HEX
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <code className="text-[11px] font-mono font-semibold text-slate-900">
            color.semantic.{role.path}
          </code>
          <span
            className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[statusKey]}`}
          >
            {STATUS_LABEL[statusKey]}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 font-sans leading-snug mb-1.5">
          {role.desc}
        </p>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="font-sans font-semibold text-slate-700">→</span>
            {role.foundationRef}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
            {role.hex}
          </span>
        </div>
      </div>
    </div>
  );
}

// Subcomponente: bloco de uma família de cor
type FamilyBlockProps = {
  family: Family;
  copiedValue: string | null;
  copyToClipboard: (text: string, id: string) => void;
};

function FamilyBlock({ family, copiedValue, copyToClipboard }: FamilyBlockProps) {
  const statusKey = family.status as 'approved' | 'provisional';
  return (
    <div className="space-y-4">
      {/* Cabeçalho da família */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-lg font-normal font-[var(--font-heading)] text-black">
              {family.name}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-sm border text-[9px] font-semibold uppercase tracking-wider font-sans ${STATUS_CLASS[statusKey]}`}
            >
              {STATUS_LABEL[statusKey]}
            </span>
            <span className="px-2 py-0.5 rounded-sm border border-black/10 bg-white text-[9px] font-mono uppercase tracking-wider text-slate-700">
              anchor · {family.anchorGrade}
            </span>
            <span className="px-2 py-0.5 rounded-sm border border-black/10 bg-white text-[9px] font-mono uppercase tracking-wider text-slate-700">
              {family.role}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-3xl">
            {family.desc}
          </p>
          <p className="text-[10px] text-slate-400 font-sans mt-1">
            Variáveis CSS: <code className="font-mono">--color-{family.key}-{'{grade}'}</code> ·{' '}
            Fonte: {SOURCE_LABEL[family.source] ?? family.source}
          </p>
        </div>
      </div>

      {/* Grade de 11 tons (050 → 950) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2">
        {family.shades.map((shade) => {
          const uniqueId = `${family.key}-${shade.grade}`;
          return (
            <div
              key={shade.grade}
              className={`flex flex-col rounded-sm overflow-hidden bg-white shadow-xs transition ${
                shade.isAnchor
                  ? 'border-2 border-[var(--color-ancestral-gold-500)] ring-1 ring-[var(--color-ancestral-gold-500)]/30'
                  : 'border border-black/5'
              }`}
            >
              {/* Bloco de cor */}
              <div
                className="h-16 w-full relative group transition-transform duration-300"
                style={{ backgroundColor: shade.hex }}
              >
                {shade.isAnchor && (
                  <span className="absolute top-1 left-1 bg-white/90 backdrop-blur-xs text-[7px] font-bold uppercase tracking-wider text-slate-900 px-1 py-0.5 rounded-sm">
                    ANCHOR
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
                    onClick={() => copyToClipboard(`var(${shade.cssVar})`, `${uniqueId}-var`)}
                    className="p-1 rounded-sm bg-white/95 text-black hover:bg-white text-[9px] font-bold flex items-center gap-0.5"
                    title="Copiar var(--…)"
                  >
                    {copiedValue === `${uniqueId}-var` ? <Check size={8} /> : <Copy size={8} />} CSS
                  </button>
                </div>
              </div>

              {/* Labels */}
              <div className="p-1.5 text-center flex flex-col font-sans">
                <span className="text-[10px] font-bold text-slate-900">{shade.grade}</span>
                <span className="text-[8px] text-slate-500 font-mono select-all truncate">{shade.hex}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [faqAberto, setFaqAberto] = useState(false);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<Theme>('light');

  // Estados para simular interações de inputs no Showcase
  const [inputNormal, setInputNormal] = useState('');
  const [inputFocus, setInputFocus] = useState('Texto focado…');
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
    btnPrimary: `<button className="px-6 py-3 bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-[var(--color-parchment-050)] font-sans text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-ancestral-gold-500)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
  Botão Primário
</button>`,
    btnSecondary: `<button className="px-6 py-3 border border-[var(--color-ancestral-gold-500)]/30 hover:border-[var(--color-ancestral-gold-500)] bg-[var(--color-parchment-050)] text-[var(--color-warm-neutral-900)] font-sans text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 hover:shadow-md active:scale-95">
  Botão Secundário
</button>`,
    btnGlass: `<button className="px-6 py-3 border border-white/5 bg-[var(--color-warm-neutral-950)]/40 backdrop-blur-lg hover:border-[var(--color-ancestral-gold-500)]/30 hover:bg-[var(--color-warm-neutral-900)]/25 text-[var(--color-parchment-050)] font-sans text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-500 shadow-lg hover:shadow-[var(--color-ancestral-gold-500)]/5">
  Glassmorphism Button
</button>`,
    input: `<div>
  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 font-sans">
    Rótulo do Campo
  </label>
  <input
    type="text"
    placeholder="Digite algo…"
    className="w-full border border-black/10 bg-white/70 rounded-sm px-3.5 py-2.5 text-sm font-sans focus:outline-none focus:border-[var(--color-ancestral-gold-500)]/50 focus:bg-white transition-all"
  />
</div>`,
    card: `<div className="relative group overflow-hidden rounded-md border border-black/5 hover:border-[var(--color-ancestral-gold-500)]/30 transition-all duration-500 min-h-[350px] p-6 flex flex-col justify-between">
  <div className="absolute inset-0 z-0">
    <img src="/flyer.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25" />
  </div>
  <div className="relative z-10">…</div>
</div>`,
  };

  return (
    <main className="min-h-screen bg-[#FAF5EC] text-slate-900 font-sans">
      <Header />

      {/* Hero Simples do Design System */}
      <section className="bg-[var(--color-warm-neutral-950)] text-[var(--color-parchment-050)] py-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--color-terracotta-600)_0%,_transparent_75%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-ancestral-gold-500)] mb-3 block font-sans">
            Documentação Viva · v0.2
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal font-[var(--font-heading)] leading-tight tracking-tight mb-4">
            Orixá Design System
          </h1>
          <p className="text-sm md:text-base text-white/70 font-sans max-w-3xl leading-relaxed">
            O guia oficial de estilo e biblioteca de componentes do <strong>T. U. Senhora do Rosário</strong>.
            Construído sob a estética do <strong>Sacred Modernism</strong>, combina tradição ancestral com
            interfaces digitais limpas e imersivas. Esta página é renderizada com os próprios tokens{' '}
            <code className="font-mono text-[var(--color-ancestral-gold-500)]">--color-*</code> do projeto — tudo
            aqui é fonte da verdade.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-sans text-white/60">
            <span className="px-3 py-1.5 rounded-sm border border-white/10 bg-white/5">4 famílias aprovadas</span>
            <span className="px-3 py-1.5 rounded-sm border border-white/10 bg-white/5">3 famílias funcionais provisórias</span>
            <span className="px-3 py-1.5 rounded-sm border border-white/10 bg-white/5">77 tokens de cor (7 × 11)</span>
            <span className="px-3 py-1.5 rounded-sm border border-white/10 bg-white/5">20 roles semânticos</span>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com Sidebar de Navegação */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Barra Lateral Sumário (Fixo no Desktop) */}
        <aside className="w-full lg:w-3/12 lg:sticky lg:top-28 self-start bg-white/40 border border-black/5 rounded-md p-6 backdrop-blur-md hidden lg:block shadow-sm">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-800 mb-4 font-sans flex items-center gap-2">
            <BookOpen size={14} className="text-[var(--color-ancestral-gold-500)]" /> Sumário
          </h3>
          <div className="relative mb-5">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar seção…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-[11px] pl-8 pr-3 py-1.5 border border-black/10 bg-white/70 rounded-sm font-sans focus:outline-none focus:border-[var(--color-ancestral-gold-500)]/50"
            />
          </div>
          <nav className="space-y-3.5">
            {menuAnchors
              .filter((m) => m.label.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="block text-xs font-medium text-slate-600 hover:text-[var(--color-ancestral-gold-500)] transition-colors font-sans"
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

          {/* Seção 2: Famílias de Cor (Foundation Tokens) */}
          <section id="familias" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Famílias de Cor (Foundation Tokens)
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade: <code className="font-mono text-[11px] text-slate-700">design-system/foundation/color.json</code>.
                O sistema é composto por <strong>4 famílias aprovadas</strong> (marca + superfícies) e
                <strong> 4 famílias funcionais provisórias</strong> (success / error / warning / info).
                Cada escala possui 11 tons (050 → 950) com <strong>anchor</strong> marcado, derivado matematicamente em OKLCH.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-inter">
                <span className={`px-2 py-0.5 rounded-sm border font-semibold uppercase tracking-wider ${STATUS_CLASS.approved}`}>
                  {STATUS_LABEL.approved}
                </span>
                <span className={`px-2 py-0.5 rounded-sm border font-semibold uppercase tracking-wider ${STATUS_CLASS.provisional}`}>
                  {STATUS_LABEL.provisional}
                </span>
                <span className="px-2 py-0.5 rounded-sm border border-black/10 bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider">
                  Anchor (cor-âncora)
                </span>
              </div>
            </div>

            {/* Subseção 2a: Famílias Aprovadas */}
            <div id="aprovadas" className="scroll-mt-28 space-y-8">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl md:text-2xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Aprovadas
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  4 famílias · status: approved
                </span>
              </header>

              {Object.values(colorPalette)
                .filter((f) => f.status === 'approved')
                .map((item) => (
                  <FamilyBlock
                    key={item.key}
                    family={item}
                    copiedValue={copiedValue}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
            </div>

            {/* Subseção 2b: Famílias Funcionais Provisórias */}
            <div id="funcionais" className="scroll-mt-28 space-y-8">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl md:text-2xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Funcionais (provisórias)
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  4 famílias · status: provisional
                </span>
              </header>

              {Object.values(colorPalette)
                .filter((f) => f.status === 'provisional')
                .map((item) => (
                  <FamilyBlock
                    key={item.key}
                    family={item}
                    copiedValue={copiedValue}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
            </div>
          </section>

          {/* Seção 3: Color Roles (Semantic Tokens) */}
          <section id="roles" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                    Color Roles (Semantic Tokens)
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                    Fonte da verdade:{' '}
                    <code className="font-mono text-[11px] text-slate-700">
                      design-system/semantic/color.{theme}.json
                    </code>
                    . Cada token semântico é uma <strong>referência</strong> a um foundation token (ex.:{' '}
                    <code className="font-mono text-[11px]">{`{color.base.parchment.050}`}</code>). Componentes
                    consomem apenas estes roles, nunca os foundation tokens diretamente.
                  </p>
                </div>

                {/* Toggle Light / Dark */}
                <div
                  role="tablist"
                  aria-label="Tema dos tokens semânticos"
                  className="inline-flex p-0.5 rounded-sm border border-black/10 bg-white shadow-xs shrink-0"
                >
                  {(['light', 'dark'] as const).map((t) => {
                    const active = theme === t;
                    return (
                      <button
                        key={t}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setTheme(t)}
                        className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider font-inter rounded-[2px] transition-colors ${
                          active
                            ? 'bg-[var(--color-ancestral-gold-500)] text-[#0D0B08]'
                            : 'text-slate-600 hover:text-black'
                        }`}
                      >
                        {t === 'light' ? 'Light' : 'Dark'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {SEMANTIC_CATEGORIES.map((cat) => {
                const items = semanticTokens[theme].filter((t) => t.category === cat.key);
                if (items.length === 0) return null;
                return (
                  <div key={cat.key} className="space-y-4">
                    <header className="flex items-baseline gap-3">
                      <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                        {cat.label}
                      </h3>
                      <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                        {items.length} token{items.length === 1 ? '' : 's'} · {cat.desc}
                      </span>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((role) => (
                        <RoleCard
                          key={role.path}
                          role={role}
                          copiedValue={copiedValue}
                          copyToClipboard={copyToClipboard}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Seção 4: Matriz de Contraste */}
          <section id="contraste" className="scroll-mt-28 space-y-6">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Matriz de Contraste (Texto × Fundo)
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Cruzamento entre os principais roles de <strong>texto</strong> e <strong>fundo</strong>, com o
                indicador de aprovação seguindo <strong>WCAG 2.1</strong> (AA = ratio ≥ 4.5 para texto normal;
                AAA = ratio ≥ 7). Todos os pares marcados como <span className="text-[#3F6B4F] font-semibold">AA</span>{' '}
                ou <span className="text-[#20402C] font-semibold">AAA</span> estão aprovados para uso em produção.
              </p>
            </div>

            <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-6">
              {/* Legenda */}
              <div className="flex flex-wrap gap-3 text-[10px] font-inter">
                <span className="px-2 py-0.5 rounded-sm border border-[#3F6B4F]/30 bg-[#3F6B4F]/10 text-[#20402C] font-semibold uppercase tracking-wider">
                  AAA · ≥ 7.0
                </span>
                <span className="px-2 py-0.5 rounded-sm border border-[#3F6B4F]/30 bg-[#3F6B4F]/5 text-[#20402C] font-semibold uppercase tracking-wider">
                  AA · ≥ 4.5
                </span>
                <span className="px-2 py-0.5 rounded-sm border border-[#A33A2B]/30 bg-[#FFE4DF] text-[#65190F] font-semibold uppercase tracking-wider">
                  Falha · &lt; 4.5
                </span>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-inter border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b border-black/10 text-slate-600 font-semibold">
                        Texto \ Fundo
                      </th>
                      {contrastColDefs.map((col) => (
                        <th
                          key={col.role}
                          className="p-2 border-b border-black/10 text-center align-bottom"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className="w-10 h-10 rounded-sm border border-black/10 shadow-xs"
                              style={{ backgroundColor: col.hex }}
                            />
                            <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                              {col.label}
                            </span>
                            <span className="text-[8px] font-mono text-slate-500">{col.hex}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contrastMatrix.map((row) => (
                      <tr key={row.role}>
                        <td className="p-2 border-b border-black/5 align-middle">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-sm border border-black/10"
                              style={{ backgroundColor: row.hex }}
                            />
                            <div>
                              <div className="text-[11px] font-semibold text-slate-800">{row.label}</div>
                              <div className="text-[9px] font-mono text-slate-500">{row.hex}</div>
                            </div>
                          </div>
                        </td>
                        {row.cells.map((cell) => (
                          <td
                            key={cell.bgRole}
                            className="p-2 border-b border-black/5 text-center"
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                                  cell.rating === 'AAA'
                                    ? 'bg-[#20402C] text-[#FAF5EC]'
                                    : cell.rating === 'AA'
                                    ? 'bg-[#E2EFE6] text-[#20402C] border border-[#3F6B4F]/30'
                                    : 'bg-[#FFE4DF] text-[#65190F] border border-[#A33A2B]/30'
                                }`}
                              >
                                {cell.rating}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {cell.ratio.toFixed(2)}:1
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-slate-500 font-inter leading-relaxed border-t border-black/5 pt-4">
                <strong>Nota:</strong> os valores de ratio são calculados em espaço sRGB segundo a fórmula WCAG 2.1
                relativa (luminance relative). Para os tons não aprovados (★), considere uso restrito a textos
                grandes (≥ 18px / bold ≥ 14px) ou cenários decorativos.
              </p>
            </div>
          </section>

          {/* Seção 5: Tipografia (Typography Tokens) */}
          <section id="tipografia" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Tipografia
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/typography.tokens.json
                </code>
                . Tokens de <code className="font-mono text-[11px]">font-family</code>,{' '}
                <code className="font-mono text-[11px]">font-weight</code>,{' '}
                <code className="font-mono text-[11px]">font-size</code>,{' '}
                <code className="font-mono text-[11px]">line-height</code> e{' '}
                <code className="font-mono text-[11px]">letter-spacing</code> — além de 7 composições
                tipográficas prontas. Apenas <code className="font-mono">font-family</code> está aprovada.
              </p>
            </div>

            {/* Subseção: Font Family */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Font Family
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {fontFamilyTokens.length} tokens · ambas approved
                </span>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fontFamilyTokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <code className="text-[12px] font-mono font-semibold text-slate-900">
                        font-family.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <code className="block text-[10px] font-mono text-slate-600 bg-slate-50 border border-black/5 rounded-sm px-2 py-1.5 break-all">
                      {t.stack.map((s) => (s.includes(' ') ? `"${s}"` : s)).join(', ')}
                    </code>
                    <div
                      className="text-3xl text-slate-900"
                      style={{ fontFamily: t.stack.map((s) => (s.includes(' ') ? `"${s}"` : s)).join(', ') }}
                    >
                      Aa Bb Cc — 0123
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Font Weight */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Font Weight
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {fontWeightTokens.length} tokens · todas provisórias
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-3">
                {fontWeightTokens.map((t) => (
                  <div key={t.name} className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-6 md:col-span-3 flex items-center gap-2 flex-wrap">
                      <code className="text-[12px] font-mono font-semibold text-slate-900">
                        font-weight.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <div className="col-span-3 md:col-span-2 font-mono text-[11px] text-slate-700 font-semibold">
                      {t.value}
                    </div>
                    <div className="col-span-12 md:col-span-7 text-slate-900 font-sans text-base"
                         style={{ fontWeight: t.value }}>
                      A Umbanda é brasileira e genuinamente nossa.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Font Size */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Font Size
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {fontSizeTokens.length} tokens · todos provisórios
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-2">
                {fontSizeTokens.map((t) => (
                  <div key={t.name} className="grid grid-cols-12 items-baseline gap-3 border-b border-black/5 pb-2 last:border-0 last:pb-0">
                    <div className="col-span-3 md:col-span-2 flex items-center gap-2 flex-wrap">
                      <code className="text-[11px] font-mono font-semibold text-slate-900">
                        font-size.{t.name}
                      </code>
                    </div>
                    <div className="col-span-3 md:col-span-2 font-mono text-[10px] text-slate-700">
                      {t.px}px / {pxToRem(t.px)}
                    </div>
                    <div
                      className="col-span-12 md:col-span-8 text-slate-900 font-sans"
                      style={{ fontSize: `${t.px}px`, lineHeight: 1.3 }}
                    >
                      Gira de Caboclos
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Line Height */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Line Height
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {lineHeightTokens.length} tokens · todos provisórios
                </span>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {lineHeightTokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-[11px] font-mono font-semibold text-slate-900">
                        line-height.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-700 font-semibold">
                      {t.value}
                    </div>
                    <p
                      className="text-[11px] text-slate-700 font-sans"
                      style={{ lineHeight: t.value }}
                    >
                      A Umbanda é uma religião monoteísta e genuinamente brasileira, fundada sob a caridade
                      espiritual e a luz curadora dos guias de lei.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Letter Spacing */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Letter Spacing
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {letterSpacingTokens.length} tokens · todos provisórios
                </span>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {letterSpacingTokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-[11px] font-mono font-semibold text-slate-900">
                        letter-spacing.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-700 font-semibold">
                      {t.value}
                    </div>
                    <p
                      className="text-base text-slate-900 font-sans"
                      style={{ letterSpacing: t.value }}
                    >
                      Gira de Caboclos
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Composições tipográficas */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Composições tipográficas
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {typographyCompositions.length} estilos compostos · todos provisórios
                </span>
              </header>

              <div className="space-y-3">
                {typographyCompositions.map((c) => {
                  const family = fontFamilyTokens.find((f) => f.name === c.fontFamily);
                  const familyCss = family
                    ? family.stack.map((s) => (s.includes(' ') ? `"${s}"` : s)).join(', ')
                    : c.fontFamily;
                  return (
                    <div
                      key={c.name}
                      className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <code className="text-[12px] font-mono font-semibold text-slate-900">
                          typography.{c.name}
                        </code>
                        <span
                          className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[c.status]}`}
                        >
                          {STATUS_LABEL[c.status]}
                        </span>
                      </div>

                      {/* Composição em tokens */}
                      <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-black/5 rounded-sm text-slate-700">
                          font-family.{c.fontFamily}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-black/5 rounded-sm text-slate-700">
                          font-size.{fontSizeTokens.find((s) => s.px === c.fontSizePx)?.name ?? c.fontSizePx} ({c.fontSizePx}px)
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-black/5 rounded-sm text-slate-700">
                          font-weight.{fontWeightTokens.find((w) => w.value === c.fontWeight)?.name ?? c.fontWeight} ({c.fontWeight})
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-black/5 rounded-sm text-slate-700">
                          letter-spacing.{letterSpacingTokens.find((l) => l.value === c.letterSpacing)?.name ?? c.letterSpacing}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-black/5 rounded-sm text-slate-700">
                          line-height.{lineHeightTokens.find((l) => l.value === c.lineHeight)?.name ?? c.lineHeight} ({c.lineHeight})
                        </span>
                      </div>

                      {/* Preview real */}
                      <div
                        className="text-slate-900"
                        style={{
                          fontFamily: familyCss,
                          fontSize: `${c.fontSizePx}px`,
                          fontWeight: c.fontWeight,
                          letterSpacing: c.letterSpacing,
                          lineHeight: c.lineHeight,
                        }}
                      >
                        Gira de Caboclos
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Seção 4: Espaçamento (Space Tokens) */}
          <section id="grid-spacing" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Espaçamento
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/space.tokens.json
                </code>
                . Escala de espaçamento baseada no grid documentado de 8px, com 14 tokens semânticos
                que preenchem containers, gaps, paddings e margins com consistência. Apenas os valores
                <span className="px-1 mx-1 rounded-sm border border-[#3F6B4F]/30 bg-[#3F6B4F]/10 text-[#20402C] text-[9px] font-semibold uppercase tracking-wider font-inter align-middle">
                  Approved
                </span>
                estão documentados no projeto — os demais são propostos pela escala derivada.
              </p>
            </div>

            {/* Subseção: Escala visual */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Space Scale
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {spaceTokens.length} tokens · {spaceTokens.filter((t) => t.status === 'approved').length} approved · {spaceTokens.filter((t) => t.status === 'provisional').length} provisional
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-3">
                {spaceTokens.map((t) => (
                  <div key={t.name} className="grid grid-cols-12 items-center gap-3">
                    {/* Token + status */}
                    <div className="col-span-12 md:col-span-3 flex items-center gap-2 flex-wrap">
                      <code className="text-[12px] font-mono font-semibold text-slate-900">
                        space.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>

                    {/* Valor em px + rem */}
                    <div className="col-span-6 md:col-span-2 font-mono text-[10px] text-slate-700 space-y-0.5">
                      <div className="font-semibold">{t.px}px</div>
                      <div className="text-slate-500">{pxToRem(t.px)}</div>
                    </div>

                    {/* Descrição (quando fornecida) */}
                    <div className="col-span-12 md:col-span-3 text-[10px] text-slate-500 font-sans leading-snug">
                      {t.description ?? '—'}
                    </div>

                    {/* Visualização em barra */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="h-3 bg-slate-100 rounded-sm border border-black/5 relative">
                        <div
                          className="absolute top-0 left-0 h-full bg-[var(--color-ancestral-gold-500)] rounded-sm"
                          style={{ width: `${Math.max(2, (t.px / 128) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Demonstração em seções */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Aplicação em seções
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  como os tokens aparecem em componentes reais
                </span>
              </header>

              <div className="space-y-6">
                {/* Section padding (space.600 / 48px) */}
                <div className="bg-white border border-black/5 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-black/5">
                    <code className="text-[10px] font-mono text-slate-700">padding: space.600 (48px)</code>
                    <span className="text-[9px] text-slate-500 font-sans">Seção de conteúdo padrão</span>
                  </div>
                  <div className="bg-[#FAF5EC] flex items-center justify-center text-[11px] font-sans text-slate-700"
                       style={{ padding: '48px' }}>
                    <span>Conteúdo centralizado com respiro generoso</span>
                  </div>
                </div>

                {/* Card padding (space.300 / 24px) */}
                <div className="bg-white border border-black/5 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-black/5">
                    <code className="text-[10px] font-mono text-slate-700">padding: space.300 (24px)</code>
                    <span className="text-[9px] text-slate-500 font-sans">Card de conteúdo</span>
                  </div>
                  <div className="bg-[#FAF5EC] flex items-center justify-center text-[11px] font-sans text-slate-700"
                       style={{ padding: '24px' }}>
                    <span>Card com padding interno médio</span>
                  </div>
                </div>

                {/* Gap entre itens (space.100 / 8px e space.200 / 16px) */}
                <div className="bg-white border border-black/5 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-black/5">
                    <code className="text-[10px] font-mono text-slate-700">gap: space.100 (8px) · space.200 (16px)</code>
                    <span className="text-[9px] text-slate-500 font-sans">Stack vertical de itens</span>
                  </div>
                  <div className="bg-[#FAF5EC]" style={{ padding: '24px' }}>
                    <div className="flex flex-col" style={{ gap: '16px' }}>
                      <div className="bg-white border border-black/5 rounded-sm px-3 py-2 text-[11px] font-sans text-slate-700">
                        Item 1 (gap: 16px)
                      </div>
                      <div className="bg-white border border-black/5 rounded-sm px-3 py-2 text-[11px] font-sans text-slate-700">
                        Item 2
                      </div>
                      <div className="bg-white border border-black/5 rounded-sm px-3 py-2 text-[11px] font-sans text-slate-700">
                        Item 3
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5: Shape (Radius + Border-Width) */}
          <section id="shape" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Shape (Radius & Border)
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/shape.tokens.json
                </code>
                . Tokens de <strong>radius</strong> (8 níveis) e <strong>border-width</strong> (4 níveis). Todos
                estão <span className="px-1.5 py-0.5 rounded-sm border border-[#C58A16]/30 bg-[#C58A16]/10 text-[#6B4800] text-[9px] font-semibold uppercase tracking-wider font-inter align-middle">
                  Provisional
                </span>{' '}
                — aguardam validação de design.
              </p>
            </div>

            {/* Subseção: Radius Scale */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Radius Scale
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {radiusTokens.length} tokens · todas provisórias
                </span>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {radiusTokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-4 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                  >
                    {/* Swatch com o radius aplicado */}
                    <div className="flex items-center justify-center h-20">
                      <div
                        className="w-16 h-16 bg-[var(--color-terracotta-600)] border border-white/10"
                        style={{ borderRadius: t.value }}
                        title={`border-radius: ${t.value}`}
                      />
                    </div>

                    {/* Token info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-[11px] font-mono font-semibold text-slate-900">
                          radius.{t.name}
                        </code>
                        <span
                          className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                        >
                          {STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      <code className="block text-[10px] font-mono text-slate-600 bg-slate-50 border border-black/5 rounded-sm px-2 py-1">
                        {t.value}
                      </code>
                      <p className="text-[10px] text-slate-600 font-sans leading-snug">
                        {t.use}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Border-Width Scale */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Border-Width Scale
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {borderWidthTokens.length} tokens · todas provisórias
                </span>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {borderWidthTokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                  >
                    {/* Swatch com a borda aplicada */}
                    <div className="flex items-center justify-center h-20">
                      <div
                        className="w-16 h-16 bg-[#FAF5EC]"
                        style={{
                          border: `${t.value} solid #0D0B08`,
                          borderRadius: '4px',
                        }}
                        title={`border-width: ${t.value}`}
                      />
                    </div>

                    {/* Token info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-[11px] font-mono font-semibold text-slate-900">
                          border-width.{t.name}
                        </code>
                        <span
                          className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                        >
                          {STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      <code className="block text-[10px] font-mono text-slate-600 bg-slate-50 border border-black/5 rounded-sm px-2 py-1">
                        {t.value}
                      </code>
                      <p className="text-[10px] text-slate-600 font-sans leading-snug">
                        {t.use}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subseção: Aplicação em componentes */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Aplicação em componentes
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  exemplos práticos de uso combinado
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-6">
                {/* Botão com radius.050 (2px) + border.thin (1px) */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-[var(--color-terracotta-600)] text-[var(--color-parchment-050)] font-sans text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      borderRadius: radiusTokens.find((r) => r.name === '050')?.value,
                      border: `${borderWidthTokens.find((b) => b.name === 'thin')?.value} solid rgba(255, 255, 255, 0.1)`,
                    }}
                  >
                    Botão primário
                  </button>
                  <div className="text-[10px] font-mono text-slate-600 space-y-0.5">
                    <div>border-radius: <code className="text-slate-900">radius.050</code> (2px)</div>
                    <div>border-width: <code className="text-slate-900">border-width.thin</code> (1px)</div>
                  </div>
                </div>

                {/* Card com radius.200 (8px) */}
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="w-64 p-4 bg-[var(--color-parchment-100)] space-y-2"
                    style={{
                      borderRadius: radiusTokens.find((r) => r.name === '200')?.value,
                      border: `${borderWidthTokens.find((b) => b.name === 'thin')?.value} solid rgba(13, 11, 8, 0.08)`,
                    }}
                  >
                    <div className="text-[11px] font-sans font-semibold text-slate-900">Card de conteúdo</div>
                    <div className="text-[10px] font-sans text-slate-700 leading-snug">
                      Superfície elevada com radius médio e borda hairline.
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 space-y-0.5">
                    <div>border-radius: <code className="text-slate-900">radius.200</code> (8px)</div>
                    <div>border: <code className="text-slate-900">border-width.thin</code> (1px)</div>
                  </div>
                </div>

                {/* Badge pílula com radius.pill (999px) + border.medium (2px) */}
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className="inline-flex items-center px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ancestral-gold-600)] bg-white font-sans"
                    style={{
                      borderRadius: radiusTokens.find((r) => r.name === 'pill')?.value,
                      border: `${borderWidthTokens.find((b) => b.name === 'medium')?.value} solid #C9A227`,
                    }}
                  >
                    Badge categoria
                  </span>
                  <div className="text-[10px] font-mono text-slate-600 space-y-0.5">
                    <div>border-radius: <code className="text-slate-900">radius.pill</code> (999px)</div>
                    <div>border-width: <code className="text-slate-900">border-width.medium</code> (2px)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5b: Motion / Animação */}
          <section id="motion" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Motion / Animação
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/motion.tokens.json
                </code>
                . Durações e curvas de aceleração que regem todas as transições visuais. Tokens com status{' '}
                <span className="px-1.5 py-0.5 rounded-sm border border-[#C58A16]/30 bg-[#C58A16]/10 text-[#6B4800] text-[9px] font-semibold uppercase tracking-wider font-inter align-middle">
                  Provisional
                </span>{' '}
                requerem validação de design.
              </p>
            </div>

            {/* Subseção: Duration Scale */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Duration Scale
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {durationTokens.length} tokens · {durationTokens.filter((t) => t.status === 'approved').length} approved · {durationTokens.filter((t) => t.status === 'provisional').length} provisional
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-5">
                {durationTokens.map((t) => (
                  <div
                    key={t.name}
                    className="group/motion grid grid-cols-12 items-center gap-3"
                  >
                    {/* Nome + status */}
                    <div className="col-span-12 md:col-span-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-[12px] font-mono font-semibold text-slate-900">
                          duration.{t.name}
                        </code>
                        <span
                          className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                        >
                          {STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans mt-1 leading-snug">
                        {t.description ?? `Token de duração ${t.name}.`}
                      </p>
                    </div>

                    {/* Valor + barra visual animada (ativa no hover) */}
                    <div className="col-span-12 md:col-span-9 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                        <span className="font-semibold">{t.ms}ms</span>
                        <span className="text-slate-400">cubic-bezier(0.2, 0, 0, 1)</span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-sm overflow-hidden border border-black/5">
                        <div
                          className="absolute top-0 left-0 h-full bg-[var(--color-ancestral-gold-500)] rounded-sm motion-bar"
                          style={{
                            width: '40%',
                            animationDuration: `${t.ms}ms`,
                            animationTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                            animationName: 'motionPulse',
                            animationIterationCount: 'infinite',
                            animationPlayState: t.ms === 0 ? 'paused' : 'paused',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 font-inter leading-relaxed">
                <strong>Como ler:</strong> a barra dourada executa um ciclo ida-e-volta usando a duração do token
                (pausada em <code className="font-mono">duration.instant</code>). Quanto mais longa a duração,
                mais lenta a percepção de movimento.
              </p>
            </div>

            {/* Subseção: Easing Curves */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Easing Curves
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {cubicBezierTokens.length} tokens · todas provisórias
                </span>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cubicBezierTokens.map((t) => (
                  <div
                    key={t.name}
                    className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <code className="text-[12px] font-mono font-semibold text-slate-900">
                        cubic-bezier.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>

                    {/* Visualização SVG da curva (Bézier 2D) */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-24 border border-black/5 rounded-sm bg-slate-50"
                      role="img"
                      aria-label={`Curva cubic-bezier ${t.name}: ${t.points.join(', ')}`}
                    >
                      <line x1="0" y1="100" x2="100" y2="100" stroke="#DBD5CB" strokeWidth="0.5" />
                      <line x1="0" y1="0" x2="0" y2="100" stroke="#DBD5CB" strokeWidth="0.5" />
                      <line x1="0" y1="100" x2="100" y2="0" stroke="#EEEBE4" strokeWidth="1" strokeDasharray="2,2" />
                      <path
                        d={`M 0 100 C ${t.points[0] * 100} ${100 - t.points[1] * 100}, ${t.points[2] * 100} ${100 - t.points[3] * 100}, 100 0`}
                        fill="none"
                        stroke="#C9A227"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Valor CSS */}
                    <code className="block text-[10px] font-mono text-slate-600 bg-slate-50 border border-black/5 rounded-sm px-2 py-1.5 break-all">
                      {cubicBezierCss(t.points)}
                    </code>

                    {/* Pontos da curva */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>P1 ({t.points[0]}, {t.points[1]})</span>
                      <span>P2 ({t.points[2]}, {t.points[3]})</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 font-inter leading-relaxed">
                <strong>Como ler:</strong> cada gráfico mostra o progresso da animação (eixo Y) ao longo do tempo
                (eixo X). Curvas que crescem rápido no início são <em>enter</em>; as que desaceleram no fim são{' '}
                <em>exit</em>. Use <code className="font-mono">standard</code> como padrão para a maioria das
                interações.
              </p>
            </div>
          </section>

          {/* Seção 5c: Opacity */}
          <section id="opacity" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Opacity
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/opacity.tokens.json
                </code>
                . Escala de opacidade usada em overlays, divisórias e estados hover. Apenas{' '}
                <code className="font-mono">opacity.soft</code> está aprovada — as demais são propostas que
                requerem validação de design.
              </p>
            </div>

            {/* Subseção: Escala */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Scale
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {opacityTokens.length} tokens · {opacityTokens.filter((t) => t.status === 'approved').length} approved · {opacityTokens.filter((t) => t.status === 'provisional').length} provisional
                </span>
              </header>

              {/* Tabela compacta com os 7 tokens */}
              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Valor</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Uso recomendado</th>
                      <th className="px-4 py-3 font-semibold text-right">Amostra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opacityTokens.map((t) => {
                      // Padrão de uso recomendado por token
                      const useHint =
                        t.name === 'transparent' ? 'Reset de visibilidade, condicionais.' :
                        t.name === 'subtle' ? 'Bordas hairlines, divisórias finas.' :
                        t.name === 'muted' ? 'Bordas visíveis, estados desabilitados.' :
                        t.name === 'soft' ? 'Overlay escuro do hero.' :
                        t.name === 'medium' ? 'Estados hover suaves, glassmorphism.' :
                        t.name === 'strong' ? 'Scrims de modal, bloqueio parcial.' :
                        'Estado padrão (visibilidade total).';
                      return (
                        <tr key={t.name} className="border-b border-black/5 last:border-0 hover:bg-slate-50/40 transition-colors">
                          <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">
                            opacity.{t.name}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700">
                            {t.value.toFixed(2)}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                            >
                              {STATUS_LABEL[t.status]}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">
                            {useHint}
                            {t.description && (
                              <span className="block text-[10px] text-slate-500 mt-0.5 italic">
                                {t.description}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Swatch sobre fundo claro (parchment) */}
                              <span
                                className="relative w-10 h-6 rounded-sm border border-black/10 overflow-hidden"
                                style={{ backgroundColor: '#FAF5EC' }}
                                title="Sobre fundo claro (parchment.050)"
                              >
                                <span
                                  className="absolute inset-0 bg-[#0D0B08]"
                                  style={{ opacity: t.value }}
                                />
                              </span>
                              {/* Swatch sobre fundo escuro (warm-neutral) */}
                              <span
                                className="relative w-10 h-6 rounded-sm border border-black/10 overflow-hidden"
                                style={{ backgroundColor: '#0D0B08' }}
                                title="Sobre fundo escuro (warm-neutral.950)"
                              >
                                <span
                                  className="absolute inset-0 bg-[#FAF5EC]"
                                  style={{ opacity: t.value }}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subseção: Demonstração visual sobre superfície clara */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração sobre superfície clara
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  overlay escuro em cima de uma imagem — legibilidade cai conforme a opacidade sobe
                </span>
              </header>

              <div className="rounded-md border border-black/5 shadow-sm overflow-hidden">
                {/* "Imagem" de fundo — texto de leitura do site */}
                <div className="relative">
                  <div className="p-6 bg-[#FAF5EC] space-y-2">
                    <p className="text-base font-sans text-slate-900 leading-relaxed">
                      A Umbanda é uma religião monoteísta e genuinamente brasileira, fundada sob a caridade
                      espiritual e a luz curadora dos guias de lei.
                    </p>
                    <p className="text-sm font-sans text-slate-700 leading-relaxed">
                      Texto de leitura padrão do site. Observe como cada camada de overlay escuro abaixo
                      desta superfície atenua a legibilidade progressivamente — até cobrir o conteúdo
                      completamente em <code className="font-mono">opacity.opaque</code>.
                    </p>
                  </div>

                  {/* Lista de overlays (não cobre o texto descritivo acima) */}
                  <div className="px-6 pb-6 space-y-2">
                    {opacityTokens.filter((t) => t.name !== 'transparent').map((t) => (
                      <div key={t.name} className="flex items-stretch gap-2">
                        {/* Label lateral — sempre legível */}
                        <div className="shrink-0 w-36 px-3 py-2 rounded-sm bg-white border border-black/5 flex flex-col justify-center">
                          <code className="text-[11px] font-mono font-semibold text-slate-900 leading-tight">
                            opacity.{t.name}
                          </code>
                          <span className="text-[9px] font-mono text-slate-500">
                            {t.value.toFixed(2)} · {Math.round(t.value * 100)}%
                          </span>
                        </div>

                        {/* Faixa com overlay — sem texto, é puramente visual */}
                        <div className="relative flex-1 h-12 rounded-sm overflow-hidden border border-black/5">
                          {/* Texto de fundo (sob o overlay) */}
                          <div className="absolute inset-0 px-3 py-2 flex items-center text-[11px] font-sans text-slate-700 bg-white">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          </div>
                          {/* Overlay escuro com a opacidade do token */}
                          <div
                            className="absolute inset-0 bg-[#0D0B08] pointer-events-none"
                            style={{ opacity: t.value }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subseção: Padrão recomendado */}
            <div className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3">
              <h4 className="text-base font-normal font-[var(--font-heading)] text-black">
                Padrão de uso
              </h4>
              <ul className="text-[11px] text-slate-700 font-sans leading-relaxed space-y-1.5 list-disc pl-5">
                <li>
                  <strong>overlays / scrims:</strong> usar <code className="font-mono">opacity.soft</code> (0.35)
                  ou <code className="font-mono">opacity.strong</code> (0.72) — aprovados para hero e modal.
                </li>
                <li>
                  <strong>bordas e divisórias:</strong> usar <code className="font-mono">opacity.subtle</code> (0.08)
                  ou <code className="font-mono">opacity.muted</code> (0.16) — bordas hairlines sobre superfícies.
                </li>
                <li>
                  <strong>estados disabled:</strong> usar <code className="font-mono">opacity.medium</code> (0.5) em
                  elementos não interativos.
                </li>
                <li>
                  <strong>glassmorphism:</strong> combinar <code className="font-mono">opacity.muted</code> +
                  <code className="font-mono">backdrop-blur</code> para painéis translúcidos.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 5d: Shadows / Elevação */}
          <section id="shadow" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Shadows / Elevação
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/shadow.tokens.json
                </code>
                . Escala de elevação que comunica profundidade sem usar bordas. Todos os tokens estão{' '}
                <span className="px-1.5 py-0.5 rounded-sm border border-[#C58A16]/30 bg-[#C58A16]/10 text-[#6B4800] text-[9px] font-semibold uppercase tracking-wider font-inter align-middle">
                  Provisional
                </span>{' '}
                — aguardam validação de design.
              </p>
            </div>

            {/* Subseção: Escala de elevação */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Elevation Scale
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {shadowTokens.length} tokens · todas provisórias
                </span>
              </header>

              {/* Tabela com preview e detalhes */}
              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Valor</th>
                      <th className="px-4 py-3 font-semibold text-right">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shadowTokens.map((t) => (
                      <tr key={t.name} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-3 align-middle">
                          <code className="text-[11px] font-mono font-semibold text-slate-900">
                            shadow.{t.name}
                          </code>
                          <span
                            className={`ml-2 px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                          >
                            {STATUS_LABEL[t.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <code className="block text-[10px] font-mono text-slate-600 leading-snug break-all">
                            {shadowCss(t.value)}
                          </code>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {/* Área de preview com fundo parchment para destacar a sombra */}
                          <div className="flex justify-end">
                            <div
                              className="w-20 h-12 bg-white rounded-sm border border-black/5"
                              style={{ boxShadow: shadowCss(t.value) }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subseção: Demonstração em cards */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração em cards
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  mesma superfície, diferentes elevações
                </span>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-[#FAF5EC] rounded-md border border-black/5">
                {shadowTokens.map((t) => (
                  <div
                    key={t.name}
                    className="bg-white p-5 rounded-md border border-black/5 transition-shadow duration-200"
                    style={{ boxShadow: shadowCss(t.value) }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-[11px] font-mono font-semibold text-slate-900">
                        shadow.{t.name}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                      >
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans leading-snug">
                      {t.name === 'none' && 'Sem elevação. Estado base, sem profundidade.'}
                      {t.name === 'low' && 'Elevação discreta. Hover em elementos interativos.'}
                      {t.name === 'medium' && 'Elevação média. Cards de conteúdo, dropdowns.'}
                      {t.name === 'high' && 'Elevação alta. Modais, popovers, drawers.'}
                      {t.name === 'focus' && 'Anel de foco dourado. Estados de foco acessível.'}
                    </p>
                    <code className="block mt-2 text-[9px] font-mono text-slate-500 break-all">
                      {shadowCss(t.value)}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 5e: Z-Index / Camadas */}
          <section id="z-index" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Z-Index / Camadas
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/foundation/z-index.tokens.json
                </code>
                . Hierarquia de empilhamento que define quem fica por cima de quem na interface. Apenas{' '}
                <code className="font-mono">z-index.header</code> (50) está approved — as demais camadas são
                propostas que requerem validação de design.
              </p>
            </div>

            {/* Subseção: Escala */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Stacking Order
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {zIndexTokens.length} tokens · {zIndexTokens.filter((t) => t.status === 'approved').length} approved · {zIndexTokens.filter((t) => t.status === 'provisional').length} provisional
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Valor</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Uso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zIndexTokens.map((t) => (
                      <tr key={t.name} className="border-b border-black/5 last:border-0 hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">
                          z-index.{t.name}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700 font-semibold">
                          {t.value}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter ${STATUS_CLASS[t.status]}`}
                          >
                            {STATUS_LABEL[t.status]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                          {ZINDEX_USE[t.name] ?? t.description ?? '—'}
                          {t.description && t.description !== ZINDEX_USE[t.name] && (
                            <span className="block text-[10px] text-slate-500 mt-0.5 italic">
                              {t.description}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subseção: Visualização em pilha */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Visualização em pilha
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  cards empilhados demonstram a hierarquia visual
                </span>
              </header>

              <div className="p-8 bg-[#FAF5EC] rounded-md border border-black/5 space-y-3">
                {/* Pilha visual — cards sobrepostos */}
                <div className="relative h-80 mx-auto max-w-2xl">
                  {zIndexTokens.map((t, idx) => {
                    // Cores progressivas do base (parchment) ao toast (gold-600)
                    const bgColor = idx === 0
                      ? '#FAF5EC'
                      : idx === zIndexTokens.length - 1
                      ? '#C9A227'
                      : idx >= 5
                      ? '#8B3A2A' // overlay/modal
                      : idx >= 3
                      ? '#594E3D' // sticky/header
                      : '#DBD5CB'; // raised/dropdown
                    const textColor = idx >= 3 ? '#FAF5EC' : '#0D0B08';
                    // Posicionamento cascata — cada card deslocado
                    const offset = idx * 28;
                    return (
                      <div
                        key={t.name}
                        className="absolute inset-x-0 rounded-sm border border-black/10 px-4 py-3 transition-all duration-200 hover:translate-x-1"
                        style={{
                          top: `${offset}px`,
                          left: `${offset}px`,
                          right: `-${offset}px`,
                          backgroundColor: bgColor,
                          zIndex: t.value,
                          color: textColor,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code
                              className="text-[11px] font-mono font-semibold"
                              style={{ color: textColor }}
                            >
                              z-index.{t.name}
                            </code>
                            <span
                              className="px-1.5 py-0.5 rounded-sm border text-[8px] font-semibold uppercase tracking-wider font-inter"
                              style={{
                                borderColor: idx >= 3 ? 'rgba(250, 245, 236, 0.3)' : 'rgba(13, 11, 8, 0.1)',
                                backgroundColor: idx >= 3 ? 'rgba(250, 245, 236, 0.1)' : 'rgba(13, 11, 8, 0.05)',
                                color: textColor,
                              }}
                            >
                              {STATUS_LABEL[t.status]}
                            </span>
                          </div>
                          <span
                            className="text-[10px] font-mono font-semibold"
                            style={{ color: textColor }}
                          >
                            {t.value}
                          </span>
                        </div>
                        <p
                          className="text-[10px] font-sans mt-1 leading-snug opacity-90"
                          style={{ color: textColor }}
                        >
                          {ZINDEX_USE[t.name] ?? ''}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] text-slate-600 font-inter leading-relaxed">
                  <strong>Como ler:</strong> cada card é renderizado com{' '}
                  <code className="font-mono">z-index: {`{value}`}</code> aplicado, e deslocado 28px para
                  baixo/direita do anterior. O resultado mostra a ordem real de empilhamento: camadas com valor
                  maior ficam visíveis por cima. A cor também evolui — do creme claro (
                  <code className="font-mono">base</code>) ao dourado (
                  <code className="font-mono">toast</code>) — reforçando a hierarquia.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 5f: Component Tokens — Button */}
          <section id="components-button" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Component Tokens · Button
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/component/button.tokens.json
                </code>
                . Os tokens de componente são <strong>referências</strong> a tokens semânticos/foundation
                (ex.: <code className="font-mono">{`{space.400}`}</code>,{' '}
                <code className="font-mono">{`{color.semantic.action.primary.default}`}</code>). Aqui
                exibimos o JSON original e a resolução para valores literais.
              </p>
            </div>

            {/* Anatomia */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Anatomia
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  height · padding-inline · gap · radius · border-width
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                      <th className="px-4 py-3 font-semibold">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { token: 'button.height.small',          ref: '{space.400}',     resolved: buttonAnatomy.height.small,          desc: 'Altura de botão pequeno.' },
                      { token: 'button.height.medium',         ref: '{space.600}',     resolved: buttonAnatomy.height.medium,         desc: 'Altura de botão padrão.' },
                      { token: 'button.height.large',          ref: '{space.800}',     resolved: buttonAnatomy.height.large,          desc: 'Altura de botão grande.' },
                      { token: 'button.padding-inline.small',  ref: '{space.200}',     resolved: buttonAnatomy.paddingInline.small,  desc: 'Padding horizontal pequeno.' },
                      { token: 'button.padding-inline.medium', ref: '{space.300}',     resolved: buttonAnatomy.paddingInline.medium, desc: 'Padding horizontal padrão.' },
                      { token: 'button.padding-inline.large',  ref: '{space.400}',     resolved: buttonAnatomy.paddingInline.large,  desc: 'Padding horizontal grande.' },
                      { token: 'button.gap',                   ref: '{space.100}',     resolved: buttonAnatomy.gap,                   desc: 'Espaço entre ícone e rótulo.' },
                      { token: 'button.radius',                ref: '{radius.200}',    resolved: buttonAnatomy.radius,                desc: 'Raio padrão dos botões.' },
                      { token: 'button.border-width',          ref: '{border-width.thin}', resolved: buttonAnatomy.borderWidth,        desc: 'Espessura padrão da borda.' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-slate-900">
                          {row.token}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-slate-600">
                          {row.ref}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.resolved}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variantes × Estados (cores) */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Variantes × Estados
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  primary · secondary · ghost
                </span>
              </header>

              {(['primary', 'secondary', 'ghost'] as const).map((variant) => {
                const v = buttonVariants[variant];
                return (
                  <div
                    key={variant}
                    className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-[12px] font-mono font-semibold text-slate-900">
                        button.{variant}
                      </code>
                      <span className="px-1.5 py-0.5 rounded-sm border border-[#C58A16]/30 bg-[#C58A16]/10 text-[#6B4800] text-[8px] font-semibold uppercase tracking-wider font-inter">
                        Provisional
                      </span>
                    </div>

                    {/* Tabela de tokens da variante */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[10px] font-mono">
                      {'background' in v && Object.entries(v.background).map(([k, v]) => (
                        <div key={`bg-${k}`} className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: v }} />
                          <span className="text-slate-600">background.{k}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-900 font-semibold">{v}</span>
                        </div>
                      ))}
                      {Object.entries(v.text).map(([k, val]) => (
                        <div key={`txt-${k}`} className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: val }} />
                          <span className="text-slate-600">text.{k}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-900 font-semibold">{val}</span>
                        </div>
                      ))}
                      {'border' in v && Object.entries(v.border).map(([k, val]) => (
                        <div key={`brd-${k}`} className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-sm border-2" style={{ borderColor: val }} />
                          <span className="text-slate-600">border.{k}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-900 font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Preview: 3 botões nos 3 estados */}
                    <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-black/5">
                      {(['default', 'hover', 'active', 'disabled'] as const).map((state) => {
                        if (state === 'disabled' && variant === 'ghost') {
                          // ghost não tem estado disabled definido, pulamos
                          return null;
                        }
                        const bg =
                          'background' in v && state in v.background
                            ? v.background[state as keyof typeof v.background]
                            : undefined;
                        const txt = v.text[state as keyof typeof v.text] ?? v.text.default;
                        const brd =
                          'border' in v && state in v.border
                            ? v.border[state as keyof typeof v.border]
                            : 'transparent';
                        const isDisabled = state === 'disabled';
                        return (
                          <div key={state} className="flex flex-col gap-1 items-center">
                            <button
                              type="button"
                              disabled={isDisabled}
                              className="font-sans font-semibold uppercase tracking-widest text-[10px] transition-all"
                              style={{
                                height: buttonAnatomy.height.medium,
                                paddingInline: buttonAnatomy.paddingInline.medium,
                                gap: buttonAnatomy.gap,
                                borderRadius: buttonAnatomy.radius,
                                borderWidth: buttonAnatomy.borderWidth,
                                borderStyle: 'solid',
                                backgroundColor: bg,
                                color: txt,
                                borderColor: brd,
                                transitionDuration: `${buttonDuration}ms`,
                                transitionTimingFunction: buttonEasing,
                                opacity: isDisabled ? 0.6 : 1,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {variant.charAt(0).toUpperCase() + variant.slice(1)}
                            </button>
                            <span className="text-[9px] text-slate-500 font-inter">{state}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Motion + Focus ring */}
              <div className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-[12px] font-mono font-semibold text-slate-900">
                    button.motion
                  </code>
                  <span className="px-1.5 py-0.5 rounded-sm border border-[#C58A16]/30 bg-[#C58A16]/10 text-[#6B4800] text-[8px] font-semibold uppercase tracking-wider font-inter">
                    Provisional
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-mono">
                  <div className="px-3 py-2 bg-slate-50 border border-black/5 rounded-sm">
                    <div className="text-slate-600">duration</div>
                    <div className="text-slate-900 font-semibold">
                      {`{duration.fast}`} → {buttonDuration}ms
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-slate-50 border border-black/5 rounded-sm">
                    <div className="text-slate-600">easing</div>
                    <div className="text-slate-900 font-semibold break-all">
                      {`{cubic-bezier.standard}`} → {buttonEasing}
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-slate-50 border border-black/5 rounded-sm">
                    <div className="text-slate-600">focus-ring</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: buttonFocusRing }} />
                      <span className="text-slate-900 font-semibold">{buttonFocusRing}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tamanhos */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Tamanhos
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  small · medium · large (todos consumindo button tokens)
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <div key={size} className="flex flex-col gap-1 items-start">
                      <button
                        type="button"
                        className="font-sans font-semibold uppercase tracking-widest text-[10px] transition-all hover:opacity-90"
                        style={{
                          height: buttonAnatomy.height[size],
                          paddingInline: buttonAnatomy.paddingInline[size],
                          gap: buttonAnatomy.gap,
                          borderRadius: buttonAnatomy.radius,
                          borderWidth: buttonAnatomy.borderWidth,
                          borderStyle: 'solid',
                          backgroundColor: buttonVariants.primary.background.default,
                          color: buttonVariants.primary.text.default,
                          borderColor: buttonVariants.primary.border.default,
                          transitionDuration: `${buttonDuration}ms`,
                          transitionTimingFunction: buttonEasing,
                        }}
                      >
                        {size}
                      </button>
                      <span className="text-[9px] text-slate-500 font-inter mt-1">
                        h: {buttonAnatomy.height[size]} · p: {buttonAnatomy.paddingInline[size]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5g: Component Tokens — Navigation */}
          <section id="components-nav" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Component Tokens · Navigation
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/component/navigation.tokens.json
                </code>
                . Tokens de componente para estruturas de navegação global: header, links de menu, footer
                e mobile menu. Inclui 2 tokens{' '}
                <span className="px-1.5 py-0.5 rounded-sm border border-[#3F6B4F]/30 bg-[#3F6B4F]/10 text-[#20402C] text-[9px] font-semibold uppercase tracking-wider font-inter align-middle">
                  Approved
                </span>{' '}
                (<code className="font-mono">header.height</code> e{' '}
                <code className="font-mono">header.z-index</code>).
              </p>
            </div>

            {/* Anatomia */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Anatomia
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  header · link · footer · mobile-menu
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Header */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Header
                      </td>
                    </tr>
                    {[
                      { token: 'navigation.header.height',        ref: '{space.1000}',                resolved: navigationTokens.header.height,        type: 'dim', approved: true },
                      { token: 'navigation.header.background',    ref: '{color.semantic.background.canvas}', resolved: navigationTokens.header.background,    type: 'color' },
                      { token: 'navigation.header.text',          ref: '{color.semantic.text.primary}',   resolved: navigationTokens.header.text,          type: 'color' },
                      { token: 'navigation.header.border',        ref: '{color.semantic.border.subtle}',  resolved: navigationTokens.header.border,        type: 'color' },
                      { token: 'navigation.header.z-index',       ref: '{z-index.header}',               resolved: navigationTokens.header.zIndex,        type: 'dim', approved: true },
                      { token: 'navigation.header.padding-inline',ref: '{space.300}',                    resolved: navigationTokens.header.paddingInline, type: 'dim' },
                      { token: 'navigation.header.shadow',        ref: '{shadow.low}',                    resolved: navigationTokens.header.shadow ? shadowCss(navigationTokens.header.shadow) : '—', type: 'shadow' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">
                          {row.token}
                          {'approved' in row && row.approved && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-sm border border-[#3F6B4F]/30 bg-[#3F6B4F]/10 text-[#20402C] text-[8px] font-semibold uppercase tracking-wider font-inter align-middle">
                              Approved
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: String(row.resolved) }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}

                    {/* Link */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Link
                      </td>
                    </tr>
                    {[
                      { token: 'navigation.link.text.default', ref: '{color.semantic.text.secondary}', resolved: navigationTokens.link.text.default, type: 'color' },
                      { token: 'navigation.link.text.hover',   ref: '{color.semantic.text.brand}',     resolved: navigationTokens.link.text.hover,   type: 'color' },
                      { token: 'navigation.link.text.active',  ref: '{color.semantic.text.brand}',     resolved: navigationTokens.link.text.active,  type: 'color' },
                      { token: 'navigation.link.typography',   ref: '{typography.label-medium}',       resolved: navigationTokens.link.typography,   type: 'dim' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}

                    {/* Footer */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Footer
                      </td>
                    </tr>
                    {[
                      { token: 'navigation.footer.background',   ref: '{color.semantic.background.inverse}', resolved: navigationTokens.footer.background,   type: 'color' },
                      { token: 'navigation.footer.text',         ref: '{color.semantic.text.inverse}',       resolved: navigationTokens.footer.text,         type: 'color' },
                      { token: 'navigation.footer.link',         ref: '{color.semantic.text.inverse}',       resolved: navigationTokens.footer.link,         type: 'color' },
                      { token: 'navigation.footer.accent',       ref: '{color.semantic.icon.brand}',         resolved: navigationTokens.footer.accent,       type: 'color' },
                      { token: 'navigation.footer.padding-block',ref: '{space.800}',                          resolved: navigationTokens.footer.paddingBlock,  type: 'dim' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}

                    {/* Mobile Menu */}
                    <tr>
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Mobile Menu
                      </td>
                    </tr>
                    {[
                      { token: 'navigation.mobile-menu.background', ref: '{color.semantic.surface.raised}', resolved: navigationTokens.mobileMenu.background, type: 'color' },
                      { token: 'navigation.mobile-menu.z-index',   ref: '{z-index.overlay}',               resolved: navigationTokens.mobileMenu.zIndex,     type: 'dim' },
                      { token: 'navigation.mobile-menu.shadow',   ref: '{shadow.high}',                    resolved: navigationTokens.mobileMenu.shadow ? shadowCss(navigationTokens.mobileMenu.shadow) : '—', type: 'shadow' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: String(row.resolved) }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demonstração: Header real */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de header
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  consumindo todos os tokens do navigation.header
                </span>
              </header>

              <div
                className="flex items-center justify-between border-b"
                style={{
                  height: navigationTokens.header.height,
                  paddingInline: navigationTokens.header.paddingInline,
                  backgroundColor: navigationTokens.header.background,
                  borderColor: navigationTokens.header.border,
                  boxShadow: navigationTokens.header.shadow ? shadowCss(navigationTokens.header.shadow) : undefined,
                  color: navigationTokens.header.text,
                  zIndex: navigationTokens.header.zIndex,
                }}
              >
                <div className="flex items-center gap-8">
                  <span
                    className="text-sm font-normal"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Senhora do Rosário
                  </span>
                  <nav className="hidden md:flex items-center gap-6">
                    {['Início', 'Eventos', 'Blog', 'Sobre', 'Contato'].map((item, i) => (
                      <a
                        key={item}
                        href="#"
                        className="font-sans font-semibold uppercase tracking-wider text-[10px] transition-colors"
                        style={{
                          color: i === 1 ? navigationTokens.link.text.active : navigationTokens.link.text.default,
                        }}
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 font-sans font-semibold uppercase tracking-widest text-[10px]"
                  style={{
                    height: '40px',
                    paddingInline: '16px',
                    backgroundColor: buttonVariants.primary.background.default,
                    color: buttonVariants.primary.text.default,
                    borderRadius: buttonAnatomy.radius,
                  }}
                >
                  Me Inscrever
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-inter leading-relaxed">
                <strong>Como ler:</strong> o header consome <code className="font-mono">height: 80px</code>,
                <code className="font-mono"> background: {navigationTokens.header.background}</code>,
                <code className="font-mono"> z-index: 50</code>, padding e shadow dos tokens. Os links usam
                <code className="font-mono"> text.secondary</code> (default) e{' '}
                <code className="font-mono">text.brand</code> (active/hover). O CTA reusa tokens de{' '}
                <strong>button</strong>.
              </p>
            </div>

            {/* Demonstração: Footer */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de footer
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  background.inverse + accent dourado
                </span>
              </header>

              <div
                style={{
                  backgroundColor: navigationTokens.footer.background,
                  color: navigationTokens.footer.text,
                  paddingBlock: navigationTokens.footer.paddingBlock,
                  paddingInline: navigationTokens.header.paddingInline,
                  borderRadius: '8px',
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h5
                      className="text-base font-normal mb-2"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: navigationTokens.footer.accent,
                      }}
                    >
                      Senhora do Rosário
                    </h5>
                    <p className="text-[11px] font-sans leading-relaxed opacity-80">
                      Terreiro de Umbanda Senhora do Rosário. Tradição, axé e acolhimento.
                    </p>
                  </div>
                  <div>
                    <h6
                      className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                      style={{ color: navigationTokens.footer.accent, fontFamily: 'var(--font-body)' }}
                    >
                      Links
                    </h6>
                    <ul className="space-y-1">
                      {['Eventos', 'Blog', 'Sobre', 'Contato'].map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="text-[11px] font-sans hover:opacity-80"
                            style={{ color: navigationTokens.footer.link }}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6
                      className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                      style={{ color: navigationTokens.footer.accent }}
                    >
                      Endereço
                    </h6>
                    <p
                      className="text-[11px] font-sans leading-relaxed opacity-80"
                    >
                      Rua das Almas, 108<br />
                      Centro — São Paulo, SP
                    </p>
                  </div>
                </div>
                <div
                  className="mt-6 pt-4 text-[10px] font-sans opacity-60"
                  style={{ borderTop: '1px solid rgba(250, 245, 236, 0.1)' }}
                >
                  © 2026 Terreiro Senhora do Rosário. Todos os direitos reservados.
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5h: Component Tokens — Tabs */}
          <section id="components-tabs" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Component Tokens · Tabs
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/component/tabs.tokens.json
                </code>
                . Tokens de componente para navegação por abas. Cobre a lista (gap, border), o item
                (padding, radius, typography, text, indicator) e motion.
              </p>
            </div>

            {/* Anatomia */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Anatomia
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  list · item (text + indicator) · motion
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* List */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        List
                      </td>
                    </tr>
                    {[
                      { token: 'tabs.list.gap',    ref: '{space.100}',                resolved: tabsTokens.list.gap,    type: 'dim' },
                      { token: 'tabs.list.border', ref: '{color.semantic.border.subtle}', resolved: tabsTokens.list.border, type: 'color' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: String(row.resolved) }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}

                    {/* Item */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Item
                      </td>
                    </tr>
                    {[
                      { token: 'tabs.item.padding-inline', ref: '{space.200}',                  resolved: tabsTokens.item.paddingInline, type: 'dim' },
                      { token: 'tabs.item.padding-block',  ref: '{space.150}',                  resolved: tabsTokens.item.paddingBlock,  type: 'dim' },
                      { token: 'tabs.item.radius',         ref: '{radius.100}',                 resolved: tabsTokens.item.radius,         type: 'dim' },
                      { token: 'tabs.item.typography',     ref: '{typography.label-medium}',   resolved: tabsTokens.item.typography,     type: 'dim' },
                      { token: 'tabs.item.text.default',   ref: '{color.semantic.text.secondary}', resolved: tabsTokens.item.text.default,  type: 'color' },
                      { token: 'tabs.item.text.hover',     ref: '{color.semantic.text.primary}',   resolved: tabsTokens.item.text.hover,    type: 'color' },
                      { token: 'tabs.item.text.active',    ref: '{color.semantic.text.brand}',     resolved: tabsTokens.item.text.active,   type: 'color' },
                      { token: 'tabs.item.text.disabled',  ref: '{color.semantic.text.disabled}',  resolved: tabsTokens.item.text.disabled, type: 'color' },
                      { token: 'tabs.item.indicator.default', ref: '{color.semantic.action.primary.default}', resolved: tabsTokens.item.indicator.default, type: 'color' },
                      { token: 'tabs.item.indicator.height',  ref: '{border-width.medium}',                       resolved: tabsTokens.item.indicator.height,  type: 'dim' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: String(row.resolved) }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}

                    {/* Motion */}
                    <tr>
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Motion
                      </td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">tabs.motion.duration</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{duration.fast}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{tabsTokens.motion.duration}ms</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">tabs.motion.easing</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{cubic-bezier.standard}`}</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-700 break-all">{tabsTokens.motion.easing}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demonstração: tabs interativas */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de tabs
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  lista · 4 estados de item · indicator
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm">
                {/* Tabs list */}
                <div
                  role="tablist"
                  className="flex items-center"
                  style={{
                    gap: tabsTokens.list.gap,
                    borderBottom: `1px solid ${tabsTokens.list.border}`,
                  }}
                >
                  {([
                    { label: 'Próximas',  state: 'active'   as const },
                    { label: 'Realizadas', state: 'default'  as const },
                    { label: 'Inscritas', state: 'default'  as const },
                    { label: 'Arquivadas', state: 'disabled' as const },
                  ]).map((tab) => {
                    const textColor =
                      tab.state === 'active'  ? tabsTokens.item.text.active  :
                      tab.state === 'disabled' ? tabsTokens.item.text.disabled :
                      tabsTokens.item.text.default;
                    return (
                      <button
                        key={tab.label}
                        type="button"
                        role="tab"
                        aria-selected={tab.state === 'active'}
                        disabled={tab.state === 'disabled'}
                        className="relative font-sans font-semibold uppercase tracking-wider text-[10px] transition-colors"
                        style={{
                          paddingInline: tabsTokens.item.paddingInline,
                          paddingBlock: tabsTokens.item.paddingBlock,
                          borderRadius: tabsTokens.item.radius,
                          color: textColor,
                          cursor: tab.state === 'disabled' ? 'not-allowed' : 'pointer',
                          opacity: tab.state === 'disabled' ? 0.6 : 1,
                          transitionDuration: `${tabsTokens.motion.duration}ms`,
                          transitionTimingFunction: tabsTokens.motion.easing,
                        }}
                      >
                        {tab.label}
                        {tab.state === 'active' && (
                          <span
                            className="absolute left-0 right-0"
                            style={{
                              bottom: '-1px',
                              height: tabsTokens.item.indicator.height,
                              backgroundColor: tabsTokens.item.indicator.default,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab panels (estáticos) */}
                <div className="mt-6">
                  {([
                    { label: 'Próximas',  active: true,  text: 'Lista de giras agendadas: Caboclos, Pretos Velhos, Crianças.' },
                    { label: 'Realizadas', active: false, text: 'Histórico de giras já ocorridas — somente leitura.' },
                    { label: 'Inscritas', active: false, text: 'Giras em que você confirmou presença.' },
                    { label: 'Arquivadas', active: false, text: 'Indisponível — recurso em construção.' },
                  ]).filter((t) => t.label === 'Próximas').map((t) => (
                    <div key={t.label} className="space-y-2">
                      <h4 className="text-base font-normal text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                        {t.label}
                      </h4>
                      <p className="text-[12px] text-slate-700 font-sans leading-relaxed">{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-inter leading-relaxed">
                <strong>Como ler:</strong> a lista aplica{' '}
                <code className="font-mono">gap: {tabsTokens.list.gap}</code> e uma border-bottom sutil.
                O item ativo usa <code className="font-mono">text.brand</code> (terracotta.700) com um
                indicator de <code className="font-mono">{tabsTokens.item.indicator.height}</code> em{' '}
                <code className="font-mono">action.primary.default</code> posicionado abaixo. Itens
                desabilitados aplicam <code className="font-mono">text.disabled</code> + cursor{' '}
                <code className="font-mono">not-allowed</code>.
              </p>
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

          {/* Seção 6b: Component Tokens — Input */}
          <section id="components-input" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Component Tokens · Input
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/component/input.tokens.json
                </code>
                . Tokens de componente para text inputs e form fields. Cobre anatomia (height, padding, gap,
                radius, border), estados de background/text/border, focus-ring, tipografia e motion.
              </p>
            </div>

            {/* Anatomia */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Anatomia
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  height · padding · gap · radius · border-width
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { token: 'input.height.small',          ref: '{space.500}',         resolved: inputTokens.height.small },
                      { token: 'input.height.medium',         ref: '{space.600}',         resolved: inputTokens.height.medium },
                      { token: 'input.height.large',          ref: '{space.800}',         resolved: inputTokens.height.large },
                      { token: 'input.padding-inline',        ref: '{space.200}',         resolved: inputTokens.paddingInline },
                      { token: 'input.gap',                   ref: '{space.100}',         resolved: inputTokens.gap },
                      { token: 'input.radius',                ref: '{radius.200}',        resolved: inputTokens.radius },
                      { token: 'input.border-width',          ref: '{border-width.thin}', resolved: inputTokens.borderWidth },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{row.resolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estados de background / text / border */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Estados (background · text · border)
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  default · hover · focus · error · disabled
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Estado</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Background */}
                    <tr className="border-b border-black/5">
                      <td colSpan={4} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Background
                      </td>
                    </tr>
                    {[
                      { token: 'input.background.default',  ref: '{color.semantic.surface.default}', resolved: inputTokens.background.default },
                      { token: 'input.background.disabled', ref: '{color.semantic.surface.subtle}',  resolved: inputTokens.background.disabled },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 text-slate-500 pl-6 text-[10px]">background</td>
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">{row.token.split('.').pop()}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                            {row.resolved}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Text */}
                    <tr className="border-b border-black/5">
                      <td colSpan={4} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Text
                      </td>
                    </tr>
                    {[
                      { token: 'input.text.value',       ref: '{color.semantic.text.primary}',             resolved: inputTokens.text.value },
                      { token: 'input.text.placeholder', ref: '{color.semantic.text.tertiary}',            resolved: inputTokens.text.placeholder },
                      { token: 'input.text.disabled',    ref: '{color.semantic.text.disabled}',            resolved: inputTokens.text.disabled },
                      { token: 'input.text.label',       ref: '{color.semantic.text.secondary}',           resolved: inputTokens.text.label },
                      { token: 'input.text.helper',      ref: '{color.semantic.text.tertiary}',            resolved: inputTokens.text.helper },
                      { token: 'input.text.error',       ref: '{color.semantic.feedback.error.default}',   resolved: inputTokens.text.error },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 text-slate-500 pl-6 text-[10px]">text</td>
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">{row.token.split('.').pop()}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                            {row.resolved}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Border */}
                    <tr className="border-b border-black/5">
                      <td colSpan={4} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Border
                      </td>
                    </tr>
                    {[
                      { token: 'input.border.default', ref: '{color.semantic.border.default}', resolved: inputTokens.border.default },
                      { token: 'input.border.hover',   ref: '{color.semantic.border.strong}',  resolved: inputTokens.border.hover },
                      { token: 'input.border.focus',   ref: '{color.semantic.border.focus}',   resolved: inputTokens.border.focus },
                      { token: 'input.border.error',   ref: '{color.semantic.border.error}',   resolved: inputTokens.border.error },
                      { token: 'input.border.disabled',ref: '{color.semantic.border.subtle}',  resolved: inputTokens.border.disabled },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 text-slate-500 pl-6 text-[10px]">border</td>
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">{row.token.split('.').pop()}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm border-2" style={{ borderColor: row.resolved }} />
                            {row.resolved}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Focus ring + Motion */}
                    <tr className="border-b border-black/5">
                      <td colSpan={4} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Focus-ring · Motion
                      </td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="px-4 py-2 text-slate-500 pl-6 text-[10px]">focus-ring</td>
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">input.focus-ring</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{color.semantic.focus.ring}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: inputTokens.focusRing }} />
                          {inputTokens.focusRing}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="px-4 py-2 text-slate-500 pl-6 text-[10px]">motion</td>
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">duration</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{duration.fast}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{inputTokens.motion.duration}ms</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-slate-500 pl-6 text-[10px]">motion</td>
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900">easing</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{cubic-bezier.standard}`}</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-700 break-all">{inputTokens.motion.easing}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demonstração: estados lado a lado */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de estados
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  renderizados consumindo os tokens
                </span>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default */}
                <div
                  className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                >
                  <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Default</div>
                  <label className="block">
                    <span
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: inputTokens.text.label, letterSpacing: '0.04em' }}
                    >
                      Rótulo
                    </span>
                    <input
                      type="text"
                      placeholder="Digite algo…"
                      className="w-full font-sans text-[14px] outline-none"
                      style={{
                        height: inputTokens.height.medium,
                        paddingInline: inputTokens.paddingInline,
                        borderRadius: inputTokens.radius,
                        borderWidth: inputTokens.borderWidth,
                        borderStyle: 'solid',
                        borderColor: inputTokens.border.default,
                        backgroundColor: inputTokens.background.default,
                        color: inputTokens.text.value,
                        transitionDuration: `${inputTokens.motion.duration}ms`,
                        transitionTimingFunction: inputTokens.motion.easing,
                      }}
                    />
                    <span
                      className="block text-[10px] mt-1.5"
                      style={{ color: inputTokens.text.helper }}
                    >
                      Texto auxiliar opcional.
                    </span>
                  </label>
                </div>

                {/* Hover */}
                <div
                  className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                >
                  <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Hover</div>
                  <label className="block">
                    <span
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: inputTokens.text.label, letterSpacing: '0.04em' }}
                    >
                      Rótulo
                    </span>
                    <input
                      type="text"
                      defaultValue="Passe o cursor aqui"
                      className="w-full font-sans text-[14px] outline-none hover:!border-current"
                      style={{
                        height: inputTokens.height.medium,
                        paddingInline: inputTokens.paddingInline,
                        borderRadius: inputTokens.radius,
                        borderWidth: inputTokens.borderWidth,
                        borderStyle: 'solid',
                        borderColor: inputTokens.border.hover,
                        backgroundColor: inputTokens.background.default,
                        color: inputTokens.text.value,
                        transitionDuration: `${inputTokens.motion.duration}ms`,
                        transitionTimingFunction: inputTokens.motion.easing,
                      }}
                    />
                    <span className="block text-[10px] mt-1.5 text-slate-500">border: {inputTokens.border.hover}</span>
                  </label>
                </div>

                {/* Focus (simulado) */}
                <div
                  className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                >
                  <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Focus</div>
                  <label className="block">
                    <span
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: inputTokens.text.label, letterSpacing: '0.04em' }}
                    >
                      Rótulo
                    </span>
                    <div
                      className="relative"
                      style={{ borderRadius: inputTokens.radius }}
                    >
                      <input
                        type="text"
                        defaultValue="Campo focado"
                        className="w-full font-sans text-[14px] outline-none"
                        style={{
                          height: inputTokens.height.medium,
                          paddingInline: inputTokens.paddingInline,
                          borderRadius: inputTokens.radius,
                          borderWidth: inputTokens.borderWidth,
                          borderStyle: 'solid',
                          borderColor: inputTokens.border.focus,
                          backgroundColor: inputTokens.background.default,
                          color: inputTokens.text.value,
                          outline: `2px solid ${inputTokens.focusRing}`,
                          outlineOffset: '1px',
                          transitionDuration: `${inputTokens.motion.duration}ms`,
                          transitionTimingFunction: inputTokens.motion.easing,
                        }}
                      />
                    </div>
                    <span className="block text-[10px] mt-1.5 text-slate-500">outline: {inputTokens.focusRing}</span>
                  </label>
                </div>

                {/* Error */}
                <div
                  className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: inputTokens.text.error }}>
                    Error
                  </div>
                  <label className="block">
                    <span
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: inputTokens.text.error, letterSpacing: '0.04em' }}
                    >
                      Rótulo
                    </span>
                    <input
                      type="text"
                      defaultValue="Texto inválido"
                      className="w-full font-sans text-[14px] outline-none"
                      style={{
                        height: inputTokens.height.medium,
                        paddingInline: inputTokens.paddingInline,
                        borderRadius: inputTokens.radius,
                        borderWidth: inputTokens.borderWidth,
                        borderStyle: 'solid',
                        borderColor: inputTokens.border.error,
                        backgroundColor: inputTokens.background.default,
                        color: inputTokens.text.value,
                        transitionDuration: `${inputTokens.motion.duration}ms`,
                        transitionTimingFunction: inputTokens.motion.easing,
                      }}
                    />
                    <span
                      className="block text-[10px] mt-1.5"
                      style={{ color: inputTokens.text.error }}
                    >
                      O preenchimento deste campo é obrigatório.
                    </span>
                  </label>
                </div>

                {/* Disabled */}
                <div
                  className="p-5 bg-white rounded-md border border-black/5 shadow-sm space-y-3 md:col-span-2"
                >
                  <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Disabled</div>
                  <label className="block">
                    <span
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: inputTokens.text.disabled, letterSpacing: '0.04em' }}
                    >
                      Rótulo
                    </span>
                    <input
                      type="text"
                      disabled
                      defaultValue="Não editável"
                      className="w-full font-sans text-[14px] outline-none cursor-not-allowed"
                      style={{
                        height: inputTokens.height.medium,
                        paddingInline: inputTokens.paddingInline,
                        borderRadius: inputTokens.radius,
                        borderWidth: inputTokens.borderWidth,
                        borderStyle: 'solid',
                        borderColor: inputTokens.border.disabled,
                        backgroundColor: inputTokens.background.disabled,
                        color: inputTokens.text.disabled,
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Demonstração: 3 tamanhos */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Tamanhos
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  small · medium · large
                </span>
              </header>

              <div className="p-6 bg-white rounded-md border border-black/5 shadow-sm space-y-4">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <div key={size} className="flex items-center gap-3">
                    <code className="text-[10px] font-mono text-slate-700 w-32 shrink-0">
                      input.height.{size}
                    </code>
                    <input
                      type="text"
                      defaultValue={`${size} (${inputTokens.height[size]})`}
                      className="flex-1 font-sans text-[14px] outline-none"
                      style={{
                        height: inputTokens.height[size],
                        paddingInline: inputTokens.paddingInline,
                        borderRadius: inputTokens.radius,
                        borderWidth: inputTokens.borderWidth,
                        borderStyle: 'solid',
                        borderColor: inputTokens.border.default,
                        backgroundColor: inputTokens.background.default,
                        color: inputTokens.text.value,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 6c: Component Tokens — Modal */}
          <section id="components-modal" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Component Tokens · Modal
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/component/modal.tokens.json
                </code>
                . Tokens de componente para modais/diálogos. Cobre overlay, container, header, body, footer,
                z-index e motion.
              </p>
            </div>

            {/* Anatomia */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Anatomia
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  overlay · container · header · body · footer · z-index · motion
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Overlay */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Overlay
                      </td>
                    </tr>
                    <tr className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">modal.overlay.background</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{color.semantic.overlay.scrim}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: modalTokens.overlay.background }} />
                          {modalTokens.overlay.background}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">modal.overlay.opacity</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{opacity.strong}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                        {modalTokens.overlay.opacity} · {Math.round(modalTokens.overlay.opacity * 100)}%
                      </td>
                    </tr>

                    {/* Container */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Container
                      </td>
                    </tr>
                    {[
                      { token: 'modal.container.background', ref: '{color.semantic.surface.raised}', resolved: modalTokens.container.background, type: 'color' },
                      { token: 'modal.container.text',       ref: '{color.semantic.text.primary}',   resolved: modalTokens.container.text,       type: 'color' },
                      { token: 'modal.container.radius',     ref: '{radius.400}',                     resolved: modalTokens.container.radius,     type: 'dim' },
                      { token: 'modal.container.padding',    ref: '{space.400}',                      resolved: modalTokens.container.padding,    type: 'dim' },
                      { token: 'modal.container.shadow',     ref: '{shadow.high}',                    resolved: modalTokens.container.shadow ? shadowCss(modalTokens.container.shadow) : '—', type: 'shadow' },
                      { token: 'modal.container.max-width',  ref: '640px',                            resolved: modalTokens.container.maxWidth,   type: 'dim' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          {row.type === 'color' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                              {row.resolved}
                            </span>
                          ) : row.resolved}
                        </td>
                      </tr>
                    ))}

                    {/* Header / Body / Footer */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Header · Body · Footer
                      </td>
                    </tr>
                    {[
                      { token: 'modal.header.gap',        ref: '{space.200}',                resolved: modalTokens.header.gap },
                      { token: 'modal.header.typography', ref: '{typography.heading-medium}', resolved: modalTokens.header.typography },
                      { token: 'modal.body.gap',          ref: '{space.300}',                resolved: modalTokens.body.gap },
                      { token: 'modal.body.typography',   ref: '{typography.body-medium}',   resolved: modalTokens.body.typography },
                      { token: 'modal.footer.gap',        ref: '{space.200}',                resolved: modalTokens.footer.gap },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{row.resolved}</td>
                      </tr>
                    ))}

                    {/* Z-Index + Motion */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Z-Index · Motion
                      </td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">modal.z-index</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{z-index.modal}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{modalTokens.zIndex}</td>
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">modal.motion.duration</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{duration.moderate}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{modalTokens.motion.duration}ms</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">modal.motion.easing</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{cubic-bezier.enter}`}</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-700 break-all">{modalTokens.motion.easing}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demonstração: modal real */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de modal
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  overlay + container + header + body + footer
                </span>
              </header>

              <div className="p-8 bg-[#FAF5EC] rounded-md border border-black/5 relative overflow-hidden min-h-[420px]">
                {/* Overlay simulado */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: modalTokens.overlay.background,
                    opacity: modalTokens.overlay.opacity,
                  }}
                />

                {/* Container do modal */}
                <div
                  className="relative mx-auto"
                  style={{
                    maxWidth: modalTokens.container.maxWidth,
                    backgroundColor: modalTokens.container.background,
                    color: modalTokens.container.text,
                    borderRadius: modalTokens.container.radius,
                    padding: modalTokens.container.padding,
                    boxShadow: modalTokens.container.shadow ? shadowCss(modalTokens.container.shadow) : undefined,
                    zIndex: modalTokens.zIndex,
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex justify-between items-start"
                    style={{ gap: modalTokens.header.gap }}
                  >
                    <div>
                      <h4
                        className="font-normal text-slate-900"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '32px',
                          fontWeight: 500,
                          lineHeight: 1.25,
                        }}
                      >
                        Confirmar inscrição
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-1">
                        typography.heading-medium · {modalTokens.header.typography}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-700 text-xl leading-none"
                      aria-label="Fechar"
                    >
                      ×
                    </button>
                  </div>

                  {/* Body */}
                  <div
                    className="mt-4"
                    style={{ gap: modalTokens.body.gap, display: 'flex', flexDirection: 'column' }}
                  >
                    <p
                      className="text-slate-700 font-sans leading-relaxed"
                      style={{ fontSize: '16px', lineHeight: 1.5 }}
                    >
                      Você está prestes a confirmar sua inscrição na Gira de Caboclos do dia 27/09/2026.
                      Após a confirmação, você receberá os detalhes por e-mail.
                    </p>
                    <p className="text-[10px] text-slate-500 font-sans">
                      typography.body-medium · {modalTokens.body.typography}
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    className="flex justify-end items-center mt-6 pt-4 border-t border-black/5"
                    style={{ gap: modalTokens.footer.gap }}
                  >
                    <button
                      type="button"
                      className="px-5 py-2.5 font-sans font-semibold uppercase tracking-widest text-[10px] hover:opacity-80"
                      style={{
                        height: buttonAnatomy.height.medium,
                        paddingInline: buttonAnatomy.paddingInline.medium,
                        borderRadius: buttonAnatomy.radius,
                        backgroundColor: buttonVariants.secondary.background.default,
                        color: buttonVariants.secondary.text.default,
                        border: `${buttonAnatomy.borderWidth} solid ${buttonVariants.secondary.border.default}`,
                        transitionDuration: `${modalTokens.motion.duration}ms`,
                        transitionTimingFunction: modalTokens.motion.easing,
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2.5 font-sans font-semibold uppercase tracking-widest text-[10px] hover:opacity-90"
                      style={{
                        height: buttonAnatomy.height.medium,
                        paddingInline: buttonAnatomy.paddingInline.medium,
                        borderRadius: buttonAnatomy.radius,
                        backgroundColor: buttonVariants.primary.background.default,
                        color: buttonVariants.primary.text.default,
                        border: `${buttonAnatomy.borderWidth} solid ${buttonVariants.primary.border.default}`,
                        transitionDuration: `${modalTokens.motion.duration}ms`,
                        transitionTimingFunction: modalTokens.motion.easing,
                      }}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-inter leading-relaxed">
                <strong>Como ler:</strong> o overlay usa{' '}
                <code className="font-mono">modal.overlay.background</code> com{' '}
                <code className="font-mono">modal.overlay.opacity</code> ({Math.round(modalTokens.overlay.opacity * 100)}%).
                O container aplica radius, padding, shadow e z-index dos tokens. Botões do footer reusam os
                tokens de <strong>button</strong> já definidos.
              </p>
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

          {/* Seção 7b: Component Tokens — Card */}
          <section id="components-card" className="scroll-mt-28 space-y-8">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Component Tokens · Card
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Fonte da verdade:{' '}
                <code className="font-mono text-[11px] text-slate-700">
                  design-system/component/card.tokens.json
                </code>
                . Tokens de componente para cards e content containers — todos derivados de tokens
                semânticos/foundation. Cobre backgrounds, text, border, radius, padding, gap, shadow e motion.
              </p>
            </div>

            {/* Anatomia */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Anatomia
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  {Object.keys(cardTokens).length} categorias · todas provisórias
                </span>
              </header>

              <div className="bg-white rounded-md border border-black/5 shadow-sm overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-black/5">
                    <tr className="text-left text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 font-semibold">Token</th>
                      <th className="px-4 py-3 font-semibold">Referência</th>
                      <th className="px-4 py-3 font-semibold">Resolvido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Background */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Background
                      </td>
                    </tr>
                    {[
                      { token: 'card.background.default', ref: '{color.semantic.surface.default}', resolved: cardTokens.background.default },
                      { token: 'card.background.subtle',  ref: '{color.semantic.surface.subtle}',  resolved: cardTokens.background.subtle },
                      { token: 'card.background.inverse', ref: '{color.semantic.surface.inverse}', resolved: cardTokens.background.inverse },
                      { token: 'card.background.glass',   ref: '{color.semantic.overlay.scrim}',  resolved: cardTokens.background.glass },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                            {row.resolved}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Text */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Text
                      </td>
                    </tr>
                    {[
                      { token: 'card.text.title',   ref: '{color.semantic.text.primary}',   resolved: cardTokens.text.title },
                      { token: 'card.text.body',    ref: '{color.semantic.text.secondary}', resolved: cardTokens.text.body },
                      { token: 'card.text.inverse', ref: '{color.semantic.text.inverse}',   resolved: cardTokens.text.inverse },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm border border-black/10" style={{ backgroundColor: row.resolved }} />
                            {row.resolved}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Border */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Border
                      </td>
                    </tr>
                    {[
                      { token: 'card.border.default', ref: '{color.semantic.border.subtle}', resolved: cardTokens.border.default },
                      { token: 'card.border.hover',   ref: '{color.semantic.border.focus}',  resolved: cardTokens.border.hover },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm border-2" style={{ borderColor: row.resolved }} />
                            {row.resolved}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Radius */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Radius
                      </td>
                    </tr>
                    {[
                      { token: 'card.radius.default', ref: '{radius.300}', resolved: cardTokens.radius.default },
                      { token: 'card.radius.large',   ref: '{radius.400}', resolved: cardTokens.radius.large },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{row.resolved}</td>
                      </tr>
                    ))}

                    {/* Padding */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Padding
                      </td>
                    </tr>
                    {[
                      { token: 'card.padding.small',  ref: '{space.200}', resolved: cardTokens.padding.small },
                      { token: 'card.padding.medium', ref: '{space.300}', resolved: cardTokens.padding.medium },
                      { token: 'card.padding.large',  ref: '{space.400}', resolved: cardTokens.padding.large },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{row.resolved}</td>
                      </tr>
                    ))}

                    {/* Gap */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Gap
                      </td>
                    </tr>
                    <tr className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">card.gap</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{space.200}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{cardTokens.gap}</td>
                    </tr>

                    {/* Shadow */}
                    <tr className="border-b border-black/5">
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Shadow
                      </td>
                    </tr>
                    {[
                      { token: 'card.shadow.default', ref: '{shadow.low}',    resolved: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : '—' },
                      { token: 'card.shadow.hover',   ref: '{shadow.medium}', resolved: cardTokens.shadow.hover   ? shadowCss(cardTokens.shadow.hover)   : '—' },
                    ].map((row) => (
                      <tr key={row.token} className="border-b border-black/5 last:border-0">
                        <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">{row.token}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{row.ref}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-slate-700">{row.resolved}</td>
                      </tr>
                    ))}

                    {/* Motion */}
                    <tr>
                      <td colSpan={3} className="px-4 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/40">
                        Motion
                      </td>
                    </tr>
                    <tr className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">card.motion.duration</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{duration.deliberate}`}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-900 font-semibold">{cardTokens.motion.duration}ms</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono text-[11px] font-semibold text-slate-900 pl-6">card.motion.easing</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{`{cubic-bezier.emphasized}`}</td>
                      <td className="px-4 py-2 font-mono text-[10px] text-slate-700 break-all">{cardTokens.motion.easing}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demonstração: variantes */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de variantes
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  background · text · radius aplicados
                </span>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default */}
                <div
                  className="space-y-2"
                  style={{
                    backgroundColor: cardTokens.background.default,
                    color: cardTokens.text.body,
                    borderRadius: cardTokens.radius.default,
                    border: `1px solid ${cardTokens.border.default}`,
                    padding: cardTokens.padding.medium,
                    boxShadow: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : undefined,
                    transitionDuration: `${cardTokens.motion.duration}ms`,
                    transitionTimingFunction: cardTokens.motion.easing,
                  }}
                >
                  <h4
                    className="text-base font-normal"
                    style={{ color: cardTokens.text.title, fontFamily: 'var(--font-heading)' }}
                  >
                    Card padrão
                  </h4>
                  <p className="text-[12px] font-sans leading-snug">
                    Superfície <code className="font-mono text-[11px]">surface.default</code> com padding médio,
                    radius padrão e shadow <code className="font-mono text-[11px]">shadow.low</code>.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <code className="text-[9px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-black/5">
                      bg: {cardTokens.background.default}
                    </code>
                    <code className="text-[9px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-black/5">
                      radius: {cardTokens.radius.default}
                    </code>
                    <code className="text-[9px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-black/5">
                      p: {cardTokens.padding.medium}
                    </code>
                  </div>
                </div>

                {/* Subtle */}
                <div
                  className="space-y-2"
                  style={{
                    backgroundColor: cardTokens.background.subtle,
                    color: cardTokens.text.body,
                    borderRadius: cardTokens.radius.default,
                    border: `1px solid ${cardTokens.border.default}`,
                    padding: cardTokens.padding.medium,
                    boxShadow: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : undefined,
                    transitionDuration: `${cardTokens.motion.duration}ms`,
                    transitionTimingFunction: cardTokens.motion.easing,
                  }}
                >
                  <h4
                    className="text-base font-normal"
                    style={{ color: cardTokens.text.title, fontFamily: 'var(--font-heading)' }}
                  >
                    Card discreto
                  </h4>
                  <p className="text-[12px] font-sans leading-snug">
                    Superfície <code className="font-mono text-[11px]">surface.subtle</code> para aninhamento
                    e hierarquia visual suave.
                  </p>
                </div>

                {/* Inverse */}
                <div
                  className="space-y-2"
                  style={{
                    backgroundColor: cardTokens.background.inverse,
                    color: cardTokens.text.inverse,
                    borderRadius: cardTokens.radius.default,
                    border: '1px solid rgba(250, 245, 236, 0.05)',
                    padding: cardTokens.padding.medium,
                    boxShadow: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : undefined,
                    transitionDuration: `${cardTokens.motion.duration}ms`,
                    transitionTimingFunction: cardTokens.motion.easing,
                  }}
                >
                  <h4
                    className="text-base font-normal"
                    style={{ color: cardTokens.text.inverse, fontFamily: 'var(--font-heading)' }}
                  >
                    Card invertido
                  </h4>
                  <p className="text-[12px] font-sans leading-snug opacity-90">
                    Superfície <code className="font-mono text-[11px]">surface.inverse</code> para destaques
                    em fundo claro (warm-neutral.900).
                  </p>
                </div>

                {/* Glass */}
                <div
                  className="space-y-2 relative overflow-hidden"
                  style={{
                    backgroundColor: cardTokens.background.glass,
                    color: cardTokens.text.inverse,
                    borderRadius: cardTokens.radius.default,
                    border: '1px solid rgba(250, 245, 236, 0.05)',
                    padding: cardTokens.padding.medium,
                    backdropFilter: 'blur(8px)',
                    boxShadow: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : undefined,
                    transitionDuration: `${cardTokens.motion.duration}ms`,
                    transitionTimingFunction: cardTokens.motion.easing,
                  }}
                >
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background: 'linear-gradient(135deg, #8B3A2A 0%, #5E2317 50%, #0D0B08 100%)',
                    }}
                  />
                  <h4
                    className="text-base font-normal"
                    style={{ color: cardTokens.text.inverse, fontFamily: 'var(--font-heading)' }}
                  >
                    Card glassmorphism
                  </h4>
                  <p className="text-[12px] font-sans leading-snug opacity-90">
                    Base <code className="font-mono text-[11px]">overlay.scrim</code> com backdrop-blur para
                    painéis translúcidos sobre fundos complexos.
                  </p>
                </div>
              </div>
            </div>

            {/* Demonstração: padding + radius + shadow + motion */}
            <div className="space-y-4">
              <header className="flex items-baseline gap-3">
                <h3 className="text-xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                  Demonstração de estados
                </h3>
                <span className="text-[10px] font-inter uppercase tracking-widest text-slate-500">
                  padding · radius · shadow · motion em ação
                </span>
              </header>

              <div className="p-6 bg-[#FAF5EC] rounded-md border border-black/5 space-y-6">
                {/* Padding: 3 tamanhos */}
                <div className="space-y-3">
                  <h4 className="text-sm font-normal text-slate-800">Padding</h4>
                  <div className="flex flex-wrap items-start gap-4">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <div
                        key={size}
                        className="bg-white border border-black/5 inline-block"
                        style={{
                          padding: cardTokens.padding[size],
                          borderRadius: cardTokens.radius.default,
                          boxShadow: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : undefined,
                        }}
                      >
                        <span className="text-[10px] font-mono text-slate-700">card.padding.{size}</span>
                        <div className="text-[9px] font-mono text-slate-500 mt-1">
                          {cardTokens.padding[size]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radius: 2 tamanhos */}
                <div className="space-y-3">
                  <h4 className="text-sm font-normal text-slate-800">Radius</h4>
                  <div className="flex flex-wrap items-start gap-4">
                    {(['default', 'large'] as const).map((size) => (
                      <div
                        key={size}
                        className="bg-white border border-black/5 p-4 w-32"
                        style={{
                          borderRadius: cardTokens.radius[size],
                          boxShadow: cardTokens.shadow.default ? shadowCss(cardTokens.shadow.default) : undefined,
                        }}
                      >
                        <span className="text-[10px] font-mono text-slate-700">card.radius.{size}</span>
                        <div className="text-[9px] font-mono text-slate-500 mt-1">{cardTokens.radius[size]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shadow: default → hover (interativo) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-normal text-slate-800">Shadow (default → hover)</h4>
                  <div className="flex flex-wrap items-start gap-6">
                    {(['default', 'hover'] as const).map((state) => (
                      <div
                        key={state}
                        className="bg-white border border-black/5 p-4 w-40 cursor-pointer"
                        style={{
                          borderRadius: cardTokens.radius.default,
                          boxShadow: cardTokens.shadow[state] ? shadowCss(cardTokens.shadow[state] as ShadowValue) : undefined,
                          transitionDuration: `${cardTokens.motion.duration}ms`,
                          transitionTimingFunction: cardTokens.motion.easing,
                        }}
                      >
                        <span className="text-[10px] font-mono text-slate-700">card.shadow.{state}</span>
                        <div className="text-[9px] font-mono text-slate-500 mt-1 break-all">
                          {cardTokens.shadow[state] ? shadowCss(cardTokens.shadow[state] as ShadowValue) : '—'}
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 italic">
                          {state === 'default' ? 'passe o cursor' : 'em hover'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
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

          {/* Seção: Próximos Componentes */}
          <section id="proximos-passos" className="scroll-mt-28 space-y-6">
            <div className="border-b border-black/10 pb-3">
              <h2 className="text-3xl md:text-4xl font-normal font-[var(--font-heading)] text-black tracking-wide">
                Próximos Componentes
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-inter max-w-3xl leading-relaxed">
                Roadmap de componentes que consumirão os <strong>Color Roles</strong> semânticos definidos acima.
                Status atual: <span className="text-[#20402C] font-semibold">aprovados</span> (foundation + semantic) e
                <span className="text-[#6B4800] font-semibold"> provisórios</span> (famílias funcionais).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'StatusBadge',     tokens: ['feedback.success.subtle', 'feedback.warning.subtle', 'feedback.error.subtle', 'feedback.info.subtle'],   desc: 'Badge semântico para status de eventos e processos.' },
                { name: 'Toast / Alert',   tokens: ['feedback.success.strong', 'feedback.warning.strong', 'feedback.error.strong', 'feedback.info.strong'], desc: 'Notificações efêmeras com hierarquia de severidade.' },
                { name: 'Form Field',      tokens: ['border.default', 'border.focus', 'border.error', 'text.disabled'],                                                     desc: 'Wrapper de campo com label, helper e mensagens de erro.' },
                { name: 'Modal',           tokens: ['overlay.scrim', 'surface.raised', 'focus.ring'],                                                                   desc: 'Diálogo com scrim e trap de foco acessível.' },
                { name: 'Tabs',            tokens: ['border.subtle', 'action.secondary.default', 'text.tertiary'],                                                       desc: 'Navegação por abas com indicador ativo dourado.' },
                { name: 'Tooltip',         tokens: ['surface.inverse', 'text.inverse'],                                                                                 desc: 'Dica flutuante sobre superfícies escuras.' },
              ].map((item) => (
                <div key={item.name} className="p-4 bg-white rounded-md border border-black/5 shadow-xs space-y-2">
                  <h4 className="text-base font-normal font-[var(--font-heading)] text-black">{item.name}</h4>
                  <p className="text-[11px] text-slate-600 font-sans leading-snug">{item.desc}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tokens.map((t) => (
                      <code
                        key={t}
                        className="text-[9px] font-mono px-1.5 py-0.5 bg-[#EEEBE4] text-[#594E3D] rounded-sm border border-black/5"
                      >
                        {t}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
