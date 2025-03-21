# FSD アーキテクチャ実装計画

## 現状分析

現在のプロジェクト構造：

```
src/
├── app.tsx
├── env.d.ts
├── index.tsx
├── routeTree.gen.ts
├── styles.css
├── components/
│   └── ui/
│       └── button.tsx
├── lib/
│   └── utils.ts
└── routes/
    ├── __root.tsx
    ├── about.tsx
    └── index.tsx
```

## 提案する FSD 構造

```
src/
├── app/               # アプリケーション初期化
│   ├── index.tsx     # エントリーポイント
│   ├── providers/    # アプリケーションレベルのプロバイダー
│   └── styles/       # グローバルスタイル
│
├── pages/            # ページコンポーネント
│   ├── _layout/     # レイアウトコンポーネント
│   ├── home/        # ホームページ
│   └── about/       # アバウトページ
│
├── widgets/          # 複合UIブロック
│   ├── header/      # ヘッダーウィジェット
│   └── sidebar/     # サイドバーウィジェット
│
├── features/         # 機能実装
│   ├── todo/        # Todo機能
│   │   ├── api/     # APIフック
│   │   ├── model/   # 機能固有の型定義
│   │   └── ui/      # 機能のUIコンポーネント
│   └── filter/      # フィルター機能
│
├── entities/         # ビジネスエンティティ
│   └── todo/        # Todoエンティティ
│       ├── model/   # エンティティモデル
│       └── ui/      # エンティティ関連のUI
│
└── shared/          # 共有リソース
    ├── api/         # APIクライアント
    ├── config/      # 設定
    ├── lib/         # ユーティリティ
    └── ui/          # 共通UIコンポーネント
```

## 移行計画

### フェーズ 1: 基本構造の作成と既存コードの移行

1. **ディレクトリ構造の作成**

   - 各 FSD レイヤーのディレクトリを作成
   - 必要な内部構造を設定

2. **既存コードの移行**
   - `components/ui` → `shared/ui`
   - `lib/utils.ts` → `shared/lib`
   - `routes/*` → `pages/*`
   - `app.tsx` → `app/providers`
   - `styles.css` → `app/styles`

### フェーズ 2: 機能実装の準備

1. **Todo 機能の基盤作成**

   ```
   features/todo/
   ├── api/
   │   ├── types.ts
   │   └── todoApi.ts
   ├── model/
   │   └── types.ts
   └── ui/
       ├── TodoList.tsx
       ├── TodoItem.tsx
       └── TodoForm.tsx
   ```

2. **エンティティの定義**
   ```
   entities/todo/
   ├── model/
   │   ├── todo.ts
   │   └── types.ts
   └── ui/
       └── TodoCard.tsx
   ```

### フェーズ 3: 共通基盤の整備

1. **API クライアントの設定**

   ```
   shared/api/
   ├── client.ts
   └── types.ts
   ```

2. **共通 UI コンポーネント**
   ```
   shared/ui/
   ├── button/
   ├── input/
   └── card/
   ```

### フェーズ 4: エラーハンドリングとデータフェッチの実装

1. **ErrorBoundary の実装**

   ```
   shared/ui/error-boundary/
   ├── ErrorBoundary.tsx
   ├── ErrorMessage.tsx
   └── types.ts
   ```

2. **Suspense 対応のデータフェッチ基盤**

   ```
   shared/api/
   ├── hooks/
   │   └── useSuspenseQuery.ts
   └── providers/
       └── QueryProvider.tsx
   ```

3. **ローディング UI の実装**
   ```
   shared/ui/loading/
   ├── LoadingSpinner.tsx
   └── SkeletonLoader.tsx
   ```

実装の詳細：

1. **ErrorBoundary の設定**

   - グローバルエラーハンドリング
   - コンポーネント単位のエラー境界
   - カスタムエラーメッセージ

2. **Suspense の活用**

   - ルートレベルのフォールバック
   - コンポーネントレベルのローディング状態
   - 段階的なローディング

3. **TanStack Query の設定**
   - Suspense モードの有効化
   - エラーハンドリングの設定
   - キャッシュ戦略の定義

## 実装の優先順位

1. 基本ディレクトリ構造の作成
2. 既存コードの移行
3. エラーハンドリングとデータフェッチの基盤実装
4. Todo エンティティの実装
5. 基本的な Todo 機能の実装
6. 共通コンポーネントの整備

## 技術的な考慮事項

1. **型安全性**

   - 各レイヤーで適切な型定義を維持
   - レイヤー間の明確なインターフェース定義

2. **テスト容易性**

   - 各レイヤーの独立したテスト
   - 適切なモック境界の設定

3. **パフォーマンス**
   - 適切なコード分割
   - 効率的な依存関係管理
   - Suspense による最適なローディング体験

## 次のステップ

1. この実装計画のレビューと承認
2. 基本ディレクトリ構造の作成
3. エラーハンドリングとデータフェッチの基盤実装
4. 既存コードの段階的な移行

## 質問事項

1. 提案したディレクトリ構造について、調整が必要な点はありますか？
2. エラーハンドリングとデータフェッチの実装方針は適切でしょうか？
3. 優先順位の設定は適切でしょうか？
