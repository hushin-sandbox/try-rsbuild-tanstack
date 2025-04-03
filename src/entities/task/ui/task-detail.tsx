import { Link } from '@tanstack/react-router';
import { Badge } from '~/shared/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/shared/ui/card';
import type { TaskDetailResponse } from '../api/types';
import { TaskDeleteDialog } from './task-delete-dialog';
import { TaskEditButton } from './task-edit-button';

export function TaskDetail({ taskDetail }: { taskDetail: TaskDetailResponse }) {
  const { task, subtasks, parentTask } = taskDetail;
  const {
    title,
    description,
    status,
    priority,
    tags,
    createdAt,
    updatedAt,
    completedAt,
    dueDate,
  } = task;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {parentTask && (
            <div className="mb-2">
              親タスク:{' '}
              <Link to="/tasks/$taskId" params={{ taskId: parentTask.id }}>
                {parentTask.title}
              </Link>
            </div>
          )}
          <div className="flex gap-2">
            <Badge>{status}</Badge>
            <Badge variant="outline">{priority}</Badge>
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardDescription>
        <CardAction className="flex gap-2">
          <TaskEditButton task={task} />
          <TaskDeleteDialog
            task={task}
            onConfirm={() => {
              // 削除後にホームページに遷移
              window.location.href = '/';
            }}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        {description && (
          <div className="whitespace-pre-wrap">{description}</div>
        )}
        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div>作成日時: {new Date(createdAt).toLocaleString()}</div>
          <div>更新日時: {new Date(updatedAt).toLocaleString()}</div>
          {completedAt && (
            <div>完了日時: {new Date(completedAt).toLocaleString()}</div>
          )}
          {dueDate && <div>期限: {new Date(dueDate).toLocaleString()}</div>}
        </div>
      </CardContent>

      {subtasks.length > 0 && (
        <CardFooter className="flex-col items-start gap-2">
          <h2 className="text-lg font-semibold">サブタスク</h2>
          <div className="flex w-full flex-col gap-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between gap-2 rounded-lg border p-4"
              >
                <div>
                  <Link
                    to="/tasks/$taskId"
                    params={{ taskId: subtask.id }}
                    className="hover:underline"
                  >
                    {subtask.title}
                  </Link>
                  <div className="flex gap-2">
                    <Badge>{subtask.status}</Badge>
                    <Badge variant="outline">{subtask.priority}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <TaskEditButton task={subtask} />
                  <TaskDeleteDialog
                    task={subtask}
                    onConfirm={() => {
                      // サブタスク削除後に現在のページを更新
                      window.location.reload();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
