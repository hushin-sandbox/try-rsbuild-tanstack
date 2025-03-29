#!/bin/bash

# エラー発生時にスクリプトを停止
set -e

# .clinerules ディレクトリが存在しない場合は作成
mkdir -p .clinerules

# docs/rules 配下の x- で始まらない .md ファイルを .clinerules にコピー
find docs/rules -type f -name "*.md" ! -name "x-*" -exec cp {} .clinerules/ \;

echo "Rules files have been copied to .clinerules directory successfully."
