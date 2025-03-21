import { useSuspenseQuery } from '@tanstack/react-query';
import type { Task } from '../model/task';

interface TasksAPIResponse {
  data: {
    tasks: Task[];
  };
  status: number;
  message?: string;
}

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data: TasksAPIResponse = await response.json();
  return data.data.tasks;
}

export function useTasks() {
  return useSuspenseQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
}
