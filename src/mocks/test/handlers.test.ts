import { setupServer } from 'msw/node';
import { describe, expect, it } from 'vitest';
import { handlers } from '../handlers';

const server = setupServer(...handlers);

// テスト前の共通セットアップ
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

describe('Task API Handlers', () => {
  const baseDate = '2025-03-21T00:00:00.000Z';
  const sampleTask = {
    title: 'テストタスク',
    description: 'テスト用のタスク',
    status: 'todo',
    priority: 'medium',
    tags: ['test'],
    isCompleted: false,
  } as const;

  describe('GET /api/tasks', () => {
    it('タスク一覧を取得できること', async () => {
      const response = await fetch('/api/tasks');
      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(result.tasks).toEqual([]);
    });
  });

  describe('POST /api/tasks', () => {
    it('タスクを作成できること', async () => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleTask),
      });
      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
      expect(result).toMatchObject({
        ...sampleTask,
        id: '00000000-0000-0000-0000-000000000000',
        createdAt: baseDate,
        updatedAt: baseDate,
      });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('存在するタスクを取得できること', async () => {
      // タスクを作成
      const createResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleTask),
      });
      const task = await createResponse.json();

      // 作成したタスクを取得
      const response = await fetch(`/api/tasks/${task.id}`);
      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(result).toEqual(task);
    });

    it('存在しないタスクの場合404を返すこと', async () => {
      const response = await fetch('/api/tasks/non-existent-id');
      const result = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(result.message).toBe('リソースが見つかりません');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('タスクを更新できること', async () => {
      // タスクを作成
      const createResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleTask),
      });
      const task = await createResponse.json();

      // タスクを更新
      const updates = { title: '更新されたタスク', isCompleted: true };
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(result).toEqual({
        ...task,
        ...updates,
        updatedAt: baseDate,
      });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('タスクを削除できること', async () => {
      // タスクを作成
      const createResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleTask),
      });
      const task = await createResponse.json();

      // タスクを削除
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(204);

      // 削除されたことを確認
      const getResponse = await fetch(`/api/tasks/${task.id}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
