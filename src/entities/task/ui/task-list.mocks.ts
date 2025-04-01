import { http, HttpResponse } from 'msw';
import { emptyTasks, sampleTasks } from '~/mocks/data';
import {
  createErrorHandlerGet,
  createLoadingHandlerGet,
} from '~/mocks/handlers/common';

const TASKS_API_PATH = '/api/tasks';

// サブタスクを含むモックデータ
const tasksWithSubtasks = [
  {
    id: 'parent-1',
    title: 'プロジェクトA：要件定義と実装',
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
    id: 'subtask-1-1',
    title: '要件定義ドキュメントの作成',
    description: '機能の要件を詳細に記述したドキュメントを作成',
    status: 'done',
    priority: 'high',
    isCompleted: true,
    tags: ['ドキュメント'],
    parentId: 'parent-1',
    createdAt: '2024-03-20T10:30:00.000Z',
    updatedAt: '2024-03-21T11:00:00.000Z',
    completedAt: '2024-03-21T11:00:00.000Z',
  },
  {
    id: 'subtask-1-2',
    title: 'UI実装',
    description: '要件に基づいたUIの実装',
    status: 'in_progress',
    priority: 'high',
    isCompleted: false,
    tags: ['フロントエンド'],
    parentId: 'parent-1',
    createdAt: '2024-03-21T09:00:00.000Z',
    updatedAt: '2024-03-21T15:00:00.000Z',
  },
  {
    id: 'parent-2',
    title: 'ドキュメント更新',
    description: 'APIドキュメントの更新作業',
    status: 'todo',
    priority: 'medium',
    isCompleted: false,
    tags: ['ドキュメント'],
    createdAt: '2024-03-21T10:00:00.000Z',
    updatedAt: '2024-03-21T10:00:00.000Z',
  },
];

export const handlers = {
  // 正常系（タスクあり）
  default: http.get(TASKS_API_PATH, () => {
    return HttpResponse.json({ tasks: sampleTasks });
  }),

  // サブタスクを含むケース
  withSubtasks: http.get(TASKS_API_PATH, () => {
    return HttpResponse.json({ tasks: tasksWithSubtasks });
  }),

  // ローディング状態
  loading: createLoadingHandlerGet(TASKS_API_PATH),

  // タスクが空の状態
  empty: http.get(TASKS_API_PATH, () => {
    return HttpResponse.json({ tasks: emptyTasks });
  }),

  // エラー状態
  error: createErrorHandlerGet(TASKS_API_PATH),
};
