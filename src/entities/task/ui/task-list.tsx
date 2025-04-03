import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge } from '~/shared/ui/badge';
import { Button } from '~/shared/ui/button';
import { useDeleteTask } from '../api/useDeleteTask';
import { useTasks } from '../api/useTasks';
import type { Task } from '../model/task';
import { TaskMethods } from '../model/task';
import { TaskCreateModal } from './task-create-modal';
import { TaskDeleteDialog } from './task-delete-dialog';
import { TaskEditButton } from './task-edit-button';

export function TaskList() {
  const { data: tasks } = useTasks();
  // ルートレベルのタスクのみを表示
  const rootTasks = tasks.filter((task) => !task.parentId);

  if (tasks.length === 0) {
    return <div className="text-center p-4">タスクがありません</div>;
  }

  return (
    <ul className="space-y-2">
      {rootTasks.map((task) => (
        <TaskItem key={task.id} task={task} tasks={tasks} />
      ))}
    </ul>
  );
}

function TaskItem({ task, tasks }: { task: Task; tasks: Task[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: deleteTask } = useDeleteTask();
  const subtasks = TaskMethods.getSubtasks(tasks, task.id);
  const hasSubtasks = subtasks.length > 0;

  return (
    <li className="p-4 border rounded hover:bg-gray-50">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '▼' : '▶'}
              </Button>
            )}
            <Link
              to="/tasks/$taskId"
              params={{ taskId: task.id }}
              className="hover:underline"
            >
              <h3 className="font-semibold">{task.title}</h3>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <div className="flex items-center gap-2">
              {!TaskMethods.isSubtask(task) && (
                <TaskCreateModal
                  parentId={task.id}
                  triggerComponent={
                    <Button variant="ghost" size="sm">
                      サブタスク追加
                    </Button>
                  }
                />
              )}
              <TaskEditButton task={task} />
              <TaskDeleteDialog
                task={task}
                onConfirm={() => deleteTask(task.id)}
              />
            </div>
          </div>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600">
            {truncateText(task.description, 200)}
          </p>
        )}
      </div>
      {isExpanded && hasSubtasks && (
        <div className="ml-6 mt-2 space-y-2">
          <SubtaskList subtasks={subtasks} tasks={tasks} />
        </div>
      )}
    </li>
  );
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const variant = {
    todo: 'secondary',
    in_progress: 'default',
    done: 'outline',
  } as const;

  const labels = {
    todo: '未着手',
    in_progress: '進行中',
    done: '完了',
  };

  return <Badge variant={variant[status]}>{labels[status]}</Badge>;
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const variant = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
  } as const;

  const labels = {
    low: '低',
    medium: '中',
    high: '高',
  };

  return <Badge variant={variant[priority]}>{labels[priority]}</Badge>;
}

function SubtaskList({
  subtasks,
  tasks,
}: {
  subtasks: Task[];
  tasks: Task[];
}) {
  return (
    <ul className="space-y-2">
      {subtasks.map((subtask) => (
        <TaskItem key={subtask.id} task={subtask} tasks={tasks} />
      ))}
    </ul>
  );
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}
