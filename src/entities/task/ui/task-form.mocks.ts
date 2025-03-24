import { http, HttpResponse } from 'msw';

const API_PATH = '/api/tasks';

export const handlers = {
  // 正常系
  default: http.post(API_PATH, async () => {
    return HttpResponse.json(
      {
        id: '1',
        title: 'テストタスク',
        description: 'これはテストタスクの説明です',
        status: 'in_progress',
        priority: 'high',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      },
      { status: 201 },
    );
  }),

  // エラー系
  error: http.post(API_PATH, () => {
    return HttpResponse.json(
      {
        message: 'タスクの作成に失敗しました',
      },
      { status: 500 },
    );
  }),
};
