# Class 文件 Schema 規格

## Frontmatter

```yaml
---
class: ClassName                          # 完整 class 名稱
file: path/to/file.ts                     # 相對於 repo root 的檔案路徑
last_reviewed: YYYY-MM-DD
coverage: 0%                              # 主觀評估：對此 class 的理解覆蓋率
related_concepts: []                      # 連結的 concept 文件名（不含副檔名）
symptoms: []                              # 常見症狀關鍵詞，用於 issue 內文檢索
---
```

## 段落規格

| 段落 | 必填 | 說明 |
|------|------|------|
| `## 職責` | ✅ | 一句話說明這個 class 做什麼，第二句補充它「不」做什麼（邊界） |
| `## 架構位置圖` | ✅ | **Mermaid graph** 呈現此 class 與上下游元件的依賴關係。必須包含：呼叫者 → 此 class → 被呼叫者，以及事件連線。用虛線表示事件驅動關係 |
| `## 關鍵依賴` | ✅ | **Inbound**：誰建構/呼叫它、監聽哪些事件；**Outbound**：它呼叫誰、發送哪些事件 |
| `## 生命週期 / 狀態圖` | 條件必填 | 若此 class 具有 FSM、明確的狀態轉換、或多階段生命週期，**必須**用 Mermaid `stateDiagram-v2` 呈現。若 class 無狀態行為可填「無明確狀態機」 |
| `## 重要方法` | ✅ | 列出 3–7 個關鍵 public/protected 方法，每個附一行說明其用途與時機 |
| `## 核心流程時序圖` | 條件必填 | 若此 class 與 2 個以上元件有互動順序，**必須**用 Mermaid `sequenceDiagram` 呈現最重要的一條操作流程。純資料 class 或無跨元件互動者可填「無跨元件互動流程」 |
| `## 學習要點` | ✅ | 這個 class 體現了哪些設計決策？讀懂它之後能理解什麼機制？ |
| `## 待補充` | ✅ | 尚未看懂或需要下次繼續的部分（每次 review 後更新或清空） |

## 圖解原則

- **圖優先、文字輔助**：每個段落能用圖表達的就用圖，文字只用於補充圖中無法表達的語境
- 優先使用的圖類型（依偏好順序）：
  1. `sequenceDiagram` — 多元件互動、操作時序
  2. `stateDiagram-v2` — 狀態轉換、生命週期
  3. `graph TD / LR` — 依賴關係、架構位置
  4. `flowchart` — 單一流程的決策分支
- 每張 Mermaid 圖上方應有一行說明此圖要表達什麼

## 互連規則

- `related_concepts` 填寫的名稱，必須對應 `docs/knowledge/concepts/` 下的實際檔案
- 每次更新此文件時，也要確認對應 concept 文件的 `related_classes` 有列入此 class

## 範例文件

見 `review-system/schema/class-example.md`
