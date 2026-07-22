import type { Preview } from '@storybook/nextjs-vite'
import '../src/styles/globals.css';
import '../src/styles/dashboard-home.css';
import '../src/styles/portal.css';
import '../src/styles/portal-corporate.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        order: [
          'Visão geral',
          'Fundamentos',
          'Site institucional',
          'Portal',
          ['Acesso', 'Administração', 'Área dos filhos'],
          'Páginas',
        ],
      },
    },
    viewport: {
      options: {
        celular: { name: 'Celular · 390 px', styles: { width: '390px', height: '844px' } },
        tablet: { name: 'Tablet · 768 px', styles: { width: '768px', height: '1024px' } },
        notebook: { name: 'Notebook · 1280 px', styles: { width: '1280px', height: '800px' } },
        desktop: { name: 'Desktop · 1440 px', styles: { width: '1440px', height: '900px' } },
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
      options: {
        rules: {
          'color-contrast': { enabled: true },
        },
      },
    },
    backgrounds: {
      options: {
        portal: { name: 'portal', value: '#f7f7f8' },
        claro: { name: 'claro', value: '#ffffff' },
        escuro: { name: 'escuro', value: '#222328' }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'portal'
    }
  }
};

export default preview;
