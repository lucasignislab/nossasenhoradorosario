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

---

## 5. Portal conectado ao Supabase

### 5.1. Gestão de membros (`/admin/membros`)

*   Administração aprova, reprova (suspende), suspende e reativa cadastros da tabela `profiles` via server actions (`src/app/(auth)/admin/membros/actions.ts`). Nenhuma ação exclui usuários do Auth.
*   A aprovação já define o papel: **Aprovar** (filho da casa) ou **Aprovar como comunicação** (editor). Cadastros ativos alternam entre os dois papéis direto na lista de membros (botão *Tornar comunicação* / *Tornar filho da casa*, com confirmação), sem SQL. A troca nunca atinge admin/developer e ninguém altera o próprio papel.
*   A listagem, a busca por nome e as contagens (ativos, aguardando, administração) são dados reais; a visão geral (`/admin`) mostra as contagens de filhos ativos e cadastros pendentes.

### 5.2. Agenda e giras (tabelas `events` e `event_confirmations`)

*   **`events`**: giras, festividades, ações sociais e cursos (`category`), com data, horário, local, entidade, descrição, flyer (`image_url`) e `status` (`confirmada`/`cancelada`). Migration: `supabase/migrations/202609070002_events.sql`.
*   **RLS:** eventos confirmados têm leitura pública (Home e `/agenda`); criar, editar, cancelar e excluir exige administração (`is_administrator()`). Cancelamento é reversível (mudança de status); exclusão remove o evento e suas confirmações (cascade).
*   **`event_confirmations`**: presença dos filhos, uma por pessoa por evento (`unique(event_id, profile_id)`). Cada filho confirma/cancela apenas a própria presença em `/dashboard/agenda`; a administração pode consultar todas.
*   **Fluxos:** `/admin/agenda` (CRUD com `EventForm`), `/dashboard/agenda` (confirmação de presença), `/agenda` e Home (próximos eventos confirmados, com estado vazio em caso de falha — sem mocks).

### 5.3. Financeiro (tabela `finance_entries`)

*   Lançamentos de entrada (mensalidade, doação, evento, outros) e saída (aluguel, água, energia, material, evento, outros), com valores em centavos (`amount_cents`). Migration: `supabase/migrations/202609070003_finance.sql`.
*   **RLS:** administração tem acesso total; cada filho visualiza apenas os próprios lançamentos (`profile_id`), preenchido quando a entrada é uma mensalidade vinculada.
*   **Admin (`/admin/financeiro`):** métricas do mês (entradas, saídas, mensalidades, saldo), gráfico de fluxo dos últimos 6 meses (`FinanceTrendChart` recebe dados reais), despesas por categoria e tabela de movimentações com criar/editar/excluir (`FinanceEntryForm`) e exportação CSV gerada no navegador.
*   **Filho (`/dashboard/financeiro`):** situação do mês corrente (Em dia / Aguardando contribuição), resumo do ano e histórico das próprias contribuições. Somente leitura.

### 5.4. Frequência (tabela `attendance`)

*   Presença por atividade: uma linha por pessoa por evento (`unique(event_id, profile_id)`), com `present`, `justified` (falta justificada — só vale com `present = false`) e `marked_by`. Migration: `supabase/migrations/202609070004_attendance.sql`.
*   **RLS:** administração tem acesso total; cada filho visualiza apenas os próprios registros.
*   **Admin (`/admin/frequencia`):** chamada por atividade (`AttendanceSheet`) — escolhe o evento, marca Presente/Faltou/Justificada por filho e salva em lote (upsert). Painel com frequência geral, presenças no mês, justificadas, barras de presença das últimas 6 atividades com chamada e tabela de % individual com leitura de acompanhamento.
*   **Filho (`/dashboard/frequencia`):** métricas pessoais (presença %, presenças, justificadas, faltas) e histórico com status por atividade. Somente leitura.

### 5.5. Avisos e conteúdos de estudo (tabelas `notices`, `contents`, `content_progress`)

