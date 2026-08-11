---
name: T. U. Senhora do Rosário
description: Portal institucional do Terreiro de Umbanda Senhora do Rosário — Sacred Modernism.
colors:
  terracotta: "#8B3A2A"
  terracotta-deep: "#5E2317"
  terracotta-soft: "#BE6755"
  ancestral-gold: "#C9A227"
  ancestral-gold-deep: "#816500"
  candle-amber: "#D4813A"
  parchment: "#FAF5EC"
  parchment-dim: "#EEEBE4"
  warm-neutral-900: "#2A2318"
  warm-neutral-950: "#0D0B08"
  warm-neutral-600: "#736754"
  warm-neutral-300: "#C3B9AB"
  ember: "#A33A2B"
  sun: "#C58A16"
  river: "#2F6473"
  surface: "#FFFFFF"
  border-hairline: "rgba(13, 11, 8, 0.08)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontWeight: 300
    lineHeight: 1.1
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  none: "0"
  sm: "2px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  "2xl": "64px"
  "3xl": "96px"
  section: "clamp(60px, 8vw, 120px)"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.sm}"
    padding: "16px 48px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ancestral-gold}"
    rounded: "{rounded.sm}"
    padding: "16px 48px"
  button-pill-filter:
    backgroundColor: "transparent"
    textColor: "{colors.warm-neutral-900}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
  card-event:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warm-neutral-900}"
    rounded: "{rounded.md}"
    padding: "32px"
  card-dark-glass:
    backgroundColor: "rgba(13, 11, 8, 0.4)"
    textColor: "{colors.parchment}"
    rounded: "{rounded.sm}"
    padding: "32px"
  input-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warm-neutral-900}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
---

# Design System: T. U. Senhora do Rosário

## Overview

**Creative North Star: "O Santuário Editorial"**

O Sacred Modernism trata o portal como uma publicação impressa de altar: tipografia serifada de revista, espaço generoso, gravidade silenciosa. O visitante deve sentir **acolhimento, mistério e dignidade** — a interface se retira e deixa a casa, suas giras e seus fundamentos falarem.

O sistema nunca deve parecer um site de igreja genérico nem um template SaaS. Nada de gradientes roxo-azul, cards aninhados em cards, ou a mesma geometria arredondada de dashboard: a linguagem aqui é terra, papel, ouro de vela e serifas com peso editorial.

**Key Characteristics:**
- Serifas Cormorant Garamond grandes e leves comandam cada tela; Inter serve a leitura e a ação.
- Fundos quentes: creme parchment de dia, preto noturno de vela nas seções escuras.
- Ouro ancestral como acento ritual e raro; terracota como única voz de ação.
- Superfícies planas com profundidade por vidro jateado e luz, não por sombras.
- Raios mínimos (2px) e bordas-fio de 5–8% de opacidade: elegância silenciosa.

## Colors

A paleta é quente e profunda: terra e papel nos extremos, com terracota e ouro como acentos ritualísticos.

### Primary
- **Terracotta Profundo** (`#8B3A2A`, anchor 600 da rampa Terracotta): a cor de ação do site — botões primários, estados ativos, links de peso. Uso concentrado; sua presença marca os pontos de decisão do visitante.

### Secondary
- **Dourado Ancestral** (`#C9A227`, anchor 500 da rampa Ancestral Gold): acento ritual — bordas que acendem no hover, spotlight de vela, legendas da galeria, ícones sociais. Nunca preenche grandes superfícies.
- **Âmbar das Velas** (`#D4813A`): variação quente do ouro para brilhos e gradientes de luz.

**The Rare Gold Rule.** O dourado é usado com parcimônia ritual — acentos, estados, luz. Nunca como preenchimento dominante de grandes superfícies. Sua raridade é o ponto.

### Neutral
- **Creme Parchment** (`#FAF5EC`): fundo claro padrão das páginas; substitui o branco puro.
- **Preto Noturno** (`#0D0B08`): fundo das seções escuras (Valores, spotlight de vela, glassmorphism).
- **Marrom Quente Escuro** (`#2A2318`): texto principal e superfícies escuras secundárias.
- **Marrom Quente Médio** (`#736754`): texto secundário e legendas.
- **Borda-fio** (`rgba(13,11,8,0.08)` em fundo claro; `white/5` em fundo escuro): divisórias discretas.

### Functional (provisórias)
- **Ember** (`#A33A2B`, anchor 600): erro/crítico — validação de formulários.
- **Sun** (`#C58A16`, anchor 500): aviso.
- **River** (`#2F6473`, anchor 600): informação.

## Typography

**Display Font:** Cormorant Garamond (fallback Georgia, serif)
**Body Font:** Inter (fallback system-ui, sans-serif)

**Character:** A serifa leve e editorial dá a voz da casa; a sans geométrica cuida da leitura funcional sem competir. Nenhuma terceira fonte entra no portal (decisão de performance confirmada).

