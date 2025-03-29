## アーキテクチャ

Single-page application

### Tech Stack

- **ビルドツール**: Rsbuild
- **UIライブラリ**: React
- **フォーム**: TanStack Form
- **バリデーション**: Valibot
- **UIコンポーネント**: shadcn/ui + Tailwind CSS
- **ルーティング**: TanStack Router
- **APIモック**: MSW (Mock Service Worker)
- **テスト**: Vitest + Testing Library
- **型チェック**: TypeScript
- **コード品質**: Biome

### Project Structure

Feature-Sliced Design (FSD) アーキテクチャを採用し、以下のレイヤー構造を持ちます：

```
src/
├── app/      # アプリケーション基盤
├── pages/    # ページとルーティング
├── widgets/  # 大規模なUI部品
├── features/ # 再利用可能な機能
├── entities/ # ビジネスエンティティ
└── shared/   # 共通機能
```
