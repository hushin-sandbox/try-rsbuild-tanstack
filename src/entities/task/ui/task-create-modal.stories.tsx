import type { Meta, StoryObj } from '@storybook/react';
import { TaskCreateModal } from './task-create-modal';
import { handlers } from './task-create-modal.mocks';

const meta = {
  component: TaskCreateModal,
  parameters: {
    docs: {
      description: {
        component:
          'タスク作成用のモーダルコンポーネント。フォームを含み、作成後は自動的に閉じます。',
      },
    },
  },
} satisfies Meta<typeof TaskCreateModal>;

export default meta;
type Story = StoryObj<typeof TaskCreateModal>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'モーダルが閉じている初期状態',
      },
    },
  },
};

export const Opened: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
    docs: {
      description: {
        story: 'モーダルが開いている状態。タスク作成が成功するパターン。',
      },
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
    docs: {
      description: {
        story:
          'タスク作成が失敗するパターン。エラー時はモーダルは開いたままになります。',
      },
    },
  },
};
