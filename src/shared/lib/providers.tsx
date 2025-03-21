import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { AppErrorBoundary } from '../ui/error-boundary';
import { LoadingFallback } from '../ui/loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      // Suspense モードではエラー時のみ ErrorBoundary にスローします
      throwOnError: (error, query) => {
        return typeof query.state.data === 'undefined';
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </AppErrorBoundary>
    </QueryClientProvider>
  );
}
