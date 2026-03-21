#!/bin/bash
# check-updates.sh
# 用法：bash review-system/scripts/check-updates.sh
# 說明：對 coverage.md 中所有 reviewed 項目，檢查 source file 自 last_reviewed 後是否有 git commit
# 輸出：有異動的項目清單（不修改 coverage.md，由人工決定是否重跑）
#
# 此腳本從 config/project.yaml 讀取 source_dir（需要 yq 或手動設定）
# 若無 yq，可手動修改下方 SOURCE_PREFIX 變數

set -euo pipefail

# ---- 配置 ----
# 嘗試從 project.yaml 讀取設定（需要 yq）
CONFIG="review-system/config/project.yaml"
if command -v yq &> /dev/null && [ -f "$CONFIG" ]; then
  SOURCE_PREFIX=$(yq '.paths.source_dir' "$CONFIG" | tr -d '"')
  # 從 source_glob 提取副檔名（例如 "src/**/*.ts" → "ts"）
  SOURCE_GLOB=$(yq '.paths.source_glob' "$CONFIG" | tr -d '"')
  SOURCE_EXT="${SOURCE_GLOB##*.}"
else
  # 若無 yq，手動設定你的 source 目錄與副檔名
  SOURCE_PREFIX="src/"
  SOURCE_EXT="ts"
  echo "⚠️  未偵測到 yq，使用預設 SOURCE_PREFIX=$SOURCE_PREFIX, SOURCE_EXT=$SOURCE_EXT"
  echo "   若不正確，請安裝 yq 或手動修改此腳本"
  echo ""
fi

COVERAGE="docs/knowledge/_meta/coverage.md"
STALE=()

if [ ! -f "$COVERAGE" ]; then
  echo "❌ 找不到 $COVERAGE，請先執行 bootstrap。"
  exit 1
fi

while IFS='|' read -r _ class file status date rest; do
  class=$(echo "$class" | xargs)
  file=$(echo "$file" | xargs)
  status=$(echo "$status" | xargs)
  date=$(echo "$date" | xargs)

  # 只檢查 reviewed 項目
  [[ "$status" != "reviewed" ]] && continue
  # 跳過表頭、分隔線、空行
  [[ -z "$file" || "$file" == "檔案路徑" || "$file" == "---"* ]] && continue
  # 跳過非 source 路徑（如 concept 的「說明」欄位），根據 project.yaml 的副檔名判斷
  [[ "$file" != *."$SOURCE_EXT" ]] && continue

  full_path="${SOURCE_PREFIX}${file}"
  # 也嘗試原始路徑（coverage.md 可能已包含完整路徑）
  if [ ! -f "$full_path" ] && [ -f "$file" ]; then
    full_path="$file"
  fi

  commits=$(git log --since="$date" --oneline -- "$full_path" 2>/dev/null || true)

  if [[ -n "$commits" ]]; then
    STALE+=("$class  (last reviewed: $date)")
  fi
done < <(grep '|' "$COVERAGE")

echo ""
if [[ ${#STALE[@]} -eq 0 ]]; then
  echo "✅ 全部 reviewed 項目均為最新，無需重跑。"
else
  echo "⚠️  以下項目自 last_reviewed 後 source 有異動，建議在 coverage.md 標為 needs-update 並重跑："
  echo ""
  for item in "${STALE[@]}"; do
    echo "  - $item"
  done
  echo ""
  echo "執行重跑：「請依照 review-system/run.md 執行，重跑 {ClassName}」"
fi
echo ""
