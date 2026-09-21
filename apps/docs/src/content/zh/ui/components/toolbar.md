---
head:
  title: 工具栏
  description: 用于将相关操作、链接和切换控件组织到同一个支持 roving focus 的紧凑工具栏中。SToolbar 组合 Aria 工具栏基础组件（ToolbarRoot/ToolbarButton/ToolbarLink/ToolbarSeparator/ToolbarToggleGroup/ToolbarToggleItem）与 toolbarVariants 样式配方（7 个槽、6 种尺寸 × 2 个方向）。
---

# 工具栏

## 概述

用于将相关操作、链接和切换控件组织到同一个支持 roving focus 的紧凑工具栏中。`SToolbar` 组合 Aria 工具栏基础组件（`ToolbarRoot`/`ToolbarButton`/`ToolbarLink`/`ToolbarSeparator`/`ToolbarToggleGroup`/`ToolbarToggleItem`）与 `toolbarVariants` 样式配方（7 个槽、6 种尺寸 × 2 个方向）。

工具栏适合密集、可键盘导航的一行操作。单个操作按钮请用 `button`；成组按钮请用 `toggle-group`。

## 用法

<UsageCode component="toolbar" />

## 特性

- 🧩 Aria/样式分离 — `ToolbarRoot` 提供工具栏上下文；每个部分（`button`/`link`/`separator`/`toggle-group`）都是薄样式化基础组件
- ⌨️ Roving focus — 方向键在工具栏项间导航，Home/End，可选 `loop`；分隔线与禁用项被跳过
- ↔️ 方向 — `horizontal`（默认）或 `vertical`；分隔线自动翻转方向
- 🔘 切换组 — `SToolbarToggleGroup`/`SToolbarToggleItem` 用 `v-model` 实现单选/多选切换
- 🔗 链接支持 — `SToolbarLink` 渲染带前导图标（`showIcon`）的锚点
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ♿ 无障碍 — `role="toolbar"`、`aria-orientation`、切换项 `aria-pressed`、`axe-core` 零违规

## 组件家族

- `SToolbar`（样式层）— 根包装组件；`toolbarVariants` 配方（`size` + 方向）配合 `provideToolbarUi`
- `SToolbarButton`（样式层）— 工具栏按钮（`Button` 基座）
- `SToolbarLink`（样式层）— 工具栏链接（`Link` 基座，可选 `showIcon`）
- `SToolbarSeparator`（样式层）— 方向感知分隔线（`SeparatorRoot` 基座）
- `SToolbarToggleGroup` / `SToolbarToggleItem`（样式层）— 切换组控件（`ToggleGroupRoot`/`ToggleGroupItem` 基座）
- `ToolbarRoot`/`ToolbarButton`/`ToolbarLink`/`ToolbarSeparator`/`ToolbarToggleGroup`/`ToolbarToggleItem`（Aria）— 底层基础组件

## 演示

<PlaygroundGallery component="toolbar" />

## API

<ComponentApi component="toolbar" />

## 注意事项

### 架构与对标差异

工具栏家族是多槽组合：`ToolbarRoot` 提供 roving focus + 方向上下文，每个部分（按钮/链接/分隔线/切换组）复用 button、link、separator、toggle-group 基础组件，UI 包装组件按槽注入 `toolbarVariants` 类。这与 radix-ui/shadcn-ui 的 headless toolbar/toggle-group 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供按钮/分段控件而非带方向感知分隔线的专用 roving-focus 工具栏容器；VeanUI 提供带 `loop`/RTL 支持与 `size` 尺寸体系的完整工具栏。

| 能力                | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------ | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离       |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Roving focus + loop |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| 方向感知            |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 切换组              |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 链接支持            |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 尺寸（6）           |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `SToolbar` 渲染 `role="toolbar"` 与 `aria-orientation`（默认 `horizontal` / `vertical`）；分隔线自动翻转以匹配。
- Roving focus 使用方向键 + Home/End；`loop` 循环导航。禁用项与分隔线被跳过。
- `SToolbarToggleGroup` 支持单选（`model-value` 字符串）与多选（`model-value` 数组），用 `v-model` 绑定。
- `dir`/RTL 从 `ConfigProvider` locale（如 `ar`）推导，或在根组件显式设置。
- `SToolbarLink` 渲染锚点；`showIcon` 在链接文本旁添加前导图标。

### Roadmap

不适用——toolbar 对当前对标集已功能完备。

## FAQ

### 如何构建工具栏？

组合按钮、链接、分隔线与切换组：

```vue
<SToolbar>
  <SToolbarButton>剪切</SToolbarButton>
  <SToolbarButton>复制</SToolbarButton>
  <SToolbarSeparator />
  <SToolbarToggleGroup v-model="align">
    <SToolbarToggleItem value="left">左</SToolbarToggleItem>
    <SToolbarToggleItem value="center">中</SToolbarToggleItem>
  </SToolbarToggleGroup>
</SToolbar>
```

### 如何设为垂直？

设置 `orientation="vertical"`：

```vue
<SToolbar orientation="vertical">
  <SToolbarButton>上</SToolbarButton>
  <SToolbarButton>下</SToolbarButton>
</SToolbar>
```

### 如何让导航循环？

设置 `loop`：

```vue
<SToolbar loop>
  <SToolbarButton>A</SToolbarButton>
  <SToolbarButton>B</SToolbarButton>
</SToolbar>
```

### 如何添加链接？

使用带 `href` 与 `show-icon` 的 `SToolbarLink`：

```vue
<SToolbar>
  <SToolbarLink href="https://example.com" show-icon>网站</SToolbarLink>
</SToolbar>
```
