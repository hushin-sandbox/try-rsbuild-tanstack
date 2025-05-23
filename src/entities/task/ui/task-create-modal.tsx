import { useState } from 'react';
import { Button } from '~/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/shared/ui/dialog';
import { useCreateTask } from '../api/useCreateTask';
import type { NewTask } from '../model/task';
import { TaskForm } from './task-form';

interface TaskCreateModalProps {
  defaultOpen?: boolean;
  parentId?: string;
  triggerComponent?: React.ReactNode;
}

export function TaskCreateModal({
  defaultOpen = false,
  parentId,
  triggerComponent,
}: TaskCreateModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (newTask: NewTask) => {
    try {
      await createTaskMutation.mutateAsync(newTask);
      // 成功したらモーダルを閉じる
      setOpen(false);
    } catch (error) {
      console.error('タスク作成エラー:', error);
      // エラーハンドリングはフォーム内で行われるため、ここでは何もしない
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerComponent || <Button>新規タスク作成</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {parentId ? 'サブタスク作成' : '新規タスク作成'}
          </DialogTitle>
          <DialogDescription>
            新しいタスクの詳細を入力してください。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TaskForm
            onSubmit={(newTask) => handleSubmit({ ...newTask, parentId })}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
