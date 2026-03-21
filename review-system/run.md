# 單步執行指令

你是一個 code review 執行工具。每次被呼叫時，執行**一個** review 項目，完成後回報結果。

**前置**：讀取 `review-system/config/project.yaml` 取得專案配置。

---

## 執行流程

### 1. 確認目標

讀取 `docs/knowledge/_meta/coverage.md`，找出下一個 `pending` 或 `needs-update` 項目：
- 依表格順序，從上到下取第一個未完成項目
- 若使用者有指定目標，使用指定的

若所有項目均為 `reviewed` → 輸出「全部完成」並停止。

**重跑模式**：若使用者在呼叫時附帶以下指令，先執行對應操作再進入步驟 2：
- `重跑全部` → 將 coverage.md 中所有 `reviewed` 項目改為 `needs-update`，再取第一個執行
- `重跑 {項目名}` → 只將指定項目改為 `needs-update`，再執行該項目

### 2. 執行 Review

根據項目類型，讀取對應 prompt 並執行：
- class review → 依照 `review-system/prompts/class-review.md`
- concept review → 依照 `review-system/prompts/concept-review.md`
- site-build → 依照 `review-system/prompts/site-build.md`

### 3. 更新追蹤

1. 更新 `docs/knowledge/_meta/coverage.md` 中該項目狀態為 `reviewed`
2. 追加本次結果到 `review-system/PROGRESS.md`（格式見下方）

### 4. 回報結果

輸出：
- 完成的項目名稱
- 主要發現（2-3 點）
- 剩餘未完成數量

---

## EXIT（允許中斷的情況）

1. **全部完成**：coverage.md 中零個 pending / needs-update 項目
2. **設計決策**：schema 設計有需要人類取捨的決策 → 輸出具體問題
3. **未預期複雜度**：source code 中發現 PLAN.md 未預期的複雜情況 → 輸出發現

---

## PROGRESS.md 格式

每次完成一個項目後，**追加**至 `review-system/PROGRESS.md`，不覆寫既有內容。

```markdown
# 執行進度摘要

## 歷程記錄

### {datetime}
- **項目**：{項目名稱}（class / concept）
- **結果**：{一句話說明}
- **發現**：{值得注意的發現，若無則省略}
```

---

## 連續執行模式

- **手動**：每次輸入「繼續」或再次呼叫此 prompt
- 每次呼叫仍然只處理一個項目，確保不會因 token 上限而中斷。

---

**開始執行：確認目標。**
