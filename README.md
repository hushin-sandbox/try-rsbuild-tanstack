# Rsbuild + TanStack Project

このプロジェクトは、最新のフロントエンド技術を活用したタスク管理アプリケーションです。

## 機能

### 実装済み
- フォーム基盤の完全な刷新
  - TanStack Form による実装
  - Valibot によるバリデーション
  - 共通コンポーネントの整備
- タスク管理の基本機能
  - タスク作成モーダル
  - タスクリスト表示
  - データフェッチの基盤

### 開発中
- フォーム拡張機能
  - ✅ Description フィールド（Markdown対応）
  - 🚧 DueDate フィールド
  - 🚧 Tags フィールド
- インライン編集機能
  - 🚧 編集モードUI
  - 🚧 状態管理

## 技術スタック

### コア技術
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

### アーキテクチャ

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

## セットアップ

依存関係のインストール:

```bash
pnpm install
```

## 開発

開発サーバーの起動:

```bash
pnpm dev
```

テストの実行:

```bash
pnpm test
```

Storybookの起動:

```bash
pnpm storybook
```

本番ビルド:

```bash
pnpm build
```

本番ビルドのプレビュー:

```bash
pnpm preview
```
