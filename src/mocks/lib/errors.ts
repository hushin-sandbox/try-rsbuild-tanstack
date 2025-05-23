import { http, HttpResponse } from 'msw';

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): never {
  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new APIError(500, error.message);
  }

  throw new APIError(500, 'Unknown error occurred');
}

export const API_ERROR_MESSAGES = {
  NOT_FOUND: 'リソースが見つかりません',
  INVALID_REQUEST: 'リクエストが無効です',
  INTERNAL_ERROR: 'サーバーエラーが発生しました',
};

export function createErrorHandler(
  path: string,
  method = 'GET',
  status = 500,
  message: string = API_ERROR_MESSAGES.INTERNAL_ERROR,
) {
  return http[method.toLowerCase() as 'get' | 'post' | 'put' | 'delete'](
    path,
    () => {
      return HttpResponse.json({ message }, { status });
    },
  );
}
