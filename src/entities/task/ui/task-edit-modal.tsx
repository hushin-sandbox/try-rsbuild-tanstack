import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/shared/ui/dialog';
import { useUpdateTask } from '../api/useUpdateTask';
import type { NewTask, Task } from '../model/task';
import { TaskForm } from './task-form';

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

export function TaskEditModal({ open, onClose, task }: TaskEditModalProps) {
  const updateTask = useUpdateTask(task.id);

  const onSubmit = async (data: NewTask) => {
    await updateTask.mutateAsync(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タスクの編集</DialogTitle>
        </DialogHeader>
        <TaskForm
          defaultValues={{
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
          }}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitText="更新"
        />
      </DialogContent>
    </Dialog>
  );
}
