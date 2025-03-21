import * as v from 'valibot';
import {
  createTask,
  newTaskSchema,
  TaskMethods,
  type NewTask,
  type Task,
} from './task';

describe('Task Model', () => {
  describe('バリデーション', () => {
    describe('タイトル', () => {
      it('空文字列でエラーになること', () => {
        const input = {
          title: '',
          description: undefined,
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).toThrow(
          'タイトルは必須です'
        );
      });

      it('スペースのみでエラーになること', () => {
        const input = {
          title: '   ',
          description: undefined,
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).toThrow(
          'タイトルは必須です'
        );
      });

      it('1文字以上で成功すること', () => {
        const input = {
          title: 'テスト',
          description: undefined,
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).not.toThrow();
      });

      it('100文字で成功すること', () => {
        const input = {
          title: 'あ'.repeat(100),
          description: undefined,
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).not.toThrow();
      });

      it('101文字でエラーになること', () => {
        const input = {
          title: 'あ'.repeat(101),
          description: undefined,
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).toThrow(
          'タイトルは100文字以内で入力してください'
        );
      });
    });

    describe('説明', () => {
      it('1000文字で成功すること', () => {
        const input = {
          title: 'テスト',
          description: 'あ'.repeat(1000),
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).not.toThrow();
      });

      it('1001文字でエラーになること', () => {
        const input = {
          title: 'テスト',
          description: 'あ'.repeat(1001),
          status: 'todo',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        } as const;

        expect(() => v.parse(newTaskSchema, input)).toThrow(
          '説明は1000文字以内で入力してください'
        );
      });
    });

    describe('ステータス', () => {
      it.each(['todo', 'in_progress', 'done'] as const)(
        '%s が有効であること',
        (status) => {
          const input = {
            title: 'テスト',
            description: undefined,
            status,
            priority: 'medium',
            tags: [],
            isCompleted: false,
          } as const;

          expect(() => v.parse(newTaskSchema, input)).not.toThrow();
        }
      );

      it('無効な値でエラーになること', () => {
        const input = {
          title: 'テスト',
          description: undefined,
          status: 'invalid',
          priority: 'medium',
          tags: [],
          isCompleted: false,
        };

        expect(() => v.parse(newTaskSchema, input)).toThrow();
      });
    });

    describe('優先度', () => {
      it.each(['low', 'medium', 'high'] as const)(
        '%s が有効であること',
        (priority) => {
          const input = {
            title: 'テスト',
            description: undefined,
            status: 'todo',
            priority,
            tags: [],
            isCompleted: false,
          } as const;

          expect(() => v.parse(newTaskSchema, input)).not.toThrow();
        }
      );

      it('無効な値でエラーになること', () => {
        const input = {
          title: 'テスト',
          description: undefined,
          status: 'todo',
          priority: 'invalid',
          tags: [],
          isCompleted: false,
        };

        expect(() => v.parse(newTaskSchema, input)).toThrow();
      });
    });
  });

  describe('メソッド', () => {
    let task: Task;
    const newTask: NewTask = {
      title: 'テストタスク',
      description: 'テストの説明',
      status: 'todo',
      priority: 'medium',
      tags: [],
      isCompleted: false,
    };

    beforeEach(() => {
      task = createTask(newTask);
    });

    describe('createTask', () => {
      it('正しい初期値で Task が作成されること', () => {
        expect(task).toEqual({
          ...newTask,
          id: '00000000-0000-0000-0000-000000000000',
          createdAt: '2025-03-21T00:00:00.000Z',
          updatedAt: '2025-03-21T00:00:00.000Z',
          completedAt: undefined,
        });
      });

      it('isCompleted が true の場合 completedAt が設定されること', () => {
        const completedTask = createTask({ ...newTask, isCompleted: true });
        expect(completedTask.completedAt).toBe('2025-03-21T00:00:00.000Z');
      });
    });

    describe('toggleComplete', () => {
      it('未完了 → 完了の切り替えで completedAt が設定されること', () => {
        const updatedTask = TaskMethods.toggleComplete(task);
        expect(updatedTask.isCompleted).toBe(true);
        expect(updatedTask.completedAt).toBe('2025-03-21T00:00:00.000Z');
      });

      it('完了 → 未完了の切り替えで completedAt が undefined になること', () => {
        const completedTask = TaskMethods.toggleComplete(task);
        const updatedTask = TaskMethods.toggleComplete(completedTask);
        expect(updatedTask.isCompleted).toBe(false);
        expect(updatedTask.completedAt).toBeUndefined();
      });
    });

    describe('update', () => {
      it('部分的な更新が正しく行われること', () => {
        const updates = {
          title: '更新されたタイトル',
          priority: 'high' as const,
        };
        const updatedTask = TaskMethods.update(task, updates);
        expect(updatedTask.title).toBe('更新されたタイトル');
        expect(updatedTask.priority).toBe('high');
        expect(updatedTask.description).toBe(task.description);
      });

      it('updatedAt が更新されること', () => {
        const updates = { title: '新しいタイトル' };
        const updatedTask = TaskMethods.update(task, updates);
        expect(updatedTask.updatedAt).toBe('2025-03-21T00:00:00.000Z');
      });
    });

    describe('isSubtask', () => {
      it('parentId がある場合に true を返すこと', () => {
        const subtask = createTask({ ...newTask, parentId: '123' });
        expect(TaskMethods.isSubtask(subtask)).toBe(true);
      });

      it('parentId がない場合に false を返すこと', () => {
        expect(TaskMethods.isSubtask(task)).toBe(false);
      });
    });

    describe('isRecurring', () => {
      it('recurrenceRule がある場合に true を返すこと', () => {
        const recurringTask = createTask({
          ...newTask,
          recurrenceRule: {
            frequency: 'daily',
            interval: 1,
          },
        });
        expect(TaskMethods.isRecurring(recurringTask)).toBe(true);
      });

      it('recurrenceRule がない場合に false を返すこと', () => {
        expect(TaskMethods.isRecurring(task)).toBe(false);
      });
    });

    describe('isOverdue', () => {
      it('期限切れの場合に true を返すこと', () => {
        const overdueTask = createTask({
          ...newTask,
          dueDate: '2025-03-20T00:00:00.000Z',
        });
        expect(TaskMethods.isOverdue(overdueTask)).toBe(true);
      });

      it('期限内の場合に false を返すこと', () => {
        const activeTask = createTask({
          ...newTask,
          dueDate: '2025-03-22T00:00:00.000Z',
        });
        expect(TaskMethods.isOverdue(activeTask)).toBe(false);
      });

      it('完了済みの場合に false を返すこと', () => {
        const completedTask = createTask({
          ...newTask,
          dueDate: '2025-03-20T00:00:00.000Z',
          isCompleted: true,
        });
        expect(TaskMethods.isOverdue(completedTask)).toBe(false);
      });
    });
  });
});
