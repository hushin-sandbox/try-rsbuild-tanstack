# ToDo 管理アプリケーション 実装計画書

## 1. データモデル設計

### Task モデル

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  parentId?: string; // サブタスク用
  recurrenceRule?: RecurrenceRule; // 繰り返しタスク用
  tags: string[];
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // 繰り返し間隔
  endDate?: Date;
}
```

### Tag モデル

```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
}
```

## 2. API 設計

### Tasks API

#### タスク一覧取得

```
GET /api/tasks
Query Parameters:
- status?: TaskStatus
- priority?: TaskPriority
- parentId?: string
- tag?: string
- search?: string
- sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title'
- sortOrder?: 'asc' | 'desc'

Response: Task[]
```

#### タスク詳細取得

```
GET /api/tasks/:id
Response: Task
```

#### タスク作成

```
POST /api/tasks;
Body: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
Response: Task;
```

#### タスク更新

```
PATCH /api/tasks/:id
Body: Partial<Task>
Response: Task
```

#### タスク削除

```
DELETE /api/tasks/:id
Response: void
```

### Tags API

#### タグ一覧取得

```
GET /api/tags
Response: Tag[]
```

#### タグ作成

```
POST /api/tags;
Body: Omit<Tag, 'id'>;
Response: Tag;
```

## 3. 画面設計

### ページ構成

1. メインページ (`/`)

   - タスク一覧表示
   - ビュー切り替え（リスト/カンバン）
   - タスク作成ボタン
   - 基本的なフィルター機能

2. 検索ページ (`/search`)

   - 高度な検索機能
   - カスタムフィルター
   - 保存済み検索条件
   - 検索結果の表示オプション

3. タスク詳細ページ (`/tasks/:id`)
   - タスク詳細情報表示
   - 編集フォーム
   - サブタスク一覧
   - 繰り返し設定

### コンポーネント設計

#### 共通コンポーネント

- `TaskCard`: タスクの基本情報表示
- `TaskForm`: タスク作成/編集フォーム
- `TaskList`: タスクのリスト表示
- `KanbanBoard`: カンバンビュー
- `TaskFilter`: フィルター UI
- `TagSelector`: タグ選択 UI
- `DatePicker`: 日付選択
- `ErrorBoundary`: エラーハンドリング
- `LoadingSpinner`: ローディング表示

#### 機能コンポーネント

- `TaskListView`: リストビューのメイン画面
- `KanbanView`: カンバンビューのメイン画面
- `TaskDetails`: タスク詳細画面
- `SubtaskList`: サブタスク一覧
- `RecurrenceSettings`: 繰り返し設定 UI

## 4. 状態管理設計

### Zustand Store

```typescript
interface TaskStore {
  // State
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  view: 'list' | 'kanban';

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: NewTask) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setView: (view: 'list' | 'kanban') => void;
}
```

### TanStack Query 設定

```typescript
// デフォルトで Suspense モードを有効化
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
  },
});

// Queries
const useTasks = (filters: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
  });
};

const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
  });
};

// Mutations
const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// エラーバウンダリとSuspenseを使用するラッパーコンポーネント
const QueryBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};
```

## 5. エラーハンドリング設計

### エラータイプ

```typescript
enum ErrorType {
  NETWORK_ERROR = 'network_error',
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN_ERROR = 'unknown_error',
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: Record<string, string>;
}
```

### エラーハンドリング戦略

1. **API エラー**

   - TanStack Query のエラーハンドリング機能を使用
   - エラー種別に応じた適切な UI フィードバック

2. **バリデーションエラー**

   - Valibot でのフォームバリデーション
   - インラインエラーメッセージ表示

3. **ネットワークエラー**
   - オフライン状態の検知
   - 再試行メカニズム
   - オフラインモードでのローカルデータ使用

## 6. 実装フェーズ

### フェーズ 1: 基本機能

1. プロジェクト設定

   - FSD ディレクトリ構造
   - MSW 設定
   - TanStack Query 設定

2. 基本的なタスク管理
   - タスク一覧表示
   - タスク作成
   - タスク編集
   - タスク削除

### フェーズ 2: ビュー実装

1. リストビュー
2. カンバンビュー
3. ドラッグ＆ドロップ

### フェーズ 3: 高度な機能

1. サブタスク
2. 繰り返しタスク
3. タグ管理

### フェーズ 4: 検索・フィルター

1. 検索機能
2. フィルター機能
3. ソート機能

### フェーズ 5: 最適化

1. パフォーマンス最適化
2. エラーハンドリング改善
3. UX 改善

## 7. 技術的な考慮事項

### パフォーマンス最適化

1. 仮想化スクロール
2. 適切なキャッシュ戦略
3. 遅延読み込み
4. メモ化による再レンダリング最適化

### セキュリティ

1. XSS 対策
2. データのバリデーション
3. API レートリミット

### アクセシビリティ

1. キーボード操作
2. スクリーンリーダー対応
3. カラーコントラスト
4. WAI-ARIA 対応

### テスト戦略

1. 単体テスト

   - コンポーネント
   - ストア
   - ユーティリティ関数

2. 統合テスト

   - API 統合
   - フォーム送信
   - フィルター機能

3. E2E テスト
   - 主要なユーザーフロー
   - エラーケース
