---
head:
  title: 标签
  description: 用于在内容行内对内容进行分类、筛选或标记的紧凑型标签。STag 组合 Aria 层 Tag 基础组件（零样式）与 tagVariants 样式配方（8 种颜色 × 6 种尺寸 × 5 种变体 × 2 种形状），并暴露 leading/trailing/close 插槽。
---

# 标签

## 概述

用于在内容行内对内容进行分类、筛选或标记的紧凑型标签。`STag` 组合 Aria 层 `Tag` 基础组件（零样式）与 `tagVariants` 样式配方（8 种颜色 × 6 种尺寸 × 5 种变体 × 2 种形状），并暴露 `leading`/`trailing`/`close` 插槽。

适用于状态标签、分类胶囊、关键词或可筛选的元数据。需要叠加在宿主元素上作为数量/通知气泡的标记请优先使用 `badge`；需要承载更大上下文反馈的提示请优先使用 `alert`。

`STag` 支持 `v-model:open` 受控显隐与带本地化可访问标签的 `closable` 关闭按钮。Aria 层 `Tag` 基础组件通过插槽 props 暴露 `close` 动作，便于完全自定义组合。

## 用法

<UsageCode component="tag" />

## 特性

- 🧩 Aria/样式分离 — Aria 层 `Tag` 负责 `open`/`close` 状态；`STag` 注入 `tagVariants` 类并提供默认关闭控件
- 🎨 8 种颜色 — `ThemeColor` 值（`primary`/`destructive`/`success`/`warning`/`info`/`carbon`/`secondary`/`accent`）
- 🖌️ 5 种变体 — `solid`/`pure`/`outline`/`soft`/`ghost`/`raw`，覆盖实心、描边与淡色等外观
- 📐 6 种尺寸 — 来自 `ThemeSize` 的 xs–2xl
- 🟦 2 种形状 — `auto`（圆角）与 `rounded`（胶囊）
- ❌ 可关闭 — `closable` 渲染由 `v-model:open` 驱动的关闭按钮；关闭控件为带本地化 `aria-label` 的真实 `<button>`（可键盘操作）
- 🌐 RTL 就绪 — 布局使用 inline-flex 与逻辑间距
- ♿ 无障碍友好 — 关闭按钮可聚焦、拥有可访问名称，默认态与可关闭态 `axe-core` 均零违规

## 组件家族

- `STag`（样式层）— 入口包装组件；`tagVariants` 配方 + `leading`/`trailing`/`close` 插槽
- `Tag`（Aria）— 状态基础组件；通过 `useControllableState` 维护 `open`，并通过插槽 props 暴露 `close` 动作

## 演示

<PlaygroundGallery component="tag" />

## API

<ComponentApi component="tag" />

## 注意事项

### 架构与对标差异

Aria 层 `Tag` 是最小的显隐/关闭状态基础组件，`STag` 将全部样式收敛到 `tagVariants` 配方，并提供默认关闭控件。这与 shadcn/ui 的 headless/样式分离一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供带 `closable`/`onClose` prop 的单一样式化标签。VeanUI 的关闭按钮是可聚焦的真实 `<button>`，其 `aria-label` 由 `tag.remove`（如 `Remove {label}`）本地化而来；多个对标库则依赖对屏幕阅读器不够健壮的纯 `×` 字形。

| 能力                       | VeanUI | shadcn/ui | Ant Design Tag | Element Plus Tag | Mantine Badge | Naive UI Tag |
| :------------------------- | :----: | :-------: | :------------: | :--------------: | :-----------: | :----------: |
| Aria/样式分离              |   ✅   |    ✅     |       —        |        —         |       —       |      —       |
| 颜色变体（8）              |   ✅   |    ✅     |       ✅       |        ✅        |      ✅       |      ✅      |
| 变体（solid/outline/soft） |   ✅   |    ✅     |       ✅       |        ✅        |      ✅       |      ✅      |
| 尺寸变体（6）              |   ✅   |     —     |       ✅       |        ✅        |      ✅       |      ✅      |
| 形状（auto / 胶囊）        |   ✅   |    ✅     |       ✅       |        ✅        |      ✅       |      ✅      |
| 可关闭标签                 |   ✅   |     —     |       ✅       |        ✅        |       —       |      ✅      |
| 本地化关闭 `aria-label`    |   ✅   |     —     |       —        |        ✅        |       —       |      —       |
| 受控显隐（`open`）         |   ✅   |     —     |       —        |        —         |       —       |      —       |
| RTL 就绪                   |   ✅   |    ✅     |       ✅       |        —         |       —       |      ✅      |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 关闭按钮的 `aria-label` 由本地化 `tag.remove` 模板基于 `content` prop 生成。若你通过 `default` 插槽而非 `content` 传入标签文本，默认关闭 `aria-label` 将回退为纯动词——请通过 `close` 插槽或 `content` prop 覆盖。
- `open` 默认 `true`。使用 `:open="false"` 或 `v-model:open` 控制显隐。
- `variant="pure"`/`outline` 会刻意用 `foreground`/`border` token 覆盖颜色前景色；`soft`/`ghost` 使用半透明色给背景着色。
- 关闭按钮继承标签文本颜色并使用透明背景/边框；在 `soft` 背景上依然可见，但请为你选择的颜色/背景组合验证对比度。
- 标签根节点为 `<div>`——若需要整块标签可点击，请自行在外层包裹链接或按钮。

### Roadmap

核心标签 API 无阻塞缺口。独立的 `tag-group` 与 `checkable` 标签行为为已评估增强项，记录在 `docs/roadmap.md`。

## FAQ

### 如何制作可关闭的标签？

设置 `closable` 并用 `v-model` 绑定 `open`：

```vue
<STag v-model:open="open" closable content="Linux" />
```

### 如何响应标签关闭？

监听 `@update:open`——点击关闭按钮时会发出 `false`：

```vue
<STag :open="open" closable content="Linux" @update:open="onClose" />
```

### 如何改变变体、形状与颜色？

使用 `variant`（`solid`/`pure`/`outline`/`soft`/`ghost`/`raw`）、`shape`（`auto`/`rounded`）与 `color`：

```vue
<STag variant="soft" shape="rounded" color="success" content="Active" />
```

### 如何在文本前后添加图标？

使用 `leading` / `trailing` 插槽：

```vue
<STag content="Status">
  <template #leading><SIcon icon="lucide:circle" /></template>
</STag>
```

### 如何自定义关闭按钮？

使用 `close` 插槽并从其 props 中读取 `close` 动作：

```vue
<STag v-model:open="open" closable content="Linux">
  <template #close="{ close }">
    <button type="button" aria-label="Dismiss" @click="close">×</button>
  </template>
</STag>
```
