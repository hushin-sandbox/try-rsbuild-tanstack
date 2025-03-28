import { http, HttpResponse } from 'msw';
import { emptyTasks, sampleTasks } from '~/mocks/data';
import {
  createErrorHandlerGet,
  createLoadingHandlerGet,
} from '~/mocks/handlers/common';

const TASKS_API_PATH = '/api/tasks';

export const handlers = {
  // 正常系（タスクあり）
  default: http.get(TASKS_API_PATH, () => {
    return HttpResponse.json({ tasks: sampleTasks });
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
