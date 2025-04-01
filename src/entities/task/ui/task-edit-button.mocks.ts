import { http, HttpResponse } from 'msw';
import { sampleTasks } from '~/mocks/data';

export const handlers = {
  // 更新成功
  updateSuccess: http.put('/api/tasks/:id', async ({ params }) => {
    const foundTask = sampleTasks.find((task) => task.id === params.id);
    if (!foundTask) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(foundTask);
  }),

  // 更新エラー
  updateError: http.put('/api/tasks/:id', () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'タスクの更新に失敗しました',
    });
  }),
};
