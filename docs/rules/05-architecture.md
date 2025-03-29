## アーキテクチャ

Single-page application

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
