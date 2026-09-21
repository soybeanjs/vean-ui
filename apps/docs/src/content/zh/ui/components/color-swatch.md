---
head:
  title: 色块
  description: 用于展示颜色值的只读色块，支持透明色和 OKLCH 输入。SColorSwatch 组合 Aria ColorSwatchRoot/ColorSwatchChecker/ColorSwatchFill 基础组件与 colorSwatchVariants 样式配方（3 个槽、6 种尺寸 × 2 种形状）。
---

# 色块

## 概述

用于展示颜色值的只读色块，支持透明色和 OKLCH 输入。`SColorSwatch` 组合 Aria `ColorSwatchRoot`/`ColorSwatchChecker`/`ColorSwatchFill` 基础组件与 `colorSwatchVariants` 样式配方（3 个槽、6 种尺寸 × 2 种形状）。

色块适合在选择器、表格或标签中展示颜色值（可带透明棋盘格）。

## 用法

<UsageCode component="color-swatch" />

## 特性

- 🧩 Aria/样式分离 — `ColorSwatchCompact` 组合棋盘 + 填充；`SColorSwatch` 只注入样式并转发 prop/插槽
- 🖼️ 透明棋盘 — 在半透明/带 alpha 的颜色背后渲染棋盘格
- 🎨 OKLCH + 透明支持 — 接受任意 `ColorValue`，包括 `oklch` 与带 alpha 的颜色
- 🏷️ 无障碍标签 — `role="img"` 带 `aria-label`（取自 `label`）；空色标记 `data-no-color`
- 🔵 形状 — `shape="square"`（默认）或 `"circle"`
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- 🔌 插槽作用域 — 默认插槽暴露 `{ color, alpha }`（RGB 字符串 + 0–1 alpha）

## 组件家族

- `SColorSwatch`（样式层）— 入口包装组件；`colorSwatchVariants` 配方配合动态插槽转发
- `ColorSwatchRoot`（Aria）— 无障碍预览根（`role="img"`、`color`/`label`）
- `ColorSwatchChecker`（Aria）— 透明棋盘格
- `ColorSwatchFill`（Aria）— 纯色填充
- `ColorSwatchCompact`（Aria）— 聚合组件；组合棋盘 + 填充

## 演示

<PlaygroundGallery component="color-swatch" />

## API

<ComponentApi component="color-swatch" />

## 注意事项

### 架构与对标差异

`ColorSwatchCompact` 负责棋盘/填充组合，所有基础组件保持零样式，仅由 UI 包装组件注入 `colorSwatchVariants` 类。这与 radix-ui-color/shadcn-ui 的 headless 分离一致。Ant Design、Element Plus、Mantine、Naive UI 用普通着色 `<span>` 渲染色块；VeanUI 暴露带透明棋盘、形状/尺寸控制与暴露解析后颜色/alpha 的插槽作用域的无障碍 `role="img"` 预览。

| 能力               | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :----------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离      |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 透明棋盘           |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| OKLCH / alpha 支持 |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 无障碍 role/img    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 形状（方/圆）      |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 尺寸（6）          |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 提供 `label` 作为无障碍名称；空色标记 `data-no-color`（以柔和色渲染）。
- `color` 接受颜色字符串或 `ColorValue`（含 `oklch`/alpha）；填充使用解析后的 CSS 颜色。
- 默认插槽接收 `{ color, alpha }`（RGB 字符串 + 0–1 alpha）用于自定义覆盖/标签。
- `shape` 在方形（`rounded-md`）与圆形（`rounded-full`）间切换。
- 这是只读预览；选择请用 `color-picker`/`color-swatch-picker`。

### Roadmap

不适用——color-swatch 对当前对标集已功能完备。

## FAQ

### 如何显示色块？

传入 `color` 与可选 `label`：

```vue
<SColorSwatch color="#7c3aed" label="强调色" />
```

### 如何设为圆形？

设置 `shape="circle"`：

```vue
<SColorSwatch color="#06b6d4" shape="circle" />
```

### 如何访问解析后的颜色/alpha？

使用默认插槽作用域：

```vue
<SColorSwatch :color="color">
  <template #default="{ alpha }">{{ (alpha * 100).toFixed(0) }}%</template>
</SColorSwatch>
```
