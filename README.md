# AI Code Review System

> 一套 AI 驅動的 code review 系統，產出可累積的學習型知識庫，幫助開發者快速理解專案架構。

## 特色

- **雙入口知識模型**：Class 導向（這個 class 做什麼？）+ Concept 導向（這個功能怎麼運作？）
- **疊代更新**：每次 review 更新既有文件，不重寫，知識持續累積
- **VitePress 站台**：全文搜尋、Mermaid 流程圖、GitHub 原始碼連結
- **AI prompt 驅動**：標準化 prompt template，確保產出品質一致

## 快速安裝

### 1. 複製到你的專案

```bash
# 將 review-system-package 內容複製到你的專案根目錄
cp -r review-system-package/review-system  <your-project>/review-system
cp -r review-system-package/docs           <your-project>/docs
cp    review-system-package/.github/workflows/docs-deploy.yml  <your-project>/.github/workflows/
```

### 2. 設定專案配置

編輯 `review-system/config/project.yaml`，填入你的專案資訊：

```yaml
project:
  name: "MyProject"    # ← 改為你的專案名稱
paths:
  source_dir: "src/"
  source_glob: "src/**/*.ts"
git:
  repo_url: "https://github.com/your-org/your-repo"
site:
  base: "/your-repo/"
```

同時更新 `docs/index.md` 的 `hero.name` 為你的專案名稱。

### 3. 安裝 VitePress

```bash
cd docs
npm install
```

### 4. 初始化知識庫（Bootstrap）

使用 AI 助手（Claude / Gemini）執行 bootstrap：

```
請依照 @review-system/bootstrap.md 執行，使用 @review-system/config/project.yaml 的設定。
```

這會自動：
- 掃描專案原始碼，產出 seed data 總覽文件
- 建立 `docs/knowledge/` 目錄結構
- 初始化 `coverage.md` 追蹤表
- 選出首輪 review 目標

### 5. 開始 Review

```
請依照 @review-system/run.md 執行
```

### 6. 啟動知識庫網站

```bash
cd docs
npm run dev    # 本地開發
npm run build  # 建置
```

---

## 目錄結構

```
review-system/                    # Review 流程引擎
├── config/
│   └── project.yaml              # 👈 專案配置（主要需要修改的檔案）
├── PLAN.md                       # 系統設計計畫
├── README.md                     # 操作 SOP
├── run.md                        # AI 單步自動執行入口
├── scan.md                       # 掃描未覆蓋 class
├── bootstrap.md                  # 初始化 wizard
├── prompts/                      # Prompt templates
│   ├── class-review.md
│   ├── concept-review.md
│   └── site-build.md
├── schema/                       # 文件格式規格
│   ├── class-schema.md
│   ├── concept-schema.md
│   ├── class-example.md
│   └── concept-example.md
└── scripts/
    └── check-updates.sh          # 偵測 source 變動

docs/                             # VitePress 知識庫站台
├── .vitepress/
│   ├── config.ts                 # VitePress 設定（讀取 project.yaml）
│   └── theme/                    # 自訂 theme（SourceLink 元件）
├── index.md                      # 首頁
├── classes.md                    # Classes 導航
├── concepts.md                   # Concepts 導航
├── knowledge/
│   ├── _meta/coverage.md         # 覆蓋率追蹤
│   ├── classes/                  # Class review 文件
│   └── concepts/                 # Concept review 文件
└── package.json
```

## 運作流程

```
Bootstrap（一次性）→ Review Loop（持續循環）→ 知識庫成長
                         ↓
        B1.選目標 → B2.執行 Review → B3.驗證
             ↑              ↓
             └── B4.更新 Coverage ← B5.回饋總覽 ─┘
```

## 授權

MIT
