import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Button } from './button';
import { Card } from './card';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Card className="p-4">
      <div className="text-red-500 font-bold">エラーが発生しました</div>
      <pre className="text-sm overflow-auto my-2">{error.message}</pre>
      <Button onClick={resetErrorBoundary} size="sm">
        再試行
      </Button>
    </Card>
  );
}

interface Props {
  children: ReactNode;
}

export function AppErrorBoundary({ children }: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          FallbackComponent={ErrorFallback}
          onError={(error) => {
            // エラーのログ記録などが必要な場合はここに追加
            console.error('Caught error:', error);
          }}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
