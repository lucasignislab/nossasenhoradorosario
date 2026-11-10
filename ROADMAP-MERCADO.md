# Roadmap de produtização — Portal do Terreiro (SaaS)

**Data:** 2026-11-10 · **Base:** perfil do concorrente Terreiro Digital (`competitor-profiles/terreirodigital.md`) vs. nosso app.
**Meta:** lançar no mercado como produto completo para terreiros de umbanda.

## 1. O que já temos — e onde já somos melhores

| Área | Nosso app | Concorrente |
|---|---|---|
| Site institucional público | ✅ completo (agenda, fundamentos, inscrições) — vitrine para atrair simpatizantes | ❌ só tela de login |
| Login social | ✅ Google (e e-mail/senha) | ❌ só e-mail/senha |
| Onboarding | ✅ tour guiado por perfil | ❌ |
| Agenda/giras | ✅ arte do Instagram sem corte, "Pretendo ir", frequência automática no dia | ✅ básico |
| Calendário | ✅ grade mensal + feed ICS (Google/Apple) | ✅ equivalente |
| Quem vai levar | ✅ cobertura por item e progresso | ✅ básico |
| Mensalidades | ✅ filho registra valor (R$ 70–100), Pix, comprovante, entra no financeiro | ✅ (cobrança gerada pela admin) |
| Escalas | ✅ faxina (7–9/equipe) + cambone com confirmação | ✅ |
| Pontos cantados | ✅ árvore de pastas livre + PDF | ✅ biblioteca simples |
| Estudos/Biblioteca | ✅ módulos, progresso, PDF das Iyás | ✅ por categorias fixas |
| Ficha do filho | ✅ completa + foto + ficha espiritual | ✅ sem foto |
| Financeiro | ✅ fundo, despesas, doações, mensalidades | ✅ + extrato/impressão |
| Avisos | ✅ | ✅ |

## 2. O que falta — priorizado para lançar no mercado

### P0 — obrigatório para vender como SaaS (multi-terreiro)

1. **Multi-tenancy** — cada terreiro com seu espaço isolado (tabela `tenants` + `tenant_id` em todas as tabelas, cadastro "Criar meu terreiro", subdomínio ou slug). *Maior mudança estrutural; quanto antes, mais barato.*
2. **Assinatura e cobrança** — trial grátis + planos por número de filhos (Asaas/Stripe Pix), painel de vencimento.
3. **LGPD** — termos de uso + política de privacidade com aceite registrado no cadastro.
4. **PWA instalável + push notifications** — app na tela inicial do celular, aviso de gira/escala.

### P1 — valor percebido imediato (rápidos de construir sobre o que já existe)

5. **Carteirinha digital do filho** — com a foto que já temos, nome, ficha espiritual e QR de identificação.
6. **Aniversariantes do mês** — precisa de `birth_date` na ficha; card na visão geral.
7. **Doação com QR Pix** — página pública de doação (sympathizers) + registro interno.
8. **Regras da Casa** — documentos internos; reusa a estrutura de pastas/PDF dos pontos cantados.
9. **Hierarquia sacerdotal** — campo "dirigente responsável" (Pai/Mãe Pequeno) por filho + relatórios por dirigente.
10. **Visitante sem login** — link público da agenda com confirmação de presença (funil de novos simpatizantes; conecta com o site público, nosso diferencial).

### P2 — operação completa da gira

11. **Atendimento** — distribuição de senhas/fichas da gira (sessões, faixas, atendentes).
12. **Cantina** — cardápio, caixa (abrir/fechar, sangria), estoque, vendas no balcão.
13. **Rifa online** — link público de venda sem login, numeração, sorteio.
14. **Relatórios e logs** — auditoria de lançamentos (nome/dia/hora), relatório de membros e atrasos.
15. **Chat interno** — mensagens entre membros (ou mural de recados como versão 1).
16. **Desenvolvimento mediúnico** — anotações privadas do dirigente por filho, acompanhamento.
17. **Papel Consulente** — agenda pública + doação, sem acesso ao interno.

## 3. Sugestão de ordem de execução

- **Agora (ainda single-tenant):** P1 itens 5–8 (carteirinha, aniversariantes, doação QR, regras da casa) — alto valor, baixo custo, usam estruturas prontas.
- **Em seguida:** P0 itens 3–4 (LGPD + PWA) — independentes de arquitetura.
- **Depois:** P0 itens 1–2 (multi-tenancy + assinatura) — virada de produto.
- **Por fim:** P2 conforme demanda dos primeiros terreiros clientes.
