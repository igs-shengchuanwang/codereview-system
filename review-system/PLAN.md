# AI Code Review 系統開發計畫

> 目標：建立一套 AI code review 系統，產出可累積的學習型知識庫，幫助閱讀者對專案開發越來越強。

---

## 設計決策

| 決策 | 結論 |
|---|---|
| D1 開發文件位置 | `./review-system/` |
| D1 知識庫位置 | `docs/knowledge/classes/` + `docs/knowledge/concepts/` |
| D1 網站位置 | `docs/`（VitePress，可部署至 GitHub Pages） |
| D2 分析單位 | 以 class 為主，可手動組合多個 class |
| D3 配置中心 | `review-system/config/project.yaml` |

---

## 核心設計原則

- 每次 review **疊代更新**既有文件，不重寫
- 知識庫**雙入口**：class 導向（這個 class 是做什麼的？）+ 概念/機制導向（這個功能怎麼運作？）
- 兩者互相連結
- 所有路徑與專案資訊統一由 `review-system/config/project.yaml` 管理

---

## 目錄結構

```
./review-system/          # review 系統工程文件
├── config/
│   └── project.yaml      # 專案配置（路徑、repo URL、站台設定）
├── PLAN.md               # 本檔案
├── README.md             # 操作 SOP
├── run.md                # 自動執行入口
├── scan.md               # 掃描未覆蓋 class
├── bootstrap.md          # 初始化 wizard
├── prompts/              # AI prompt templates
├── schema/               # 文件 schema 規格
└── scripts/              # 輔助腳本

docs/
├── knowledge/
│   ├── _meta/
│   │   └── coverage.md   # 模組 review 狀態追蹤
│   ├── classes/          # 各 class 說明文件（入口 A）
│   └── concepts/         # 功能/機制說明文件（入口 B）
├── .vitepress/           # VitePress 站台設定
└── {seed_file}           # 全局總覽文件（seed data，bootstrap 產出）
```

---

## Part A — 一次性建設（Bootstrap）

**目標**：讓 Review Loop 可以開始運作的最低限度建設。

### A1. 設定專案配置
- [ ] 填寫 `review-system/config/project.yaml` 中的所有欄位

### A2. 產出 Seed Data
- [ ] AI 掃描專案原始碼，產出全局總覽文件
- [ ] 更新 `review-system/config/project.yaml` 的 `seed_file` 路徑

### A3. 建立目錄與追蹤表
- [ ] 建立 `docs/knowledge/classes/`、`docs/knowledge/concepts/`、`docs/knowledge/_meta/`
- [ ] 建立 `docs/knowledge/_meta/coverage.md`（初始追蹤表）

### A4. 選定首輪 Review 目標
- [ ] 從 seed data 中選出 3-5 個核心 class 和 2-3 個核心 concept
- [ ] 填入 `coverage.md` 並標為 `pending`

**Part A 完成標準**：seed data + coverage.md 就位，可以開始跑 Review Loop。

---

## Part B — Review Loop（核心循環）

```
┌───────────────────────────────────────────────────────────────┐
│                       Review Loop                             │
│                                                               │
│  B1. 選目標 → B2. 執行 Review → B3. 驗證                     │
│       ↑              ↓                                       │
│       └── B4. 更新 Coverage ← B5. 回饋更新總覽文件 ──────────┘│
└───────────────────────────────────────────────────────────────┘
```

### B1. 選擇 Review 目標
- `coverage.md` 中 `pending` 或 `needs-update` 的模組
- 最近修改的 source file（`scripts/check-updates.sh`）
- 手動指定

### B2. 執行 Review
- **Class review**：`prompts/class-review.md`
- **Concept review**：`prompts/concept-review.md`

### B3. 驗證產出品質
- [ ] 文件符合 schema 格式
- [ ] 疊代更新時，沒有覆蓋既有正確內容
- [ ] 互連正確（class ↔ concept 雙向）

### B4. 更新 Coverage

### B5. 回饋更新總覽文件

---

## Part C — 維護與優化（偶發）

### C1. Schema / Prompt 調整
- 發現產出品質不符預期 → 修改 schema 或 prompt → 重跑受影響文件

### C2. VitePress 站台建設
- [ ] 設定 `docs/.vitepress/config.ts`
- [ ] 建立首頁 + 導航頁
- [ ] GitHub Actions 部署 workflow

### C3. Coverage 管理
- 對應 source file 有 commit → `scripts/check-updates.sh` 偵測 → 標記 `needs-update`

---

## 里程碑

| 階段 | 交付物 | 頻率 | 狀態 |
|---|---|---|---|
| Part A Bootstrap | seed data + coverage + 首輪目標 | 一次性 | pending |
| Part B 首輪 Review | 核心 class/concept 文件 | 一次 | pending |
| Part B 持續 Review | 逐步擴充知識庫 | 持續 | — |
| Part C 網站 | VitePress 可用 | 一次性 | pending |
| Part C 維護 | schema/prompt 調整 | 偶發 | — |
