import { composeStories } from '@storybook/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from './task-list.stories';

const { Default, Loading, Empty, ErrorCase, WithSubtasks } =
  composeStories(stories);

describe('TaskList', () => {
  test('タスク一覧を表示できる', async () => {
    await Default.run();

    // タイトルが表示されることを確認
    expect(
      screen.getByRole('heading', {
        name: 'プロジェクトA：要件定義と実装',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'ドキュメント更新' }),
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

  describe('サブタスク機能', () => {
    test('初期状態ではサブタスクは非表示', async () => {
      await WithSubtasks.run();

      // 親タスクは表示される
      expect(
        screen.getByRole('heading', { name: 'プロジェクトA：要件定義と実装' }),
      ).toBeInTheDocument();
      // サブタスクは非表示
      expect(
        screen.queryByRole('heading', { name: '要件定義ドキュメントの作成' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'UI実装' }),
      ).not.toBeInTheDocument();

      // ドキュメント更新タスクは表示（ルートレベルのタスク）
      expect(
        screen.getByRole('heading', { name: 'ドキュメント更新' }),
      ).toBeInTheDocument();
    });

    test('展開/折りたたみボタンでサブタスクの表示を切り替えできる', async () => {
      const user = userEvent.setup();
      await WithSubtasks.run();

      // サブタスクを持つタスクの展開ボタンをクリック
      const expandButton = screen.getByRole('button', { name: '▶' });
      await user.click(expandButton);

      // サブタスクが表示される
      expect(
        screen.getByRole('heading', { name: '要件定義ドキュメントの作成' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'UI実装' }),
      ).toBeInTheDocument();

      // ボタンの表示が変わる
      expect(screen.getByRole('button', { name: '▼' })).toBeInTheDocument();

      // 折りたたみボタンをクリック
      const collapseButton = screen.getByRole('button', { name: '▼' });
      await user.click(collapseButton);

      // サブタスクが非表示になる
      expect(
        screen.queryByRole('heading', { name: '要件定義ドキュメントの作成' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'UI実装' }),
      ).not.toBeInTheDocument();

      // ボタンの表示が戻る
      expect(screen.getByRole('button', { name: '▶' })).toBeInTheDocument();
    });
  });

  describe('削除機能', () => {
    test('タスクを削除できる', async () => {
      const user = userEvent.setup();
      await Default.run();

      // 削除ボタンをクリック
      const deleteButton = screen.getAllByLabelText('タスクを削除')[0];
      await user.click(deleteButton);

      // 削除確認ダイアログが表示される
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText(/を削除してよろしいですか？/),
      ).toBeInTheDocument();

      // 削除を実行
      const confirmButton = screen.getByRole('button', { name: '削除' });
      await user.click(confirmButton);

      // ダイアログが閉じる
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('削除をキャンセルできる', async () => {
      const user = userEvent.setup();
      await Default.run();

      // 削除ボタンをクリック
      const deleteButton = screen.getAllByLabelText('タスクを削除')[0];
      await user.click(deleteButton);

      // キャンセルボタンをクリック
      const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
      await user.click(cancelButton);

      // ダイアログが閉じる
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      // タスクが表示されたままである
      expect(
        screen.getByRole('heading', {
          name: 'プロジェクトA：要件定義と実装',
        }),
      ).toBeInTheDocument();
    });
  });
});
