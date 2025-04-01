import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../model/task';
import type { APIErrorResponse, TaskResponse } from './types';

async function updateTask(
  taskId: string,
  updates: Partial<Task>,
): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as APIErrorResponse;
    throw new Error(errorData.message || 'タスクの更新に失敗しました');
  }

  const data = (await response.json()) as TaskResponse;
  return data;
}

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Task>) => updateTask(taskId, updates),
    // 楽観的更新の実装
    onMutate: async (updates) => {
      // 既存のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // 以前のタスク一覧を保存
      const previousTasks = queryClient.getQueryData(['tasks']) as Task[];

      // キャッシュを更新
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return [];
        return old.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
                updatedAt: new Date().toISOString(),
                completedAt: updates.isCompleted
                  ? new Date().toISOString()
                  : task.completedAt,
              }
            : task,
        );
      });

      // コンテキストを返す
      return { previousTasks };
    },
    // エラー時にロールバック
    onError: (_, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    // 完了時にクエリを再検証
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
