import type { Task } from '~entities/task/model/task';

export type APIResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

export type TasksAPIResponse = APIResponse<{
  tasks: Task[];
}>;

export type TaskAPIResponse = APIResponse<{
  task: Task;
}>;

export type APIErrorResponse = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};
