import { http, HttpResponse } from 'msw';
import { sampleTasks } from '../data/tasks';
import { delay } from '../lib/delay';
import { createErrorHandler } from '../lib/errors';

export const handlers = [
  // タスク一覧取得
  http.get('/api/tasks', async () => {
    await delay();
    return HttpResponse.json({ tasks: sampleTasks });
  }),

  // タスク詳細取得
  http.get('/api/tasks/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    const task = sampleTasks.find((t) => t.id === id);
    if (!task) {
      return new HttpResponse('Task not found', { status: 404 });
    }
    // サブタスクを取得
    const subtasks = sampleTasks.filter((t) => t.parentId === id);
    // 親タスクを取得
    const parentTask = task.parentId
      ? sampleTasks.find((t) => t.id === task.parentId)
      : null;

    return HttpResponse.json({
      task,
      subtasks,
      parentTask,
    });
  }),

  // タスク作成
  http.post('/api/tasks', async ({ request }) => {
    await delay();
    const task = await request.json();
    return HttpResponse.json({ task });
  }),

  // タスク更新
  http.patch('/api/tasks/:id', async ({ request }) => {
    await delay();
    const task = await request.json();
    return HttpResponse.json({ task });
  }),

  // タスク削除
  http.delete('/api/tasks/:id', async () => {
    await delay();
    return new HttpResponse(null, { status: 204 });
  }),
];

export const errorHandlers = [
  // タスク一覧取得エラー
  createErrorHandler('/api/tasks'),
  // タスク詳細取得エラー
  createErrorHandler('/api/tasks/:id'),
  // タスク作成エラー
  createErrorHandler('/api/tasks', 'POST'),
  // タスク更新エラー
  createErrorHandler('/api/tasks/:id', 'PATCH'),
  // タスク削除エラー
  createErrorHandler('/api/tasks/:id', 'DELETE'),
];
