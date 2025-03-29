## コードスタイルとパターン

- 関数型アプローチを優先する：
  - `map`、`filter`、`reduce` などを活用する
  - 早期リターンパターンを使用する
- `any` 型の使用を避ける
- 型アサーション `as` の過剰使用を避ける
- コード整形・リンティングは保存時に Biome が適用されます。私が行う必要はありません
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

