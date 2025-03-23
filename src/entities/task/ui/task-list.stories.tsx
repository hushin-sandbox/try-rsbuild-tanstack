import type { Meta, StoryObj } from '@storybook/react';
import { TaskList } from './task-list';
import { handlers } from './task-list.mocks';

const meta = {
  component: TaskList,
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof TaskList>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [handlers.loading],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [handlers.empty],
    },
  },
};

export const ErrorCase: Story = {
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
};
