'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardCheck,
  DoorOpen,
  Home,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import '../../styles/dashboard-layout.css';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  mode?: 'member' | 'admin';
  navigationPrefix?: string;
  previewMode?: boolean;
  user: {
    name: string;
    email: string;
    role?: 'member' | 'admin' | 'developer';
  };
}

const memberMenu = [
  { label: 'Visão geral', path: '', icon: Home },
  { label: 'Agenda interna', path: '/agenda', icon: CalendarDays },
  { label: 'Escala de cuidados', path: '/faxinas', icon: Sparkles },
  { label: 'Minha frequência', path: '/frequencia', icon: ClipboardCheck },
  { label: 'Estudos', path: '/aulas', icon: BookOpen },
  { label: 'Mensalidades', path: '/financeiro', icon: WalletCards },
  { label: 'Avisos', path: '/avisos', icon: Bell },
  { label: 'Meu perfil', path: '/perfil', icon: UserRound },
];

const adminMenu = [
  { label: 'Visão geral', path: '', icon: ChartNoAxesCombined },
  { label: 'Filhos da casa', path: '/membros', icon: UsersRound },
  { label: 'Agenda e giras', path: '/agenda', icon: CalendarDays },
  { label: 'Frequência', path: '/frequencia', icon: ClipboardCheck },
  { label: 'Financeiro', path: '/financeiro', icon: CircleDollarSign },
  { label: 'Conteúdos', path: '/conteudos', icon: BookOpen },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

const roleNames = {
  member: 'Filho da casa',
  admin: 'Administração',
  developer: 'Acesso técnico',
};

export function DashboardLayout({
  children,
  mode = 'member',
  navigationPrefix,
  previewMode = false,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const prefix = navigationPrefix ?? (mode === 'admin' ? '/admin' : '/dashboard');
  const previewRoot = previewMode ? '/portal-preview' : '';
  const menuItems = mode === 'admin' ? adminMenu : memberMenu;

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className={`dashboard-layout dashboard-layout--${mode}`}>
      {sidebarOpen && (
        <button className="dashboard-layout__overlay" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu" />
      )}

      <aside className={`dashboard-layout__sidebar ${sidebarOpen ? 'dashboard-layout__sidebar--open' : ''}`}>
        <div className="dashboard-layout__sidebar-header">
          <Link href="/" className="dashboard-layout__logo" aria-label="Ir para o site">
            <span>Terreiro</span>
            Senhora do Rosário
          </Link>
          <button className="dashboard-layout__close-btn" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={22} />
          </button>
        </div>

        <div className="dashboard-layout__context">
          <span>{mode === 'admin' ? 'Gestão da casa' : 'Comunidade interna'}</span>
          <strong>{mode === 'admin' ? 'Administração' : 'Área dos filhos'}</strong>
        </div>

        <nav className="dashboard-layout__nav" aria-label={mode === 'admin' ? 'Navegação administrativa' : 'Navegação da área dos filhos'}>
          {menuItems.map((item) => {
            const href = `${prefix}${item.path}`;
            const Icon = item.icon;
            const active = item.path === '' ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`dashboard-layout__nav-item ${active ? 'is-active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {mode === 'admin' ? (
          <Link href={`${previewRoot}/dashboard`} className="dashboard-layout__switch-area">
            <Home size={16} />
            Ver minha área
          </Link>
        ) : (user.role === 'admin' || user.role === 'developer') ? (
          <Link href={`${previewRoot}/admin`} className="dashboard-layout__switch-area">
            <Settings size={16} />
            Acessar administração
          </Link>
        ) : null}

        <div className="dashboard-layout__sidebar-footer">
          <div className="dashboard-layout__user">
            <div className="dashboard-layout__user-avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</div>
            <div className="dashboard-layout__user-info">
              <p className="dashboard-layout__user-name">{user.name}</p>
              <p className="dashboard-layout__user-email">{roleNames[user.role ?? 'member']}</p>
            </div>
          </div>
          {previewMode ? (
            <span className="dashboard-layout__preview-label">Modo de demonstração</span>
          ) : (
            <button className="dashboard-layout__logout-btn" onClick={handleLogout} disabled={loggingOut}>
              <DoorOpen size={17} aria-hidden="true" />
              {loggingOut ? 'Saindo...' : 'Sair com segurança'}
            </button>
          )}
        </div>
      </aside>

      <main className="dashboard-layout__main">
        <header className="dashboard-layout__header">
          <button className="dashboard-layout__menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={23} />
          </button>
          <div>
            <p className="dashboard-layout__header-eyebrow">{mode === 'admin' ? 'Gestão e cuidado' : 'Comunidade interna'}</p>
            <h2 className="dashboard-layout__page-title">{mode === 'admin' ? 'Administração' : 'Área dos filhos'}</h2>
          </div>
          {mode === 'admin' && <span className="dashboard-layout__privacy">Acesso reservado</span>}
        </header>
        <div className="dashboard-layout__content">{children}</div>
      </main>
    </div>
  );
}
