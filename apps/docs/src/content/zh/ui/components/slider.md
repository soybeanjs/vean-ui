---
head:
  title: 滑块
  description: 用于在连续数值范围内选择一个或多个数值的滑块组件，支持水平/垂直方向、多滑块区间（range）模式、RTL 与反向（inverted）方向，以及完整的键盘操作。当数值属于有界数值范围、需要用户通过鼠标或键盘精确调节时使用；若为自由文本或数字输入，优先使用 SInputNumber。
---

# 滑块

## 概述

用于在连续数值范围内选择一个或多个数值的滑块组件，支持水平/垂直方向、多滑块区间（range）模式、RTL 与反向（inverted）方向，以及完整的键盘操作。当数值属于有界数值范围、需要用户通过鼠标或键盘精确调节时使用；若为自由文本或数字输入，优先使用 `SInputNumber`。

## 用法

<UsageCode component="slider" />

## 特性

- 🎚 `modelValue` / `defaultValue` — 基于 `useControllableState` 的受控与非受控双模式
- 🔢 单滑块或多滑块区间 — 向 `modelValue` 传入包含两个值的数组即可创建 range slider
- ⌨️ 完整键盘支持 — 方向键按 `step` 步进，PageUp/PageDown 与 Shift+方向键跳 10 步，Home/End 直达 min/max
- ↔ 通过 `dir` 支持 RTL 方向，`inverted` 可反转数值方向
- 📐 水平与垂直双方向，并反射 `aria-orientation`
- 📋 原生表单代理 — 隐藏输入（区间模式展开为 `name[0]`/`name[1]`）承载 `name` / `required`
- 🎨 通过 `sliderVariants` 提供 6 种尺寸 × 8 种颜色
- 🧩 `trackProps` / `rangeProps` / `thumbProps` 透传 + 默认插槽自定义滑块内容
- 📏 `minStepsBetweenThumbs` 与 `thumbAlignment`（`contain` / `overflow`）实现精细区间控制

## 演示

<PlaygroundGallery component="slider" />

## API

<ComponentApi component="slider" />

## 注意事项

### 架构与行业对标

VeanUI 由 Aria 层 `SliderRoot`（`useControllableState` + 值规范化 + `VisuallyHiddenInput` 表单代理）→ `SliderTrack`（指针拖拽，pointer-move/up/cancel 挂载在 document）→ `SliderRange`（滑块间的百分比跨度）→ `SliderThumb`（`role="slider"` + `aria-valuemin/max/now` + `aria-orientation`，聚焦派生步进）组成。`SliderCompact` 负责 root + track + range + thumbs 的组合与滑块迭代；UI 层 `SSlider` 仅通过 `sliderVariants` 计算变体类并经 `provideSliderUi` 注入 `ui` 映射。

| 能力                             | VeanUI | Ant Design `Slider` | Element Plus `Slider` | Mantine `Slider` | Naive UI `Slider` | shadcn `Slider` |
| :------------------------------- | :----: | :-----------------: | :-------------------: | :--------------: | :---------------: | :-------------: |
| Aria/styled 分离                 |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| 受控/非受控                      |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| 区间（多滑块）                   |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| 垂直方向                         |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| 反向 / RTL                       |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| 键盘导航（方向键/Home/End/Page） |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| `minStepsBetweenThumbs`          |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| 表单代理 / `name` 提交           |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| axe 零违规                       |   ✅   |          —          |           —           |        —         |         —         |        —        |
| marks 刻度标记                   |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| 拖拽时数值气泡 tooltip           |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| 数字输入框联动                   |   ➕   |         ✅          |           —           |        —         |         —         |        —        |

### 使用注意

- 单滑块没有默认可访问名称——请通过 `thumbProps` 传入 `aria-label`（区间模式自动回退到本地化的"最小值"/"最大值"标签）。
- 滑块默认在轨道内（`contain`）；`thumbAlignment="overflow"` 可让滑块超出轨道边界。
- 表单代理仅在根元素含 `form` 类且设置了 `name` 时渲染；需配合原生 `<form>` 或 `SForm` 使用。
- PageUp/PageDown 与 Shift+方向键按 `step` 的 10 倍步进；`minStepsBetweenThumbs` 可阻止滑块互相跨越。

## 常见问题

### 如何创建区间滑块（range slider）？

向 `modelValue`（或 `defaultValue`）传入包含两个值的数组，例如 `[20, 80]`。组件渲染两个滑块，`valueCommit` 同时发出两个值。两个滑块分别标记为"最小值"/"最大值"（已本地化），除非通过 `thumbProps['aria-label']` 覆盖。

### 如何限制两个滑块的最小间距？

设置 `minStepsBetweenThumbs` 为滑块之间的最小步数——当间距低于该阈值时，步进或拖拽操作会被拒绝。

### 如何在滑块上方显示当前值？

使用默认插槽，它会为每个滑块提供 `{ index, value, modelValue }` 参数，可渲染自定义内容。内置 tooltip 属于排期待增强项。

### 支持哪些键盘快捷键？

方向键按 `step` 步进，PageUp/PageDown 与 Shift+方向键跳 10 步，Home/End 直达 min/max。方向键跟随 `dir` 与 `inverted`（RTL 翻转水平方向键；`inverted` 反转数值方向）。
