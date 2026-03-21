執行一次 concept review。

**前置**：讀取 `review-system/config/project.yaml` 取得專案配置。

**目標 concept**：若使用者有指定則使用指定的；若未指定，讀取 `docs/knowledge/_meta/coverage.md`，從狀態為 `pending` 或 `needs-update` 的 concept 項目中選第一個，並告知使用者選了哪個。

**涉及的 class**：若使用者有指定則使用指定的；若未指定，從全局總覽文件（`config/project.yaml` 的 `paths.seed_file`）中找出與目標 concept 相關的 class 清單。

**步驟**：

1. 確認目標 concept 名稱與涉及的 class 清單（見上）
2. 使用 `config/project.yaml` 中的 `paths.source_dir`，搜尋並讀取所有涉及 class 的 source files
3. 讀取現有知識庫文件 `docs/knowledge/concepts/{concept-name}.md`（若存在）
4. 讀取各涉及 class 的知識庫文件 `docs/knowledge/classes/{ClassName}.md`（若存在）
5. 讀取 `review-system/schema/concept-schema.md` 了解格式規範
6. 依照 schema 格式，產出或更新 `docs/knowledge/concepts/{concept-name}.md`

**疊代規則**：
- 若文件已存在：只更新有新發現的段落，保留已驗證的內容
- 若文件不存在：從頭產出完整文件，流程圖段落必須包含 Mermaid 圖
- 所有描述必須 100% 來自 source code，不可猜測

**完成後執行**：
1. 寫入 `docs/knowledge/concepts/{concept-name}.md`
   - 在 frontmatter 的 `symptoms` 填入 3–6 個常見症狀關鍵詞：
     - 描述這個機制出問題時，issue 上最常出現的症狀措辭
     - 使用開發者/QA 日常用語（不是程式術語）
     - 例：`[功能不觸發, 流程中斷, 操作後沒反應]`
2. 更新 `docs/knowledge/_meta/coverage.md`（將此 concept 標為 `reviewed`，填入日期）
3. 確認各涉及 class 的文件中 `related_concepts` 有列入此 concept，若無則補上
4. 若本次發現全局總覽文件中有描述不精確的地方，更新該文件

完成後回報：已建立/更新的檔案清單，以及本次 review 的主要發現（2–3 點）。
