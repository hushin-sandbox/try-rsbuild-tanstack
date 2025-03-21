import { Badge } from '~shared/ui/badge';
import { useTasks } from '../api/useTasks';
import type { Task } from '../model/task';

export function TaskList() {
  const { data: tasks } = useTasks();

  if (tasks.length === 0) {
    return <div className="text-center p-4">タスクがありません</div>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <li className="p-4 border rounded hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
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
