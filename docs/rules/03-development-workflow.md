## Development Workflow

### コマンド一覧

- **開発サーバー起動**: `pnpm dev`
- **ビルド**: `pnpm build`
- **テスト実行**: `pnpm test`
  - 特定のテストファイル実行: `pnpm test <filename>`
- **リンティング**: `pnpm check`
  - 特定ファイルのリント: `pnpm check <filename>`
- **フォーマット**: `pnpm format`

### 開発フロー
1. **機能実装前**: テストを先に書く（TDD）
2. **コード変更時**: 既存テストが通ることを確認
3. **コード作成後**: テストを実行して期待通りの動作を確認
4. **テスト失敗時**: テストが通るようにコードを修正
5. **リファクタリング時**: テストが引き続き通ることを確認
6. **コミット前**: Biomeを実行してコードスタイルを確認
   ```bash
   pnpm format
   ```
