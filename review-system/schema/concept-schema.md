# Concept 文件 Schema 規格

## Frontmatter

```yaml
---
concept: kebab-case-name              # 概念/機制名稱，用 kebab-case
related_classes: []                   # 涉及的 class 名稱清單
last_reviewed: YYYY-MM-DD
coverage: 0%                          # 主觀評估：對此機制的理解覆蓋率
symptoms: []                          # 常見症狀關鍵詞，用於 issue 內文檢索
---
```

## 段落規格

| 段落 | 必填 | 說明 |
|------|------|------|
| `## 這個機制做什麼` | ✅ | 一段話說明此機制的功能與目的（使用者感知層面 + 程式層面） |
| `## 完整運作流程` | ✅ | 從觸發條件開始，步驟式描述整個流程直到結束（含錯誤/邊界情況） |
| `## 流程圖` | ✅ | 用 Mermaid flowchart 表示主要流程（至少含觸發→核心邏輯→結束） |
| `## 涉及的 class 與各自職責` | ✅ | 列出每個參與此機制的 class，說明它在這個機制裡扮演什麼角色 |
| `## 如果要修改這個功能，動哪裡` | ✅ | 指出最可能需要修改的檔案/方法，以及修改時需要注意的副作用 |
| `## 學習要點` | ✅ | 理解此機制後，能解釋哪些行為？有哪些設計值得注意？ |
| `## 待補充` | ✅ | 尚未釐清的部分（每次 review 後更新或清空） |

## 互連規則

- `related_classes` 填寫的名稱，必須對應 `docs/knowledge/classes/` 下的實際檔案
- 每次更新此文件時，也要確認對應 class 文件的 `related_concepts` 有列入此 concept

## 範例文件

見 `review-system/schema/concept-example.md`
