## git

git コミットとプルリクエストの作成に関するベストプラクティス

### commit

#### コミットメッセージ

- 「なぜ」に焦点を当てる
- 明確で簡潔な言葉を使用
- 変更の目的を正確に反映
- Use conventional commit message format.
- description in Japanese.

#### 実行


```bash
# 関連ファイルのみをステージング
git add <files>

# コミット例
git commit -m "feat: (description)"
```

### プルリクエストの作成

`gh pr` コマンドを使って作成する

```bash
# プルリクエストの作成例（HEREDOCを使用）
gh pr create --title "簡潔なタイトル" --body "$(cat <<'EOF'
## 概要

...

## 変更内容

- ...

## レビューのポイント

- ...
EOF
)"
```
