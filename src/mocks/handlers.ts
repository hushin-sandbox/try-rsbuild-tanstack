import { http, HttpResponse } from 'msw';
import type { APIErrorResponse } from '~/entities/task/api/types';
import type { NewTask, Task } from '~/entities/task/model/task';
import { createTask } from '~/entities/task/model/task';
import { API_ERROR_MESSAGES } from './lib/errors';
import { storageAdapter } from './lib/storage';

export const handlers = [
  // タスク一覧取得
  http.get('/api/tasks', () => {
    const tasks = storageAdapter.getTasks();
    return HttpResponse.json({ tasks }, { status: 200 });
  }),

  // タスク詳細取得
  http.get('/api/tasks/:id', ({ params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      const errorResponse: APIErrorResponse = {
        message: API_ERROR_MESSAGES.NOT_FOUND,
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }
    return HttpResponse.json(task, { status: 200 });
  }),

  // タスク作成
  http.post('/api/tasks', async ({ request }) => {
    const newTask = (await request.json()) as NewTask;
    const task = createTask(newTask);
    storageAdapter.saveTask(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  // タスク更新
  http.put('/api/tasks/:id', async ({ params, request }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      const errorResponse: APIErrorResponse = {
        message: API_ERROR_MESSAGES.NOT_FOUND,
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    const updates = (await request.json()) as Partial<Task>;
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storageAdapter.saveTask(updatedTask);
    return HttpResponse.json(updatedTask, { status: 200 });
  }),

  // タスク削除
  http.delete('/api/tasks/:id', ({ params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      const errorResponse: APIErrorResponse = {
        message: API_ERROR_MESSAGES.NOT_FOUND,
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    storageAdapter.deleteTask(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];
