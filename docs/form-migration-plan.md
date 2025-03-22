# Form Migration Plan: react-hook-form から TanStack Form への移行 (更新版)

src/shared/ui/form.tsx のリファクタリング

## アーキテクチャの決定

### 1. カスタムフォームフック作成

```typescript
// src/shared/lib/form-context.ts
import { createFormHookContexts } from '@tanstack/react-form'

export const {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} = createFormHookContexts()
```

### 2. UI コンポーネントの設計

```typescript
// src/shared/ui/form/field.tsx
import { useFieldContext } from '~//shared/lib/form-context'
import type { AnyFieldApi } from '@tanstack/react-form'

export interface FormFieldProps {
  name: string
  label?: string
  description?: string
  error?: string
  children: React.ReactNode
}

// FormField のラッパーコンポーネント
export function FormField({ label, error, description, ...props }: FormFieldProps) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      {props.children}
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}

// 各フィールドタイプのコンポーネント
export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  
  return (
    <FormField label={label}>
      <FormControl>
        <Input
          value={field.state.value}
          onChange={e => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
      </FormControl>
    </FormField>
  )
}

// その他のフィールドタイプも同様に実装
```

### 3. カスタムフォームフックの作成

```typescript
// src/shared/lib/form.ts
import { createFormHook } from '@tanstack/react-form'
import { TextField, SelectField, TextareaField } from '~//shared/ui/form/field'
import { fieldContext, formContext } from './form-context'

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
```

### 4. フォームの使用例

```typescript
function TaskForm() {
  const form = useAppForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
    },
    onSubmit: async ({ value }) => {
      // 送信処理
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name="title"
        children={(field) => (
          <field.TextField
            label="タイトル"
          />
        )}
      />
      
      <form.AppField
        name="description"
        children={(field) => (
          <field.TextareaField
            label="説明"
          />
        )}
      />
      
      <form.AppField
        name="status"
        children={(field) => (
          <field.SelectField
            label="ステータス"
            options={[
              { value: 'todo', label: 'Todo' },
              { value: 'done', label: 'Done' },
            ]}
          />
        )}
      />
      
      <form.AppForm>
        <form.SubmitButton>保存</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
```

## 移行手順の更新

1. 準備フェーズ
   - [x] 現状分析
   - [x] 移行計画の作成
   - [x] TanStack Form の依存関係追加
   
2. フォーム基盤の実装
   - [x] フォームコンテキストの作成
   - [x] フィールドコンポーネントの実装
   - [x] フォームコンポーネントの実装
   - [x] カスタムフォームフックの作成

3. 既存コンポーネントの置き換え
   - [x] FormItem の調整
   - [x] FormField の実装
   - [x] 各フィールドタイプの実装
   - [x] フォームのバリデーション移行
   - [x] react-hook-form, zod, @hookform/resolvers のアンイストール

4. テストとドキュメント
   - [ ] 単体テストの作成
   - [ ] フォームコンポーネントの型定義
   - [ ] 使用例の追加
   - [ ] ドキュメントの更新

## メリット

1. **型安全性の向上**
   - フィールド名の自動補完
   - フォーム値の型推論
   - バリデーションエラーの型安全な扱い

2. **コードの再利用性**
   - カスタムフォームフックによる共通ロジックの共有
   - 型定義の再利用
   - UI コンポーネントの組み合わせ

3. **パフォーマンスの最適化**
   - 不要な再レンダリングの防止
   - バリデーションの効率化
   - レンダリングの最適化

4. **アクセシビリティの維持**
   - 既存の UI コンポーネントの再利用
   - アクセシビリティ属性の継承
   - エラー通知の改善

## 注意点

1. **段階的な移行**
   - 既存のフォームを一つずつ移行
   - テストカバレッジの維持
   - 互換性の確保

2. **型定義の管理**
   - フォーム値の型定義の整理
   - バリデーションスキーマの移行
   - 型エラーの解決

3. **パフォーマンスモニタリング**
   - レンダリング回数の監視
   - メモリ使用量の確認
   - バンドルサイズの管理