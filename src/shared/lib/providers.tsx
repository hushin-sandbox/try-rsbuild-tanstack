import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { AppErrorBoundary } from '../ui/error-boundary';
import { LoadingFallback } from '../ui/loading';

type QueryClientOptions = {
  retry?: boolean;
};

export function createQueryClient(options?: QueryClientOptions) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        // Suspense モードではエラー時のみ ErrorBoundary にスローします
        throwOnError: (_error, query) => {
          return typeof query.state.data === 'undefined';
        },
        retry: options?.retry ?? true,
      },
    },
  });
}

const defaultQueryClient = createQueryClient();

export function Providers({
  children,
  queryClient = defaultQueryClient,
}: {
  children: ReactNode;
  queryClient?: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </AppErrorBoundary>
    </QueryClientProvider>
  );
}
