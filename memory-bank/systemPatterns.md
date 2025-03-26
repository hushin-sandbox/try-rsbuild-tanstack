# システムパターンとプラクティス

## フォームパターン

### フォーム基盤パターン

```typescript
import { createFormHookContexts } from '@tanstack/react-form'
import { fieldContext, formContext } from '@/shared/lib/form-context'
import * as v from 'valibot'

// フォームコンテキストの作成
const { formContext, fieldContext } = createFormHookContexts()

// バリデーションスキーマの定義
const TaskSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, 'タイトルは必須です'),
    v.maxLength(100, 'タイトルは100文字以内で入力してください')
  ),
  description: v.pipe(
    v.string(),
    v.maxLength(1000, '説明は1000文字以内で入力してください')
  ),
  dueDate: v.pipe(
    v.string(),
    v.optional()
  ),
  tags: v.array(v.string()),
})

// フォームフックの作成
export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField: ({ field, label, description, error }) => (
      <FormField
        label={label}
        description={description}
        error={error}
      >
        <FormControl>
          <Input
            value={field.state.value}
            onChange={e => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        </FormControl>
      </FormField>
    ),
    TextareaField: ({ field, label, description, error }) => (
      <FormField
        label={label}
        description={description}
        error={error}
      >
        <FormControl>
          <Textarea
            value={field.state.value}
            onChange={e => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        </FormControl>
      </FormField>
    ),
  },
  formContext,
  fieldContext,
})
```

### バリデーションパターン

```typescript
// バリデーションスキーマ
const TaskSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, 'タイトルは必須です'),
    v.maxLength(100, 'タイトルは100文字以内で入力してください')
  ),
  description: v.pipe(
    v.string(),
    v.maxLength(1000, '説明は1000文字以内で入力してください')
  ),
  dueDate: v.pipe(
    v.string(),
    v.optional(),
    v.transform(value => value ? new Date(value) : undefined)
  ),
  tags: v.array(
    v.pipe(
      v.string(),
      v.maxLength(30, 'タグは30文字以内で入力してください')
    ),
    v.maxLength(10, 'タグは10個まで設定できます')
  ),
})

// フォームの実装
function TaskForm() {
  const form = useAppForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      tags: [],
    },
    onSubmit: async ({ value }) => {
      const result = await submitTask(value)
      // エラーハンドリング
      if (!result.success) {
        return {
          error: result.error,
        }
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="title"
        children={(field) => (
          <field.TextField
            label="タイトル"
            description="タスクのタイトルを入力してください"
          />
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <field.TextareaField
            label="説明"
            description="タスクの詳細を入力してください"
          />
        )}
      />
    </form>
  )
}
```

### インライン編集パターン

```typescript
interface InlineEditFieldProps<T> {
  name: string
  label: string
  defaultValue: T
  onSave?: (value: T) => Promise<void>
  onCancel?: () => void
  validate?: (value: T) => string | undefined
  renderDisplay?: (value: T) => React.ReactNode
  renderEdit?: (props: {
    value: T
    onChange: (value: T) => void
    onBlur: () => void
    error?: string
  }) => React.ReactNode
}

function InlineEditField<T>({
  name,
  label,
  defaultValue,
  onSave,
  onCancel,
  validate,
  renderDisplay,
  renderEdit,
}: InlineEditFieldProps<T>) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string>()
  const previousValue = useRef(defaultValue)

  // フォーカス管理
  const editRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus()
    }
  }, [isEditing])

  // キーボードハンドリング
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && !e.shiftKey) {
      handleSave()
    }
  }

  const handleSave = async () => {
    const value = field.state.value
    const validationError = validate?.(value)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await onSave?.(value)
      setIsEditing(false)
      previousValue.current = value
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存に失敗しました')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    field.setValue(previousValue.current)
    onCancel?.()
  }

  return (
    <form.Field
      name={name}
      defaultValue={defaultValue}
      children={(field) => (
        <div className="inline-field">
          {isEditing ? (
            <div className="inline-edit-container">
              {renderEdit ? (
                renderEdit({
                  value: field.state.value,
                  onChange: field.handleChange,
                  onBlur: handleSave,
                  error,
                })
              ) : (
                <field.TextField
                  ref={editRef}
                  label={label}
                  autoFocus
                  error={error}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                />
              )}
              <div className="inline-edit-actions">
                <Button size="sm" onClick={handleSave}>保存</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="inline-display"
              onClick={() => setIsEditing(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsEditing(true)
                }
              }}
            >
              {renderDisplay?.(field.state.value) ?? field.state.value}
              <PencilIcon className="inline-edit-icon" />
            </div>
          )}
        </div>
      )}
    />
  )
}
```

