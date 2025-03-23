import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
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

export const FilledForm: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    msw: {
      handlers: [handlers.default],
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
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
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
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },
};
