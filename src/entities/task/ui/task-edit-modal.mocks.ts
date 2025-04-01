import { http, HttpResponse } from 'msw';
import { sampleTasks } from '~/mocks/data/tasks';
import { createErrorHandler } from '~/mocks/handlers/common';

export const handlers = {
  default: http.put('/api/tasks/:id', () => {
    return HttpResponse.json(sampleTasks[0], { status: 200 });
  }),
  error: createErrorHandler('PUT', '/api/tasks/:id'),
};
