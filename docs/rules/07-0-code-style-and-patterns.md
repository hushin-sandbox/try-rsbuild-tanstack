## コードスタイルとパターン

本プロジェクトはTypeScriptを使用しています。

### 型の使用

- 明示的な型アノテーションを使用
- `any`型は避け、代わりに`unknown`使用
- 複雑な型は`interface`/`type`で定義
- 配列型は`T[]`形式を優先
- 型アサーション `as` の過剰使用を避ける
- Make Impossible States Impossible
  - Use Discriminated Union for complex situations

#### 型定義のベストプラクティス

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

### Null/Undefinedの扱い

- オプショナルチェーン`?.`活用
- Nullish合体演算子`??`使用
- 非nullアサーション`!`は避ける
- 早期リターンでネスト削減

### 関数型アプローチ

- 関数型アプローチを優先する：
  - `map`、`filter`、`reduce` などを活用する
- 純粋関数: 副作用を持たない関数を優先

### モジュール構成

- 絶対パスは`@/*`エイリアス使用
- 型のみの場合は`import type`
- 循環参照を避ける

### エラー処理

- 具体的なエラー型を使用
- 非同期は`try/catch`または`Promise.catch()`

