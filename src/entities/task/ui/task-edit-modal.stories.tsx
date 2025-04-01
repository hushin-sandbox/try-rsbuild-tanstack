import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import { sampleTasks } from '~/mocks/data/tasks';
import { TaskEditModal } from './task-edit-modal';
import { handlers } from './task-edit-modal.mocks';

const defaultTask = sampleTasks[0];

const meta = {
  component: TaskEditModal,
  args: {
    open: true,
    onClose: fn(),
    task: defaultTask,
  },
} satisfies Meta<typeof TaskEditModal>;

export default meta;
type Story = StoryObj<typeof TaskEditModal>;

// 基本的な表示
export const Default: Story = {
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('初期値が正しく設定されている', async () => {
      expect(canvas.getByLabelText('タイトル')).toHaveValue(args.task.title);
      expect(canvas.getByLabelText('説明')).toHaveValue(args.task.description);
      console.log(canvas.getByLabelText('ステータス'));
      expect(canvas.getByLabelText('ステータス')).toHaveTextContent('進行中');
      expect(canvas.getByLabelText('優先度')).toHaveTextContent('高');
    });
  },
};

// 更新成功
export const UpdateSuccess: Story = {
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const onClose = args.onClose;

    await step('フォームの値を更新', async () => {
      // タイトルを更新
      const titleInput = canvas.getByLabelText('タイトル');
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, '更新されたタスク');

      // 説明を更新
      const descriptionInput = canvas.getByLabelText('説明');
      await userEvent.clear(descriptionInput);
      await userEvent.type(descriptionInput, '更新された説明');
    });

    await step('フォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '更新' }));
    });

    await step('モーダルが閉じられる', async () => {
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  },
};

// エラーケース
export const ErrorCase: Story = {
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const onClose = args.onClose;

    await step('フォームの値を更新', async () => {
      await userEvent.type(canvas.getByLabelText('タイトル'), '更新時にエラー');
    });

    await step('フォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '更新' }));
    });

    await step('エラー時はモーダルが閉じない', async () => {
      expect(onClose).not.toHaveBeenCalled();
    });
  },
};

// バリデーションエラー
export const ValidationError: Story = {
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const onClose = args.onClose;

    await step('タイトルを空にする', async () => {
      const titleInput = canvas.getByLabelText('タイトル');
      await userEvent.clear(titleInput);
    });

    await step('フォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '更新' }));
    });

    await step('エラーメッセージの確認', async () => {
      expect(canvas.getByText('タイトルは必須です')).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });
  },
};

// キャンセル操作
export const CancelOperation: Story = {
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const onClose = args.onClose;

    await step('フォームの値を更新', async () => {
      await userEvent.type(
        canvas.getByLabelText('タイトル'),
        ' (キャンセルテスト)',
      );
    });

    await step('キャンセルボタンをクリック', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'キャンセル' }));
    });

    await step('モーダルが閉じられる', async () => {
      expect(onClose).toHaveBeenCalled();
    });
  },
};
