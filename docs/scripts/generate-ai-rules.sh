#!/bin/bash

# エラー発生時にスクリプトを停止
set -e

# 既存の .clinerules ディレクトリを削除して新規作成
rm -rf .clinerules
mkdir -p .clinerules

# docs/rules 配下の .md ファイルをディレクトリ構造を維持したままコピー
cd docs/rules
find . -type f -name "*.md" -exec cp --parents {} ../../.clinerules/ \;
cd -

echo "Rules files have been copied to .clinerules directory successfully."
