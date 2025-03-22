import * as v from 'valibot';
import { useAppForm } from '~/shared/lib/form';
import { Button } from '~/shared/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/ui/form';
import { Input } from '~/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/ui/select';
import { Textarea } from '~/shared/ui/textarea';
import { type NewTask, newTaskSchema } from '../model/task';
import type { TaskPriority, TaskStatus } from '../model/types';

// フォームのサブセットスキーマ（最小限のフィールド + description）
const taskFormSchema = v.object({
  title: newTaskSchema.entries.title,
  description: newTaskSchema.entries.description,
  status: newTaskSchema.entries.status,
  priority: newTaskSchema.entries.priority,
});

// 型を自動生成
type TaskFormValues = v.InferOutput<typeof taskFormSchema>;

// デフォルト値
const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
};

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>;
  onCancel?: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: taskFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // バリデーション
        const validated = v.parse(taskFormSchema, value);

        // 完全なNewTaskオブジェクトを作成
        const newTask: NewTask = {
          ...validated,
          dueDate: undefined,
          parentId: undefined,
          tags: [],
          isCompleted: false,
          recurrenceRule: undefined,
        };

        // 送信処理
        await onSubmit(newTask);
      } catch (error) {
        if (error instanceof v.ValiError) {
          console.error('Validation error:', error.issues);
          return;
        }
        console.error('Unknown error:', error);
      }
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* タイトルフィールド */}
      <form.AppField name="title">
        {(field) => (
          <FormField name={field.name}>
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="タスクのタイトルを入力"
                />
              </FormControl>
              <FormDescription>
                タスクの内容を簡潔に入力してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      </form.AppField>

      {/* 説明フィールド */}
      <form.AppField name="description">
        {(field) => (
          <FormField name={field.name}>
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="タスクの詳細な説明を入力"
                />
              </FormControl>
              <FormDescription>
                タスクの詳細を記述してください（1000文字以内）
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      </form.AppField>

      {/* ステータスフィールド */}
      <form.AppField name="status">
        {(field) => (
          <FormField name={field.name}>
            <FormItem>
              <FormLabel>ステータス</FormLabel>
              <FormControl>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as TaskStatus)
                  }
                  onOpenChange={() => field.handleBlur()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">未着手</SelectItem>
                    <SelectItem value="in_progress">進行中</SelectItem>
                    <SelectItem value="done">完了</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      </form.AppField>

      {/* 優先度フィールド */}
      <form.AppField name="priority">
        {(field) => (
          <FormField name={field.name}>
            <FormItem>
              <FormLabel>優先度</FormLabel>
              <FormControl>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as TaskPriority)
                  }
                  onOpenChange={() => field.handleBlur()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="優先度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        )}
      </form.AppField>

      {/* フォームアクション */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        )}
        <Button type="submit" disabled={!form.state.canSubmit}>
          作成
        </Button>
      </div>
    </Form>
  );
}
