import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { waitFor } from '@testing-library/react';
import { sampleTasks } from '~/mocks/data';
import { TaskEditButton } from './task-edit-button';
import { handlers } from './task-edit-button.mocks';

const defaultTask = sampleTasks[0];

const meta = {
  component: TaskEditButton,
  args: {
    task: defaultTask,
  },
} satisfies Meta<typeof TaskEditButton>;

export default meta;
type Story = StoryObj<typeof TaskEditButton>;

// 基本的な表示
export const Default: Story = {};

// 編集成功
export const EditSuccess: Story = {
  parameters: {
    msw: {
      handlers: [handlers.updateSuccess],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('編集ボタンをクリック', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '編集' }));
    });

    await step('モーダルが表示される', async () => {
      const titleInput = await canvas.findByLabelText('タイトル');
      expect(titleInput).toHaveValue(defaultTask.title);
    });

    await step('タイトルを更新', async () => {
      const titleInput = await canvas.findByLabelText('タイトル');
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, '更新されたタスク');
    });

    await step('フォームを送信', async () => {
      const updateButton = canvas.getByRole('button', { name: '更新' });
      await userEvent.click(updateButton);
    });

    await step('モーダルが閉じる', async () => {
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  },
};

// 編集エラー
export const EditError: Story = {
  parameters: {
    msw: {
      handlers: [handlers.updateError],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('編集ボタンをクリック', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '編集' }));
    });

    await step('タイトルを更新', async () => {
      const titleInput = await canvas.findByLabelText('タイトル');
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, 'エラーになるタスク');
    });

    await step('フォームを送信', async () => {
      const updateButton = canvas.getByRole('button', { name: '更新' });
      await userEvent.click(updateButton);
    });

    await step('モーダルが閉じない', () => {
      const titleInput = canvas.getByLabelText('タイトル');
      expect(titleInput).toBeInTheDocument();
    });
  },
};

// キャンセル操作
export const CancelOperation: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('編集ボタンをクリック', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '編集' }));
    });

    await step('タイトルを更新', async () => {
      const titleInput = await canvas.findByLabelText('タイトル');
      await userEvent.type(titleInput, ' (キャンセルテスト)');
    });

    await step('キャンセルボタンをクリック', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'キャンセル' }));
    });

    await step('モーダルが閉じる', () => {
      const titleInput = canvas.queryByLabelText('タイトル');
      expect(titleInput).not.toBeInTheDocument();
    });
  },
};