*   **`notices`**: comunicados da casa com categoria (geral, espiritual, operacional, evento) e destaque (`pinned`). Avisos fixados aparecem primeiro em todos os lugares. Migration: `supabase/migrations/202609070005_notices_contents.sql`.
*   **`contents`**: biblioteca de estudos — links externos (YouTube, Drive etc.) com tipo (vídeo/artigo/documento), módulo (percurso), duração e rascunho/publicado.
*   **`content_progress`**: conclusão pessoal por conteúdo (`unique(content_id, profile_id)`); cada filho marca/desfaz apenas o próprio progresso.
*   **RLS:** nova função `is_active_member()` (membro autenticado ativo) protege a leitura de avisos e de conteúdos publicados; escrita e rascunhos são exclusivos da administração.
*   **Fluxos:** `/admin/avisos` (CRUD de comunicados, novo item no menu de administração), `/admin/conteudos` (CRUD com publicar/despublicar), `/dashboard/avisos` (lista com data relativa em pt-BR), `/dashboard/aulas` (percursos por módulo com barra de progresso e "Marcar como concluído").

### 5.6. Cuidados da casa — escala por data (tabelas `cleaning_shift_dates`, `cleaning_shift_months`, `cleaning_shift_signups`)

*   **Modelo novo (substitui as equipes fixas):** dias de cuidado em TODAS as quintas-feiras do mês + um sábado (por padrão o último; a administração pode ajustar por mês). Cada data tem equipe de no mínimo 7 e no máximo 9 pessoas. Migration: `supabase/migrations/202609070010_cleaning_shifts.sql`. As tabelas antigas (`chore_teams`, `chore_team_members`, `chore_schedules`, migration 006) seguem no banco, mas não são mais usadas pelas telas.
*   **Geração das datas:** função `ensure_cleaning_shift_dates()` (security definer, idempotente) chamada ao abrir `/dashboard/faxinas` ou `/admin/faxinas` — cria as datas do mês atual e do próximo, respeitando o sábado ajustado em `cleaning_shift_months`.
*   **Inscrição:** qualquer cadastro ativo (filho, comunicação, administração) se inscreve e cancela sozinho. Máximo de 9 por data travado na action **e** em trigger (`enforce_cleaning_shift_capacity`, com lock na linha da data). Datas com menos de 7 mostram "Faltam N pessoas" para todos; completas mostram "Completa"; lotadas, "Lotada".
*   **RLS:** leitura de datas e inscrições para membros ativos (`is_active_member()`); inscrição/cancelamento apenas do próprio perfil; ajuste de sábado e remoção de inscritos exclusivos da administração.
*   **Admin (`/admin/faxinas`):** lista as próximas datas com contagem, StatusPill, nomes dos inscritos (com botão para remover inscrição) e o seletor de sábado do mês em cada cartão de sábado.
*   **Filho (`/dashboard/faxinas`):** cartões por data com contagem, barra de vagas e botão "Quero participar" / "Cancelar participação" — sem SQL e sem depender da administração.

### 5.7. Visões gerais e limpeza final

*   **`/admin` (visão geral):** 100% dados reais — filhos ativos e pendentes (com nomes e datas), próximas atividades confirmadas, avisos fixados e resumo financeiro do mês (entradas/saídas/saldo).
*   **`/dashboard` (home do filho):** mantém os cartões de serviços e ganha um resumo real no topo — próxima atividade (com estado de confirmação), próxima data de cuidado em que a pessoa está inscrita, situação da mensalidade do mês e os 3 últimos avisos.
*   **`/admin/configuracoes`:** contagens reais de papéis (admins, desenvolvedores, membros ativos) e de cadastros pendentes.
*   **Login:** a página de acesso não anuncia mais a prévia demonstrativa; o `portal-preview` continua disponível apenas com `NEXT_PUBLIC_PORTAL_PREVIEW=true` no ambiente (ver `.env.example`) e serve os mocks de fallback das views.
*   Componente morto `LoginForm` removido (substituído pelo `AuthForm`).

### 5.8. Papel de comunicação (`editor`)

*   Novo valor `editor` no enum `app_role` (migration `supabase/migrations/202609070008_editor_role.sql`). Pensado para quem cuida das redes sociais da casa (ex.: Instagram).
*   **Pode:** visão geral, agenda (`/admin/agenda`), avisos (`/admin/avisos`) e conteúdos (`/admin/conteudos`) — as políticas de escrita de `events`, `notices` e `contents` agora usam a nova função `public.is_content_manager()` (admin, developer ou editor ativo).
*   **Não pode:** membros, financeiro, frequência, faxinas e configurações — essas páginas redirecionam editores para `/admin/agenda` (guarda `redirectEditorsAway()`), o menu omite esses itens e as tabelas seguem protegidas por `is_administrator()`.
*   Na visão geral, editores não veem os painéis de cadastros pendentes nem o resumo financeiro — no lugar, um painel neutro descreve o escopo do acesso.
*   A promoção a editor é feita via SQL pela administração (ver seção de ativação no README do Supabase).
