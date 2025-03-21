import type { Task } from '../model/task';
import { useTasks } from '../api/useTasks';

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
  const colors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  const labels = {
    todo: '未着手',
    in_progress: '進行中',
    done: '完了',
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const labels = {
    low: '低',
    medium: '中',
    high: '高',
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${colors[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
