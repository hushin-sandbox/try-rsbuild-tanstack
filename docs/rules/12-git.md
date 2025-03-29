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
git commit -m "$(cat <<'EOF'
<type>(<scope>): <適切なメッセージ>

- <詳細な変更内容>
- <詳細な変更内容>

EOF
)"
```

### プルリクエストの作成

#### ブランチの状態確認

```
# 未コミットの変更確認
git status

# mainからの差分確認
GIT_PAGER=cat git diff --stat main...HEAD 

# コミット履歴の確認
GIT_PAGER=cat git log main..HEAD
```

#### 実行コマンド
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
