import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { APIErrorResponse } from './types';

async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData: APIErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // タスク一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
