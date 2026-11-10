# Terreiro Digital — Perfil de concorrente (quick scan)

**Data da análise:** 2026-11-10
**Fonte:** código-fonte do app (HTML/JS servido em https://terreirodigital.netlify.app/) + telas públicas. Sem dados de SEO (domínio Netlify sem presença orgânica relevante).

## O que é

SaaS multi-tenant de gestão para terreiros de umbanda (PWA, React + Supabase, app de um único desenvolvedor, contato WhatsApp (41) 98859-9264, Instagram @terreirodigitalapp). Não é site institucional — é um aplicativo interno fechado (só tela de login pública) que cada terreiro assina.

## Modelo de negócio

- Teste grátis → assinatura via Asaas (PIX), por número de usuários:
  - Até 20 usuários — R$ 29,90/mês
  - Até 40 — R$ 39,90 | Até 60 — R$ 49,90 | Até 80 — R$ 64,90 | Até 100 — R$ 79,90 | 150+ — R$ 114,90
- Multi-instância: "Cadastrar meu terreiro", busca de terreiros por cidade, admin do app com CRM próprio (leads, metas, vencimentos), modo suporte, indique-e-ganhe (código de indicação).

## Papéis

- Consulente (agenda, calendário, doação)
- Filho / médium
- Administração (acesso total, com permissões extras granulares por seção)
- Hierarquia sacerdotal: Pai/Mãe de Santo, Pai/Mãe Pequeno — filhos vinculados a um dirigente ("Médiuns ativos por Pai/Mãe de Santo", relatório de atraso por dirigente)
- Admin do App (dono do SaaS)

## Módulos (menu do app)

| Módulo | O que faz |
|---|---|
| Início | Dashboard |
| Agenda | Giras, confirmação de presença ("Vou! 🔥" / "Não poderei ir"), público-alvo da gira (filhos/hierarquia) |
| Calendário | Visão mensal, exportar p/ Google Agenda / Apple Calendar |
| Contribuir (Mural) | Lista do que levar na gira ("Vou levar", quantidade) |
| Quem vai levar (Adoções) | Itens adotados por filho |
| Doação | PIX com QR, registro de contribuições |
| Mensalidades | Cobrança gerada pela admin (não pelo filho), isenção, grupos de valor, cobrança avulsa, "cobrar no WhatsApp", relatório de atraso (geral e por dirigente), comprovante |
| Escala (faxina) | Ícone vassoura; escala por data |
| Escala de Cambone | Cambones escalados por gira |
| Pontos Cantados | Biblioteca de pontos de umbanda |
| Regras da Casa | Documentos/PDF internos |
| Biblioteca | Categorias: Elementos, Entidades, Ervas, Estudos, Fundamentos, Preceitos |
| Rifa Online | Rifa com link público de venda (sem login), numeração, sorteio |
| Cantina | Cardápio, caixa (abrir/fechar, troco, sangria, suprimento), estoque, vendas no balcão |
| Atendimento | Distribuição de senhas/fichas da gira: sessões, atendentes e faixas de senha, consulente escolhe senha física |
| Carteirinha | Carteirinha digital do filho |
| Aniversariantes | Aniversários do mês |
| Chat | Mensagens internas |
| Desenvolvimento | Acompanhamento do desenvolvimento mediúnico (relatório do Pai/Mãe de Santo por filho, anotações privadas) |
| Usuários | Cadastro via link ("Link p/ consulente", "Link p/ filho de santo"), níveis de acesso |
| Financeiro | Entradas/saídas, extrato, relatórios, impressão |
| Relatórios | Relatório de membros, atrasos |
| Logs | Auditoria de lançamentos com nome/dia/hora |
| Configurações | Aparência (tema), logo próprio, aceite de Termos/LGPD, push notifications |

## Outros destaques

- **PWA instalável** com push notifications (VAPID) e auto-update por versão.
- **Visitante sem login**: link público onde o visitante vê a agenda e confirma presença sem criar conta.
- **LGPD**: termos de uso + política de privacidade com registro de aceite.
- **Hierarquia espiritual** modelada: orixá de cabeça, data de iniciação, dirigente responsável por cada filho.

## O que NÃO tem

- Site institucional público (a home é só login) — nada de vitrine para atrair simpatizantes, fundamentos, agenda pública com arte.
- Login social (só e-mail/senha).
- Blog/SEO/conteúdo editorial.
