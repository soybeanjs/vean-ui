# @vean/ui — 组件路线图 (Roadmap)

> 本文档是项目的**总路线图**，覆盖三大板块：
>
> 1. **核心组件路线**：按 **高 / 中 / 低** 三级优先级分类所有待实现组件，附「延后至组件市场」与「范围外组件」清单（已发布组件清单见附录 B，用法与 API 以文档站为权威）；调研方法与调研库清单见「[调研方法与评估维度](#调研方法与评估维度)」与「[附录 A](#附录-a--调研的组件库14-个)」。
> 2. **领域扩展路线**：AI/chat 与中后台壳均确定在核心 aria/ui 内实现，分别见 [ui-ai-roadmap.md](./ui-ai-roadmap.md) 与 [ui-shell-roadmap.md](./ui-shell-roadmap.md)；editor / table / form / ui-pro 保留为未来提案（落地形态待立项评估），见 [领域扩展路线](#领域扩展路线domains--proposals) 与 [docs/ecosystem/](../ecosystem/README.md)。
> 3. **项目优化路线**：来自 [optimize.md](../optimize.md) 的 F1–F11 工程改进项及执行阶段，详见 [项目优化路线](#项目优化路线engineering-optimization)。

## 概述

| 类别                   | 数量 | 说明                                                                                                                                                        |
| :--------------------- | :--: | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 已发布（shipped）      |  96  | `accordion` … `watermark`，见 `packages/ui/src/index.ts`                                                                                                    |
| 高优先级（P0 + P1）    |  22  | 关键缺口与强需求，优先实现（P0 × 9 + P1 × 13）                                                                                                              |
| 中优先级（P2）         |  11  | 有用且有一定需求，按计划推进                                                                                                                                |
| 低优先级（P3）         |  12  | 小众但功能独立，择机实现                                                                                                                                    |
| 延后至组件市场         |  12  | 复合型 / 小众，将以源码形式分发                                                                                                                             |
| 范围外                 | 60+  | 移动端专用、已被覆盖、图表、业务专属等                                                                                                                      |
| 核心内领域             |  2   | AI/chat（[ui-ai-roadmap.md](./ui-ai-roadmap.md)）、中后台壳（[ui-shell-roadmap.md](./ui-shell-roadmap.md)）——逻辑在 aria 域模块、组件在 ui，统一 `S` 前缀   |
| 未来提案（形态待评估） |  4   | editor（富文本）、table（高级数据网格）、form（Schema 表单）、ui-pro（增值）；ui-x/admin/chart 已取消不发布，详见 [docs/ecosystem/](../ecosystem/README.md) |
| 工程优化项             |  11  | F1–F11，见 [optimize.md](../optimize.md)，分阶段 A–D 推进                                                                                                   |

### 优先级映射说明

源文档采用四级优先级（P0 / P1 / P2 / P3），本文档按三级归类如下：

| 路线图等级   | 对应源文档等级        | 含义                             |
| :----------- | :-------------------- | :------------------------------- |
| **高优先级** | P0 Critical + P1 High | 关键缺口与强需求，近期里程碑实现 |
| **中优先级** | P2 Medium             | 有用、中等需求，容量允许时安排   |
| **低优先级** | P3 Low                | 小众但功能独立，暂缓或择机实现   |

### 调研方法与评估维度

调研口径：

1. **取 14 个主流 UI 库**（10k+ star，含 React 与 Vue 两栈）作为对比基准，清单与各库组件数见 [附录 A](#附录-a--调研的组件库14-个)。
2. **与已发布组件做差集** — 对照 `packages/ui/src/index.ts` 的 96 个组件组，只保留差距项。
3. **桌面优先范围** — 移动端专用模式（多源自 Vant / Varlet）不进入活跃路线图。
4. **市场延后规则** — 需要大量原子组件组合、且使用场景小众者，延后到未来以源码形式分发的组件市场（见 [延后至组件市场](#延后至组件市场deferred-to-marketplace)）。

每个候选组件基于以下维度评估：

- **功能独立性 (Functional independence)** — 单一聚焦职责。
- **可复用性 (Reusability)** — 能否独立使用，无需大量原子组件组合。
- **需求度 (Demand)** — 在 14 个主流库中出现的数量（共识信号）。
- **契合度 (Alignment)** — 与桌面优先、aria/styled、企业级定位的契合。
- **工作量 (Effort)** — Low / Medium / High。

### 优先级图例

| 等级 | 标签     | 含义                                                 |
| :--: | :------- | :--------------------------------------------------- |
|  P0  | Critical | 关键缺口，广泛共识（6+ 库），低-中工作量，优先实现。 |
|  P1  | High     | 强需求（4+ 库）或企业关键，下一里程碑实现。          |
|  P2  | Medium   | 有用、中等需求，容量允许时安排。                     |
|  P3  | Low      | 小众但功能独立，暂缓 / 择机。                        |

---

## 高优先级（High — P0 Critical + P1 High）

关键缺口与强需求组件，应优先实现。共 **22** 个组件（P0 × 9 + P1 × 13）。

> **注：** `Rating`（原 P0 #1）已发布至 `@vean/ui`（`SRating`，见 [packages/ui/src/components/rating](../../packages/ui/src/components/rating)），自活跃路线图移除；下方序号沿用源文档，未重排。

### 概要

#### P0 — Critical（9 个）

| 序号 | 组件           | 需求度 | 工作量  |
| :--: | :------------- | :----: | :-----: |
|  2   | `Upload`       | 12/14  |  High   |
|  3   | `Timeline`     | 10/14  | Medium  |
|  4   | `Typography`   |  7/14  | Medium  |
|  5   | `Descriptions` |  4/14  | Medium  |
|  6   | `TreeSelect`   |  7/14  | Medium  |
|  7   | `Statistic`    |  6/14  |   Low   |
|  8   | `Ellipsis`     |  5/14  | Low-Med |
|  9   | `Code`         |  5/14  | Medium  |
|  10  | `Image`        |  8/14  | Medium  |

#### P1 — High（13 个）

| 序号 | 组件              | 需求度 | 工作量 |
| :--: | :---------------- | :----: | :----: |
|  11  | `Transfer`        |  6/14  |  High  |
|  12  | `QRCode`          |  3/14  |  Low   |
|  13  | `Result`          |  4/14  |  Low   |
|  14  | `Countdown`       |  3/14  |  Low   |
|  15  | `NumberAnimation` |  2/14  |  Low   |
|  16  | `InfiniteScroll`  |  4/14  | Medium |
|  17  | `Mention`         |  4/14  |  High  |
|  18  | `AvatarGroup`     |  6/14  |  Low   |
|  19  | `RangeSlider`     |  5/14  | Medium |
|  20  | `Space`           |  5/14  |  Low   |
|  21  | `SplitButton`     |  4/14  | Medium |
|  22  | `Fieldset`        |  5/14  |  Low   |
|  23  | `InputMask`       |  3/14  | Medium |

### 详细条目

---

#### 1. `Rating` — ✅ 已发布（shipped）

`Rating` 已实现并发布为 `SRating`，源码位于 [packages/ui/src/components/rating](../../packages/ui/src/components/rating) 与 [packages/aria/src/components/rating](../../packages/aria/src/components/rating)。原路线图条目（P0、Demand 10/14、Low effort、单类 `cv()` 模式）已达成，自活跃路线图移除。

---

#### 2. `Upload` — 高优先级 (P0) | Demand: 12/14 | Effort: High

**Purpose:** Let users select, preview, and upload files with progress feedback.

**Functionality:**

- File selection via button click or drag-and-drop.
- Multiple file support with configurable count/size limits.
- File list with preview (images), name, size, status, and remove action.
- Upload progress bar per file.
- Abort/retry individual uploads.
- Custom request adapter (XHR, fetch, or third-party storage).
- Drag-over visual feedback.
- Avatar upload mode (single image, square/circle crop).
- Accept attribute filtering by extension/MIME.

**Implementation considerations:**

- **Aria:** `UploadRoot` + `UploadDropzone` + `UploadFileList` + `UploadFileItem` + `UploadTrigger`. Multi-slot pattern with `UiContext`. Owns file state, validation, drag events, and the request lifecycle. Expose `customRequest` prop for adapter injection.
- **UI:** `scv()` recipe with slots (`root`, `dropzone`, `trigger`, `fileList`, `fileItem`, `progress`). Variants: `type` (select/drag/avatar), `listType` (text/image).
- **Dependencies:** Reuse `progress`, `button`, `tag` (for file status). Optional `tooltip` for error messages.
- **Patterns:** Multi-slot base component — `provideUploadUi(ui)` + `useUploadUi(slot)`. Consider a Compact aggregation (`UploadCompact`) for the common drag+list+progress composite.

**Cross-library:** Ant Design, Mantine, Element Plus, Naive UI, Arco, TDesign, PrimeVue, Vuetify, Quasar, Vant, Varlet, PrimeReact.

---

#### 3. `Timeline` — 高优先级 (P0) | Demand: 10/14 | Effort: Medium

**Purpose:** Display a chronological sequence of events with markers along a vertical or horizontal axis.

**Functionality:**

- Vertical (default) and horizontal orientation.
- Alternate (left/right) item placement.
- Customisable dot/marker per item (icon, colour).
- Item with timestamp, title, description, and optional extra content.
- Reverse mode (newest first or last).

**Implementation considerations:**

- **Aria:** `TimelineRoot` + `TimelineItem` + `TimelineDot` + `TimelineContent` + `TimelineSeparator`. Multi-slot; owns item registration and orientation context.
- **UI:** `scv()` recipe with slots (`root`, `item`, `separator`, `dot`, `content`). Variants: `mode` (left/alternate/right), `orientation` (horizontal/vertical).
- **Dependencies:** `icon` for custom markers.
- **Patterns:** Multi-slot — `provideTimelineUi(ui)`. Items are declarative children, no Compact aggregation needed.

**Cross-library:** MUI (Lab), Ant Design, Mantine, Element Plus, Naive UI, Arco, TDesign, PrimeVue, Vuetify, Quasar.

---

#### 4. `Typography` — 高优先级 (P0) | Demand: 7/14 | Effort: Medium

**Purpose:** Provide a family of styled text primitives (Title, Paragraph, Text) with consistent typography scales and semantic HTML.

**Functionality:**

- `TypographyTitle` (h1–h6) with heading level prop.
- `TypographyParagraph` with copyable, editable, ellipsis support.
- `TypographyText` with variant (secondary, success, warning, danger), mark, code, underline, delete, strong.
- Heading size independent of semantic level.
- Copy-to-clipboard integration.
- Ellipsis with tooltip expansion (delegates to `Ellipsis`).

**Implementation considerations:**

- **Aria:** `TypographyRoot` (context provider for scale) + `TypographyTitle` + `TypographyParagraph` + `TypographyText`. Each is a lightweight SFC; `polymorphic as` prop for semantic tag override.
- **UI:** `scv()` recipe per sub-component. Variants: `level` (1–6 for title), `type` (default/secondary/success/warning/danger), `size`.
- **Dependencies:** `clipboard` (for copyable), `tooltip` (for ellipsis), `editable` (for editable paragraph).
- **Patterns:** Multi-slot family — `provideTypographyUi(ui)`. Each sub-component reads context for consistent scale.

**Cross-library:** MUI, Ant Design, Mantine, Chakra UI, shadcn/ui, Element Plus, Naive UI, Arco, TDesign.

---

#### 5. `Descriptions` — 高优先级 (P0) | Demand: 4/14 | Effort: Medium

**Purpose:** Display a structured list of key-value pairs (field labels and values) in a responsive grid layout.

**Functionality:**

- Configurable column count (responsive breakpoints).
- Vertical or horizontal layout (label position: top/left/right).
- Bordered (table-style) and borderless variants.
- Item span control (colspan/rowspan).
- Title and extra slot for header actions.
- Size variants.

**Implementation considerations:**

- **Aria:** `DescriptionsRoot` + `DescriptionsItem`. Root owns column calculation and responsive breakpoints; items register their label/value/span.
- **UI:** `scv()` recipe with slots (`root`, `item`, `label`, `content`). Variants: `border` (true/false), `layout` (horizontal/vertical), `labelAlign` (left/right/center).
- **Dependencies:** None (pure layout).
- **Patterns:** Multi-slot — `provideDescriptionsUi(ui)`. Items are declarative; root computes grid from registered items.

**Cross-library:** Ant Design, Naive UI, Arco, TDesign.

---

#### 6. `TreeSelect` — 高优先级 (P0) | Demand: 7/14 | Effort: Medium

**Purpose:** Combine tree-structured data navigation with a select trigger, allowing users to pick a node from a hierarchy.

**Functionality:**

- Single and multiple selection modes.
- Checkable nodes (with parent-child cascade in multi-mode).
- Async/lazy loading of tree nodes.
- Search/filter within the tree.
- Virtual scrolling for large trees (reuse `virtualizer`).
- Customisable node rendering.
- Expand/collapse with keyboard navigation.
- `value`/`label` display in the trigger.

**Implementation considerations:**

- **Aria:** `TreeSelectRoot` + `TreeSelectTrigger` + `TreeSelectContent` + `TreeSelectTree` + `TreeSelectNode`. Composes `tree` logic inside a `popover`/`combobox`-style trigger. Reuse `useTreeState` composable from the existing `tree` component.
- **UI:** `scv()` recipe with slots (`root`, `trigger`, `content`, `node`). Variants: `size`, `color`, `multiple`, `checkable`.
- **Dependencies:** `tree` (aria logic), `popover` (positioning), `virtualizer` (optional, for large lists).
- **Patterns:** Multi-slot — `provideTreeSelectUi(ui)`. Consider Compact aggregation (`TreeSelectCompact`) that wires trigger + tree + virtualizer.

**Cross-library:** Ant Design, Mantine, Element Plus, Naive UI, Arco, TDesign, PrimeVue.

---

#### 7. `Statistic` — 高优先级 (P0) | Demand: 6/14 | Effort: Low

**Purpose:** Display a single labelled numeric value with optional prefix, suffix, and formatting.

**Functionality:**

- Label, value, prefix (icon/text), suffix (unit).
- Value formatting (decimal places, thousands separator).
- Optional trend indicator (up/down with percentage).
- Loading state.
- Integration with `NumberAnimation` for count-up effect.

**Implementation considerations:**

- **Aria:** `StatisticRoot` + `StatisticLabel` + `StatisticValue` + `StatisticPrefix` + `StatisticSuffix`. Lightweight; value formatting delegated to a pure util.
- **UI:** `cv()` / `scv()` recipe. Variants: `size`, `trend` (up/down/none).
- **Dependencies:** `icon` (for trend arrow), optional `NumberAnimation` (for animated value).
- **Patterns:** Multi-slot — `provideStatisticUi(ui)`. Value formatting as a shared pure function in `packages/aria/src/shared/`.

**Cross-library:** Ant Design, Chakra UI (`Stat`), Element Plus, Naive UI, Arco, TDesign.

---

#### 8. `Ellipsis` — 高优先级 (P0) | Demand: 5/14 | Effort: Low-Medium

**Purpose:** Truncate text to a configurable number of lines and reveal full content on hover via a tooltip.

**Functionality:**

- Line-clamp (1–N lines) using CSS `-webkit-line-clamp`.
- Tooltip expansion when text is actually overflowed (only show tooltip if content exceeds the clamp).
- Expandable mode (click to expand/collapse the full text).
- Suffix slot (e.g. "…more" link).

**Implementation considerations:**

- **Aria:** `EllipsisRoot` — manages overflow detection (ResizeObserver / DOM measurement), expanded state, and tooltip visibility logic.
- **UI:** `cv()` recipe. Variants: `lines` (number), `expandable` (boolean), `tooltip` (boolean).
- **Dependencies:** `tooltip` (for overflow popup).
- **Patterns:** Single-class or minimal-slot. Overflow detection is a reusable composable (`useOverflow`) placed in `packages/aria/src/composables/`.

**Cross-library:** Naive UI, Arco, Vant, Varlet, Mantine (`Spoiler`-adjacent).

---

#### 9. `Code` — 高优先级 (P0) | Demand: 5/14 | Effort: Medium

**Purpose:** Render a code block with syntax highlighting, optional line numbers, and a copy button.

**Functionality:**

- Syntax highlighting for configurable languages.
- Line numbers toggle.
- Copy-to-clipboard button.
- Inline code variant (single-line, inline).
- Max-height with scroll for long blocks.
- Theme (light/dark) following the config-provider.

**Implementation considerations:**

- **Aria:** `CodeRoot` + `CodeCopy` — manages copy state and line-number generation. Syntax highlighting delegated to a pluggable highlighter (Shiki / highlight.js / Prism) injected via prop or context.
- **UI:** `scv()` recipe with slots (`root`, `code`, `copyButton`, `lineNumbers`). Variants: `variant` (block/inline), `theme` (light/dark).
- **Dependencies:** `clipboard` (for copy button). External highlighter is a peer dependency (do not bundle).
- **Patterns:** Multi-slot — `provideCodeUi(ui)`. Highlighter injection via a `provideHighlighter()` context so users choose their own library.

**Cross-library:** Mantine, Chakra UI, Naive UI, Varlet, shadcn/ui (Typography prose).

---

#### 10. `Image` — 高优先级 (P0) | Demand: 8/14 | Effort: Medium

**Purpose:** Display an image with built-in fallback, loading state, and optional preview/zoom.

**Functionality:**

- Loading placeholder (spinner or skeleton).
- Error fallback (broken image placeholder).
- Preview/zoom on click (opens a full-screen viewer).
- Fit mode (cover, contain, fill).
- Placeholder slot while loading.
- Configurable preview toolbar (zoom, rotate, download).

**Implementation considerations:**

- **Aria:** `ImageRoot` — manages `loadingStatus` (`idle`/`loading`/`loaded`/`error`), preview open state, and zoom/rotate state. Reuse `useImageLoadingStatus` pattern.
- **UI:** `cv()` recipe for the image itself; `scv()` for the preview overlay. Variants: `fit` (cover/contain/fill), `preview` (boolean), `rounded`.
- **Dependencies:** `spinner` or `skeleton` (for loading), `dialog`/`popover` (for preview overlay — reuse overlay primitives).
- **Patterns:** Minimal-slot for the base image; the preview viewer is a separate `ImagePreview` component that can be used standalone.

**Cross-library:** Ant Design, Mantine, Chakra UI, shadcn/ui, Element Plus, Vuetify, Quasar, PrimeVue, Arco, TDesign.

---

#### 11. `Transfer` — 高优先级 (P1) | Demand: 6/14 | Effort: High

**Purpose:** Move items between two lists (source and target) with optional filtering and batch operations.

**Functionality:**

- Dual-list layout with transfer buttons (→, ←, ⇒, ⇐).
- Single and multiple selection.
- Search/filter per panel.
- Disabled items and one-way restriction.
- Custom item rendering.
- Footer slot for batch actions.
- Data-source driven (array of `{ key, label, disabled }`).

**Implementation considerations:**

- **Aria:** `TransferRoot` + `TransferList` + `TransferItem` + `TransferOperations`. Root owns source/target state sets, selection state, and move operations.
- **UI:** `scv()` recipe with slots (`root`, `list`, `item`, `operations`, `footer`). Variants: `size`, `filterable`.
- **Dependencies:** `input` (for search), `button` (for operations), `checkbox` (for item selection), `tag` (for target count badge).
- **Patterns:** Multi-slot — `provideTransferUi(ui)`. Consider Compact aggregation (`TransferCompact`) wiring both lists + operations + search.

**Cross-library:** Ant Design, MUI, Element Plus, Naive UI, TDesign, PrimeReact (`PickList`).

---

#### 12. `QRCode` — 高优先级 (P1) | Demand: 3/14 | Effort: Low

**Purpose:** Generate and render a QR code from a string value.

**Functionality:**

- Configurable size, colour, and background.
- Error correction level (L/M/Q/H).
- Optional icon/logo in the centre.
- Download as PNG/SVG.
- Value reactive (re-renders on change).

**Implementation considerations:**

- **Aria:** `QRCodeRoot` — pure rendering component; QR matrix generation delegated to a small utility (e.g. `qrcode` npm package). No complex state.
- **UI:** `cv()` recipe. Variants: `size`, `color`, `bgColor`, `level`.
- **Dependencies:** External `qrcode` library (peer dependency).
- **Patterns:** Single-class component. Render to `<canvas>` or `<svg>`.

**Cross-library:** Ant Design, Naive UI, TDesign.

---

#### 13. `Result` — 高优先级 (P1) | Demand: 4/14 | Effort: Low

**Purpose:** Display a status page (success, error, warning, info, 404) with icon, title, description, and actions.

**Functionality:**

- Status presets: success, error, warning, info, 404, 403, 500.
- Custom icon slot.
- Title and subtitle/description.
- Extra content slot (actions, links).
- Responsive centre alignment.

**Implementation considerations:**

- **Aria:** `ResultRoot` + `ResultIcon` + `ResultTitle` + `ResultSubtitle`. Minimal logic — status drives icon/colour.
- **UI:** `cv()` recipe. Variants: `status` (success/error/warning/info/404/403/500).
- **Dependencies:** `icon` (for status icons).
- **Patterns:** Multi-slot — `provideResultUi(ui)`. Status-to-icon mapping table in the UI layer.

**Cross-library:** Ant Design, Arco, Naive UI, Varlet.

---

#### 14. `Countdown` — 高优先级 (P1) | Demand: 3/14 | Effort: Low

**Purpose:** Display a live countdown timer to a target timestamp, updating every second/millisecond.

**Functionality:**

- Format: days/hours/minutes/seconds (configurable segments).
- Custom formatter function.
- On-finish callback.
- Pause/resume.
- Reactive target value.

**Implementation considerations:**

- **Aria:** `CountdownRoot` — uses `useIntervalFn` from VueUse (or internal rAF) to tick. Computes remaining time and emits `finish` event.
- **UI:** `cv()` recipe. Variants: `format` (HH:mm:ss / dd HH:mm:ss / custom), `size`.
- **Dependencies:** None (pure timer logic). Reuse `NumberAnimation` for digit-flip animation if desired.
- **Patterns:** Single-class component. Timer logic as a `useCountdown` composable in `packages/aria/src/composables/`.

**Cross-library:** Naive UI, Vant, Varlet.

---

#### 15. `NumberAnimation` — 高优先级 (P1) | Demand: 2/14 | Effort: Low

**Purpose:** Animate a number from one value to another with easing, for dashboard/statistic displays.

**Functionality:**

- From/to values with easing function.
- Duration control.
- Decimal precision and locale formatting.
- On-start, on-finish, on-frame callbacks.
- Play/pause/replay.

**Implementation considerations:**

- **Aria:** `useNumberAnimation` composable — wraps `useTransition` or a rAF-based tween. Returns current animated value.
- **UI:** Minimal — a `<span>` that renders the formatted animated value. Variant: `format` (number/currency/percentage).
- **Dependencies:** None. Can be consumed by `Statistic` and `Countdown`.
- **Patterns:** Composable-first; the UI component is a thin wrapper. Place `useNumberAnimation` in `packages/aria/src/composables/`.

**Cross-library:** Naive UI (`NumberAnimation`), Varlet (`CountTo`).

---

#### 16. `InfiniteScroll` — 高优先级 (P1) | Demand: 4/14 | Effort: Medium

**Purpose:** Automatically load more content when the user scrolls near the bottom of a container.

**Functionality:**

- IntersectionObserver-based bottom detection.
- Configurable distance threshold.
- Loading indicator slot.
- `hasMore` flag to stop loading.
- Load-more callback (`onLoadMore`).
- Reverse mode (load at top — for chat).

**Implementation considerations:**

- **Aria:** `InfiniteScrollRoot` — manages sentinel element, observer, loading state, and `hasMore` flag. Uses `useIntersectionObserver` from VueUse.
- **UI:** `cv()` recipe with a `loading` slot. Variants: `direction` (down/up).
- **Dependencies:** `spinner` (for loading indicator). Complements (but does not require) `virtualizer`.
- **Patterns:** Single-class wrapper. The sentinel observer logic is a `useInfiniteScroll` composable in `packages/aria/src/composables/`.

**Cross-library:** Element Plus, Vuetify, Quasar, Naive UI.

---

#### 17. `Mention` — 高优先级 (P1) | Demand: 4/14 | Effort: High

**Purpose:** Provide an input that triggers a popup of suggestions when the user types `@` or a custom trigger character.

**Functionality:**

- Configurable trigger characters (`@`, `#`, `/`).
- Suggestion popup positioned at the caret.
- Async suggestion loading.
- Custom suggestion rendering (avatar + name).
- Multiple mentions and tag insertion.
- Keyboard navigation of suggestions.
- Value as plain text or structured mentions array.

**Implementation considerations:**

- **Aria:** `MentionRoot` + `MentionInput` + `MentionSuggestions` + `MentionItem`. Root owns the input value, caret position, trigger detection, and suggestion query. The popup reuses `popover` positioning.
- **UI:** `scv()` recipe with slots (`root`, `input`, `suggestions`, `item`). Variants: `size`, `placement`.
- **Dependencies:** `popover` (for suggestion positioning), `avatar` (optional, in suggestion items), `input`/`textarea` (as the base editor).
- **Patterns:** Multi-slot — `provideMentionUi(ui)`. Caret-position detection is the hard part — use a `useCaretPosition` composable.

**Cross-library:** Ant Design, Arco, Element Plus, Naive UI.

---

#### 18. `AvatarGroup` — 高优先级 (P1) | Demand: 6/14 | Effort: Low

**Purpose:** Display a stack of overlapping avatars with a `+N` overflow indicator.

**Functionality:**

- Overlapping display with configurable spacing.
- Max visible count with `+N` overflow avatar.
- Hover to expand (z-index raise).
- Vertical and horizontal stacking.

**Implementation considerations:**

- **Aria:** `AvatarGroupRoot` — registers child avatars, computes overflow count, applies z-index ordering.
- **UI:** `cv()` recipe. Variants: `max` (number), `direction` (horizontal/vertical), `spacing`.
- **Dependencies:** `avatar` (wraps existing avatar component).
- **Patterns:** Multi-slot — `provideAvatarGroupUi(ui)`. Children are `avatar` components; group provides spacing/z-index context.

**Cross-library:** MUI, Ant Design, Mantine, PrimeVue, Arco, TDesign.

---

#### 19. `RangeSlider` — 高优先级 (P1) | Demand: 5/14 | Effort: Medium

**Purpose:** Allow users to select a min/max range using two thumbs on a single track.

**Functionality:**

- Dual-thumb (min and max) interaction.
- Min/max bounds and step.
- Dragging the track between thumbs to move the range.
- Keyboard navigation for each thumb.
- Tooltip showing the current value on each thumb.
- Vertical and horizontal orientation.

**Implementation considerations:**

- **Aria:** `RangeSliderRoot` + `RangeSliderTrack` + `RangeSliderRange` + `RangeSliderThumb` + `RangeSliderStartThumb` + `RangeSliderEndThumb`. Closely follows the existing `slider` architecture but with two thumbs and a `value` of `[min, max]`.
- **UI:** `scv()` recipe — extends the `slider` recipe with dual-thumb slot classes.
- **Dependencies:** Reuse `slider` aria primitives where possible (pointer drag logic, ARIA slider pattern).
- **Patterns:** Multi-slot — `provideRangeSliderUi(ui)`. Share the `useSliderThumb` composable from the existing slider.

**Cross-library:** MUI, Mantine, Chakra UI, Vuetify, Quasar.

---

#### 20. `Space` — 高优先级 (P1) | Demand: 5/14 | Effort: Low

**Purpose:** Provide a flexbox-based layout primitive that distributes spacing between children along a row or column.

**Functionality:**

- Direction (horizontal/vertical).
- Configurable gap size (mapped to `ThemeSize`).
- Alignment (start/center/end/between/around).
- Wrap control.
- Split (insert a spacer between specific children).

**Implementation considerations:**

- **Aria:** `SpaceRoot` — minimal; reads direction/align/wrap and provides them to the UI layer.
- **UI:** `cv()` recipe. Variants: `direction`, `align`, `gap` (ThemeSize), `wrap`.
- **Dependencies:** None.
- **Patterns:** Single-class component — `spaceVariants({...}, props.class)`. Maps to UnoCSS flex utilities (`flex`, `flex-col`, `gap-{size}`, `items-{align}`).

**Cross-library:** MUI, Mantine, Element Plus, Arco, TDesign.

---

#### 21. `SplitButton` — 高优先级 (P1) | Demand: 4/14 | Effort: Medium

**Purpose:** Combine a primary button action with a dropdown of secondary actions.

**Functionality:**

- Primary button + dropdown trigger.
- Shared variant/size.
- Configurable dropdown menu items.
- Disabled state.
- Icon separator between primary and dropdown.

**Implementation considerations:**

- **Aria:** `SplitButtonRoot` + `SplitButtonPrimary` + `SplitButtonDropdown`. Composes `button` + `dropdown-menu`. Root provides shared variant context.
- **UI:** `scv()` recipe with slots (`root`, `primary`, `separator`, `trigger`). Variants: `size`, `color`, `variant`.
- **Dependencies:** `button` (primary action), `dropdown-menu` (secondary actions).
- **Patterns:** Multi-slot — `provideSplitButtonUi(ui)`. Thin wrapper over existing `dropdown-menu` trigger.

**Cross-library:** PrimeReact, MUI, Quasar (`ButtonDropdown`), Ant Design (`Button` with dropdown).

---

#### 22. `Fieldset` — 高优先级 (P1) | Demand: 5/14 | Effort: Low

**Purpose:** Group related form fields with a labelled border (native `<fieldset>`/`<legend>` semantics).

**Functionality:**

- Native `<fieldset>` + `<legend>` rendering.
- Legend with optional icon and tooltip.
- Disabled state (propagates to children via context).
- Variant: bordered, borderless, emphasised.

**Implementation considerations:**

- **Aria:** `FieldsetRoot` + `FieldsetLegend` — provides a `disabled` context that form fields can consume.
- **UI:** `cv()` recipe. Variants: `variant` (default/borderless), `size`.
- **Dependencies:** None (semantic HTML).
- **Patterns:** Multi-slot — `provideFieldsetUi(ui)` + `provideFieldsetContext()` for disabled propagation. Uses native `<fieldset>`/`<legend>` elements.

**Cross-library:** Mantine, Headless UI, PrimeReact, Naive UI, HTML standard.

---

#### 23. `InputMask` — 高优先级 (P1) | Demand: 3/14 | Effort: Medium

**Purpose:** Constrain and format user input against a mask pattern (e.g. phone, date, card number).

**Functionality:**

- Mask pattern with literal and placeholder characters.
- Configurable placeholder character.
- Reactive value (masked and unmasked).
- Keep-literals option (strip or retain separators on blur).
- Paste handling.
- Custom format function.

**Implementation considerations:**

- **Aria:** `InputMaskRoot` — wraps the existing `input`; intercepts `keydown`, `input`, `paste`, and `blur` events to apply/strip the mask. Mask logic is a pure function in `packages/aria/src/shared/`.
- **UI:** Reuses the `input` recipe; adds `mask` and `placeholderChar` props.
- **Dependencies:** `input` (base component).
- **Patterns:** Single-class wrapper over `input`. Mask logic (`applyMask`, `stripMask`) as shared pure functions. Consider a `useInputMask` composable.

**Cross-library:** PrimeReact (`InputMask`), Mantine (`MaskInput`), Ant Design (pattern).

---

## 中优先级（Medium — P2）

有用且在若干库中存在，容量允许时实现。共 **11** 个组件。

### 概要

| 序号 | 组件                   | 需求度 | 工作量  |
| :--: | :--------------------- | :----: | :-----: |
|  24  | `CurrencyInput`        |  2/14  | Medium  |
|  25  | `TriStateCheckbox`     |  4/14  |   Low   |
|  26  | `VisuallyHidden`       |  4/14  |   Low   |
|  27  | `Banner`               |  4/14  | Low-Med |
|  28  | `Backdrop`             |  4/14  |   Low   |
|  29  | `LoadingBar`           |  4/14  | Medium  |
|  30  | `FloatingActionButton` |  5/14  | Medium  |
|  31  | `InputGroup`           |  3/14  | Medium  |
|  32  | `Dropzone`             |  3/14  | Medium  |
|  33  | `Masonry`              |  3/14  | Medium  |
|  34  | `NativeSelect`         |  3/14  |   Low   |

### 详细条目

---

#### 24. `CurrencyInput` — 中优先级 (P2) | Demand: 2/14 | Effort: Medium

**Purpose:** Numeric input that formats its display as a locale-aware currency value.

**Functionality:**

- Currency symbol and position (prefix/suffix) based on locale.
- Thousands separator and decimal places.
- Min/max validation.
- Negative value handling.
- Value emitted as a number (not a formatted string).

**Implementation considerations:**

- **Aria:** Extends `input-number` with a currency formatter. Uses `Intl.NumberFormat` for formatting.
- **UI:** Reuses `input-number` recipe; adds `currency` and `locale` props.
- **Dependencies:** `input-number` (base component).
- **Patterns:** Variant of `input-number` — can be implemented as a prop on `input-number` (`type="currency"`) or a separate component.

**Cross-library:** Mantine (`NumberInput` with currency formatter), Ant Design (via `InputNumber` formatter).

---

#### 25. `TriStateCheckbox` — 中优先级 (P2) | Demand: 4/14 | Effort: Low

**Purpose:** Checkbox that supports three states: checked, unchecked, and indeterminate.

**Functionality:**

- Indeterminate visual state (dash icon).
- Value as `boolean | 'indeterminate'`.
- Click cycles: unchecked → checked → indeterminate (configurable).
- ARIA `aria-checked="mixed"` for indeterminate.
- Disabled state.

**Implementation considerations:**

- **Aria:** Extends `checkbox` aria — adds `'indeterminate'` to the value union type and the cycle logic.
- **UI:** Extends `checkbox` recipe — adds an indeterminate icon variant.
- **Dependencies:** `checkbox` (base component), `icon` (dash icon).
- **Patterns:** Extension of `checkbox`. Can be a prop (`indeterminate`) on the existing `checkbox` rather than a separate component.

**Cross-library:** PrimeReact (`TriStateCheckbox`), Ant Design/Element Plus/Naive UI (indeterminate prop).

---

#### 26. `VisuallyHidden` — 中优先级 (P2) | Demand: 4/14 | Effort: Low

**Purpose:** Render content that is visually hidden but accessible to screen readers.

**Functionality:**

- Content rendered in a 1px clipped container.
- Screen-reader-only text.
- No visual footprint.

**Implementation considerations:**

- **Aria:** Pure presentational — no state. Uses the standard `.sr-only` CSS pattern.
- **UI:** Single UnoCSS class set (`sr-only`). No variants.
- **Dependencies:** None.
- **Patterns:** Single-class component. Can also be a utility class exported from the CSS layer.

**Cross-library:** Mantine, Chakra UI, Radix UI, shadcn/ui.

---

#### 27. `Banner` — 中优先级 (P2) | Demand: 4/14 | Effort: Low-Medium

**Purpose:** Display a persistent, dismissible message bar at the top of a page or section (distinct from transient toasts).

**Functionality:**

- Severity variants (info, success, warning, error).
- Title and description.
- Dismissible (close button) with `onClose`.
- Action slot (e.g. "Undo", "View details").
- Icon per severity.
- Sticky/full-width mode.

**Implementation considerations:**

- **Aria:** `BannerRoot` — manages dismiss state, severity context.
- **UI:** `cv()` recipe. Variants: `severity` (info/success/warning/error), `dismissible`.
- **Dependencies:** `icon` (severity icons), `button` (close/action).
- **Patterns:** Single-class or minimal-slot. Related to `alert` but persistent and page-level — not a transient notification.

**Cross-library:** Vuetify, Quasar, MUI (`Alert` banner mode), Ant Design (`Alert` with banner).

---

#### 28. `Backdrop` — 中优先级 (P2) | Demand: 4/14 | Effort: Low

**Purpose:** Render a dimmed overlay behind modals/drawers, or as a standalone loading scrim.

**Functionality:**

- Configurable opacity and colour.
- Click-to-close (with `onClose`).
- Transition (fade).
- `invisible` mode (captures clicks without dimming).

**Implementation considerations:**

- **Aria:** `BackdropRoot` — manages open/transition state, click-outside detection.
- **UI:** `cv()` recipe. Variants: `opacity`, `color`, `invisible`.
- **Dependencies:** None (pure overlay). Can be used internally by `dialog`/`drawer` if they don't already have a backdrop slot.
- **Patterns:** Single-class component. Reuse the existing overlay/portal pattern from `dialog`.

**Cross-library:** MUI, Vuetify (`Overlay`), Mantine, Headless UI.

---

#### 29. `LoadingBar` — 中优先级 (P2) | Demand: 4/14 | Effort: Medium

**Purpose:** Display an indeterminate progress bar fixed at the top of the viewport for route transitions or long-running tasks.

**Functionality:**

- Indeterminate animation (slide/shimmer).
- Programmatic `start()` / `finish()` / `error()` API (imperative, like a toast).
- Configurable colour and height.
- Reactive progress percentage (determinate mode).

**Implementation considerations:**

- **Aria:** `LoadingBarProvider` + `useLoadingBar()` composable — programmatic API similar to `useToast`. Manages a global loading bar instance.
- **UI:** `cv()` recipe. Variants: `position` (top/bottom), `color`, `indeterminate`.
- **Dependencies:** None. Reuse the `toast` provider pattern for the imperative API.
- **Patterns:** Provider + composable pattern — mirrors `provideToast()` / `useToast()`. Place `useLoadingBar` in `packages/aria/src/composables/`.

**Cross-library:** Quasar, Varlet, Naive UI, Mantine (`nprogress`).

---

#### 30. `FloatingActionButton` — 中优先级 (P2) | Demand: 5/14 | Effort: Medium

**Purpose:** Render a circular, elevated action button that floats above content (typically bottom-right of a viewport/section).

**Functionality:**

- Icon-only or icon + label.
- Configurable position (top-right, bottom-right, etc.).
- Tooltip on hover.
- Expandable variant (click to reveal sub-actions).
- Shape: circle or rounded-rectangle.

**Implementation considerations:**

- **Aria:** `FabRoot` + `FabTrigger` + `FabActions` — the expandable variant reuses `popover`/`dropdown-menu` positioning.
- **UI:** `cv()` / `scv()` recipe. Variants: `shape` (circle/round), `position`, `size`, `color`.
- **Dependencies:** `button` (base styling), `icon`, `tooltip` (optional).
- **Patterns:** If non-expandable, it's a `button` variant. If expandable, it composes `dropdown-menu`.

**Cross-library:** MUI (`FAB`), Vuetify, Quasar, Naive UI (`FloatButton`), Varlet.

---

#### 31. `InputGroup` — 中优先级 (P2) | Demand: 3/14 | Effort: Medium

**Purpose:** Combine an input with leading/trailing addons (icons, buttons, text, prefixes/suffixes).

**Functionality:**

- Leading and trailing addon slots.
- Addon as text, icon, or button.
- Connected (flush) or separated styling.
- Size inherits from the inner input.
- Disabled state propagation.

**Implementation considerations:**

- **Aria:** `InputGroupRoot` — provides size/disabled context to children. No complex state.
- **UI:** `scv()` recipe with slots (`root`, `input`, `addonBefore`, `addonAfter`). Variants: `size`, `variant` (connected/separated), `disabled`.
- **Dependencies:** `input`, `button`, `icon` (as addon children).
- **Patterns:** Multi-slot — `provideInputGroupUi(ui)` + context for size/disabled propagation.

**Cross-library:** shadcn/ui, Naive UI, Ant Design (`Input.Group`).

---

#### 32. `Dropzone` — 中优先级 (P2) | Demand: 3/14 | Effort: Medium

**Purpose:** Provide a drag-and-drop area for file selection, usable standalone or as part of `Upload`.

**Functionality:**

- Drag-over visual feedback.
- Click to browse files.
- Multiple file support with type/size validation.
- Configurable accept filter.
- Disabled state.
- Dropzone text/icon customisation.

**Implementation considerations:**

- **Aria:** `DropzoneRoot` — manages drag state (`idle`/`dragOver`/`dropping`), file validation, and the hidden file input.
- **UI:** `scv()` recipe with slots (`root`, `icon`, `text`). Variants: `variant` (default/bordered/filled), `disabled`, `active` (drag-over).
- **Dependencies:** Can be consumed by `Upload` as the trigger area. Standalone use returns selected files via callback.
- **Patterns:** Multi-slot — `provideDropzoneUi(ui)`. Drag event handling as a `useDropzone` composable.

**Cross-library:** Mantine (`Dropzone`), shadcn/ui (Upload drag area), PrimeVue.

---

#### 33. `Masonry` — 中优先级 (P2) | Demand: 3/14 | Effort: Medium

**Purpose:** Render a Pinterest-style masonry layout where items of varying heights are packed into columns.

**Functionality:**

- Configurable column count (responsive breakpoints).
- Gap control.
- Horizontal or vertical ordering.
- Item re-flow on resize.
- SSR-safe (renders without JS measurement, then reflows).

**Implementation considerations:**

- **Aria:** `MasonryRoot` + `MasonryItem` — root measures container width, computes column count, and distributes items. Uses `ResizeObserver` for re-flow.
- **UI:** `cv()` recipe. Variants: `columns` (number or responsive object), `gap`, `direction`.
- **Dependencies:** None.
- **Patterns:** Multi-slot — `provideMasonryUi(ui)`. Item distribution as a `useMasonry` composable (pure layout logic, no DOM coupling beyond measurement).

**Cross-library:** MUI, Ant Design (v6), Mantine.

---

#### 34. `NativeSelect` — 中优先级 (P2) | Demand: 3/14 | Effort: Low

**Purpose:** Render a styled native `<select>` element for low-JS forms, SSR, and progressive enhancement.

**Functionality:**

- Native `<select>` with styled trigger.
- Options and optgroups.
- Multiple selection (native `multiple`).
- Size and variant matching the custom `select`.
- Form integration (native `name`/`value` submission).

**Implementation considerations:**

- **Aria:** `NativeSelectRoot` — thin wrapper around `<select>`; no popup logic.
- **UI:** `cv()` recipe. Variants: `size`, `color`, `variant`, `multiple`.
- **Dependencies:** `icon` (chevron indicator).
- **Patterns:** Single-class component. Complements (not replaces) the custom `select` which has full keyboard/ARIA popup logic.

**Cross-library:** shadcn/ui, Headless UI, MUI (native select mode).

---

## 低优先级（Low — P3）

小众但功能独立，暂缓或择机实现。共 **12** 个组件。

### 概要

| 序号 | 组件              | 需求度 | 工作量 |
| :--: | :---------------- | :----: | :----: |
|  35  | `Equation`        |  1/14  | Medium |
|  36  | `NumberFormatter` |  1/14  |  Low   |
|  37  | `Marquee`         |  2/14  |  Low   |
|  38  | `GradientText`    |  1/14  |  Low   |
|  39  | `Highlight`       |  3/14  |  Low   |
|  40  | `Blockquote`      |  2/14  |  Low   |
|  41  | `Knob`            |  2/14  | Medium |
|  42  | `Signature`       |  2/14  | Medium |
|  43  | `Terminal`        |  2/14  | Medium |
|  44  | `OverflowList`    |  2/14  | Medium |
|  45  | `Indicator`       |  1/14  |  Low   |
|  46  | `Spoiler`         |  1/14  |  Low   |

### 详细条目

---

#### 35. `Equation` — 低优先级 (P3) | Demand: 1/14 | Effort: Medium

**Purpose:** Render a mathematical equation using KaTeX.

**Functionality:** KaTeX rendering, block/inline mode, error fallback for invalid expressions.

**Implementation considerations:** Wraps KaTeX (`katex` npm package as peer dependency). Pure render — `equationRender(latex, options)` pure function. Variants: `block` (block/inline).

**Cross-library:** Naive UI.

---

#### 36. `NumberFormatter` — 低优先级 (P3) | Demand: 1/14 | Effort: Low

**Purpose:** Format a number for display (locale, currency, percentage) without animation.

**Functionality:** `Intl.NumberFormat` wrapper, decimal precision, locale, currency code.

**Implementation considerations:** Pure function `formatNumber(value, options)` in `packages/aria/src/shared/`. UI is a `<span>`. Overlaps with `NumberAnimation` — consider merging as `NumberAnimation` with `animated={false}`.

**Cross-library:** Mantine (`NumberFormatter`).

---

#### 37. `Marquee` — 低优先级 (P3) | Demand: 2/14 | Effort: Low

**Purpose:** Scroll content horizontally in a continuous loop (marquee effect).

**Functionality:** Direction (left/right), speed, pause on hover, duplicate content for seamless loop.

**Implementation considerations:** CSS animation (`@keyframes` via UnoCSS) + content duplication logic. `useMarquee` composable for pause-on-hover. Variants: `direction`, `speed`.

**Cross-library:** Mantine, Naive UI.

---

#### 38. `GradientText` — 低优先级 (P3) | Demand: 1/14 | Effort: Low

**Purpose:** Render text with a CSS gradient fill.

**Functionality:** Gradient direction, colour stops, from/to props.

**Implementation considerations:** `background-clip: text` with UnoCSS utilities. Could be a `Typography` sub-component or a standalone. Variants: `gradient` (from/to colors), `direction`.

**Cross-library:** Naive UI.

---

#### 39. `Highlight` — 低优先级 (P3) | Demand: 3/14 | Effort: Low

**Purpose:** Highlight occurrences of a query string within a body of text.

**Functionality:** Case-sensitive/insensitive match, custom highlight tag/class, multiple query terms.

**Implementation considerations:** Pure function `highlightSegments(text, query)` returning segments. UI renders `<mark>` for matches. Could be a `Typography` sub-component.

**Cross-library:** Naive UI, Mantine, Chakra UI.

---

#### 40. `Blockquote` — 低优先级 (P3) | Demand: 2/14 | Effort: Low

**Purpose:** Render a styled quotation block with optional citation.

**Functionality:** Quote text, author/citation, variant (default/bordered).

**Implementation considerations:** Semantic `<blockquote>` + `<cite>`. Could be a `Typography` sub-component. Variants: `variant`, `size`.

**Cross-library:** Mantine, Naive UI.

---

#### 41. `Knob` — 低优先级 (P3) | Demand: 2/14 | Effort: Medium

**Purpose:** Rotary input control for selecting a value by dragging around a circular dial.

**Functionality:** Min/max/step, value display, size, colour, read-only, keyboard (arrow keys rotate).

**Implementation considerations:** SVG or canvas arc rendering. Pointer drag → angle → value mapping. ARIA `role="slider"`. `useKnob` composable for angle/value logic. Variants: `size`, `color`.

**Cross-library:** Quasar, PrimeReact.

---

#### 42. `Signature` — 低优先级 (P3) | Demand: 2/14 | Effort: Medium

**Purpose:** Capture a handwritten signature on a canvas.

**Functionality:** Canvas drawing, pen colour/width, clear, export as PNG/SVG/data-url, disabled, background colour.

**Implementation considerations:** `<canvas>` with pointer events (down/move/up). `useSignature` composable managing stroke paths. Export via `canvas.toDataURL()`. Variants: `penColor`, `backgroundColor`.

**Cross-library:** Vant, Varlet.

---

#### 43. `Terminal` — 低优先级 (P3) | Demand: 2/14 | Effort: Medium

**Purpose:** Render console-style output with a prompt and command history.

**Functionality:** Command input line, output history, auto-scroll, custom prompt symbol, command callback.

**Implementation considerations:** `TerminalRoot` + `TerminalOutput` + `TerminalInput`. Manages command history array, auto-scroll to bottom on new output. Variants: `prompt` (symbol), `theme` (dark/light).

**Cross-library:** PrimeReact, PrimeVue.

---

#### 44. `OverflowList` — 低优先级 (P3) | Demand: 2/14 | Effort: Medium

**Purpose:** Render a list of items that, when they exceed the container width, collapse the overflow into a "more" dropdown.

**Functionality:** Container measurement, item width measurement, overflow detection, "more" button with dropdown of hidden items, responsive re-flow on resize.

**Implementation considerations:** `OverflowListRoot` — uses `ResizeObserver` to measure container and children, computes which items fit, moves the rest to an overflow array. `useOverflow` composable. Reuses `dropdown-menu` for the overflow popup.

**Cross-library:** Mantine, Arco (`OverflowList`).

---

#### 45. `Indicator` — 低优先级 (P3) | Demand: 1/14 | Effort: Low

**Purpose:** Render a small status dot/badge at a corner of a child element (e.g. online indicator on an avatar).

**Functionality:** Position (top-right/top-left/bottom-right/bottom-left), colour, size, label, offset, disabled.

**Implementation considerations:** `IndicatorRoot` wraps a child with `position: relative`; renders an absolutely-positioned dot. `cv()` recipe. Variants: `position`, `color`, `size`, `offset`.

**Cross-library:** Mantine.

---

#### 46. `Spoiler` — 低优先级 (P3) | Demand: 1/14 | Effort: Low

**Purpose:** Collapsible region that hides content until the user clicks a toggle (show more/less).

**Functionality:** Toggle label (show/hide), animated expand/collapse, initial expanded state, max-height before collapse.

**Implementation considerations:** Closely related to `collapsible` — may be a styled variant with a "Show more" link and optional max-height clamp. `cv()` recipe. Variants: `expanded`, `maxHeight`.

**Cross-library:** Mantine.

---

## 延后至组件市场（Deferred to Marketplace）

需要**大量原子组件组合**且**用例较为小众**的组件。这些组件不进入核心库，而是延后至未来的**源码分发组件市场**（类似 shadcn/ui 的 registry 模式）。

组件市场将以可复制源码形式分发组合方案，用户获得完整源码控制权，同时避免核心包膨胀。当前共 **8** 个组件。

> **2026-09 更新：** 原表中的 `PageHeader`、`Navbar`、`Sidebar`、`AppShell` 已转入核心内壳领域规划（`SPageHeader`、`SLayoutShell`、`SShellMenu`、`SLogo` + aria `shell` 域模块），见 [ui-shell-roadmap.md](./ui-shell-roadmap.md)，不再走市场分发。

| 组件                | 延后原因（复合 + 小众）                                                                                                                             | 基于原子组件                                                | 需求度 |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :----: |
| `Tour`              | 引导 walkthrough — 高亮引擎 + 步骤管理 + popover 定位，小众（引导场景）。                                                                           | `popover`, `dialog`, `button`, `icon`                       |  3/14  |
| `TreeTable`         | 树形表格 — 扩展 table 支持展开/折叠行 + tree 状态，小众企业场景。                                                                                   | `table`, `tree`, `collapsible`                              |  3/14  |
| `Comment`           | 评论块 — avatar + author + content + actions + 嵌套回复，社交域小众。                                                                               | `avatar`, `typography`, `button`, `tag`                     |  2/14  |
| `Galleria`          | 完整图库/灯箱 — carousel + 缩略图条 + zoom + 全屏，小众。                                                                                           | `carousel`, `image`, `dialog`, `button`                     |  2/14  |
| `OrganizationChart` | 组织架构图 — tree + 自定义节点渲染 + 连接线，小众企业场景。                                                                                         | `tree`, `card`, `icon`                                      |  2/14  |
| `RichTextEditor`    | 所见即所得编辑器 — 工具栏 + contenteditable + 插件，体量大。落地形态待评估（见 [ecosystem/editor.md](../ecosystem/editor.md) 提案），不走市场分发。 | `toolbar`, `button`, `icon`, `tooltip` + Tiptap/ProseMirror |  3/14  |
| `Dock`              | macOS 风格 Dock — 放大效果 + tooltip + 应用图标，小众平台特性。                                                                                     | `tooltip`, `icon`, `popover`                                |  2/14  |
| `DynamicInput`      | 可编辑输入列表 — 增/删/排序多行表单字段，复合表单模式。                                                                                             | `input`, `button`, `icon`, `list`                           |  1/14  |

### 市场设计说明

- **分发模式：** 源码（`.vue` + `.ts`）复制进用户项目，而非 npm 依赖；用户拥有并自定义代码。
- **Registry：** CLI 或配置文件列出可用的市场组件及元数据（名称、描述、依赖、所用原子组件）。
- **组合方式：** 每个市场组件从 `@vean/ui`（原子）与 `@vean/aria`（组合式）导入，无需新的 aria 逻辑，仅做组合。
- **版本控制：** 市场组件标注所兼容的核心库版本。

---

## 范围外组件（Out of Scope）

经评估后**明确拒绝**进入活跃路线图与组件市场的候选项。共 60+ 个。

### 移动端专用（按桌面优先范围排除）

`PullRefresh`, `IndexBar`, `FloatingPanel`, `FloatingBubble`, `SwipeCell`, `SlideItem`, `Tabbar`, `BottomNavigation`, `NumberKeyboard`, `PasswordInput` (mobile), `Area`, `NoticeBar`, `Barrage`, `RollingText`, `AppBar` (mobile), `Sticky`, `Search` (mobile), `Picker`/`PickerGroup` (mobile), `ActionBar`.

### 已被现有组件覆盖

`ScrollTop` (= `backtop`), `Inplace` (= `editable`), `PickList` (= `transfer`), `InputTag` / `DynamicTags` (= `tags-input`), `ColorInput` (= `color-field`), `HueSlider` / `AlphaSlider` (= `color-slider`), `Counter` / `Stepper` mobile (= `input-number`), `OtpInput` (= `input-otp`), `Text` / `Heading` / `Paragraph` (= `Typography`), `Box` / `Container` / `Stack` / `SimpleGrid` (= `layout` + UnoCSS), `Listbox` (= `select`), `Modal` (= `dialog`), `Sheet` (= `drawer`), `Notification` / `Sonner` / `Message` / `MessageBox` / `ConfirmDialog` / `ConfirmPopup` (= `toast` / `dialog` / `popconfirm`), `Direction` (= `config-provider`), `Portal` / `FocusTrap` (内部原语), `ThemeIcon` (= `icon`), `Paper` / `Elevation` (原始 styled div), `StyleProvider` (= `config-provider`), `NoSSR` (框架关注点), `ResizeObserver` / `ScrollObserver` (工具组合式), `ActionIcon` / `CopyButton` (`button` / `clipboard` 变体), `Burger` / `NavLink` (基于 `button`/`link` 的复合).

### 图表（不进库：文档示例）

`Chart`, `Heatmap`, `Sparkline` —— 图表是独立领域，有自身生态（ECharts、Chart.js、recharts），不进核心 UI 库。**最终决策：不发布图表包**，文档站直接基于 [TanStack Charts](https://tanstack.com/charts) 提供 shadcn 风格示例（见 `apps/docs/src/examples/chart/`）。

### 业务专属（过于狭窄）

`AddressEdit`, `AddressList`, `ContactCard`, `ContactEdit`, `ContactList`, `Coupon`, `SubmitBar`（Vant 结算流程）.

### 冗余菜单变体

`MegaMenu`, `TieredMenu`, `PanelMenu`, `SlideMenu`, `TabMenu` —— 可用现有 `menu` / `dropdown-menu` / `navigation-menu` 的插槽与配置表达。

### 低级指令 / 工具

`Ripple` (directive), `Lazy` (directive), `Mutation`, `Morph`, `Touch-*` (Quasar directives), `Intersection` (composable), `BlockUI` (用 `backdrop`/`overlay`), `Overlay` (原始, 用 `backdrop`), `ImageCompare` (小众), `Parallax` (小众), `DataIterator` / `DataList` (由 `table`/`list` 覆盖), `Popselect` (popover + select 复合 —— 用 `combobox`), `SpeedDial` (FAB 变体 —— 用 `FloatingActionButton`), `Video` (范围外), `Chat` (过于特定 —— 如有需求可作市场候选项), `CountTo` (= `NumberAnimation`).

---

## 领域扩展路线（Domains & Proposals）

Vean 当前是**单组件库 + 源码分发工具链**形态：仓库不包含任何外围 npm 包（`@soybeanjs/ui-x`、`@soybeanjs/admin`、`@soybeanjs/chart` 均已移除；[ADR-0001](../adr/0001-peripheral-package-layering.md) 的外围包分层模型相应 superseded）。新领域按两类推进：

1. **核心内领域（in-core domains）**：通过 aria 准入（R1–R8）的领域逻辑放 `@vean/aria`（域模块 + composables，零样式），样式组件放 `@vean/ui`，统一 `S` 前缀，遵循同一套两层契约与发布节奏。
2. **未来提案（proposals）**：editor / table / form / ui-pro 保留为方向与调研资产；落地形态（并入核心 ui、独立包、或仅 vean 源码配方）立项时重新评估，不预设第三层包。

### 分层现状

分层图与组件计数不在本文件维护副本：唯一图见 [ecosystem/README.md「当前分层」](../ecosystem/README.md#当前分层无外围包)，架构真相源见 [architecture.md](../architecture.md)。

依赖铁律不变：**ui → aria 单向**；aria 零样式；ARIA / 键盘语义不出 aria。

### 核心内领域

| 领域      | 路线图                                       | Aria 准入                                                                         | 状态       |
| :-------- | :------------------------------------------- | :-------------------------------------------------------------------------------- | :--------- |
| AI / chat | [ui-ai-roadmap.md](./ui-ai-roadmap.md)       | 4 个组件族（thread / sender / thought-chain / conversations）+ `src/ai/` 域模块   | 规划 P0–P3 |
| 中后台壳  | [ui-shell-roadmap.md](./ui-shell-roadmap.md) | 无新 DOM 家族；`src/shell/` 纯逻辑（`useMediaQuery` / `useShellNav` / `useTabs`） | 规划 M1–M4 |

### 未来提案（落地形态待评估）

| 提案     | 方向                                                    | 现状                                                            | 技术方案                                                                                                  |
| :------- | :------------------------------------------------------ | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `editor` | 富文本编辑器（Tiptap 内核，仅 MIT 免费边界，UI 层自建） | 2026-08 完成市场调研与收费边界核实                              | [ecosystem/editor.md](../ecosystem/editor.md)                                                             |
| `table`  | 高级数据网格 / ProTable                                 | 2026-08 调研完成；内核已于 v0.50.0 更换为 `@tanstack/vue-table` | [ecosystem/table.md](../ecosystem/table.md)                                                               |
| `form`   | Schema 驱动高级表单（协议驱动渲染 + 声明式联动）        | 2026-08 调研完成                                                | [ecosystem/form.md](../ecosystem/form.md)                                                                 |
| `ui-pro` | 增值 / 高级组件（探索性，与商业化一并评估）             | 无代码，仅方向预留                                              | [ecosystem/ui-pro.md](../ecosystem/ui-pro.md) · [commercialization.md](../ecosystem/commercialization.md) |

> 这些提案写于「外围包单包自治」时期，文中包结构、lockstep、跨包白名单依赖等前提**已不适用**，阅读时以本页为准；立项必须先产出形态决策（核心内实现 / 独立包 / vean 配方三选一），必要时新立 ADR。市场调研原始结论见 [research/](../research/README.md)。

### 配套基础设施（已就绪）

- **vean registry 命名空间化**：items 为 `ui/<name>` + `package` 字段，未来新增域/包可按 `<namespace>/<name>` 扩展；核心 `ui` 裸名免前缀。
- **按包生成链路**：`pnpm sui gen api/changelog/skills` 按包输出，文档站按命名空间定位（`chart` 是非包的 TanStack Charts 文档示例命名空间，不对应 npm 包）。
- **图表**：不发布包，文档站 `apps/docs/src/examples/chart/` 提供 TanStack Charts shadcn 风格示例。

---

## 项目优化路线（Engineering Optimization）

工程质量改进项（F1–F11）的唯一权威是 [optimize.md](../optimize.md)：P0/P1/P2 分级、执行阶段 A–D、各 F 项验收与最新状态（如 F4 已收敛）均以该文件为准，本文件不再维护副本表——此前的手抄副本已发生过基线与状态漂移（即 optimize.md F10 指出的形态）。

总体原则不变：**先解决依赖闭包、CI 构建一致性与发布安全，再考虑目录拆分或新构建工具。**

---

## 总体里程碑

仅保留仍有效的批次，只定顺序不绑死日期；2026-08 的外围包分支合并里程碑（M-EC1–M-EC5）已随 ui-x/admin/chart 取消整体废止。

| 批次                      | 内容                                                        | 排期口径                                        | 关键验收                                  |
| :------------------------ | :---------------------------------------------------------- | :---------------------------------------------- | :---------------------------------------- |
| **M-AI** AI 核心组件      | P0–P3 批次，详见 [ui-ai-roadmap.md §11](./ui-ai-roadmap.md) | 以该路线图为准                                  | 每组件全交付面（源码/测试/文档/示例/API） |
| **M-SH** 中后台壳         | M1–M4，详见 [ui-shell-roadmap.md §9](./ui-shell-roadmap.md) | 建议排在 v0.50 重构窗口之后                     | aria 逻辑单测 + shell Tier 2 冒烟 e2e     |
| **M-OPT** 工程优化        | F1–F11，阶段 A–D 见 [optimize.md](../optimize.md)           | F 项按需滚动推进                                | 见 [optimize.md](../optimize.md) 各 F 项  |
| **M-CMP1** 核心组件第一批 | P0 组件 9 个（Upload / Timeline / Typography 等）           | 按「P0 → P1 → P2 → P3」顺序滚动，无既定官方时间 | 每组件全交付面                            |
| **M-CMP2** 核心组件第二批 | P1 组件 13 个（含 `Result`，壳路线复用）                    | 同上                                            | 同上                                      |
| **M-CMP3** 核心组件收尾   | P2 × 11 + P3 × 12，视容量穿插                               | 同上                                            | P2/P3 可转入组件市场                      |
| **M-PRO** 提案立项评估    | editor / table / form / ui-pro 的形态三选一决策             | 有需求信号时启动                                | 形态决策 + 必要时新立 ADR                 |

---

## 附录 A — 调研的组件库（14 个）

调研基准为 14 个主流 UI 库（10k+ star）；移动端库（Vant / Varlet）仅作移动端对照，不进入桌面优先路线图。

| Library      | Stack | Components | Stars (approx.) |
| :----------- | :---- | :--------: | :-------------: |
| MUI          | React |     59     |       95k       |
| Ant Design   | React |     71     |       92k       |
| Mantine      | React | 117 + ext  |       27k       |
| Chakra UI v2 | React |     54     |       38k       |
| shadcn/ui    | React |     59     |       75k       |
| Radix UI     | React |     30     |       16k       |
| Headless UI  | React |     16     |       25k       |
| PrimeReact   | React |     90     |       6k*       |
| MUI Base     | React |     20     |    (bundled)    |
| Element Plus | Vue   |     82     |       25k       |
| Naive UI     | Vue   |    ~80     |       16k       |
| Vuetify      | Vue   |    ~70     |       40k       |
| Quasar       | Vue   |    ~80     |       26k       |
| PrimeVue     | Vue   |     95     |       10k       |
| Arco Design  | Vue   |     73     |       5k*       |
| TDesign      | Vue   |     72     |       3k*       |
| Vant         | Vue   |     73     |       23k       |
| Varlet       | Vue   |     70     |       5k*       |

\* Included for completeness despite <10k stars due to strong ecosystem influence (PrimeReact/PrimeVue share a component surface; Arco/TDesign are major Chinese enterprise ecosystems; Varlet paired with Vant for mobile comparison).

## 附录 B — 通用组件（已发布）

以下 24 个组件概念同时出现在 MUI / Ant Design / Mantine / Chakra 与 Element Plus / Naive UI / Vuetify / Quasar —— 任何 UI 组件库的 table-stakes，且均已随 `@vean/ui` 发布：

The following 24 component concepts appear in **all 4** of MUI/Ant Design/Mantine/Chakra and **all 4** of Element Plus/Naive UI/Vuetify/Quasar — the table-stakes of any UI library. All are already shipped in `@vean/ui`:

`Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `Form`, `Table`, `Card`, `Dialog/Modal`, `Tabs`, `Menu`, `Pagination`, `Avatar`, `Badge`, `Tooltip`, `Carousel`, `Skeleton`, `Progress`, `Alert`, `Accordion/Collapse`, `Stepper/Steps`, `Tag`.

> 各组件的用法与完整 API 以文档站组件页为权威（`apps/docs`，路由 `/components/<name>`；API 数据由 `pnpm sui gen api` 生成于 `apps/docs/src/generated/api/`），本文件不再维护手写副本。

## 附录 C — 实现模式速查

将各路线图组件映射至预期的 aria 模式（依据组件开发规范）：

| 模式                          | 组件                                                                                                                                                                                                                                                                                  |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 单类 (`cv()`)                 | `Rating`, `QRCode`, `VisuallyHidden`, `Banner`, `Backdrop`, `Space`, `NativeSelect`, `GradientText`, `Indicator`, `Spoiler`, `Marquee`, `Blockquote`, `Highlight`, `NumberFormatter`                                                                                                  |
| 多槽 (`scv()` + `provide*Ui`) | `Upload`, `Timeline`, `Typography`, `Descriptions`, `TreeSelect`, `Statistic`, `Code`, `Image`, `Transfer`, `Mention`, `AvatarGroup`, `RangeSlider`, `SplitButton`, `Fieldset`, `InputGroup`, `Dropzone`, `Masonry`, `FloatingActionButton`, `LoadingBar`, `OverflowList`, `Terminal` |
| 组合式优先                    | `NumberAnimation` (`useNumberAnimation`), `Countdown` (`useCountdown`), `InfiniteScroll` (`useInfiniteScroll`), `Ellipsis` (`useOverflow`), `InputMask` (`useInputMask`)                                                                                                              |
| 现有组件扩展                  | `CurrencyInput` (→ `input-number`), `TriStateCheckbox` (→ `checkbox`), `Equation` (KaTeX wrapper), `Knob` (SVG + `useKnob`), `Signature` (canvas + `useSignature`)                                                                                                                    |

---

_本文档为项目总路线图，同时是**组件评估明细的唯一来源**（原 `components.md` 已并入本文件）。桌面优先范围；96 个组件已发布；45 个进入活跃路线图（高 22 / 中 11 / 低 12）；8 个延后至组件市场（另有 `PageHeader` / `Navbar` / `Sidebar` / `AppShell` 4 个转入壳领域规划）；60+ 个在范围外清单中被明确拒绝。AI 与中后台壳两个核心内领域分别见 [ui-ai-roadmap.md](./ui-ai-roadmap.md) / [ui-shell-roadmap.md](./ui-shell-roadmap.md)；editor / table / form / ui-pro 为形态待评估的未来提案。_
