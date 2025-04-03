import type { Meta, StoryObj } from '@storybook/react';

import { withDummyRouter } from '~/shared/lib/withDummyRouter';
import { TaskList } from './task-list';
import { handlers } from './task-list.mocks';

const meta = {
  component: TaskList,
  decorators: [withDummyRouter('/')],
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

export const WithSubtasks: Story = {
  parameters: {
    msw: {
      handlers: [handlers.withSubtasks],
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
