# 掃描未覆蓋 Class

掃描 source 中尚未納入 `docs/knowledge/_meta/coverage.md` 的 class，協助決定下一批 review 目標。

**前置**：讀取 `review-system/config/project.yaml` 取得 `paths.source_glob` 和 `review.export_pattern`。

---

## 執行步驟

1. 讀取 `docs/knowledge/_meta/coverage.md`，列出所有已追蹤的 class 名稱（coverage.md 表格第一欄）

2. 使用 `config/project.yaml` 中的 `paths.source_glob`，grep 出所有符合 `review.export_pattern` 的 class 名稱
   - 若有設定 `review.class_prefix`，只匹配帶有該前綴的 class

3. 輸出差集（在 source 中存在但 coverage.md 未追蹤的 class），依目錄分組顯示：

   ```
   controllers/
     - GameEngine
     - PlayerController
   models/
     - GameState
   ...
   ```

4. 對每個未覆蓋 class，給出建議優先度：

   - **high**：被其他已 review class 直接依賴，或是核心流程的一環
   - **medium**：獨立功能模組，理解它有助掌握某個功能區塊
   - **skip**：純資料結構（Schema、Data）、常數定義（Const）、小型 helper，可暫不 review

5. 輸出完整報告後，詢問使用者：「請選擇想加入 coverage.md 的項目（可複數），我會將它們加入為 `pending` 狀態。」

---

## 完成後執行

依使用者確認，將選定的 class 加入 `docs/knowledge/_meta/coverage.md` 的對應分類表格，狀態設為 `pending`。

回報：新增了哪幾個項目、目前 pending 總數。
