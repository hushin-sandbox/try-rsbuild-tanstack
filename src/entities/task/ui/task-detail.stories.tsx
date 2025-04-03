import type { Meta, StoryObj } from '@storybook/react';
import { http } from 'msw';
import { TaskDetail } from './task-detail';
import {
  mockTaskDetail,
  mockTaskDetailWithoutParent,
  mockTaskDetailWithoutSubtasks,
} from './task-detail.mocks';

const meta = {
  component: TaskDetail,
  parameters: {
    msw: {
      handlers: [
        http.post(
          '/api/tasks/:id/done',
          () => new Response(null, { status: 204 }),
        ),
        http.delete(
          '/api/tasks/:id',
          () => new Response(null, { status: 204 }),
        ),
      ],
    },
  },
} satisfies Meta<typeof TaskDetail>;

export default meta;

type Story = StoryObj<typeof TaskDetail>;

export const Default: Story = {
  args: {
    taskDetail: mockTaskDetail,
  },
};

export const WithoutParent: Story = {
  args: {
    taskDetail: mockTaskDetailWithoutParent,
  },
};

export const WithoutSubtasks: Story = {
  args: {
    taskDetail: mockTaskDetailWithoutSubtasks,
  },
};
