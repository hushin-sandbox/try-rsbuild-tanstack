# React テストのベストプラクティス

## ESLint で検出可能な規則

### `eslint-plugin-testing-library`で検出可能な規則

- `screen`オブジェクトの使用を強制
- 不要な`cleanup`の使用を禁止
- テスト ID の過度な使用を制限
- `waitFor`内での副作用を禁止
- 空の`waitFor`コールバックを禁止

### `eslint-plugin-jest-dom`で検出可能な規則

- アサーションメソッドの適切な使用
  - `toBeInTheDocument()`の使用を推奨
  - `toBeTruthy()`/`toBeFalsy()`の代わりに具体的なマッチャーを使用

### コードスタイル関連

- テストファイル命名規則の統一
- テスト記述の一貫性確保
- 不要なテストユーティリティの使用制限

## テストの設計原則

### 1. テストコードの構造化

- ネストされた describe ブロックを避ける

  ```typescript
  // ❌ 避けるべき
  describe('when logged in', () => {
    beforeEach(() => {
      // セットアップ
    });
    describe('when clicking button', () => {
      // テスト
    });
  });

  // ✅ 推奨
  test('logged in user can click button', () => {
    // セットアップとテストを一箇所に
  });
  ```

### 2. テストの分離とユースケースベース

- 機能の断片ではなく、完全なユースケースをテスト

```typescript
// ❌ 避けるべき：機能を分割したテスト
test('counter initializes with correct value', () => {
  render(<Counter maxClicks={4} initialCount={3} />);
  expect(screen.getByText(/count: 3/i)).toBeInTheDocument();
});

test('counter increments on click', () => {
  render(<Counter maxClicks={4} initialCount={3} />);
  userEvent.click(screen.getByText(/count/i));
  expect(screen.getByText(/count: 4/i)).toBeInTheDocument();
});

// ✅ 推奨：ユースケース全体を1つのテストで
test('allows clicks until maxClicks, then requires reset', () => {
  render(<Counter maxClicks={4} initialCount={3} />);
  const counterButton = screen.getByText(/^count/i);

  // 初期状態の確認
  expect(counterButton).toHaveTextContent('3');

  // クリックでカウントが増加
  userEvent.click(counterButton);
  expect(counterButton).toHaveTextContent('4');

  // maxClicksに達したら無効化
  expect(counterButton).toHaveAttribute('disabled');

  // リセット機能の確認
  userEvent.click(screen.getByText(/reset/i));
  expect(counterButton).toHaveTextContent('3');
  expect(counterButton).not.toHaveAttribute('disabled');
});
```

### 3. テストヘルパー関数の活用

```typescript
// ✅ 推奨: 設定可能なヘルパー関数
function setup(props = {}) {
  const defaultProps = {
    maxClicks: 4,
    initialCount: 3,
    ...props,
  };
  const utils = render(<Counter {...defaultProps} />);
  const counterButton = utils.getByText(/^count/i);

  return {
    ...utils,
    counterButton,
    clickCounter: () => userEvent.click(counterButton),
    clickReset: () => userEvent.click(utils.getByText(/reset/i)),
  };
}

test('counter behaves correctly', () => {
  const { counterButton, clickCounter, clickReset } = setup();

  // テストシナリオの実行
  clickCounter();
  expect(counterButton).toHaveTextContent('4');
});
```

### 4. テストの独立性

- 各テストは独立して実行可能
- 共有状態に依存しない
- テストの順序に依存しない
- 副作用を適切に処理

## React Testing Library の使用方法

### 1. クエリの優先順位

1. `getByRole` - 最も推奨
2. `getByLabelText` - フォーム要素
3. `getByText` - テキストコンテンツ
4. `getByTestId` - 最終手段

### 2. クエリバリアントの使い分け

- `get*` - 要素が存在することを期待
- `query*` - 要素が存在しないことを確認
- `find*` - 非同期で要素が表示されることを期待

### 3. ユーザーイベントの使用

- `userEvent`を優先して使用
- `fireEvent`は必要な場合のみ使用
- 実際のユーザー操作に近い動作をシミュレート
