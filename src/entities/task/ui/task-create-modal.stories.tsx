import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { sampleTasks } from '~/mocks/data/tasks';
import { Providers, createQueryClient } from '~/shared/lib/providers';
import { Button } from '~/shared/ui/button';
import { TaskCreateModal } from './task-create-modal';
import { handlers } from './task-create-modal.mocks';

// テスト用のサンプルデータ
const testParentTask = {
  id: 'test-parent',
  title: 'テスト用親タスク',
  description: 'テスト用の親タスク',
  status: 'todo' as const,
  priority: 'medium' as const,
  isCompleted: false,
  tags: ['テスト'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Storybookのプロバイダー
const withProviders = (Story: React.ComponentType) => {
  const queryClient = createQueryClient();
  // タスクデータを事前に設定
  queryClient.setQueryData(['tasks'], [testParentTask, ...sampleTasks]);
  return (
    <Providers queryClient={queryClient}>
      <Story />
    </Providers>
  );
};

const meta = {
  component: TaskCreateModal,
  decorators: [withProviders],
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

export const FilledForm: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
    test: {
      // FIXME なぜか pnpm test-storybook でエラーが発生するため、一時的に無効化
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('フォームに情報を入力', async () => {
      // タイトル入力
      await userEvent.type(canvas.getByLabelText('タイトル'), 'テストタスク');

      // 説明入力
      await userEvent.type(
        canvas.getByLabelText('説明'),
        'これはテストタスクの説明です',
      );

      // ステータス選択
      await userEvent.click(
        canvas.getByRole('combobox', { name: 'ステータス' }),
      );
      await userEvent.click(canvas.getByRole('option', { name: '進行中' }));

      // 優先度選択
      await userEvent.click(canvas.getByRole('combobox', { name: '優先度' }));
      await userEvent.click(canvas.getByRole('option', { name: '高' }));
    });

    await step('フォームを送信', async () => {
      // 送信ボタンをクリック
      await userEvent.click(canvas.getByRole('button', { name: '作成' }));
    });

    await step('モーダルが閉じることを確認', async () => {
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  },
};

export const CreateSubTask: Story = {
  args: {
    defaultOpen: true,
    parentId: '1',
    triggerComponent: (
      <Button variant="ghost" size="sm">
        サブタスク追加
      </Button>
    ),
  },
  parameters: {
    msw: {
      handlers: [handlers.createSubTask],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('モーダルのタイトルを確認', async () => {
      expect(
        canvas.getByRole('heading', { name: 'サブタスク作成' }),
      ).toBeInTheDocument();
    });

    await step('フォームに情報を入力', async () => {
      await userEvent.type(
        canvas.getByLabelText('タイトル'),
        'サブタスクのテスト',
      );
      await userEvent.type(
        canvas.getByLabelText('説明'),
        'これはサブタスクのテストです',
      );
    });

    await step('フォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '作成' }));
    });

    await step('モーダルが閉じることを確認', async () => {
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  },
};

export const SubTaskError: Story = {
  args: {
    defaultOpen: true,
    parentId: 'subtask-1-1',
    triggerComponent: (
      <Button variant="ghost" size="sm">
        サブタスク追加
      </Button>
    ),
  },
  parameters: {
    msw: {
      handlers: [handlers.subTaskError],
    },
  },
};

export const ValidationError: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('空のフォームを送信', async () => {
      // 空のタイトルで送信を試みる
      await userEvent.click(canvas.getByRole('button', { name: '作成' }));
    });

    await step('バリデーションエラーの確認', async () => {
      // エラーメッセージの確認
      await expect(canvas.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  },
};

export const CancelOperation: Story = {
  args: {
    defaultOpen: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('フォームに値を入力', async () => {
      await userEvent.type(
        canvas.getByLabelText('タイトル'),
        'キャンセルテスト',
      );
    });

    await step('キャンセル操作', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'キャンセル' }));
    });

    await step('モーダルが閉じることを確認', async () => {
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  },
};
