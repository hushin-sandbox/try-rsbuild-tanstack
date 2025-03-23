import type { Task } from '~/entities/task/model/task';

export type TasksResponse = {
  tasks: Task[];
};

export type TaskResponse = Task;

export type APIErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};
