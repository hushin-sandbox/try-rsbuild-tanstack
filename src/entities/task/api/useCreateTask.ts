import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NewTask, Task } from '../model/task';

interface TaskAPIResponse {
  data: {
    task: Task;
  };
  status: number;
  message?: string;
}

interface APIErrorResponse {
  status: number;
  message: string;
}

async function createTask(newTask: NewTask): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as APIErrorResponse;
    throw new Error(errorData.message || 'タスクの作成に失敗しました');
  }

  const data = (await response.json()) as TaskAPIResponse;
  return data.data.task;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // タスク一覧のキャッシュを更新
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
  });
}
