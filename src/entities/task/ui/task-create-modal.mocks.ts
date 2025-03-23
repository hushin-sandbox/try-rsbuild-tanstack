import { delay, http, HttpResponse } from 'msw';
import { createErrorHandlerPost } from '~/mocks/handlers/common';

const API_PATH = '/api/tasks';

export const handlers = {
  // 正常系
  default: http.post(API_PATH, async () => {
    await delay(1000);
    return HttpResponse.json({ data: {}, status: 201 });
  }),

  // エラー状態
  error: createErrorHandlerPost(API_PATH),
};
