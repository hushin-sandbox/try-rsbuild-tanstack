import { http, HttpResponse } from 'msw';
import { createErrorHandlerPost } from '~/mocks/handlers/common';
import { customDelay } from '~/mocks/lib/delay';

const API_PATH = '/api/tasks';

export const handlers = {
  // 正常系
  default: http.post(API_PATH, async () => {
    await customDelay(1000);
    return HttpResponse.json({}, { status: 201 });
  }),

  // エラー状態
  error: createErrorHandlerPost(API_PATH),
};
