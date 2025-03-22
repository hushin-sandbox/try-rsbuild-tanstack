import { composeStories } from '@storybook/react';
import { screen } from '@testing-library/react';
import * as stories from './task-list.stories';

const { Default, Loading, Empty, ErrorCase } = composeStories(stories);

describe('TaskList', () => {
  test('タスク一覧を表示できる', async () => {
    await Default.run();

    // タイトルが表示されることを確認
    expect(
      screen.getByRole('heading', { name: '機能開発タスク' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'バグ修正' }),
    ).toBeInTheDocument();

    // ステータスが表示されることを確認
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getAllByText('未着手')).toHaveLength(2);
    expect(screen.getByText('完了')).toBeInTheDocument();

    // 優先度が表示されることを確認
    expect(screen.getAllByText('高')).toHaveLength(2);
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('低')).toBeInTheDocument();

    // 説明が表示されることを確認
    expect(screen.getByText(/新機能の実装を行います/)).toBeInTheDocument();
    expect(
      screen.getByText(/ログイン画面のバリデーションエラーを修正/),
    ).toBeInTheDocument();
  });

  test('ローディング状態を表示できる', async () => {
    await Loading.run();
    // ローディング中はリストが表示されない
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('タスクが空の状態を表示できる', async () => {
    await Empty.run();
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  test('エラー状態を表示できる', async () => {
    await ErrorCase.run();
    // エラー時はリストが表示されない
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
