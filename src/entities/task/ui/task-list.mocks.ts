import { http, HttpResponse } from 'msw';
import { emptyTasks, sampleTasks } from '~/mocks/data';
import {
  createErrorHandler,
  createLoadingHandler,
} from '~/mocks/handlers/common';

const TASKS_API_PATH = '/api/tasks';

export const handlers = {
  // 正常系（タスクあり）
  default: http.get(TASKS_API_PATH, () => {
    return HttpResponse.json({
      data: { tasks: sampleTasks },
      status: 200,
    });
  }),

  // ローディング状態
  loading: createLoadingHandler(TASKS_API_PATH),

  // タスクが空の状態
  empty: http.get(TASKS_API_PATH, () => {
    return HttpResponse.json({
      data: { tasks: emptyTasks },
      status: 200,
    });
  }),

  // エラー状態
  error: createErrorHandler(TASKS_API_PATH),
};
