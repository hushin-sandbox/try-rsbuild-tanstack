# テストパターン

## テストの設計原則

1. テストコードの構造化
```typescript
// ❌ 避けるべき：機能を分割したテスト
describe('TaskForm', () => {
  test('初期状態の確認', () => {
    render(<TaskForm />)
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
  })

  test('バリデーションの確認', () => {
    render(<TaskForm />)
    fireEvent.click(screen.getByRole('button', { name: '保存' }))
    expect(screen.getByText('タイトルは必須です')).toBeInTheDocument()
  })
})

// ✅ 推奨：ユースケース全体を1つのテストで
test('タスク作成の完全なフロー', async () => {
  const onSubmit = vi.fn()
  render(<TaskForm onSubmit={onSubmit} />)

  // 初期状態の確認
  const titleInput = screen.getByRole('textbox', { name: 'タイトル' })
  expect(titleInput).toBeInTheDocument()

  // バリデーションの確認
  await userEvent.click(screen.getByRole('button', { name: '保存' }))
  expect(screen.getByText('タイトルは必須です')).toBeInTheDocument()

  // 正常系の確認
  await userEvent.type(titleInput, 'テストタスク')
  await userEvent.click(screen.getByRole('button', { name: '保存' }))
  expect(onSubmit).toHaveBeenCalledWith({ title: 'テストタスク' })
})
```

2. テストユーティリティの活用
```typescript
// テストヘルパー関数
function setup(props = {}) {
  const defaultProps = {
    onSubmit: vi.fn(),
    ...props,
  }
  const utils = render(<TaskForm {...defaultProps} />)
  const titleInput = screen.getByRole('textbox', { name: 'タイトル' })
  const submitButton = screen.getByRole('button', { name: '保存' })

  return {
    ...utils,
    titleInput,
    submitButton,
    submitForm: async (title: string) => {
      await userEvent.type(titleInput, title)
      await userEvent.click(submitButton)
    },
  }
}

// テストの実装
test('フォームの送信', async () => {
  const { submitForm } = setup()
  await submitForm('テストタスク')
  expect(screen.getByRole('alert')).toHaveTextContent('保存しました')
})
```

## コンポーネントテスト

1. クエリの優先順位
```typescript
// ✅ 推奨: getByRole と aria-label の使用
const submitButton = screen.getByRole('button', { name: '保存' })
const titleInput = screen.getByRole('textbox', { name: 'タイトル' })

// ❌ 避ける: テストIDの使用
const submitButton = screen.getByTestId('submit-button')
```

2. 非同期処理のテスト
```typescript
test('タスクの読み込みと表示', async () => {
  server.use(
    rest.get('/api/tasks', (req, res, ctx) => {
      return res(ctx.json([{ id: '1', title: 'テスト' }]))
    })
  )

  render(<TaskList />)
  
  // ローディング状態の確認
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
  
  // データ表示の確認
  const task = await screen.findByRole('listitem')
  expect(task).toHaveTextContent('テスト')
})
```

3. エラーケースのテスト
```typescript
test('エラー時の表示', async () => {
  server.use(
    rest.post('/api/tasks', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )

  const { submitForm } = setup()
  await submitForm('テストタスク')
  
  expect(screen.getByRole('alert')).toHaveTextContent('エラーが発生しました')
})
```

## インテグレーションテスト

```typescript
test('タスクの作成から表示までの統合フロー', async () => {
  render(
    <TaskProvider>
      <TaskList />
      <TaskCreateButton />
    </TaskProvider>
  )

  // 新規タスク作成
  await userEvent.click(screen.getByRole('button', { name: '新規タスク' }))
  
  // モーダルでの入力
  const modal = screen.getByRole('dialog')
  await userEvent.type(
    within(modal).getByRole('textbox', { name: 'タイトル' }),
    'テストタスク'
  )
  await userEvent.click(within(modal).getByRole('button', { name: '保存' }))

  // リストでの表示確認
  expect(await screen.findByRole('listitem')).toHaveTextContent('テストタスク')
})
