import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LocationSection } from './location-section';

const meta: Meta<typeof LocationSection> = {
  title: 'Sections/LocationSection',
  component: LocationSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof LocationSection>;

export const Default: Story = {};
