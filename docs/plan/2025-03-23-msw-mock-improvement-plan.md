# MSW モックレスポンス改善計画

## 現状の課題

1. レスポンスボディに HTTP ステータスを含めている
   - REST API のプラクティスとして不適切
   - ステータスは HTTP レスポンスヘッダーで表現すべき
   - レスポンスボディに status を含めることで冗長な情報になっている

2. レスポンス構造が複雑
   - 不必要な `data` ラッパーを使用している
   - REST API の原則であるシンプルさが損なわれている

3. エラーレスポンスの構造が不適切
   - エラーレスポンスにも status を含めている
   - エラーメッセージの構造が統一されていない

## 改善案

### 1. レスポンス型の見直し

```typescript
// Before
type APIResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

type TasksAPIResponse = APIResponse<{
  tasks: Task[];
}>;

// After
type TasksResponse = {
  tasks: Task[];
};

type TaskResponse = Task;

// エラーレスポンス
type APIErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};
```

### 2. レスポンスの実装方針

1. 成功レスポンス（2xx）
   - リソースを直接返す（`data` ラッパーなし）
   - HTTP ステータスコードで状態を表現
   - 例：
     ```typescript
     // リソースの配列を返す場合
     return HttpResponse.json({ tasks }, { status: 200 });
     
     // 単一のリソースを返す場合
     return HttpResponse.json(task, { status: 200 });
     ```

2. エラーレスポンス（4xx, 5xx）
   - エラーメッセージと必要に応じてバリデーションエラーを含める
   - HTTP ステータスコードでエラー種別を表現
   - 例：
     ```typescript
     return HttpResponse.json(
       { message: 'タスクが見つかりません' },
       { status: 404 }
     );
     ```

## 実装手順

1. 型定義の変更（src/mocks/lib/types.ts）
   - 新しいレスポンス型の定義
   - 古い型の削除

2. ハンドラーの実装更新（src/mocks/handlers.ts）
   - レスポンス構造の簡素化
   - HTTP ステータスコードの適切な使用

3. クライアント側の修正
   - レスポンス処理の更新
   - 型定義の更新

4. テストの更新
   - モックレスポンスの構造変更に合わせた更新
   - エラーケースのテスト調整

## 注意事項

- この変更はクライアント側のコードに影響を与える
- 段階的な移行が必要な場合は、一時的に両方の形式をサポートすることも検討
- 特にタイプ定義の変更は慎重に行う

## 期待される効果

1. REST API のベストプラクティスに準拠
   - シンプルなレスポンス構造
   - 適切な HTTP ステータスコードの使用

2. 保守性の向上
   - 不要なネストの削除
   - 明確なレスポンス構造

3. クライアント側での扱いやすさの向上
   - シンプルなデータアクセス
   - 型安全性の向上

4. エラーハンドリングの一貫性向上
   - 統一されたエラーレスポンス形式
   - 明確なエラー情報の提供
