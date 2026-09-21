---
head:
  title: ToggleGroup
  description: 一组可切换开关状态的双态按钮，支持单选与多选模式。适用于格式工具栏、筛选标签，或任何即时生效的互斥（或多选）分段控件。若需要外观统一的分段单选控件，SSegment 可能更合适；若只需单个独立的开关按钮，请使用 SToggle。
---

# ToggleGroup

## 概述

一组可切换开关状态的双态按钮，支持单选与多选模式。适用于格式工具栏、筛选标签，或任何即时生效的互斥（或多选）分段控件。若需要外观统一的分段*单选*控件，`SSegment` 可能更合适；若只需单个独立的开关按钮，请使用 `SToggle`。

## 用法

<UsageCode component="toggle-group" />

## 特性

- 🎯 单选 / 多选 — 通过 `multiple` 在单选与多选间切换，泛型值类型安全（`M extends boolean`，`T extends DefinedValue`）
- 🎚 受控 / 非受控 — `v-model` 与 `defaultValue`（标量或数组）由 `useControllableState` 支撑
- ⌨️ Roving focus 键盘导航 — 方向键在条目间移动焦点，`loop` 支持循环，RTL 下方向自动反转
- ♿ `aria-pressed` + `data-state`（`on`/`off`）双通道反射，axe 零违规
- 🎨 `toggleGroupVariants` 提供 3 变体（outline/soft/ghost）× 6 尺寸 × 8 颜色 × 2 方向
- 🧩 每个条目继承完整 `Button` props（`as`/`asChild`、`type`、条目级 `disabled`），slot 暴露 `pressed` / `disabled`
- 📝 表单集成 — 设置 `name`/`required` 后渲染隐藏 input，选择值随所属表单提交
- 🧩 `ui` 按 slot 覆盖类名（`root` / `item`）

## 组件系列

- `SToggleGroup` — 组根组件，管理选择状态、方向与 roving focus
- `SToggleGroupItem` — 单个可切换按钮；传入唯一 `value` 以标识其在组内的身份

## 演示

<PlaygroundGallery component="toggle-group" />

## API

<ComponentApi component="toggle-group" />

## 注意事项

### 架构与行业对标

VeanUI 由 Aria `ToggleGroupRoot`（`useSelection` + `useRovingFocusGroup` + 隐藏 input 表单代理）与 `ToggleGroupItem`（依据 `rovingFocus` 动态选择 `useRovingFocusGroupItem` 或 `Button` 基座）构成。UI 层 `SToggleGroup` 是仅计算 `toggleGroupVariants` 类名的薄透传包装；`data-state` 通过 UnoCSS `data-[state=on]:*` 选择器驱动按下样式。`toggle-group` 为 Radix/shadcn 原生模式；其余对标库以单选/按钮组或分段控件表达同一交互。

| 能力                          | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn `ToggleGroup` |
| :---------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :------------------: |
| Aria/styled 分离              |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| 单选 / 多选                   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          ✅          |
| 受控 / 非受控                 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          ✅          |
| Roving focus 方向键           |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| Loop 循环导航                 |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| RTL 方向感知                  |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| `aria-pressed` + `data-state` |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| 方向（横排/竖排）             |   ✅   |     —      |      ✅      |   ✅    |    —     |          ✅          |
| 变体 × 尺寸 × 颜色            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          —           |
| 隐藏 input 表单提交           |   ✅   |     —      |      —       |    —    |    —     |          —           |
| 单选可取消选中                |   ✅   |     ✅     |      —       |    —    |    —     |          —           |
| 禁用（组级 + 条目级）         |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          ✅          |

### 使用注意

- `rovingFocus`、`loop`、`clearable` 默认均为 `true`。关闭 `rovingFocus` 后退化为普通 `role="group"`，无方向键导航。
- 组级 `disabled` 会禁用全部条目；条目级 `disabled` 仅影响自身，二者取并集（`group || item`）。
- 单选模式下再次点击已选项会发出 `update:modelValue` 且值为 `undefined`（除非 `:clearable="false"`）——父组件需处理 `undefined`。
- 表单提交需设置 `name`；`required` 仅标记隐藏 input，不参与校验。
- 纯图标条目请补充 `aria-label`，否则按钮无可访问名称。
- 在 `form` 中，仅当组为表单控件且设置了 `name` 时才渲染隐藏 input。

## 常见问题

### 单选还是多选？

默认单选。传入 `multiple` 可同时选中多个条目——此时 `modelValue`/`defaultValue` 变为数组，泛型 `M` 由它们自动推断。

### 单选模式下如何允许取消选中？

`clearable` 默认为 `true`，点击已激活条目即清除选择并发出 `undefined`。设置 `:clearable="false"` 可始终保持必选。

### 如何让方向键循环导航？

保持 `loop`（默认 `true`）开启，焦点会从末尾回绕到首项、反之亦然，并自动跳过禁用条目。

### `SToggleGroup` 与 `SToggle` 有什么区别？

`SToggleGroup` 协调一组条目：统一管理单选/多选、roving-focus 键盘导航与共享的 `aria-pressed` 状态。`SToggle` 是独立单开关，无组内协调。

### 如何让组竖排显示？

设置 `orientation="vertical"` — 布局切换为纵向堆叠，方向键导航也随之沿纵轴移动。
