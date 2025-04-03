import { http, HttpResponse } from 'msw';
import { TaskMethods, type NewTask, type Task } from '~/entities/task/model/task';
import { API_ERROR_MESSAGES, createErrorHandler } from '../lib/errors';
import { createTask, storageAdapter } from '../lib/storage';

export const handlers = [
  // タスク一覧取得
  http.get('/api/tasks', async () => {
    const tasks = storageAdapter.getTasks();
    return HttpResponse.json({ tasks });
  }),

  // タスク詳細取得
  http.get('/api/tasks/:id', async ({ params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      return HttpResponse.json(
        { message: API_ERROR_MESSAGES.NOT_FOUND },
        { status: 404 },
      );
    }
    // サブタスクを取得
    const tasks = storageAdapter.getTasks();
    const subtasks = tasks.filter((t) => t.parentId === params.id);
    // 親タスクを取得
    const parentTask = task.parentId
      ? storageAdapter.getTask(task.parentId as string)
      : null;

    return HttpResponse.json({
      task,
      subtasks,
      parentTask,
    });
  }),

  // タスク作成
  http.post('/api/tasks', async ({ request }) => {
    const newTask = (await request.json()) as NewTask;
    const task = createTask(newTask);
    storageAdapter.saveTask(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  // タスク更新
  http.put('/api/tasks/:id', async ({ request, params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      return HttpResponse.json({ message: API_ERROR_MESSAGES.NOT_FOUND }, { status: 404 });
    }

    const updates = (await request.json()) as Partial<Task>;
    const updatedTask = TaskMethods.update(task, updates);
    storageAdapter.saveTask(updatedTask);
    return HttpResponse.json(updatedTask);
  }),

  // タスク削除
  http.delete('/api/tasks/:id', async ({ params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      return HttpResponse.json({ message: API_ERROR_MESSAGES.NOT_FOUND }, { status: 404 });
    }
    storageAdapter.deleteTask(params.id as string);
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
  createErrorHandler('/api/tasks/:id', 'PUT'),
  // タスク削除エラー
  createErrorHandler('/api/tasks/:id', 'DELETE'),
];
