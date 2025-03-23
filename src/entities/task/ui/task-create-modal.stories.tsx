import type { Meta, StoryObj } from '@storybook/react';
import { TaskCreateModal } from './task-create-modal';
import { handlers } from './task-create-modal.mocks';

const meta = {
  component: TaskCreateModal,
} satisfies Meta<typeof TaskCreateModal>;

export default meta;
type Story = StoryObj<typeof TaskCreateModal>;

export const Default: Story = {};

export const Opened: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
};

export const ErrorCase: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
};
