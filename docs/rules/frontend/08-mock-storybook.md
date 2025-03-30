## モックデータとStorybook

### モックデータの構成

- モックデータはエンティティごとに `src/mocks/data` 配下に配置する
- エンティティの型定義に基づいた現実的なサンプルデータを作成する
- 基本的なデータセットに加えて、エッジケース（空配列など）も用意する

```typescript
// src/mocks/data/tasks.ts
export const sampleTasks: Task[] = [
  {
    id: '1',
    title: '機能開発タスク',
    // ...実際のユースケースを想定したデータ
  }
];

// エッジケース用のデータ
export const emptyTasks: Task[] = [];
```

### API モックの実装

- コンポーネントごとに `.mocks.ts` ファイルを作成する
- ハンドラーは以下の状態をカバーする
  - 正常系（デフォルト）
  - ローディング状態
  - エラー状態
  - 空の状態（該当する場合）
- 共通のハンドラー関数は `src/mocks/handlers/common.ts` に実装する

```typescript
// src/entities/task/ui/task-list.mocks.ts
export const handlers = {
  default: http.get('/api/tasks', () => {
    return HttpResponse.json({ tasks: sampleTasks });
  }),
  loading: createLoadingHandlerGet('/api/tasks'),
  error: createErrorHandlerGet('/api/tasks'),
};
```

### Storybookでのモック参照

- 各ストーリーは対応するモックハンドラーを参照する
- コンポーネントの主要なユースケースごとにストーリーを作成する
- ハンドラーは MSW のパラメーターとして設定する

#### Storybook 例

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';
import { handlers } from './component.mocks';

const meta = {
  // title 不要
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

// データが空の状態など、ユースケース別に追加
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [handlers.empty],
    },
  },
};
```


### ディレクトリ構造

```
src/
├── mocks/
│   ├── data/          # モックデータ
│   │   └── tasks.ts
│   └── handlers/      # 共通ハンドラー
│       └── common.ts
└── entities/
    └── task/
        └── ui/
            ├── task-list.tsx
            ├── task-list.mocks.ts   # コンポーネント固有のモック
            └── task-list.stories.tsx # Storybook
```

### テストでのモックの使用

- テストではStorybookを再利用する
  - composeStories を利用して `<StoryName>.run()` でモックが適用される