### Hierarchy
- **Display** (300, tamanhos hero, line-height ~1.1): títulos de hero e chamadas principais; sempre Cormorant.
- **Headline** (500, line-height 1.2): títulos de seção e cards editoriais.
- **Title** (500, ~1.25rem): nomes de eventos e giras em cards.
- **Body** (400, 1rem, line-height 1.6): texto de leitura; largura confortável (65–75ch em blocos editoriais).
- **Label** (500, uppercase, letter-spacing 0.08em): eyebrow labels, categorias, metadados.

**The Two Voices Rule.** Apenas duas famílias tipográficas existem: Cormorant fala pela casa, Inter serve o visitante. Uma terceira fonte é regressão, não variação.

## Layout

Grade estrita de 8px: todos os paddings, gaps e margens são múltiplos de 8 (8/16/24/32/48/64/96px). Padding vertical de seção fluido (`clamp(60px, 8vw, 120px)`). Composições públicas favorecem assimetria editorial (texto + card de imagem vertical com borda offset deslocada) em vez de grids simétricos de SaaS. Header fixo com wrapper de altura reservada (80px) para impedir saltos de layout.

## Elevation & Depth

Sistema essencialmente plano com brilho pontual: sombras são raras e ambientes; a profundidade vem de vidro jateado (`backdrop-blur` sobre `rgba(13,11,8,0.4)`), gradientes de leitura sobre imagens e do spotlight de vela que segue o cursor nas seções escuras.

**The Flat-By-Default Rule.** Superfícies são planas em repouso. Luz e vidro — não drop shadows — criam hierarquia. Qualquer sombra proeminente precisa de justificativa.

## Shapes

Linguagem de cantos contidos: raio fino (2px) como padrão em botões, inputs e cards de vidro; raio médio (6px) nos cards de giras e eventos; `rounded-full` reservado a pílulas de filtro, tags e ícones sociais; `rounded-none` em divisores ultra minimalistas. Bordas sempre finas (5–12% de opacidade).

**The Reserved Circle Rule.** O círculo completo é uma forma especial: só pílulas, tags e avatares o usam. Um card arredondado demais é sinal de template, não de terreiro.

## Components

### Buttons
Refinados e contidos: bordas finas, raio mínimo, elegância silenciosa.
- **Shape:** cantos quase retos (2px).
- **Primary:** terracota profundo sobre texto creme (padding 16px 48px).
- **Hover / Focus:** escurece para o degrau 800 da rampa terracota; transições suaves.
- **Secondary:** contorno dourado sobre fundo transparente; o ouro acende no hover.
- **Estados documentados:** Normal, Hover, Active, Disabled, Loading — ver `/design-system`.

### Chips
- **Style:** pílulas circulares de filtro com contorno fino; selecionada ganha preenchimento quente.

### Cards / Containers
- **Corner Style:** 6px em cards de evento/gira; 2px em cards dark glassmorphism.
- **Background:** branco/parchment nos claros; vidro escuro (`rgba(13,11,8,0.4)` + blur) nas seções noturnas; flyers das giras como imagem de fundo com gradiente vertical de leitura (`black/95 → black/25`).
- **Border:** fio de 5% de opacidade; borda dourada acende no hover nos cards escuros.

### Inputs / Fields
- **Style:** fundo claro, borda-fio, raio 2px, padding 8px 16px.
- **Focus:** borda dourada.
- **Error:** borda e texto auxiliar em Ember.
- **Disabled:** opacidade reduzida, sem interação.

### Navigation
- **Header:** fixo (`fixed top-0`), logo em duas linhas ("T. U." + "Senhora do Rosário" em display serif); wrapper de 80px preserva o fluxo do documento.
- **Footer:** links de navegação completos; ícones sociais circulares que acendem em dourado no hover.

### Candlelight Spotlight (assinatura)
Seções escuras capturam o movimento do mouse e projetam uma luz dourada radial suave, como uma vela seguindo o cursor. É o gesto visual mais reconhecível do sistema — preservá-lo.

### Scroll Reveal
Texto e imagem surgem por deslocamento + opacidade via IntersectionObserver ao rolar; imagens históricas partem em grayscale e ganham cor no hover.

## Do's and Don'ts

### Do:
- **Do** usar o grid de 8px em todo espaçamento (8/16/24/32/48/64/96px).
- **Do** manter Cormorant Garamond para display e Inter para corpo — somente essas duas famílias.
- **Do** reservar o dourado a acentos, estados e luz (The Rare Gold Rule).
- **Do** usar bordas-fio de 5–12% de opacidade para divisórias.
- **Do** usar flyers e fotos reais da casa como imagem de fundo com gradiente de leitura.

### Don't:
- **Don't** criar gradientes roxo-azul, cards aninhados em cards ou qualquer padrão de template SaaS.
- **Don't** usar o dourado como preenchimento de grandes superfícies.
- **Don't** adicionar uma terceira família tipográfica.
- **Don't** aplicar drop shadows proeminentes; superfícies são planas em repouso.
- **Don't** arredondar cards além de 6px; círculos são reservados a pílulas e avatares.
- **Don't** inventar imagens, depoimentos ou dados — apenas conteúdo real fornecido pelo proprietário.
