# Review System SOP

> AI code review 系統操作手冊。每次 review 都是一次 Review Loop 的執行。

---

## 前置準備

1. 確認 `review-system/config/project.yaml` 已填寫完畢
2. 已執行過 `bootstrap.md` 完成初始化

---

## 目錄結構

```
review-system/
├── config/
│   └── project.yaml          # 專案配置
├── PLAN.md                   # 系統設計計畫
├── README.md                 # 本檔案：操作 SOP
├── run.md                    # 自動執行入口（單步模式）
├── scan.md                   # 掃描未覆蓋 class
├── bootstrap.md              # 初始化 wizard
├── PROGRESS.md               # 執行歷程記錄（bootstrap 後自動建立）
├── prompts/                  # Prompt templates
│   ├── class-review.md
│   ├── concept-review.md
│   └── site-build.md
├── schema/                   # 文件格式規格
│   ├── class-schema.md
│   ├── concept-schema.md
│   ├── class-example.md
│   └── concept-example.md
└── scripts/
    └── check-updates.sh

docs/
├── knowledge/
│   ├── _meta/coverage.md     # 模組 review 狀態追蹤
│   ├── classes/              # 各 class 知識文件（入口 A）
│   └── concepts/             # 各機制知識文件（入口 B）
└── {seed_file}               # 全局總覽文件
```

---

## Review Loop 標準流程

```
B1. 選目標 → B2. 執行 Review → B3. 驗證 → B4. 更新 Coverage → B5. 回饋總覽文件
     ↑___________________________________________________________↓
```

### B1. 選擇 Review 目標

查看 `docs/knowledge/_meta/coverage.md`，優先選：
1. 狀態為 `pending` 的首輪優先模組
2. 狀態為 `needs-update` 的模組（source 有變動）
3. 手動指定

### B2. 執行 Review

**Class review**（單一 class 深度分析）：

使用 `review-system/prompts/class-review.md` 的 prompt template，填入目標 class 名稱後送出。

**Concept review**（橫跨多 class 的機制分析）：

使用 `review-system/prompts/concept-review.md` 的 prompt template，填入目標機制與涉及的 class 後送出。

### B3. 驗證產出品質

- [ ] 文件符合 schema 格式（frontmatter 完整、段落齊全）
- [ ] 疊代更新時，沒有覆蓋既有正確內容
- [ ] 互連正確（class 的 related_concepts ↔ concept 的 related_classes 雙向對應）
- [ ] 閱讀測試：讀完後能回答「這個 class 做什麼」/「這個機制怎麼運作」

### B4. 更新 Coverage

在 `docs/knowledge/_meta/coverage.md` 更新狀態：
- 完成 → `reviewed`，填入日期
- 若後續 source file 有 commit → 手動標為 `needs-update`

### B5. 回饋更新總覽文件

若本次 review 發現全局總覽文件有不精確或遺漏之處：
- 修正描述，補充新發現的細節
- 保持「全局總覽」定位，細節留在 class/concept 文件

---

## 快速開始

### 確認進度

每次開新 session 時，用以下 prompt 確認現在該做什麼：

```
讀取 @review-system/PLAN.md 和 @docs/knowledge/_meta/coverage.md，
告訴我目前進度，以及建議的下一步。
```

### 用 run.md 自動執行

`run.md` 是自動執行入口，每次處理一個項目：

```
請依照 @review-system/run.md 執行
```

### 重跑 review

```
請依照 @review-system/run.md 執行，重跑全部
```

```
請依照 @review-system/run.md 執行，重跑 {ClassName}
```

### 連續執行

- **手動**：每次輸入「繼續」驅動下一個項目

---

## 偵測 source 變動

```bash
bash review-system/scripts/check-updates.sh
```

比對輸出與 `docs/knowledge/_meta/coverage.md`，將有變動的項目狀態改為 `needs-update`。

---

## 維護

- **Schema 調整**：修改 `schema/` 下的規格文件，受影響的知識文件需重跑 review
- **Prompt 調整**：修改 `prompts/` 下的 template
- **Coverage 管理**：對應 source file 有 commit → 手動/腳本標記 `needs-update`
