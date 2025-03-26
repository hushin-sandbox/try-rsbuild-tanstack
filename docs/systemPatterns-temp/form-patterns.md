# フォームパターン

## フォーム基盤パターン

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

## バリデーションパターン

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

## インライン編集パターン

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

## エラーハンドリングパターン

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

## 楽観的更新パターン

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
