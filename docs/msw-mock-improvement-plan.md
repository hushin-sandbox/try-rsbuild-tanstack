# MSW モック改善計画

## 目的
Storybookのmswモックを改善し、より保守性の高い実装にする

## 変更点

### 1. タスク固有のモックの作成
`src/entities/task/ui/task-list.mocks.ts` に以下のハンドラーを実装：

```typescript
import { http, delay, HttpResponse } from 'msw';
import { sampleTasks, emptyTasks } from '~/mocks/data';

// Loading状態のハンドラー
const createLoadingHandler = () =>
  http.get('/api/tasks', async () => {
    await delay('infinite');
    return new HttpResponse(null, { status: 200 });
  });

// エラー状態のハンドラー
const createErrorHandler = (status = 500) =>
  http.get('/api/tasks', () => {
    return HttpResponse.json(
      {
        status,
        message: 'Internal Server Error',
      },
      { status }
    );
  });

export const handlers = {
  // 正常系（タスクあり）
  default: http.get('/api/tasks', () => {
    return HttpResponse.json({
      data: { tasks: sampleTasks },
      status: 200,
    });
  }),

  // ローディング状態
  loading: createLoadingHandler(),

  // タスクが空の状態
  empty: http.get('/api/tasks', () => {
    return HttpResponse.json({
      data: { tasks: emptyTasks },
      status: 200,
    });
  }),

  // エラー状態
  error: createErrorHandler(),
};
```

### 2. Storybookの改善
`src/entities/task/ui/task-list.stories.tsx` を以下のように修正：

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { handlers } from './task-list.mocks';
import { TaskList } from './task-list';

const meta = {
  component: TaskList,
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof TaskList>;

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

## 利点
1. モックの再利用性が向上
2. コードの重複が減少
