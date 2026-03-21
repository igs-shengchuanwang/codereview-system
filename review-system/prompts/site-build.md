執行一次網站建設任務。

**前置**：讀取 `review-system/config/project.yaml` 取得專案配置。

**目標任務**：若使用者有指定則使用指定的；若未指定，讀取 `docs/knowledge/_meta/coverage.md`，從「網站建設」表格中取第一個 `pending` 項目。

**技術選型**：VitePress（支援 Mermaid、全文搜尋、GitHub Pages 部署）

---

## vitepress-setup

執行條件：任務為 `vitepress-setup`

**步驟**：

1. 確認 `docs/package.json` 存在且包含 vitepress 依賴
2. 確認 `docs/.vitepress/config.ts` 已設定：
   - `title` 對應 `config/project.yaml` 的 `site.title`
   - `base` 對應 `config/project.yaml` 的 `site.base`
   - sidebar 自動掃描 `knowledge/classes/` 和 `knowledge/concepts/`
3. 確認 `docs/index.md` 首頁包含：
   - Classes 與 Concepts 兩個入口連結
   - 全局總覽文件連結
4. 確認導航頁面：
   - `docs/classes.md` — 列出 `docs/knowledge/classes/` 下所有文件連結
   - `docs/concepts.md` — 列出 `docs/knowledge/concepts/` 下所有文件連結
5. 確認 Mermaid 支援已啟用（vitepress-plugin-mermaid）
6. 確認自訂 theme 包含 SourceLink 元件（frontmatter.file → GitHub 連結）

**完成後執行**：
1. 更新 coverage.md 中 `vitepress-setup` 狀態
2. 追加結果到 `review-system/PROGRESS.md`

---

## github-pages-deploy

執行條件：任務為 `github-pages-deploy`，且 `vitepress-setup` 已為 `reviewed`

**步驟**：

1. 確認 VitePress 設定完畢
2. 建立 `.github/workflows/docs-deploy.yml`：
   - trigger：`docs/**` 有 push 到對應分支
   - 使用 Node.js + VitePress build
   - 使用 `actions/deploy-pages` 部署
3. 設定 `base` 對應 `config/project.yaml` 的 `site.base`

**完成後執行**：
1. 更新 coverage.md 狀態
2. 追加結果到 PROGRESS.md

完成後回報：已建立的檔案清單，以及需要在 GitHub repo Settings > Pages 手動啟用的步驟。
