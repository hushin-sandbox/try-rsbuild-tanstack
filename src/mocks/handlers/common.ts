import { delay, http, HttpResponse } from 'msw';

// Loading状態のハンドラー
export const createLoadingHandler = (path: string) =>
  http.get(path, async () => {
    await delay('infinite');
    return new HttpResponse(null, { status: 200 });
  });

// エラー状態のハンドラー
export const createErrorHandler = (path: string, status = 500) =>
  http.get(path, () => {
    return HttpResponse.json(
      {
        status,
        message: 'Internal Server Error',
      },
      { status },
    );
  });
