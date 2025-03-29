# Storybook パターン

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';
import { handlers } from './component.mocks';

const meta = {
  component: Component,
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

// 基本的な状態
export const Default: Story = {
  args: {
    // コンポーネントの props
  },
};

// ローディング状態
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [handlers.loading],
    },
  },
};

// エラー状態
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
};

// データが空の状態
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [handlers.empty],
    },
  },
};
```

## MSW モックハンドラーパターン

```typescript
// [component-name].mocks.ts
import { http, HttpResponse } from 'msw';
import { createLoadingHandlerGet, createErrorHandlerGet } from '~/mocks/handlers/common';

const API_PATH = '/api/endpoint';

export const handlers = {
  // 正常系
  default: http.get(API_PATH, () => {
    return HttpResponse.json({
      tasks: sampleData
    })
  }),

  // ローディング状態
  loading: createLoadingHandlerGet(API_PATH),

  // エラー状態
  error: http.get(API_PATH, () => {
    return HttpResponse.json(
      {
        message: 'エラーが発生しました',
        errors: {
          general: ['サーバーエラーが発生しました']
        }
      },
      { status: 500 }
    )
  }),

  // データが空の状態
  empty: http.get(API_PATH, () => {
    return HttpResponse.json({
      tasks: []
    })
  }),
};
