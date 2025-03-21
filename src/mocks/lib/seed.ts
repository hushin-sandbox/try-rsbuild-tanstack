import type { NewTask } from '~entities/task/model/task';
import { storageAdapter, createTask } from './storage';

const sampleTasks: NewTask[] = [
  {
    title: 'タスク管理アプリの実装',
    description: 'React + TypeScript + MSWでタスク管理アプリを実装する',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2025-03-28T00:00:00Z',
    tags: ['frontend', 'react', 'typescript'],
    isCompleted: false,
  },
  {
    title: 'MSWのテスト実装',
    description: 'APIモックのテストを実装する',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-03-22T00:00:00Z',
    tags: ['test', 'msw'],
    isCompleted: false,
  },
];

export function seedTasks(): void {
  for (const task of sampleTasks) {
    const newTask = createTask(task);
    storageAdapter.saveTask(newTask);
  }
}
