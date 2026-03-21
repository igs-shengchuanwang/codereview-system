---
class: GameEngine
file: src/core/GameEngine.ts
last_reviewed: 2026-01-01
coverage: 100%
related_concepts: [game-loop, state-management]
symptoms: [遊戲卡住不動, 畫面沒反應, 狀態異常, 初始化失敗]
---

## 職責

**管理遊戲主循環與全域狀態調度，驅動所有子系統按序執行。**
它「不」負責具體的業務邏輯（如戰鬥計算、UI 渲染）——那些由各個 Controller/Manager 處理。

## 在架構中的位置

**Core Layer**。在整個系統中居於最上層調度位置：

```
Application Entry
    │
    ▼
GameEngine（主循環調度 + 全域狀態）
    │
    ├──▶ StateManager（狀態管理）
    ├──▶ SceneController（場景切換）
    ├──▶ InputSystem（輸入處理）
    └──▶ EventBus（事件分發）
```

## 關鍵依賴

**Inbound（誰呼叫它）：**
- `Application.main()` 在啟動時建構並呼叫 `init()`
- 框架的 `update()` 回調每幀驅動 `tick()`

**Outbound（它呼叫誰）：**
- `StateManager.inst` — 讀取/更新全域狀態
- `SceneController` — 場景載入與切換
- `EventBus.emit()` — 發送生命週期事件（`GAME_INIT`, `GAME_START`, `GAME_PAUSE`, `GAME_END`）

## 重要方法

| 方法 | 說明 |
|------|------|
| `init(config)` | **入口**。讀取配置、初始化所有子系統、發送 GAME_INIT |
| `start()` | 開始主循環，發送 GAME_START |
| `tick(dt)` | 每幀呼叫，依序更新所有子系統 |
| `pause() / resume()` | 暫停/恢復主循環 |
| `destroy()` | 清理所有資源，發送 GAME_END |

## 學習要點

1. **單一調度中心**：所有子系統的更新順序由 `tick()` 內的呼叫順序決定，改變順序可能導致微妙的時序 bug。

2. **事件驅動生命週期**：外部模組透過監聽 EventBus 事件來回應遊戲狀態變化，而非直接依賴 GameEngine。

3. **Singleton 但非全域**：透過 Application 持有唯一實例，而非暴露全域變數。

## 待補充

- 無。
