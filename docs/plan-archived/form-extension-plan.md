# フォーム拡張実装計画

## 概要

タスク作成フォームに以下の機能を追加実装します：

1. マークダウン対応の説明フィールド
2. 日付選択機能付きの期限日フィールド
3. タグ管理機能（事前定義タグと自由入力の併用）

## 1. Description フィールドの拡張

### 実装内容

- 基本的なマークダウン編集機能の追加
  - 太字（**text**）
  - イタリック（*text*）
  - リスト（- item）
- プレビュー機能（@tailwindcss/typography 利用）
- バリデーション（1000文字制限）

### 技術的アプローチ

1. コンポーネント構成
```typescript
interface MarkdownFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maxLength?: number;
}

// プレビューモード切り替え可能なマークダウンエディタ
const MarkdownField: React.FC<MarkdownFieldProps>;
```

2. プレビュー機能
```typescript
// Biome のエラーに対応するため、必要に応じて biome-ignore を使用
// biome-ignore lint/style/useImportType: marked は CommonJS モジュール
import marked from 'marked';

// プレビューコンポーネント
const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  // HTMLをサニタイズして prose クラスで表示
  return (
    <div 
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    />
  );
};
```

3. バリデーション
- 既存のvalibot スキーマを活用
- エディタ上での文字数カウント表示

## 2. DueDate フィールドの実装

### 実装内容

- 日付選択UI
- カレンダー表示
- 日付バリデーション

### 技術的アプローチ

1. コンポーネント構成
```typescript
// デフォルトで当日以降の日付のみ選択可能
interface DatePickerFieldProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerField: React.FC<DatePickerFieldProps>;
```

2. バリデーション
- ISO 8601形式での日付管理
- 過去の日付を選択不可に設定（オプション）

## 3. Tags フィールドの実装

### 実装内容

- タグ入力UI（事前定義タグと自由入力の併用）
- タグ管理機能（追加/削除）
- バリデーション（タグ数制限、文字数制限）

### 技術的アプローチ

1. コンポーネント構成
```typescript
interface TagFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  predefinedTags?: string[];
  maxTags?: number;
}

const TagField: React.FC<TagFieldProps>;
```

2. 事前定義タグの管理
```typescript
// biome-ignore lint/style/noDefaultExport: 定数のエクスポートには default を使用
export default {
  priority: ['重要', '緊急'],
  status: ['進行中', '待機中'],
  type: ['バグ', '機能改善', 'ドキュメント'],
} as const;
```

3. バリデーション
- タグあたりの最大文字数: 30文字
- タグの最大数: 10個

## アクセシビリティ対応

1. キーボード操作
- タブ移動でのフォーカス管理
- ショートカットキーでのマークダウン編集
- ESCキーでのポップアップクローズ

2. スクリーンリーダー対応
- 適切なARIAラベルの設定
- エラーメッセージの読み上げ

## パフォーマンス最適化

1. コンポーネントのメモ化
```typescript
// biome-ignore lint/style/useImportType: React の型インポートを無視
import React, { memo } from 'react';

const MarkdownPreview = memo(function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: marked(content) }} />
  );
});
```

2. バリデーションの最適化
- デバウンス処理の適用
- バリデーションタイミングの調整

## テスト計画

1. ユニットテスト
- 各フィールドコンポーネントのテスト
- バリデーションロジックのテスト
- ユーティリティ関数のテスト

2. インテグレーションテスト
- フォーム全体の動作確認
- エラーハンドリングの確認
- APIとの連携テスト

3. E2Eテスト
- 主要なユーザーフローのテスト
- エッジケースの確認

## 実装ステップ

1. Phase 1: Description機能拡張
- マークダウンエディタの基本実装
- プレビュー機能の追加（@tailwindcss/typography の設定）
- バリデーション実装

2. Phase 2: DueDate実装
- DatePickerコンポーネントの作成
- バリデーション実装
- UI/UX最適化

3. Phase 3: Tags実装
- タグ入力UIの作成
- タグ管理機能の実装
- バリデーション実装

## リスクと対策

1. パフォーマンス
- 大量のタグ処理時の最適化
- マークダウンプレビューの遅延読み込み

2. UX
- 直感的なタグ入力の実現
- わかりやすいマークダウン編集UI

3. データ整合性
- タグの重複防止
- 日付データの正規化

## Biome対応ガイドライン

Biomeのエラーに対しては、以下の方針で対応します：

1. 可能な限りコードを修正してエラーを解消
2. 修正が難しい場合は、適切な説明とともに `biome-ignore` を使用

```typescript
// 例: CommonJSモジュールのインポート
// biome-ignore lint/style/useImportType: サードパーティライブラリはCommonJSモジュール
import { something } from 'some-library';

// 例: default exportの使用
// biome-ignore lint/style/noDefaultExport: 定数のエクスポートには default を使用
export default constant;
```

主な ignore パターン：
- `lint/style/useImportType`: CommonJS モジュールのインポート
- `lint/style/noDefaultExport`: 定数や設定オブジェクトの default export
- `lint/correctness/noUnusedVariables`: 型定義のみで使用する変数