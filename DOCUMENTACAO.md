# Documentação Técnica: Terreiro de Umbanda Senhora do Rosário

Esta documentação detalha a arquitetura de software, as tecnologias empregadas, as estruturas de design e a especificação de tudo o que foi construído no projeto do portal do **T. U. Senhora do Rosário (Terreiro de Umbanda Senhora do Rosário)**.

---

## 1. Tecnologias Utilizadas

O projeto foi construído utilizando um ecossistema moderno voltado para performance, SEO e fidelidade de design (Sacred Modernism):

*   **Next.js 16.1 (App Router):** Framework React principal. Escolhido pelo suporte nativo a React Server Components (RSC) para carregamento estático veloz e indexação SEO, além de roteamento simplificado por pastas.
*   **React 19:** Biblioteca base de construção de interfaces. Utiliza os novos recursos de concorrência e gerenciamento de estado client-side.
*   **Tailwind CSS v4:** Framework CSS utilitário de última geração. Utiliza o novo motor compilado que substitui o PostCSS tradicional e provê suporte nativo a variáveis CSS e recursos avançados de cor, como o espaço OKLCH.
*   **TypeScript:** Tipagem estática em toda a base de código, garantindo a integridade dos contratos de dados (como as props de eventos e cards) e prevenindo erros em tempo de compilação.
*   **Lucide React:** Pacote de ícones vetoriais leves e consistentes com a estética minimalista do site.
*   **Storybook:** Ambiente isolado para desenvolvimento e teste visual dos componentes (como `AgendaSection` e `EventCard`).
*   **Vitest:** Framework de testes unitários rápidos integrado ao ambiente de execução do projeto.

---

## 2. Arquitetura do Projeto

O site segue uma arquitetura orientada ao App Router do Next.js com forte separação entre a lógica de renderização de servidor e cliente.

### Estrutura de Diretórios

```
├── .agent/                    # Scripts utilitários de IA, checklists e relatórios
├── .storybook/                # Configuração do ambiente isolado de Storybook
├── public/                    # Arquivos estáticos (vídeos, imagens locais, manifestos)
├── src/
│   ├── app/                   # Roteamento e Páginas (Next.js App Router)
│   │   ├── (auth)/            # Grupo de rotas autenticadas (Área do Filho)
│   │   │   ├── dashboard/     # Painel de controle do membro
│   │   │   │   ├── aulas/     # Vídeo-aulas e estudos
│   │   │   │   └── financeiro/# Controle de mensalidades
│   │   ├── agenda/            # Página de Agenda de Giras (/agenda)
│   │   ├── blog/              # Página de Fundamentos e Artigos (/blog)
│   │   ├── design-system/     # Documentação viva do Design System (/design-system)
│   │   ├── eventos/           # Página de Eventos e Ações Sociais (/eventos)
│   │   ├── login/             # Página de login (/login)
│   │   ├── sobre/             # Página institucional Sobre Nós (/sobre)
│   │   ├── layout.tsx         # Layout base global (carregamento de fontes e cabeçalhos)
│   │   └── page.tsx           # Página Inicial (Home)
│   ├── components/            # Componentes reutilizáveis
│   │   ├── features/          # Componentes focados em features/dados (Agenda, Eventos, Form)
│   │   ├── layout/            # Estruturas globais (Header, Footer, Hero)
│   │   ├── sections/          # Seções compostas da página (ContentSection, ValuesSection)
│   │   └── ui/                # Componentes básicos primitivos (Tabs, Buttons)
│   └── styles/                # Estilos CSS Globais e Tematização
│       ├── globals.css        # Configurações do Tailwind v4 e variáveis de design
│       └── theme.css          # Animações personalizadas (como fade-rise)
```

### Padrão de Renderização: RSC vs RCC

Para otimizar o tempo de carregamento e o SEO, o projeto é renderizado como estático por padrão. A interatividade é delegada cirurgicamente a Client Components (`'use client'`) nos pontos de contato do usuário:

1.  **React Server Components (RSC):** As páginas estruturais (`src/app/page.tsx`, `sobre/page.tsx` e `blog/page.tsx`) são Server Components. Elas são renderizadas no servidor e geradas como HTML estático no build, eliminando o peso de execução de JavaScript no carregamento inicial.
2.  **React Client Components (RCC):** Componentes dinâmicos como o `Header` (menu mobile expansível), a página `/eventos` (filtros, modais e formulários), a página `/agenda` (tabs interativas), e a Área do Filho (`/login` e `/dashboard`) utilizam `'use client'`. 
    *   *Nota de Engenharia:* A Área do Filho (Dashboard, Aulas, Financeiro) foi explicitamente convertida para Client Components para evitar erros de pré-renderização estática do Next.js ao lidar com hooks de estado ou chamadas do navegador que não estão disponíveis no servidor durante a compilação.

---

## 3. Detalhamento de Páginas e Componentes

