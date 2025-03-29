# パフォーマンスパターン

## メモ化パターン

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
