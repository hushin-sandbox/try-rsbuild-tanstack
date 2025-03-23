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
      handlers: [handlers.loading],
    },
  },
};
```

## MSW の使い方

### 共通ハンドラーの定義

src/mocks/handlers/common.ts

### モックハンドラーの定義

```typescript
// [component-name].mocks.ts
import { http, HttpResponse } from 'msw';
import { sampleData } from '~/mocks/data';
import { createLoadingHandlerGet, createErrorHandlerGet } from '~/mocks/handlers/common';

const API_PATH = '/api/endpoint';

export const handlers = {
  // 正常系
  default: http.get(API_PATH, () => {
    return HttpResponse.json({
      data: { items: sampleData },
      status: 200,
    });
  }),

  // ローディング状態
  loading: createLoadingHandlerGet(API_PATH),

  // データが空の状態
  empty: http.get(API_PATH, () => {
    return HttpResponse.json({
      data: { items: [] },
      status: 200,
    });
  }),

  // エラー状態
  error: createErrorHandlerGet(API_PATH),
};
```

### Story での使用

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { handlers } from './component-name.mocks';
import { Component } from './Component';

const meta = {
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [handlers.loading],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [handlers.empty],
    },
  },
};

export const ErrorCase: Story = {
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
};
```

## ベストプラクティス

1. ストーリーの命名
   - Default: 基本的な使用方法（正常系）
   - Loading: ローディング状態
   - Empty: データが空の状態
   - ErrorCase: エラー状態

2. モックの構造化
   - 共通ハンドラー（Loading, Error）は `src/mocks/handlers/common.ts` に定義
   - コンポーネント固有のモックは `[component-name].mocks.ts` に定義
   - APIパスは定数として管理

3. MSW の使用
   - 共通ハンドラーを活用して重複を排除
   - コンポーネント固有のモックは専用ファイルに分離
   - エラーケースも考慮
   - デフォルトのモックハンドラーは避け、各ストーリーで明示的に設定

4. コンポーネントのドキュメント
   - コンポーネントの説明を含める
   - 使用例を示す
   - props の説明を追加