import { composeStories } from '@storybook/react';
import { screen, waitFor } from '@testing-library/react';
import { setup } from '~/test/helpers/setup';
import * as stories from './task-create-modal.stories';

const { Default, Opened, ErrorCase } = composeStories(stories);

describe('TaskCreateModal', () => {
  test('モーダルの開閉ができる', async () => {
    const { user } = await setup(Default);

    // 初期状態ではモーダルは閉じている
    expect(
      screen.queryByRole('heading', { name: '新規タスク作成' }),
    ).not.toBeInTheDocument();

    // モーダルを開く
    await user.click(screen.getByRole('button', { name: '新規タスク作成' }));
    expect(
      screen.getByRole('heading', { name: '新規タスク作成' }),
    ).toBeInTheDocument();

    // モーダルを閉じる（キャンセルボタン）
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: '新規タスク作成' }),
      ).not.toBeInTheDocument();
    });
  });

  test('タスクを作成できる', async () => {
    const { user } = await setup(Opened);
    // フォームに入力
    await user.type(
      screen.getByRole('textbox', { name: 'タイトル' }),
      'テストタスク',
    );
    await user.type(
      screen.getByRole('textbox', { name: '説明' }),
      'テストの説明',
    );

    // フォームを送信
    await user.click(screen.getByRole('button', { name: '作成' }));

    // モーダルが閉じることを確認
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: '新規タスク作成' }),
      ).not.toBeInTheDocument();
    });
  });

  test('エラー時にモーダルが開いたままになる', async () => {
    const { user } = await setup(ErrorCase);

    // フォームに入力
    await user.type(
      screen.getByRole('textbox', { name: 'タイトル' }),
      'テストタスク',
    );
    await user.type(
      screen.getByRole('textbox', { name: '説明' }),
      'テストの説明',
    );

    // フォームを送信
    await user.click(screen.getByRole('button', { name: '作成' }));

    // エラー時はモーダルが閉じないことを確認
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '新規タスク作成' }),
      ).toBeInTheDocument();
    });
  });
});
