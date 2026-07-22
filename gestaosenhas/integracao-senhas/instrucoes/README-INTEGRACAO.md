# Guia de Integração — Módulo de Gestão de Senhas

Este guia descreve como integrar o Sistema de Gestão de Senhas ao projeto existente do **Terreiro de Umbanda Senhora do Rosário**.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Instalação da Dependência](#2-instalação-da-dependência-zustand)
3. [Copiar Arquivos](#3-copiar-arquivos-para-o-projeto)
4. [Atualizar Header](#4-atualizar-o-header)
5. [Adicionar CSS](#5-adicionar-css-customizado)
6. [Verificação Final](#6-verificação-final)
7. [Rotas Criadas](#7-rotas-criadas)

---

## 1. Pré-requisitos

- Projeto rodando localmente (`npm run dev`)
- Acesso ao código fonte
- Sem alterações não commitadas no Git (recomendado)

---

## 2. Instalação da Dependência (Zustand)

```bash
npm install zustand
```

---

## 3. Copiar Arquivos para o Projeto

### 3.1 Tipos TypeScript

```bash
mkdir -p src/types
cp types/senhas.ts src/types/senhas.ts
```

### 3.2 Store Zustand

```bash
mkdir -p src/store
cp store/useSenhaStore.ts src/store/useSenhaStore.ts
```

### 3.3 Componentes

```bash
mkdir -p src/components/senhas
cp components/senhas/*.tsx src/components/senhas/
```

### 3.4 Páginas (App Router)

```bash
mkdir -p src/app/senhas
mkdir -p "src/app/(auth)/dashboard/senhas"
cp pages/senhas/page.tsx src/app/senhas/page.tsx
cp pages/dashboard-senhas/page.tsx "src/app/(auth)/dashboard/senhas/page.tsx"
cp pages/dashboard-senhas/layout.tsx "src/app/(auth)/dashboard/senhas/layout.tsx"
```

---

## 4. Atualizar o Header

Edite `src/components/layout/header/Header.tsx` e adicione ao array `navLinks`:

```tsx
const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre Nós' },
  { href: '/agenda', label: 'Giras' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/senhas', label: 'Atendimento' },  // <-- NOVO
  { href: '/blog', label: 'Blog' },
  { href: '/design-system', label: 'Design System' },
];
```

---

## 5. Adicionar CSS Customizado

Edite `src/styles/globals.css` e adicione no final do arquivo (após o `@layer base`):

```css
/* ============================================
   ANIMAÇÕES DO MÓDULO DE SENHAS
   ============================================ */

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(201, 162, 39, 0); }
}

@keyframes ticket-print {
  0% { transform: translateY(-20px); opacity: 0; }
  60% { transform: translateY(4px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}

.animate-pulse-gold {
  animation: pulse-gold 2s ease-in-out infinite;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--color-dark);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-dark-muted);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-sacred-gold);
}
```

---

## 6. Verificação Final

### Estrutura esperada:

```
src/
├── types/
│   └── senhas.ts
├── store/
│   └── useSenhaStore.ts
├── components/
│   └── senhas/
│       ├── DisplaySenha.tsx
│       ├── PainelControle.tsx
│       ├── FormularioSenha.tsx
│       ├── Estatisticas.tsx
│       └── HistoricoAtendimentos.tsx
└── app/
    ├── senhas/
    │   └── page.tsx          ← /senhas (pública)
    └── (auth)/
        └── dashboard/
            └── senhas/
                ├── page.tsx  ← /dashboard/senhas (admin)
                └── layout.tsx
```

### Inicie o servidor:

```bash
npm run dev
```

### Teste as rotas:

| Rota | O que testar |
|---|---|
| `http://localhost:3000/senhas` | Página pública da fila |
| `http://localhost:3000/dashboard/senhas` | Painel administrativo |

### Funcionalidades para testar:

1. **Gerar senha** — preencha o formulário e clique "Gerar Senha"
2. **Chamar próxima** — clique "Chamar Próxima"
3. **Chamar por voz** — clique no botão de voz
4. **Finalizar** — encerre o atendimento
5. **Ver histórico** — aba "Histórico"
6. **Ver estatísticas** — aba "Estatísticas"
7. **Persistência** — recarregue a página, dados permanecem

---

## 7. Rotas Criadas

| Rota | Acesso | Função |
|---|---|---|
| `/senhas` | Público | Display da senha atual para consulentes |
| `/dashboard/senhas` | Autenticado | Painel completo de gestão |

---

## Resolução de Problemas

### "Cannot find module '@/store/useSenhaStore'"

Verifique o `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### "Cannot find module 'zustand'"

```bash
npm install zustand
```

### Dados não persistem

O Zustand usa `localStorage`. Verifique se o navegador não está no modo anônimo.

---

## Design System Aplicado

Todos os componentes seguem o **Orixá Design System**:

- **Botões:** `bg-[#8B3A2A]` primário, `font-inter text-xs uppercase tracking-widest rounded-sm`
- **Inputs:** `border-black/10 bg-white/70 rounded-sm focus:border-[#C9A227]/50`
- **Labels:** `text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-inter`
- **Cards claros:** `bg-white rounded-md border border-black/5 shadow-sm`
- **Cards escuros (glass):** `bg-[#0D0B08]/40 backdrop-blur-lg border border-white/5`
- **Tipografia:** Cormorant Garamond (títulos) + Inter (corpo)
- **Cores:** Sacred Red `#8B3A2A`, Sacred Gold `#C9A227`, Cream `#FAF5EC`, Dark `#0D0B08`
