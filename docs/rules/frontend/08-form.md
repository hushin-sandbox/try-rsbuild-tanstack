## フォーム実装のルール

### 基本方針

- TanStack Form と Valibot を使用
- shadcn/ui のフォームコンポーネントを活用
- 型安全なフォーム実装を重視
- 一貫したUIとユーザー体験を提供

### フォーム構造

#### コンポーネント階層

```tsx
<Form>
  <FormField>
    <FormItem>
      <FormLabel>ラベル</FormLabel>
      <FormControl>
        {/* 入力コンポーネント */}
      </FormControl>
      <FormDescription>説明文</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</Form>
```

#### Select コンポーネントの実装

Select コンポーネントを使用する際は、以下の階層構造を厳守します：

```tsx
<Select>
  <FormControl>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="value">表示名</SelectItem>
  </SelectContent>
</Select>
```

重要: SelectTrigger は必ず FormControl の子要素として配置します。これにより、一貫したスタイリングとアクセシビリティが保証されます。

### バリデーション実装

#### スキーマ定義

```typescript
const formSchema = v.object({
  fieldName: v.pipe(
    v.string(),
    v.minLength(1, 'エラーメッセージ')
  ),
});

type FormValues = v.InferOutput<typeof formSchema>;
```

#### フォーム初期化

```typescript
const form = useAppForm({
  defaultValues,
  validators: {
    onChange: formSchema,
  },
  onSubmit: async ({ value }) => {
    // バリデーション
    const validated = v.parse(formSchema, value);
    // 送信処理
    await onSubmit(validated);
  },
});
```

### エラーハンドリング

- FormMessage コンポーネントでバリデーションエラーを表示
- onSubmit 内でバリデーションエラーを適切に処理
- ユーザーフレンドリーなエラーメッセージを提供
