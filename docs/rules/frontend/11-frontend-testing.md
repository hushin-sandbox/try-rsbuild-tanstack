# フロントエンドテストガイドライン

## 基本方針

1. Storybookベースのテスト戦略
2. 実装はstories.tsxで完結
3. .test.tsxは作成しない（モデル層のロジックテストのみ.test.tsを使用）

## ディレクトリ構造

```
src/
├── mocks/
│   ├── data/          # モックデータ
│   │   └── tasks.ts   # エンティティごとのサンプルデータ
│   └── handlers/      # 共通ハンドラー
└── entities/task/ui/
    ├── component.tsx
    ├── component.mocks.ts    # モック定義
    └── component.stories.tsx # テスト実装
```

## 実装手順

### 1. モックデータ作成

```typescript
// src/mocks/data/tasks.ts
export const sampleTasks = [
  { id: '1', title: '基本データ' },
];
export const emptyTasks = [];  // エッジケース
```

### 2. モックハンドラー定義

```typescript
// component.mocks.ts
export const handlers = {
  default: http.get('/api/tasks', () => HttpResponse.json(sampleTasks)),
  error: createErrorHandler('/api/tasks'),
  loading: createLoadingHandler('/api/tasks'),
  empty: http.get('/api/tasks', () => HttpResponse.json(emptyTasks)),
};
```

### 3. ストーリー実装

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';
import { handlers } from './Component.mocks';

const meta = {
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};
export const Loading: Story = {
  parameters: { msw: { handlers: [handlers.loading] } }
};
export const Error: Story = {
  parameters: { msw: { handlers: [handlers.error] } }
};
export const Empty: Story = {
  parameters: { msw: { handlers: [handlers.empty] } }
};
export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement); // modalの要素をテストするために canvasElement.parentNode を渡す
    // インタラクションの実装
  }
};
```

### 4. コンポーネント実装

Component.tsx を実装する

### 5. テスト実行

`pnpm test-storybook <filename>`

## 必須テストケース

1. **基本機能**
   - Default（初期表示）
   - Loading
   - Error

2. **インタラクション**
   - データ入力
   - フォーム送信
   - API通信
   - エラー処理

## テストの書き方

### ユースケース毎の

### アクセシビリティを考慮したクエリ

```typescript
// ✅ Good
getByRole('button', { name: '送信' });
getByLabelText('ユーザー名');

// ❌ Bad
getByTestId('submit-button');
```

## コードレビュー基準

- [ ] 必要なテストケースが網羅されているか
- [ ] アクセシビリティを考慮したクエリを使用しているか
- [ ] モックは最小限に抑えられているか
- [ ] テストが壊れやすくないか（実装の詳細に依存していないか）
- [ ] エラーケースが適切に処理されているか
