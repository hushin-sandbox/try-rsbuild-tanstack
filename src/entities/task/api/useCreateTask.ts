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
    // 楽観的更新の実装
    onMutate: async (newTask) => {
      // 既存のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // 以前のタスク一覧を保存
      const previousTasks = queryClient.getQueryData(['tasks']) as Task[];

      // 新しいタスクを一時的に追加
      const tempTask: Task = {
        ...newTask,
        id: `temp-${Date.now()}`, // 一時的なID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: newTask.isCompleted ? new Date().toISOString() : undefined,
      };

      // キャッシュを更新
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return old ? [tempTask, ...old] : [tempTask];
      });

      // コンテキストを返す
      return { previousTasks };
    },
    // サーバーからの応答で実際のデータに更新
    onSuccess: (newTask, _, context) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return [newTask];
        // 一時的なタスクを実際のタスクに置き換え
        return old.map((task) =>
          task.id.startsWith('temp-') ? newTask : task,
        );
      });
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
