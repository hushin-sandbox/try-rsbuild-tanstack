import * as v from 'valibot';
import {
  recurrenceFrequencySchema,
  taskPrioritySchema,
  taskStatusSchema,
} from './types';

// Recurrence Rule Schema
const recurrenceRuleSchema = v.object({
  frequency: recurrenceFrequencySchema,
  interval: v.number(),
  endDate: v.optional(v.string()),
});

// 型を自動生成
export type RecurrenceRule = v.InferOutput<typeof recurrenceRuleSchema>;

// Base Task Fields
const baseTaskSchema = v.object({
  title: v.pipe(
    v.string('タイトルは文字列である必要があります'),
    v.transform((value) => value.trim()),
    v.minLength(1, 'タイトルは必須です'),
    v.maxLength(100, 'タイトルは100文字以内で入力してください'),
  ),
  description: v.optional(
    v.pipe(
      v.string('説明は文字列である必要があります'),
      v.maxLength(1000, '説明は1000文字以内で入力してください'),
    ),
  ),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: v.optional(v.string()),
  parentId: v.optional(v.string()),
  tags: v.array(v.string()),
  isCompleted: v.boolean(),
  recurrenceRule: v.optional(recurrenceRuleSchema),
});

// 型を自動生成
export type BaseTask = v.InferOutput<typeof baseTaskSchema>;

// New Task Schema (作成時に使用)
export const newTaskSchema = baseTaskSchema;
export type NewTask = v.InferOutput<typeof newTaskSchema>;

// Task Schema (既存のタスク)
export const taskSchema = v.object({
  ...baseTaskSchema.entries,
  id: v.string('IDは文字列である必要があります'),
  createdAt: v.string('作成日時は文字列である必要があります'),
  updatedAt: v.string('更新日時は文字列である必要があります'),
  completedAt: v.optional(v.string('完了日時は文字列である必要があります')),
});

export type Task = v.InferOutput<typeof taskSchema>;

// Task Factory
export const createTask = (data: NewTask): Task => {
  const now = new Date().toISOString();
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    completedAt: data.isCompleted ? now : undefined,
  };
};

// Task Methods
export const TaskMethods = {
  toggleComplete(task: Task): Task {
    const now = new Date().toISOString();
    return {
      ...task,
      isCompleted: !task.isCompleted,
      completedAt: !task.isCompleted ? now : undefined,
      updatedAt: now,
    };
  },

  update(task: Task, updates: Partial<NewTask>): Task {
    return {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },

  isSubtask(task: Task): boolean {
    return Boolean(task.parentId);
  },

  isRecurring(task: Task): boolean {
    return Boolean(task.recurrenceRule);
  },

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.isCompleted) {
      return false;
    }
    return new Date(task.dueDate) < new Date();
  },

  // サブタスクを取得
  getSubtasks(tasks: Task[], parentId: string): Task[] {
    return tasks.filter((task) => task.parentId === parentId);
  },

  // サブタスクを再帰的に取得
  getAllSubtasks(tasks: Task[], parentId: string): Task[] {
    const directSubtasks = this.getSubtasks(tasks, parentId);
    const allSubtasks = [...directSubtasks];

    for (const subtask of directSubtasks) {
      const nestedSubtasks = this.getAllSubtasks(tasks, subtask.id);
      allSubtasks.push(...nestedSubtasks);
    }

    return allSubtasks;
  },

  // サブタスク作成時のバリデーション
  validateSubtaskCreation(parentTask: Task): void {
    if (parentTask.parentId) {
      throw new TaskValidationError(
        'サブタスクの下にサブタスクは作成できません',
      );
    }
  },
};

// Custom Error
export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskValidationError';
  }
}
