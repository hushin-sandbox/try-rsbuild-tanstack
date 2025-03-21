# 技術学習 Web アプリケーション プロジェクト概要

## プロジェクトの目的と目標

TanStack Router の File-Based Routing, TanStack Query, shadcn/ui の学習が目的です。
モダンなフロントエンド技術を活用して、優れたユーザー体験を提供することを目指します。

題材として ToDo 管理 Web アプリケーションを構築します。

## 技術スタック

### アーキテクチャ・構成

- SPA（クライアントサイドレンダリング）

### フロントエンド

- Feature-Sliced Design（FSD）アーキテクチャ
- React + TypeScript
- UI: shadcn/ui + Tailwind CSS
- ルーティング: TanStack Router
- データ取得: TanStack Query
- フォーム: TanStack Form
- 状態管理: Zustand
- UI 開発: Storybook
- ビルドツール: Rsbuild
- ホスティング: Vercel

### バックエンド

- Mock Service Worker で REST API を定義
- localStorage に永続化

### 品質保証

- バリデーション: Valibot
- テスト: Vitest, React Testing Library
- E2E テスト: Playwright
- リンター: Biome

## 主要機能

### タスク管理の基本機能

- タスクの作成・編集・削除

### 高度なタスク管理

- サブタスクのサポート
- 繰り返しタスクの設定

### ビューとインターフェース

- リストビュー
- カンバンビュー
- ドラッグ＆ドロップ操作

### 検索と整理

- 高度な検索機能
- カスタムフィルター

## 対象ユーザー

### メインターゲット

- ナレッジワーカー
- ソフトウェア開発者

### ユーザー特性

- 個人の生産性向上を重視
- 効率的な操作を好む技術系ユーザー
- キーボードショートカットやマークダウン記法を活用したい

## 成功基準

1. ユーザビリティ

   - 直感的なインターフェース
   - 高速なレスポンス
   - シームレスな操作性

2. 機能性

   - 全ての主要機能の完全実装
   - 高い安定性

3. 技術的品質
   - 保守性の高いコード
   - 拡張可能なアーキテクチャ
   - 堅牢なエラーハンドリング
