import type { Meta, StoryObj } from '@storybook/react';
import type { Task } from '../model/task';
import { TaskDeleteDialog } from './task-delete-dialog';

const sampleTask: Task = {
  id: '1',
  title: 'サンプルタスク',
  description: 'これは削除確認ダイアログのサンプルタスクです。',
  status: 'todo',
  priority: 'medium',
  tags: [],
  isCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta = {
  component: TaskDeleteDialog,
  args: {
    task: sampleTask,
    onConfirm: () => {},
  },
} satisfies Meta<typeof TaskDeleteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
