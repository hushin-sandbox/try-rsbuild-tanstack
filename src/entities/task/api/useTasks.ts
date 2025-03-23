import { useSuspenseQuery } from '@tanstack/react-query';
import type { Task } from '../model/task';
import type { TasksResponse } from './types';

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data: TasksResponse = await response.json();
  return data.tasks;
}

export function useTasks() {
  return useSuspenseQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
}
