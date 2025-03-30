#!/bin/bash

# エラー発生時にスクリプトを停止
set -e

# 既存の .clinerules ディレクトリを削除して新規作成
rm -rf .clinerules
mkdir -p .clinerules

# docs/rules 配下の x- で始まらない .md ファイルをディレクトリ構造を維持したままコピー
find docs/rules -type f -name "*.md" ! -name "x-*" -exec cp --parents {} .clinerules/ \;

echo "Rules files have been copied to .clinerules directory successfully."
