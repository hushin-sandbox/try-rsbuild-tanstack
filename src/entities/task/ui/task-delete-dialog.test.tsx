import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import * as stories from './task-delete-dialog.stories';

const { Default } = composeStories(stories);

test('削除確認ダイアログの動作確認', async () => {
  const mockOnConfirm = vi.fn();
  render(<Default onConfirm={mockOnConfirm} />);

  // トリガーボタンをクリック
  const deleteButton = screen.getByRole('button', { name: 'タスクを削除' });
  await userEvent.click(deleteButton);

  // ダイアログが表示される
  expect(
    screen.getByRole('heading', { name: 'タスクの削除' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/「サンプルタスク」を削除してよろしいですか？/),
  ).toBeInTheDocument();

  // 削除を確認
  const confirmButton = screen.getByRole('button', { name: '削除' });
  await userEvent.click(confirmButton);

  // onConfirmが呼ばれる
  expect(mockOnConfirm).toHaveBeenCalledTimes(1);

  // ダイアログが閉じる
  expect(
    screen.queryByRole('heading', { name: 'タスクの削除' }),
  ).not.toBeInTheDocument();
});

test('キャンセルボタンをクリックするとダイアログが閉じる', async () => {
  const mockOnConfirm = vi.fn();
  render(<Default onConfirm={mockOnConfirm} />);

  // トリガーボタンをクリック
  const deleteButton = screen.getByRole('button', { name: 'タスクを削除' });
  await userEvent.click(deleteButton);

  // キャンセルボタンをクリック
  const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
  await userEvent.click(cancelButton);

  // onConfirmは呼ばれない
  expect(mockOnConfirm).not.toHaveBeenCalled();

  // ダイアログが閉じる
  expect(
    screen.queryByRole('heading', { name: 'タスクの削除' }),
  ).not.toBeInTheDocument();
});
