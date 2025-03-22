import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { emptyTasks, sampleTasks } from '~/mocks/data';
import { TaskList } from './task-list';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const Decorator = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

const meta = {
  title: 'Entities/Task/TaskList',
  component: TaskList,
  decorators: [Decorator],
  parameters: {
    // デフォルトのモックハンドラー
    msw: {
      handlers: [
        http.get('/api/tasks', () => {
          return HttpResponse.json({
            data: { tasks: sampleTasks },
            status: 200,
          });
        }),
      ],
    },
  },
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof TaskList>;

// デフォルト（タスクあり）
export const Default: Story = {};

// ローディング状態
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/tasks', async () => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return HttpResponse.json({
            data: { tasks: sampleTasks },
            status: 200,
          });
        }),
      ],
    },
  },
};

// タスクが空の状態
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/tasks', () => {
          return HttpResponse.json({
            data: { tasks: emptyTasks },
            status: 200,
          });
        }),
      ],
    },
  },
};

// エラー状態
export const ErrorCase: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/tasks', () => {
          return HttpResponse.json(
            {
              status: 500,
              message: 'Internal Server Error',
            },
            { status: 500 },
          );
        }),
      ],
    },
  },
};
