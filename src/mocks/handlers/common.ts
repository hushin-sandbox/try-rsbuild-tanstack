import { http, type HttpHandler, HttpResponse } from 'msw';
import { customDelay } from '../lib/delay';

// 汎用的なエラーハンドラー作成関数
export const createErrorHandler = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  status = 500,
): HttpHandler => {
  const response = HttpResponse.json(
    {
      status,
      message: 'Internal Server Error',
    },
    { status },
  );

  switch (method) {
    case 'GET':
      return http.get(path, () => response);
    case 'POST':
      return http.post(path, () => response);
    case 'PUT':
      return http.put(path, () => response);
    case 'DELETE':
      return http.delete(path, () => response);
  }
};

// Loading状態の汎用ハンドラー作成関数
export const createLoadingHandler = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
): HttpHandler => {
  const response = async () => {
    await customDelay('infinite');
    return new HttpResponse(null, { status: 200 });
  };

  switch (method) {
    case 'GET':
      return http.get(path, response);
    case 'POST':
      return http.post(path, response);
    case 'PUT':
      return http.put(path, response);
    case 'DELETE':
      return http.delete(path, response);
  }
};

// Loading状態のGETハンドラー
export const createLoadingHandlerGet = (path: string) =>
  http.get(path, async () => {
    await customDelay('infinite');
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
    await customDelay('infinite');
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
