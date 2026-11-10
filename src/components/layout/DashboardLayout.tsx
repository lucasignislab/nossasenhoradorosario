'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Command,
  DoorOpen,
  HelpCircle,
  Home,
  IdCard,
  Menu,
  Music2,
  PackageCheck,
  ScrollText,
  Search,
  Settings,
  Sparkles,
  UserRound,
  UserRoundCheck,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { OnboardingTour } from '@/components/features/OnboardingTour';
import { ConsentGate } from '@/components/features/ConsentGate';
import '../../styles/dashboard-layout.css';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  mode?: 'member' | 'admin';
  navigationPrefix?: string;
  previewMode?: boolean;
  user: {
    name: string;
    email: string;
    role?: 'member' | 'admin' | 'developer' | 'editor';
    avatarUrl?: string | null;
    onboarded?: boolean;
    termsAccepted?: boolean;
  };
}

const memberMenu = [
  { label: 'Visão geral', path: '', icon: Home },
  { label: 'Calendário', path: '/agenda', icon: CalendarDays },
  { label: 'Quem vai levar', path: '/levar', icon: PackageCheck },
  { label: 'Escala de cambone', path: '/cambones', icon: UserRoundCheck },
  { label: 'Escala de cuidados', path: '/faxinas', icon: Sparkles },
  { label: 'Minha frequência', path: '/frequencia', icon: ClipboardCheck },
  { label: 'Estudos', path: '/aulas', icon: BookOpen },
  { label: 'Pontos Cantados', path: '/pontos', icon: Music2 },
  { label: 'Regras da Casa', path: '/regras', icon: ScrollText },
  { label: 'Mensalidades', path: '/financeiro', icon: WalletCards },
  { label: 'Avisos', path: '/avisos', icon: Bell },
  { label: 'Carteirinha', path: '/carteirinha', icon: IdCard },
  { label: 'Meu perfil', path: '/perfil', icon: UserRound },
];

const adminMenu = [
  { label: 'Visão geral', path: '', icon: ChartNoAxesCombined },
  { label: 'Filhos da casa', path: '/membros', icon: UsersRound },
  { label: 'Agenda e giras', path: '/agenda', icon: CalendarDays },
  { label: 'Quem vai levar', path: '/mural', icon: PackageCheck },
  { label: 'Cambones', path: '/cambones', icon: UserRoundCheck },
  { label: 'Frequência', path: '/frequencia', icon: ClipboardCheck },
  { label: 'Financeiro', path: '/financeiro', icon: CircleDollarSign },
  { label: 'Conteúdos', path: '/conteudos', icon: BookOpen },
  { label: 'Faxinas', path: '/faxinas', icon: Sparkles },
  { label: 'Avisos', path: '/avisos', icon: Bell },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

const roleNames = {
  member: 'Filho da casa',
  admin: 'Administração',
  developer: 'Acesso técnico',
  editor: 'Comunicação',
};

// O papel editor (comunicação) administra apenas agenda, avisos e conteúdos.
const editorHiddenAdminPaths = ['/membros', '/frequencia', '/financeiro', '/faxinas', '/configuracoes'];

export function DashboardLayout({
  children,
  mode = 'member',
  navigationPrefix,
  previewMode = false,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Tour de boas-vindas: abre sozinho no primeiro acesso de quem está ativo.
  useEffect(() => {
    if (!previewMode && user.onboarded === false) setTourOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const prefix = navigationPrefix ?? (mode === 'admin' ? '/admin' : '/dashboard');
  const previewRoot = previewMode ? '/portal-preview' : '';
  const baseMenu = mode === 'admin' ? adminMenu : memberMenu;
  const menuItems = mode === 'admin' && user.role === 'editor'
    ? baseMenu.filter((item) => !editorHiddenAdminPaths.includes(item.path))
    : baseMenu;
  const currentItem = [...menuItems]
    .reverse()
    .find((item) => item.path === '' ? pathname === prefix : pathname.startsWith(`${prefix}${item.path}`));

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
            <span className="dashboard-layout__logo-mark">SR</span>
            <span className="dashboard-layout__logo-copy">
              <strong>Senhora do Rosário</strong>
              <small>Gestão da comunidade</small>
            </span>
          </Link>
          <button className="dashboard-layout__close-btn" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
            <X size={22} />
          </button>
        </div>

        <div className="dashboard-layout__context">
          <span className="dashboard-layout__context-icon">{mode === 'admin' ? 'GA' : 'AF'}</span>
          <span className="dashboard-layout__context-copy">
            <small>Ambiente atual</small>
            <strong>{mode === 'admin' ? 'Administração' : 'Área dos filhos'}</strong>
          </span>
          <ChevronDown size={14} aria-hidden="true" />
        </div>

        <p className="dashboard-layout__nav-label">Workspace</p>

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
        ) : (user.role === 'admin' || user.role === 'developer' || user.role === 'editor') ? (
          <Link href={`${previewRoot}/admin`} className="dashboard-layout__switch-area">
            <Settings size={16} />
            Acessar administração
          </Link>
        ) : null}

        <div className="dashboard-layout__sidebar-footer">
          <div className="dashboard-layout__user">
            <div className="dashboard-layout__user-avatar" aria-hidden="true">
              {user.avatarUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.avatarUrl} alt="" className="dashboard-layout__user-avatar-img" />
                : user.name.charAt(0).toUpperCase()}
            </div>
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
          <div className="dashboard-layout__breadcrumb">
            <span>{mode === 'admin' ? 'Administração' : 'Área dos filhos'}</span>
            <span>/</span>
            <strong>{currentItem?.label ?? 'Visão geral'}</strong>
          </div>
          <button className="dashboard-layout__search" type="button">
            <Search size={15} aria-hidden="true" />
            <span>Buscar no sistema...</span>
            <kbd><Command size={11} /> K</kbd>
          </button>
          <div className="dashboard-layout__header-actions">
            {previewMode && <span className="dashboard-layout__environment"><i /> Ambiente de teste</span>}
            <button type="button" aria-label="Rever o tour de boas-vindas" onClick={() => setTourOpen(true)}><HelpCircle size={17} /></button>
            <button type="button" aria-label="Notificações"><Bell size={17} /><i /></button>
            <button className="dashboard-layout__header-user" type="button" aria-label="Abrir menu da conta">
              {user.avatarUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.avatarUrl} alt="" className="dashboard-layout__user-avatar-img" />
                : user.name.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>
        <div className="dashboard-layout__content">{children}</div>
      </main>
      <OnboardingTour role={user.role ?? 'member'} open={tourOpen} onClose={() => setTourOpen(false)} />
      {!previewMode && user.termsAccepted === false ? <ConsentGate /> : null}
    </div>
  );
}
