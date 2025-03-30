import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { TaskForm } from './task-form';

describe('TaskForm', () => {
  test('マークダウンプレビューの切り替え', async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const user = userEvent.setup();

    // 説明フィールドにマークダウンを入力
    const textarea = screen.getByLabelText('説明');
    await user.type(textarea, '# タスクの説明\n\n**重要な項目**');

    // プレビューモードに切り替え
    const previewButton = screen.getByRole('button', { name: 'プレビュー' });
    await user.click(previewButton);

    // マークダウンがHTMLに変換されていることを確認
    expect(
      screen.getByRole('heading', { name: 'タスクの説明' }),
    ).toBeInTheDocument();
    const boldText = screen.getByText('重要な項目');
    expect(boldText.tagName).toBe('STRONG');

    // エディタモードに戻す
    const editorButton = screen.getByRole('button', { name: 'エディタ' });
    await user.click(editorButton);

    // テキストエリアが表示されていることを確認
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
  });

  test('バリデーションエラーの表示', async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    const user = userEvent.setup();

    // 空のフォームを送信
    const submitButton = screen.getByRole('button', { name: '作成' });
    await user.click(submitButton);

    // エラーメッセージの確認
    expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
  });

  test('フォームの送信', async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    // フォームに値を入力
    await user.type(screen.getByLabelText('タイトル'), 'テストタスク');
    await user.type(screen.getByLabelText('説明'), 'これはテストです');

    // ステータスを選択
    await user.click(screen.getByRole('combobox', { name: 'ステータス' }));
    await user.click(screen.getByRole('option', { name: '進行中' }));

    // 優先度を選択
    await user.click(screen.getByRole('combobox', { name: '優先度' }));
    await user.click(screen.getByRole('option', { name: '高' }));

    // フォームを送信
    await user.click(screen.getByRole('button', { name: '作成' }));

    // onSubmit が正しい値で呼ばれることを確認
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'テストタスク',
        description: 'これはテストです',
        status: 'in_progress',
        priority: 'high',
        dueDate: undefined,
        parentId: undefined,
        tags: [],
        isCompleted: false,
        recurrenceRule: undefined,
      });
    });
  });

  test('キャンセル処理', async () => {
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);
    const user = userEvent.setup();

    // キャンセルボタンをクリック
    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await user.click(cancelButton);

    // onCancel が呼ばれることを確認
    expect(onCancel).toHaveBeenCalled();
  });
});