### 3.1. Cabeçalho (Header) & Rodapé (Footer)
*   **Header (`Header.tsx`):**
    *   **Fixação Inabalável (Fixed):** O cabeçalho foi refatorado de `sticky` para `fixed top-0 left-0 w-full z-50`. Isso supera o bug clássico do CSS onde elementos `sticky` falham silenciosamente quando um elemento ancestral possui `overflow-x-hidden` (propriedade usada em nossas páginas para conter as animações de scroll).
    *   **Wrapper anti-salto:** O componente `<header>` é envolto por um `div` relativo com altura fixa `h-20` (80px) que permanece no fluxo do documento. Isso empurra o conteúdo da página de forma nativa e evita que o topo das Hero Sections fique escondido embaixo da barra do menu.
    *   **Tipografia do Logo:** Nome estruturado em duas linhas: pequeno "T. U." em caixa alta e grande "Senhora do Rosário" na fonte display.
*   **Footer (`footer.tsx`):**
    *   Alinhado à tipografia do site. Apresenta links de navegação para todas as rotas e botões de redes sociais circulares minimalistas que se acendem em dourado ao passar o mouse.

### 3.2. Página Inicial (Home)
Construída com base em seções de alto impacto sensorial e micro-interações:
*   **Cinematic Hero (`Hero.tsx` & `hero.css`):**
    *   **Loop de Vídeo Otimizado:** Renderiza um vídeo em tela cheia rodando em segundo plano (`loop`, `muted`, `playsInline`).
    *   **Gestão de Opacidade de Frame:** Utiliza uma rotina de `requestAnimationFrame` que gerencia a opacidade de `0` a `1` nos primeiros 500ms e desvanece de `1` a `0` nos últimos 500ms do loop de vídeo, evitando flashes pretos ou quebras de renderização abruptas que ocorrem em vídeos padrão de navegadores.
    *   **Overlay Protetor:** Sobreposição escura de 35% que garante o contraste perfeito para a legibilidade do texto branco e botões.
*   **Seção "A Nossa Casa" (`ContentSection`):**
    *   **Asimetria Visual:** Disposição de grade assimétrica dividida entre texto editorial e um card de imagem vertical com borda offset deslocada.
    *   **Hover Grayscale-to-Color:** A imagem inicia em tons de cinza (`grayscale contrast-110`) e ganha cores naturais de forma ultra suave (`transition-all duration-700`) no hover.
    *   **Scroll Reveal:** Acionado via `IntersectionObserver` nativo do React, fazendo com que o texto e a imagem surjam com efeito de deslocamento e opacidade ao rolar a página.
*   **Valores e Fundamentos (`ValuesSection`):**
    *   **Candlelight Spotlight (Spotlight de Vela):** Seção escura que captura os movimentos do mouse (`onMouseMove`) e projeta uma luz dourada radial suave e focada que simula o brilho de uma vela acesa seguindo o cursor do usuário.
    *   **Dark Glassmorphism:** Os cards de fundamentos são placas de vidro jateado translúcido (`bg-[#0D0B08]/40 backdrop-blur-lg border-white/5`) com micro-animações de flutuação dos ícones e acendimento de borda dourada ao passar o mouse.
*   **Agenda do Mês (`AgendaSection` & `EventCard`):**
    *   **Flyers de Fundo:** Os cards de giras exibem as artes dos flyers como imagens de fundo em tela cheia.
    *   **Gradiente Vertical de Leitura:** Sobreposição de gradiente escuro profundo (`from-black/95 via-black/50 to-black/25`) que assegura a legibilidade do texto branco sobreposto ao flyer artístico.
    *   **Redirecionamento Inteligente:** Se o card ou o botão "Ver Todas as Giras" for clicado na Home, o componente Client intercepta e redireciona o usuário de forma limpa para a página principal de Giras (`/agenda`), respeitando o fluxo do Next.js Server Components.

### 3.3. Página de Eventos
Página dedicada a festividades e ações sociais, rica em funcionalidades interativas:
*   **Filtros de Categoria:** Botões de pílula que filtram dinamicamente a grade de eventos ("Todos", "Festividades", "Ações Sociais", "Cursos & Doutrina") disparando uma animação de desfoque suave (`blur-md` para `blur-none`) e fade-in no grid.
*   **Modal de Detalhes e Inscrição em Etapas:**
    *   Ao clicar no card do evento, abre-se um modal expansível com efeito blur no fundo da página.
    *   **Etapa 1:** Apresentação do flyer estendido, dados de horário/local e descrição longa do evento.
    *   **Etapa 2 (Formulário Integrado):** Ao clicar em "Me Inscrever", a interface do modal muda dinamicamente para um formulário de inscrição (Nome, WhatsApp, Observações). Ao submeter, o site formata os dados e redireciona o usuário para o WhatsApp oficial do Terreiro com a mensagem pronta de solicitação de vaga.
