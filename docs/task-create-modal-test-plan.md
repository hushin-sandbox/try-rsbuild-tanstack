# TaskCreateModal Component Test Plan

## 概要

`TaskCreateModal` コンポーネントのインタラクションテストを実装します。
フォーム入力、バリデーション、API通信、モーダル操作などの一連の操作を確認します。

## テストケース

### 1. 基本的なフォーム入力と送信テスト

```typescript
// 新しいストーリー: FilledForm
export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // タイトル入力
    await userEvent.type(canvas.getByLabelText('タイトル'), 'テストタスク');

    // 説明入力
    await userEvent.type(
      canvas.getByLabelText('説明'),
      'これはテストタスクの説明です'
    );

    // ステータス選択
    await userEvent.click(canvas.getByLabelText('ステータス'));
    await userEvent.click(canvas.getByText('進行中'));

    // 優先度選択
    await userEvent.click(canvas.getByLabelText('優先度'));
    await userEvent.click(canvas.getByText('高'));

    // 送信
    await userEvent.click(canvas.getByRole('button', { name: '作成' }));

    // モーダルが閉じることを確認
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
```

### 2. バリデーションエラーのテスト

```typescript
// 新しいストーリー: ValidationError
export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 空のタイトルで送信
    await userEvent.click(canvas.getByRole('button', { name: '作成' }));

    // エラーメッセージの確認
    await expect(canvas.getByText('タイトルは必須です')).toBeInTheDocument();
  },
};
```

### 3. キャンセル操作のテスト

```typescript
// 新しいストーリー: CancelOperation
export const CancelOperation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームに値を入力
    await userEvent.type(canvas.getByLabelText('タイトル'), 'キャンセルテスト');

    // キャンセルボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: 'キャンセル' }));

    // モーダルが閉じることを確認
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
```

## 実装ステップ

1. 必要なパッケージのインストール
```bash
pnpm add -D @storybook/test @storybook/addon-interactions
```

2. Storybook設定の更新
```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  // ...
  addons: [
    // ...
    '@storybook/addon-interactions'
  ],
};
```

3. stories.tsx ファイルの更新
- 既存のストーリーを維持しつつ、新しいテストケースを追加
- userEvent, within, expect のインポートを追加
- 各テストケースの実装

## 期待される結果

- すべてのテストケースが成功すること
- Storybook上でインタラクションの実行が可視化されること
- CI環境でのtest-runnerによる自動テストが成功すること