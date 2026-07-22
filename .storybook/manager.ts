import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'Senhora do Rosário · Design System',
  brandUrl: '/?path=/docs/visão-geral-introdução--docs',
  colorPrimary: '#356fc1',
  colorSecondary: '#c9a227',
  appBg: '#f5f6f8',
  appContentBg: '#ffffff',
  appPreviewBg: '#f7f7f8',
  appBorderColor: '#e3e4e7',
  appBorderRadius: 8,
  textColor: '#222328',
  textMutedColor: '#666a73',
  barBg: '#ffffff',
  barTextColor: '#666a73',
  barSelectedColor: '#356fc1',
  inputBg: '#ffffff',
  inputBorder: '#d5d7db',
  inputTextColor: '#222328',
  inputBorderRadius: 6,
  fontBase: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
});

addons.setConfig({
  theme,
  sidebar: { showRoots: true },
  toolbar: { title: { hidden: false } },
});
