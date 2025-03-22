import type { Task } from '~/entities/task/model/task';

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: '機能開発タスク',
    description:
      '新機能の実装を行います。要件定義から実装、テストまでを含みます。',
    status: 'in_progress',
    priority: 'high',
    isCompleted: false,
    tags: ['開発', 'フロントエンド'],
    createdAt: '2024-03-20T10:00:00.000Z',
    updatedAt: '2024-03-21T15:00:00.000Z',
  },
  {
    id: '2',
    title: 'バグ修正',
    description: 'ログイン画面のバリデーションエラーを修正',
    status: 'todo',
    priority: 'medium',
    isCompleted: false,
    tags: ['バグ修正', 'フロントエンド'],
    createdAt: '2024-03-21T09:00:00.000Z',
    updatedAt: '2024-03-21T09:00:00.000Z',
  },
  {
    id: '3',
    title: 'ドキュメント更新',
    status: 'done',
    priority: 'low',
    isCompleted: true,
    tags: ['ドキュメント'],
    createdAt: '2024-03-19T14:00:00.000Z',
    updatedAt: '2024-03-20T16:00:00.000Z',
    completedAt: '2024-03-20T16:00:00.000Z',
  },
  {
    id: '4',
    title: 'パフォーマンス改善',
    description:
      'アプリケーションの読み込み速度を改善するための対応を行います。\n- バンドルサイズの最適化\n- 画像の最適化\n- キャッシュの活用',
    status: 'todo',
    priority: 'high',
    isCompleted: false,
    tags: ['パフォーマンス', '改善'],
    createdAt: '2024-03-22T08:00:00.000Z',
    updatedAt: '2024-03-22T08:00:00.000Z',
    dueDate: '2024-03-25T00:00:00.000Z',
  },
];

// 空のタスクリストを返すためのモックデータ
export const emptyTasks: Task[] = [];