### エラーハンドリングパターン

```typescript
// エラー型定義
interface ApiError {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}

interface ValidationError {
  type: 'validation'
  message: string
  fieldErrors: Record<string, string>
}

interface NetworkError {
  type: 'network'
  message: string
}

type AppError = ApiError | ValidationError | NetworkError

// エラーハンドリングユーティリティ
const errorUtils = {
  isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  },

  isValidationError(error: unknown): error is ValidationError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      error.type === 'validation'
    )
  },

  isNetworkError(error: unknown): error is NetworkError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      error.type === 'network'
    )
  },

  handleFormError(error: unknown) {
    if (this.isApiError(error)) {
      return {
        error: error.message,
        fieldErrors: error.fieldErrors,
      }
    }

    if (this.isValidationError(error)) {
      return {
        error: error.message,
        fieldErrors: error.fieldErrors,
      }
    }

    if (this.isNetworkError(error)) {
      return {
        error: 'ネットワークエラーが発生しました。再度お試しください。',
      }
    }

    return {
      error: '予期せぬエラーが発生しました。',
    }
  },
}

// フォームの実装
function TaskForm() {
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      try {
        await submitTask(value)
      } catch (error) {
        return errorUtils.handleFormError(error)
      }
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <div className="form-fields">
        {/* フォームフィールド */}
      </div>
      
      {/* エラー表示 */}
      {form.state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{form.state.error}</AlertDescription>
        </Alert>
      )}
      
      {/* アクション */}
      <div className="form-actions">
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
}
```

### 楽観的更新パターン

```typescript
function useOptimisticUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['tasks'])
      const previousTasks = queryClient.getQueryData(['tasks'])

      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map((task) =>
          task.id === newTask.id ? newTask : task
        )
      )

      return { previousTasks }
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(
        ['tasks'],
        context?.previousTasks
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tasks'])
    },
  })
}
```

## テストパターン

### テストの設計原則

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

### コンポーネントテスト

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

### インテグレーションテスト

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
```

## パフォーマンスパターン

### メモ化パターン

```typescript
// フィールドコンポーネントのメモ化
const TextField = memo(({ field, label }: FieldProps) => (
  <FormField label={label}>
    <FormControl>
      <Input
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
      />
    </FormControl>
  </FormField>
))

// フォーム状態の監視
const FormStateObserver = () => {
  const formState = useStore(form.store, (state) => ({
    isDirty: state.isDirty,
    isValid: state.isValid,
  }))

  return (
    <div>
      <div>Dirty: {formState.isDirty ? 'Yes' : 'No'}</div>
      <div>Valid: {formState.isValid ? 'Yes' : 'No'}</div>
    </div>
  )
}
```

## アクセシビリティパターン

```typescript
// アクセシブルなフォームフィールド
const AccessibleField = ({ label, error, description, children }) => (
  <div role="group" aria-labelledby={`${label}-label`}>
    <label
      id={`${label}-label`}
      htmlFor={label}
    >
      {label}
    </label>
    {children}
    {description && (
      <div id={`${label}-description`}>{description}</div>
    )}
    {error && (
      <div
        id={`${label}-error`}
        role="alert"
        aria-live="polite"
      >
        {error}
      </div>
    )}
  </div>
)
```

## Storybook パターン

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';
import { handlers } from './component.mocks';

const meta = {
  component: Component,
  parameters: {
    msw: {
      handlers: [handlers.default],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

// 基本的な状態
export const Default: Story = {
  args: {
    // コンポーネントの props
  },
};

// ローディング状態
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [handlers.loading],
    },
  },
};

// エラー状態
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [handlers.error],
    },
  },
};

// データが空の状態
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [handlers.empty],
    },
  },
};
```

### MSW モックハンドラーパターン

```typescript
// [component-name].mocks.ts
import { http, HttpResponse } from 'msw';
import { createLoadingHandlerGet, createErrorHandlerGet } from '~/mocks/handlers/common';

const API_PATH = '/api/endpoint';

export const handlers = {
  // 正常系
  default: http.get(API_PATH, () => {
    return HttpResponse.json({
      tasks: sampleData
    })
  }),

  // ローディング状態
  loading: createLoadingHandlerGet(API_PATH),

  // エラー状態
  error: http.get(API_PATH, () => {
    return HttpResponse.json(
      {
        message: 'エラーが発生しました',
        errors: {
          general: ['サーバーエラーが発生しました']
        }
      },
      { status: 500 }
    )
  }),

  // データが空の状態
  empty: http.get(API_PATH, () => {
    return HttpResponse.json({
      tasks: []
    })
  }),
};
```

