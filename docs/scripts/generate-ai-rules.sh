#!/bin/bash

# エラー発生時にスクリプトを停止
set -e

# .clinerules ディレクトリが存在しない場合は作成
mkdir -p .clinerules

# docs/rules 配下の全ての .md ファイルを .clinerules にコピー
cp -r docs/rules/* .clinerules/

echo "Rules files have been copied to .clinerules directory successfully."
