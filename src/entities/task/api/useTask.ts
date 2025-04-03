import { useSuspenseQuery } from '@tanstack/react-query';
import type { TaskDetailResponse } from './types';

async function fetchTask(id: string): Promise<TaskDetailResponse> {
  const response = await fetch(`/api/tasks/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  return response.json();
}

export function useTask(id: string) {
  return useSuspenseQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
  });
}
