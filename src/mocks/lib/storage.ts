import type { Task } from '~/entities/task/model/task';
import { createTask } from '~/entities/task/model/task';

const STORAGE_KEY = 'tasks';

export const storageAdapter = {
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTask(id: string): Task | undefined {
    return this.getTasks().find((task) => task.id === id);
  },

  saveTask(task: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter((task) => task.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};

export { createTask };
