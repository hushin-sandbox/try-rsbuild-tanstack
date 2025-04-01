# フロントエンドテスト戦略

## 基本方針

- **Storybookでのコンポーネントテスト**を中心に据える
- ユーザー体験に近い形でテストを実装
- モックは必要最小限に抑える

## テスト構成

### 1. コンポーネントテスト（Storybook）

- インタラクションテストとビジュアルテストを統合
- ストーリーでユースケースを網羅
- MSWでAPIモックを実装

```typescript
// ストーリー例
export const CreateSubTask: Story = {
  args: {
    defaultOpen: true,
    parentId: '1',
  },
  parameters: {
    msw: {
      handlers: [handlers.getTasks, handlers.createSubTask],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step('フォームに情報を入力', async () => {
      await userEvent.type(
        canvas.getByLabelText('タイトル'),
        'サブタスクのテスト',
      );
    });

    await step('フォームを送信', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '作成' }));
    });

    await step('モーダルが閉じることを確認', async () => {
      await waitFor(() => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  },
};
```

### 2. 必要なテストケース

以下のケースをストーリーとして実装：

1. **正常系**
   - 基本的な動作確認
   - データ入力と送信
   - 成功時のフィードバック

2. **エラー系**
   - バリデーションエラー
   - APIエラー
   - ネットワークエラー

3. **状態変化**
   - ローディング状態
   - 空の状態
   - データ更新後の状態

4. **エッジケース**
   - 境界値
   - 特殊なインプット
   - 異常系データ

### 3. その他のテスト

- **モデル層のユニットテスト**: 純粋なロジックのテストは `.test.ts` で実装
- **APIハンドラーのテスト**: MSWハンドラーのテストは `.test.ts` で実装
- **E2Eテスト**: 必要に応じてPlaywright等で実装

## ベストプラクティス

### ストーリーの作成

1. **明確な命名**
   ```typescript
   export const Default: Story = {};
   export const Loading: Story = {};
   export const Error: Story = {};
   export const Empty: Story = {};
   ```

2. **必要なコンテキストの提供**
   ```typescript
   const withProviders = (Story: React.ComponentType) => {
     const queryClient = createQueryClient();
     return (
       <QueryClientProvider client={queryClient}>
         <Story />
       </QueryClientProvider>
     );
   };
   ```

3. **インタラクションの記述**
   ```typescript
   play: async ({ canvasElement, step }) => {
     const canvas = within(canvasElement.parentNode as HTMLElement);
     
     await step('アクション名', async () => {
       // テストコード
     });
   }
   ```

### APIモック

1. **ハンドラーの整理**
   ```typescript
   export const handlers = {
     default: http.get('/api/data', () => HttpResponse.json(data)),
     error: http.get('/api/data', () => HttpResponse.error()),
     loading: createLoadingHandler('/api/data'),
   };
   ```

2. **データの準備**
   ```typescript
   const testData = {
     id: 'test-1',
     title: 'テスト用データ',
     // ...
   };
   ```

## アクセシビリティ

テストでは以下の優先順でクエリを使用：

1. `getByRole` - アクセシビリティと役割に基づく検索
2. `getByLabelText` - フォーム要素に最適
3. `getByText` - テキストコンテンツで要素を見つける
4. `getByTestId` - 最後の手段として

```typescript
// ✅ 推奨
getByRole('button', { name: '送信' });
getByLabelText('ユーザー名');

// ❌ 非推奨
getByTestId('submit-button');
```

## テストの原則

1. **ユーザー視点でのテスト**
   - 実際の使用シナリオに基づくテスト
   - 実装の詳細ではなく、動作に注目

2. **独立性の確保**
   - テスト間での状態共有を避ける
   - 副作用の適切な管理

3. **シンプルさの維持**
   - 複雑なセットアップを避ける
   - テストの意図を明確に

4. **メンテナンス性**
   - DRYよりも読みやすさを優先
   - 適切なコメントと説明
