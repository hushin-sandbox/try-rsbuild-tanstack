import * as v from 'valibot';

// Task Status
export const taskStatusSchema = v.union([
  v.literal('todo'),
  v.literal('in_progress'),
  v.literal('done'),
]);
export type TaskStatus = 'todo' | 'in_progress' | 'done';

// Task Priority
export const taskPrioritySchema = v.union([
  v.literal('low'),
  v.literal('medium'),
  v.literal('high'),
]);
export type TaskPriority = 'low' | 'medium' | 'high';

// Recurrence Frequency
export const recurrenceFrequencySchema = v.union([
  v.literal('daily'),
  v.literal('weekly'),
  v.literal('monthly'),
]);
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';
