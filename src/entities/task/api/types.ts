import type { NewTask, Task } from '../model/task';

// タスク関連のレスポンス型
export type TasksResponse = {
  tasks: Task[];
};

export type TaskResponse = Task;

export type TaskDetailResponse = {
  task: Task;
  subtasks: Task[];
  parentTask: Task | null;
};

// エラーレスポンス
export interface APIErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// リクエスト型
export type CreateTaskRequest = NewTask;
export type UpdateTaskRequest = Partial<Task>;
