# アクセシビリティパターン

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
