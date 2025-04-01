import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/shared/ui/dialog';
import type { Task } from '../model/task';

interface TaskDeleteDialogProps {
  task: Task;
  onConfirm: () => void;
}

export function TaskDeleteDialog({ task, onConfirm }: TaskDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="タスクを削除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タスクの削除</DialogTitle>
          <DialogDescription>
            「{task.title}」を削除してよろしいですか？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
