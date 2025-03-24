import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { TaskForm } from './task-form';
import { handlers } from './task-form.mocks';

const meta = {
  component: TaskForm,
  args: {
    onSubmit: async () => {},
  },
} satisfies Meta<typeof TaskForm>;

export default meta;
type Story = StoryObj<typeof TaskForm>;

// 基本的な表示
export const Default: Story = {};

// マークダウン入力とプレビュー
export const WithMarkdown: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('マークダウンテキストを入力', async () => {
      const textarea = canvas.getByLabelText('説明');
      await userEvent.type(
        textarea,
        '# タスクの説明\n\n**重要な項目**\n\n- 項目1\n- 項目2',
      );
    });

    await step('プレビューモードに切り替え', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'プレビュー' }));

      // プレビューの内容を確認
      const preview = canvas.getByRole('heading', { name: 'タスクの説明' });
      expect(preview).toBeInTheDocument();

      const boldText = canvas.getByText('重要な項目');
      expect(boldText).toHaveStyle({ 'font-weight': 600 });

      const listItems = canvas.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });

    await step('エディタモードに戻る', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'エディタ' }));
      const textarea = canvas.getByLabelText('説明');
      expect(textarea).toBeInTheDocument();
    });
  },
};

// バリデーションエラー
export const ValidationError: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('空のフォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '作成' }));
    });

    await step('エラーメッセージの確認', async () => {
      expect(canvas.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  },
};

// 送信成功
export const SubmitSuccess: Story = {
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('フォームに値を入力', async () => {
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
      await userEvent.click(canvas.getByRole('button', { name: '作成' }));
    });
  },
};

// キャンセル操作
export const CancelOperation: Story = {
  args: {
    onCancel: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('フォームに値を入力', async () => {
      await userEvent.type(
        canvas.getByLabelText('タイトル'),
        'キャンセルテスト',
      );
    });

    await step('キャンセルボタンをクリック', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'キャンセル' }));
    });
  },
};
