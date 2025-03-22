import { http, HttpResponse } from 'msw';
import type { NewTask, Task } from '~/entities/task/model/task';
import { createTask } from '~/entities/task/model/task';
import { API_ERROR_MESSAGES } from './lib/errors';
import { storageAdapter } from './lib/storage';
import type {
  APIErrorResponse,
  TaskAPIResponse,
  TasksAPIResponse,
} from './lib/types';

export const handlers = [
  // タスク一覧取得
  http.get('/api/tasks', () => {
    const tasks = storageAdapter.getTasks();
    const response: TasksAPIResponse = {
      data: { tasks },
      status: 200,
    };
    return HttpResponse.json(response);
  }),

  // タスク詳細取得
  http.get('/api/tasks/:id', ({ params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      const errorResponse: APIErrorResponse = {
        status: 404,
        message: API_ERROR_MESSAGES.NOT_FOUND,
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }
    const response: TaskAPIResponse = {
      data: { task },
      status: 200,
    };
    return HttpResponse.json(response);
  }),

  // タスク作成
  http.post('/api/tasks', async ({ request }) => {
    const newTask = (await request.json()) as NewTask;
    const task = createTask(newTask);
    storageAdapter.saveTask(task);
    const response: TaskAPIResponse = {
      data: { task },
      status: 201,
      message: 'タスクが作成されました',
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  // タスク更新
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      const errorResponse: APIErrorResponse = {
        status: 404,
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

    const response: TaskAPIResponse = {
      data: { task: updatedTask },
      status: 200,
      message: 'タスクが更新されました',
    };
    return HttpResponse.json(response);
  }),

  // タスク削除
  http.delete('/api/tasks/:id', ({ params }) => {
    const task = storageAdapter.getTask(params.id as string);
    if (!task) {
      const errorResponse: APIErrorResponse = {
        status: 404,
        message: API_ERROR_MESSAGES.NOT_FOUND,
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    storageAdapter.deleteTask(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];
