import { delay, http, HttpResponse } from 'msw';

// Loading状態のGETハンドラー
export const createLoadingHandlerGet = (path: string) =>
  http.get(path, async () => {
    await delay('infinite');
    return new HttpResponse(null, { status: 200 });
  });

// エラー状態のGETハンドラー
export const createErrorHandlerGet = (path: string, status = 500) =>
  http.get(path, () => {
    return HttpResponse.json(
      {
        status,
        message: 'Internal Server Error',
      },
      { status },
    );
  });

// Loading状態のPOSTハンドラー
export const createLoadingHandlerPost = (path: string) =>
  http.post(path, async () => {
    await delay('infinite');
    return new HttpResponse(null, { status: 200 });
  });

// エラー状態のPOSTハンドラー
export const createErrorHandlerPost = (path: string, status = 500) =>
  http.post(path, () => {
    return HttpResponse.json(
      {
        status,
        message: 'Internal Server Error',
      },
      { status },
    );
  });
