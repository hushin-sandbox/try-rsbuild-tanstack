## コードスタイルとパターン

- 関数型アプローチを優先する：
  - `map`、`filter`、`reduce` などを活用する
  - 早期リターンパターンを使用する
- `any`型は避け、代わりに`unknown`使用
- 型アサーション `as` の過剰使用を避ける
- 複雑な型は`interface`/`type`で定義
- 配列型は`T[]`形式を優先
- Make Impossible States Impossible
  - Use Discriminated Union for complex situations

### 型定義のベストプラクティス

```typescript
// Prefer interfaces over type literal aliases
interface User {
  firstName: string;
  lastName: string;
}

// anyの代わりにunknownを使い、型ガードを活用
function processValue(x: unknown): void {
  if (typeof x === 'string') {
    console.log(x.toUpperCase());
  }
}

// 関数の戻り値型を明示
function fetchUser(id: string): Promise<Result<User, ApiError>> {
  // 実装
}
```

