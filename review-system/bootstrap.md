# Part A — 初始化 Bootstrap

請根據 `review-system/config/project.yaml` 的設定，為此專案初始化 AI code review 知識庫。

---

## Step 0（前置）：驗證配置

1. 讀取 `review-system/config/project.yaml`
2. 確認以下欄位已填寫：
   - `project.name`
   - `paths.source_dir`
   - `paths.source_glob`
3. 若有欄位為空，告知使用者需要先填寫哪些欄位

---

## Step 1：產出 Seed Data（全局總覽文件）

1. 使用 `paths.source_glob` 掃描專案原始碼
2. 重點閱讀：Entry/Main、Model、Controller、核心邏輯模組
3. 產出全局總覽文件（建議放在 `docs/` 根目錄），內容包含：
   - 分層架構圖
   - 核心流程圖（初始化、主要操作、核心邏輯）
   - 主要模組一覽表
   - 每個主要模組一段說明
4. 將產出的檔案路徑更新到 `review-system/config/project.yaml` 的 `paths.seed_file`

---

## Step 2：建立目錄結構

依照 `review-system/config/project.yaml` 中的 `paths` 設定建立：

```bash
mkdir -p docs/knowledge/classes
mkdir -p docs/knowledge/concepts
mkdir -p docs/knowledge/_meta
```

---

## Step 3：選定首輪 Review 目標

從 Step 1 產出的總覽文件中，選出：
- **3-5 個核心 class**：系統的骨幹模組（如主控 Controller、資料 Model、核心引擎）
- **2-3 個核心 concept**：跨 class 的重要機制（如核心玩法流程、狀態管理機制）

---

## Step 4：建立 Coverage 追蹤表

建立 `docs/knowledge/_meta/coverage.md`：

```markdown
# Knowledge Base Coverage

> 最後更新：{today}
> 狀態說明：`pending` 未開始 ｜ `reviewed` 已完成 ｜ `needs-update` source 有變動待重跑 ｜ `skip` 暫不 review

---

## 核心 Classes

| Class | 檔案路徑 | 狀態 | 最後 review | 備注 |
|-------|----------|------|------------|------|
| {ClassName} | {file_path} | pending | — | — |
...

---

## Concepts

| Concept | 說明 | 狀態 | 最後 review | 備注 |
|---------|------|------|------------|------|
| {concept-name} | {description} | pending | — | — |
...
```

---

## Step 5：更新 Config

將 Step 3 選出的首輪目標填入 `review-system/config/project.yaml` 的 `review.first_batch`。

---

## Step 6：更新首頁

將 `docs/index.md` 的 `hero.name` 更新為 `review-system/config/project.yaml` 中的 `project.name`。

---

## Step 7：驗證

- [ ] 全局總覽文件已產出且可讀
- [ ] `docs/knowledge/` 目錄結構已建立
- [ ] `coverage.md` 包含首輪目標、狀態為 `pending`
- [ ] `review-system/config/project.yaml` 的 `seed_file` 已更新
- [ ] `docs/index.md` 的 `hero.name` 已更新為專案名稱

---

## 完成後

回報：
1. 產出的全局總覽文件路徑
2. 首輪 review 目標清單
3. 下一步指令：「請依照 @review-system/run.md 執行」
