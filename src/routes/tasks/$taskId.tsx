import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useTask } from '~/entities/task/api/useTask';
import { TaskDetail } from '~/entities/task/ui/task-detail';
import { AppErrorBoundary } from '~/shared/ui/error-boundary';
import { LoadingFallback } from '~/shared/ui/loading';

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const { data } = useTask(taskId);

  return <TaskDetail taskDetail={data} />;
}

export const Route = createFileRoute('/tasks/$taskId')({
  component: () => (
    <AppErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <TaskDetailPage />
      </Suspense>
    </AppErrorBoundary>
  ),
});
