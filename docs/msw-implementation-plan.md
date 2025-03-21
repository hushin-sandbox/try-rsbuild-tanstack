# MSW と API モックの実装計画

## 概要

Mock Service Worker (MSW) を使用して REST API をモックし、localStorage を使用してデータを永続化する実装計画です。

## 1. セットアップ手順

### パッケージのインストール

1. 開発依存パッケージ
   ```bash
   pnpm add -D msw
   ```

### プロジェクト構造

```
src/
  mocks/
    browser.ts      # MSW ブラウザセットアップ
    handlers.ts     # API ハンドラー
    lib/
      storage.ts    # ストレージ管理
      errors.ts     # エラー管理
    test/
      handlers.test.ts  # ハンドラーのテスト
      storage.test.ts   # ストレージ管理のテスト
```

## 2. 実装詳細

### MSW のセットアップ
```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### API ハンドラーの実装
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';
import { storageAdapter } from './lib/storage';

export const handlers = [
  // タスク一覧取得
  rest.get('/api/tasks', (req, res, ctx) => {
    const tasks = storageAdapter.getTasks();
    return res(ctx.status(200), ctx.json(tasks));
  }),

  // タスク詳細取得
  rest.get('/api/tasks/:id', (req, res, ctx) => {
    const task = storageAdapter.getTask(req.params.id);
    if (!task) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.json(task));
  }),

  // タスク作成
  rest.post('/api/tasks', async (req, res, ctx) => {
    const newTask = await req.json();
    const task = createTask(newTask);
    storageAdapter.saveTask(task);
    return res(ctx.status(201), ctx.json(task));
  }),

  // タスク更新
  rest.patch('/api/tasks/:id', async (req, res, ctx) => {
    const updates = await req.json();
    const task = storageAdapter.getTask(req.params.id);
    if (!task) {
      return res(ctx.status(404));
    }
    const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
    storageAdapter.saveTask(updatedTask);
    return res(ctx.status(200), ctx.json(updatedTask));
  }),

  // タスク削除
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const task = storageAdapter.getTask(req.params.id);
    if (!task) {
      return res(ctx.status(404));
    }
    storageAdapter.deleteTask(req.params.id);
    return res(ctx.status(204));
  }),
];
```

### ストレージ管理
```typescript
// src/mocks/lib/storage.ts
const STORAGE_KEY = 'tasks';

export const storageAdapter = {
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTask(id: string): Task | undefined {
    return this.getTasks().find(task => task.id === id);
  },

  saveTask(task: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(task => task.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};
```

### エラー管理
```typescript
// src/mocks/lib/errors.ts
export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): never {
  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new APIError(500, error.message);
  }

  throw new APIError(500, 'Unknown error occurred');
}
```

## 3. テスト実装

### ハンドラーのテスト
```typescript
// src/mocks/test/handlers.test.ts
describe('API Handlers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('タスク一覧を取得できること', async () => {
    // テスト実装
  });

  it('タスクを作成できること', async () => {
    // テスト実装
  });
});
```

### ストレージ管理のテスト
```typescript
// src/mocks/test/storage.test.ts
describe('Storage Adapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('タスクを保存して取得できること', () => {
    // テスト実装
  });
});
```

## 4. 実装手順

1. MSW のインストールとセットアップ
2. ストレージ管理の実装とテスト
3. API ハンドラーの実装とテスト
4. エラー管理の実装
5. React Query との統合
   ```bash
   pnpm add @tanstack/react-query
   ```

## 5. 考慮事項

1. エラーハンドリング
   - API エラーの適切な処理
   - バリデーションエラーの処理
   - ネットワークエラーの処理

2. パフォーマンス
   - 効率的なデータ取得
   - キャッシュ戦略

3. テスト
   - 単体テスト
   - 統合テスト
   - エッジケースの考慮