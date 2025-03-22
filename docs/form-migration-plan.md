# Form Migration Plan: react-hook-form から TanStack Form への移行

src/shared/ui/form.tsx のリファクタリング

## 現状分析

### 既存のコンポーネント構造

```tsx
Form (FormProvider)
└── FormField (Controller)
    └── FormItem
        ├── FormLabel
        ├── FormControl
        ├── FormDescription
        └── FormMessage
```

### 各コンポーネントの役割

1. **Form (FormProvider)**
   - フォームコンテキストの提供
   - フォーム全体の状態管理

2. **FormField (Controller)**
   - フィールドの制御
   - フィールドコンテキストの提供
   - バリデーション状態の管理

3. **FormItem**
   - フィールドのラッパー
   - スタイリングとレイアウト
   - 一意のID生成と提供

4. **FormLabel**
   - アクセシブルなラベル
   - エラー状態の視覚的フィードバック

5. **FormControl**
   - 入力要素のラッパー
   - アクセシビリティ属性の提供
   - エラー状態の管理

6. **FormDescription**
   - フィールドの説明文
   - アクセシビリティ対応

7. **FormMessage**
   - エラーメッセージの表示
   - エラー状態の視覚的フィードバック

## TanStack Form での実装計画

### 1. フォームコンテキストの作成

```typescript
// src/shared/lib/form-context.ts
import { createFormHookContexts } from '@tanstack/react-form';

export const {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} = createFormHookContexts();
```

### 2. 基本コンポーネントの再実装

```typescript
// src/shared/ui/form.tsx
import { Field, useField } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/form-core';

// Form コンポーネント
export const Form = ({ children, ...props }) => (
  <form {...props}>{children}</form>
);

// FormField コンポーネント
export const FormField = ({ name, children }) => (
  <Field name={name}>
    {(field) => children({ field })}
  </Field>
);

// 既存のコンポーネントを TanStack Form 対応に修正
export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});

// その他のコンポーネントも同様に修正
```

### 3. フィールドコンポーネントの使用例

```typescript
const MyForm = () => {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async (values) => {
      // ...
    },
  });

  return (
    <form.Form>
      <FormField name="name">
        {(field) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </FormControl>
            {field.state.meta.errors ? (
              <FormMessage>{field.state.meta.errors[0]}</FormMessage>
            ) : (
              <FormDescription>Enter your name</FormDescription>
            )}
          </FormItem>
        )}
      </FormField>
    </form.Form>
  );
};
```

## 移行手順

1. **準備フェーズ**
   - [x] 現状分析
   - [x] 移行計画の作成
   - [ ] TanStack Form の依存関係追加

2. **基盤実装**
   - [ ] フォームコンテキストの作成
   - [ ] 基本コンポーネントの実装
   - [ ] ユーティリティ関数の実装

3. **コンポーネント移行**
   - [ ] Form コンポーネントの実装
   - [ ] FormField の移行
   - [ ] FormItem の調整
   - [ ] その他のコンポーネントの移行

4. **バリデーション実装**
   - [ ] バリデーションルールの移行
   - [ ] エラーハンドリングの実装
   - [ ] フィールドレベルのバリデーション
   - [ ] フォームレベルのバリデーション

5. **テストと最適化**
   - [ ] ユニットテストの作成
   - [ ] 統合テストの作成
   - [ ] パフォーマンス最適化
   - [ ] アクセシビリティテスト

## 技術的な考慮事項

1. **型安全性**
   - TanStack Form の型システムを活用
   - カスタム型定義の作成
   - 型推論の活用

2. **パフォーマンス**
   - 不要な再レンダリングの防止
   - メモ化の適切な使用
   - 状態更新の最適化

3. **アクセシビリティ**
   - ARIA属性の維持
   - キーボード操作のサポート
   - エラー通知の適切な実装

## リスクと対策

1. **互換性の問題**
   - 既存のフォームコードとの互換性維持
   - 段階的な移行の実施
   - フォールバックの実装

2. **パフォーマンスの低下**
   - パフォーマンスモニタリング
   - 必要に応じた最適化
   - ベンチマークの実施

3. **学習コスト**
   - ドキュメントの整備
   - サンプルコードの提供
   - チームメンバーへの説明会実施

## 次のステップ

1. [ ] フォームコンテキストの実装開始
2. [ ] 基本コンポーネントの移行
3. [ ] サンプルフォームの作成とテスト
4. [ ] ドキュメントの更新

## 結論

TanStack Form への移行は、型安全性の向上とパフォーマンスの最適化をもたらします。段階的な移行アプローチにより、リスクを最小限に抑えながら、モダンなフォーム実装を実現できます。