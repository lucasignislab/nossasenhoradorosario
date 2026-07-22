import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: [
    '../src/stories/**/*.mdx',
    '../src/components/portal/**/*.stories.@(ts|tsx)',
    '../src/components/features/AgendaSection.stories.tsx',
    '../src/components/features/AuthForm.stories.tsx',
    '../src/components/features/LocationContact.stories.tsx',
    '../src/components/features/VideoPlayer.stories.tsx',
    '../src/components/features/event-card.stories.tsx',
    '../src/components/features/blog-card/*.stories.tsx',
    '../src/components/layout/Hero.stories.tsx',
    '../src/components/layout/header/*.stories.ts',
    '../src/components/layout/footer/*.stories.tsx',
    '../src/components/sections/content-section/*.stories.tsx',
    '../src/app/agenda/*.stories.tsx',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  features: {
    componentsManifest: true,
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
};
export default config;
