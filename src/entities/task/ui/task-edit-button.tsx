import { useState } from 'react';
import { Button } from '~/shared/ui/button';
import type { Task } from '../model/task';
import { TaskEditModal } from './task-edit-modal';

interface TaskEditButtonProps {
  task: Task;
}

export function TaskEditButton({ task }: TaskEditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        編集
      </Button>
      {open && (
        <TaskEditModal open={open} onClose={() => setOpen(false)} task={task} />
      )}
    </>
  );
}
