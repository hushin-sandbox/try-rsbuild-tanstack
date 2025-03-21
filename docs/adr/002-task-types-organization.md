# 2. タスク関連の型定義の再編成

Date: 2025-03-21

## ステータス

採用

## コンテキスト

タスク関連の型定義（TaskStatus、TaskPriority、RecurrenceFrequency）が`shared/lib/types.ts`に配置されていましたが、これらはタスクドメイン固有の型定義です。また、BaseEntityの型定義も同じファイルに含まれていました。

## 決定

以下の変更を行いました：

1. BaseEntityの分離
   - 共通の型定義として`shared/lib/entity.ts`に移動
   - 他のエンティティでも再利用可能に

2. タスク固有の型定義の移動
   - `entities/task/model/types.ts`に移動
   - タスクドメインに関連する全ての型定義を集約

## 結果

- より良い関心の分離
- ドメイン駆動設計の原則に沿った構造
- 型定義の再利用性の向上
- メンテナンス性の向上

## 参考資料

- ドメイン駆動設計の境界づけられたコンテキストの概念
- Feature Sliced Design アーキテクチャパターン