*   **Galeria de Memórias ("Momentos da Nossa Casa"):**
    *   Grid de fotos históricas em escala de cinza que ganham cor e sofrem um zoom lento no hover, revelando uma legenda em dourado.
    *   **Visualizador Lightbox:** Clicar na imagem abre uma visualização ampliada e centralizada na tela sobre um fundo desfocado.
*   **FAQ Colapsável (Acordeão):**
    *   Sanfonas minimalistas para dúvidas comuns sobre o terreiro.
    *   Utiliza transições suaves de altura máxima (`max-h-0` para `max-h-96`) e rotação de 180° no indicador de abertura.

### 3.4. Rota do Design System (`src/app/design-system/page.tsx`)
Uma página de documentação viva construída para servir de guia de referência visual e técnica:
*   **Sumário Fixo (Sidebar):** Menu lateral que acompanha o scroll no desktop e guia o usuário pelas seções.
*   **Escalas OKLCH (100 a 900):** Apresentação matemática detalhada de tons para as 4 cores base do site. Cada shade possui botões de cópia rápida para HEX e OKLCH.
*   **Showcase Interativo de Estados:**
    *   **Botões:** Renderização física de variantes (Primário Red, Secundário Gold Outlined, Dark Glassmorphism) simulando os estados Normal, Hover, Active (pressionado), Disabled (desabilitado) e Loading (com spinner animado).
    *   **Inputs:** Inputs reais renderizados nos estados de Foco (borda dourada), Erro (borda vermelha e texto auxiliar) e Desabilitado.
*   **Snippets Copiáveis:** Painéis de código colapsáveis contendo o código exato em React e Tailwind CSS para cada elemento do sistema, facilitando a replicação rápida.

---

## 4. Especificações do Design System (Tokens)

O sistema visual é regido pelas variáveis e padrões declarados em `globals.css`:

### 4.1. Escala de Cores Base

A paleta de cores do *Sacred Modernism* baseia-se em tons quentes e profundos:

| Token CSS | Cor Representada | Valor HEX Base | OKLCH Correspondente |
| :--- | :--- | :--- | :--- |
| `--color-sacred-red` | Terracota Profundo | `#8B3A2A` | `oklch(0.38 0.15 28)` |
| `--color-sacred-gold` | Dourado Ancestral | `#C9A227` | `oklch(0.72 0.17 84)` |
| `--color-cream` | Creme Off-white | `#FAF5EC` | `oklch(0.97 0.015 85)` |
| `--color-dark` | Preto Noturno | `#0D0B08` | `oklch(0.12 0.01 70)` |
| `--color-dark-muted` | Marrom Escuro | `#2A2318` | `oklch(0.24 0.035 75)` |

### 4.2. Tipografia

Consistente em todo o site, sem adição de fontes extras para proteger o carregamento do portal (Opção A):

*   **Títulos e Chamadas (Heading):** `Cormorant Garamond` (Serif Display).
    *   *Classe CSS:* `font-[var(--font-heading)]` ou `font-serif`
*   **Leitura, Botões e Inputs (Body):** `Inter` (Sans-serif Geométrica).
    *   *Classe CSS:* `font-[var(--font-body)]` ou `font-sans`

### 4.3. Espaçamento (Grid de 8px)

Margens, paddings e gaps são estritamente múltiplos de 8px:

*   **8px** (`w-2`/`h-2` / `p-2`): Paddings internos de campos e formulários.
*   **16px** (`w-4`/`h-4` / `p-4`): Gaps entre elementos secundários e botões simples.
*   **24px** (`w-6`/`h-6` / `p-6`): Espaçamento em grids responsivos de cards.
*   **32px** (`w-8`/`h-8` / `p-8`): Padding padrão de cards e caixas de texto.
*   **48px** (`w-12`/`h-12` / `p-12`): Paddings de seções em telas mobile.
*   **64px** (`w-16`/`h-16` / `p-16`): Margem de segurança de títulos e separadores.
*   **96px** (`w-24`/`h-24` / `p-24`): Padding vertical padrão de seções no desktop.

### 4.4. Bordas e Raios (Border Radius)

*   **Reto / Sem Radius (`rounded-none`):** Usado em divisores e estruturas de layout ultra minimalistas.
*   **Fino (`rounded-sm` / 2px):** Padrão do site. Aplicado em **botões, campos de entrada (inputs) e cards dark glassmorphism**.
*   **Médio (`rounded-md` / 6px):** Aplicado nos cards normais de Giras e Eventos.
*   **Circular (`rounded-full`):** Reservado para botões secundários de pílulas de categorias, tags de filtros e botões de redes sociais no rodapé.
*   **Borda Fina Padrão:** As bordas limitadoras utilizam `border-black/5` (em fundo claro) ou `border-white/5` (em fundo escuro), assegurando que as linhas divisórias sejam elegantes e discretas.
