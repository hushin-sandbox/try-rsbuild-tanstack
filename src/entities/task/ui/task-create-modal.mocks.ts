import { http, HttpResponse } from 'msw';
import { createErrorHandlerPost } from '~/mocks/handlers/common';
import { customDelay } from '~/mocks/lib/delay';
import type { Task } from '../model/task';

const API_PATH = '/api/tasks';

export const handlers = {
  // 正常系
  default: http.post(API_PATH, async () => {
    await customDelay(1000);
    return HttpResponse.json({}, { status: 201 });
  }),

  // エラー状態
  error: createErrorHandlerPost(API_PATH),

  // サブタスクが作成できない場合（親タスクがサブタスクの場合）
  subTaskError: http.post(API_PATH, async () => {
    await customDelay(500);
    return HttpResponse.json(
      {
        error: 'ValidationError',
        message: 'サブタスクの下にサブタスクは作成できません',
      },
      { status: 400 },
    );
  }),

  // サブタスク作成の正常系
  createSubTask: http.post(API_PATH, async ({ request }) => {
    await customDelay(500);
    const data = (await request.json()) as Partial<Task>;
    return HttpResponse.json(
      {
        ...data,
        id: 'subtask-test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),
};
