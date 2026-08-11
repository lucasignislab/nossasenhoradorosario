# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dois públicos confirmados, com prioridade explícita nesta ordem:

1. **Visitantes e simpatizantes (prioridade 1):** pessoas que ainda não conhecem a casa. Chegam para entender o que é o terreiro, consultar a agenda de giras e eventos, e dar o primeiro passo para visitar. O site público vem primeiro em qualquer conflito de prioridade.
2. **Filhos da casa (membros):** frequentadores com acesso à Área do Filho — painel, vídeo-aulas e estudos, e controle de mensalidades/financeiro.

## Product Purpose

Portal institucional do T. U. Senhora do Rosário (Terreiro de Umbanda Senhora do Rosário). Apresenta a casa, seus fundamentos e valores, divulga a agenda de giras, festividades, ações sociais e cursos, recebe inscrições (via WhatsApp oficial) e oferece uma área logada para os membros. Sucesso significa novos visitantes conhecendo a casa e comparecendo às giras, e membros bem servidos na área restrita.

## Positioning

É a presença institucional completa da casa num lugar só — agenda, fundamentos, inscrições e área do membro — algo que o Instagram ou o WhatsApp do terreiro, isoladamente, não entregam.

## Operating Context

- Uso público contínuo: consulta de agenda de giras e eventos, leitura de fundamentos (blog), inscrição em eventos com redirecionamento para o WhatsApp oficial do terreiro.
- Uso interno recorrente pelos membros: login, dashboard, aulas e financeiro (Supabase como backend).
- Conteúdo visual real da casa: flyers das giras, fotos históricas da galeria "Momentos da Nossa Casa".
- Deploy via Netlify; desenvolvimento com Next.js (App Router), Storybook e Vitest.

## Capabilities and Constraints

- Site público estático (RSC) com páginas: Home, Agenda, Eventos, Blog/Fundamentos, Sobre, Design System; interatividade pontual em Client Components.
- Área do Filho autenticada: dashboard, aulas, financeiro (Supabase Auth/SSR).
- Formulário de inscrição em eventos formata mensagem e redireciona para o WhatsApp oficial — não há backend próprio de inscrições.
- Idioma: português (Brasil).
- Restrição durável: não inventar depoimentos, números de membros, histórico ou qualquer dado factual — somente conteúdo real fornecido pelo proprietário.

## Brand Commitments

- Nome: "T. U. Senhora do Rosário" (logo em duas linhas: "T. U." pequeno + "Senhora do Rosário" em fonte display).
- Direção estética vinculante: **Sacred Modernism** — paleta vermelho/dourado com tons terrosos escuros, tipografia display, dark glassmorphism, spotlight de vela; tokens OKLCH documentados em `globals.css` e na rota `/design-system`.
- Canais: WhatsApp oficial como canal de inscrições e contato.

## Evidence on Hand

- `DOCUMENTACAO.md` — especificação técnica e de design completa do que está construído.
- `Manual_Boas_Vindas.pdf` — manual institucional da casa (fonte de conteúdo real).
- Flyers das giras e fotos históricas em `public/` e na galeria de eventos.
- **Ausências a não fabricar:** depoimentos, número de membros/frequentadores, datas históricas e quaisquer fatos não fornecidos explicitamente pelo proprietário.

## Product Principles

1. **O site público primeiro:** quando houver conflito, a experiência de quem ainda não conhece a casa prevalece sobre a área interna.
2. **Respeito em cada detalhe:** o tom visual e verbal deve honrar a natureza sagrada e acolhedora da casa — nada de estética genérica de template.
3. **Só verdade:** todo conteúdo factual vem do proprietário; ausência de dado real é preferível a dado inventado.
4. **Um só lar institucional:** tudo que a casa comunica (agenda, fundamentos, inscrições, membros) converge para este portal.
