# Storybook

## 基本的な書き方

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta: Meta<typeof Component> = {
  component: Component,
  // コンポーネントのメタデータを定義
  parameters: {
    // MSW などのパラメータを設定
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

// 基本的なストーリー
export const Default: Story = {
  args: {
    // コンポーネントの props を定義
  },
};

// データ取得中の状態
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        // MSW のハンドラーを定義
      ],
    },
  },
};
```

## MSW の使い方

### handlers の定義

```typescript
// src/mocks/data/tasks.ts などにモックデータを定義
export const sampleTasks = [
  {
    id: '1',
    title: 'サンプルタスク',
    // ...
  },
];

// stories ファイルで使用
import { http, HttpResponse } from 'msw';
import { sampleTasks } from '~/mocks/data/tasks';

const handlers = [
  http.get('/api/tasks', () => {
    return HttpResponse.json({
      data: { tasks: sampleTasks },
      status: 200,
    });
  }),
];
```

### Story での使用

```typescript
export const WithData: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/tasks', () => {
          return HttpResponse.json({
            data: { tasks: sampleTasks },
            status: 200,
          });
        }),
      ],
    },
  },
};
```

## ベストプラクティス

1. ストーリーの命名
   - Default: 基本的な使用方法
   - WithData: データがある状態
   - Loading: ローディング状態
   - Empty: データが空の状態
   - Error: エラー状態

2. モックデータの管理
   - モックデータは別ファイルに分離
   - 再利用可能な形で定義
   - 現実的なデータを用意

3. MSW の使用
   - グローバルハンドラーは preview.ts に定義
   - ストーリー固有のハンドラーは Story の parameters に定義
   - エラーケースも考慮

4. コンポーネントのドキュメント
   - コンポーネントの説明を含める
   - 使用例を示す
   - props の説明を追加