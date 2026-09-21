---
head:
  title: 空状态
  description: 用于突出「内容缺失」并引导用户采取下一步操作的轻量级空状态组件。SEmpty 是 UI-only 组合：root/header/media/title/description/content 解剖节点由普通元素自绘，默认图标走 SIcon，样式来自 emptyVariants 配方（6 个槽、6 种尺寸）。
---

# 空状态

## 概述

用于突出「内容缺失」并引导用户采取下一步操作的轻量级空状态组件。`SEmpty` 是 **UI-only** 组件：root/header/media/title/description/content 解剖节点由普通元素自绘，默认媒体图标走 `SIcon`，样式统一来自 `emptyVariants` 配方（6 个槽、6 种尺寸）。

适用于「无结果」、空收件箱、空表格或引导提示。关于状态的纯内联反馈请优先使用 `alert`；内容仍在加载（而非缺失）时请优先使用 `skeleton`。

Aria 层不存在 `empty` 家族：空状态不含需要在多个包装层之间复用的键盘、焦点、ARIA 或状态逻辑，因此整份装配留在 UI 层，并保留 `data-vean-empty-*` 属性供样式与测试使用。

## 用法

<UsageCode component="empty" />

## 特性

- 🧩 UI-only 解剖壳 — `SEmpty` 自持 header/media/title/description 编排，纯样式驱动；没有可供组合的 Aria `empty` 家族
- 🖼️ 媒体 / 图标 — `icon` prop 或 `media` 插槽，用于插图、emoji 或自定义图形
- 🏷️ 标题 + 描述 — `title`/`description` prop 或对应插槽
- ⚡ 操作区 — `content`/`default` 插槽，用于按钮或后续指引
- 🎨 6 种尺寸 — 匹配 `ThemeSize` 的 xs–2xl `size`
- 🎛️ 逐槽控制 — `headerProps`/`mediaProps`/`contentProps`/`titleProps`/`descriptionProps` 转发到各部件
- ♿ 无障碍友好 — 标题渲染为真实标题元素，`axe-core` 零违规

## 组件家族

`SEmpty` 是单一导出。它自绘整份解剖结构，并在对应节点上暴露 `data-vean-empty-root` / `-header` / `-media` / `-title` / `-description` / `-content`，因此 `class`/`ui` 与逐部件 `*Props` 可以作用到每个部件。

## 演示

<PlaygroundGallery component="empty" />

## API

<ComponentApi component="empty" />

## 注意事项

### 架构与对标差异

`SEmpty` 在 UI 层自持 header/media/title/description 编排——空状态是一个没有行为支撑的解剖壳，因此刻意没有 Aria 家族。这与 shadcn/ui 的「组合优先」一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供带 `image`/`description` prop 的单一样式化 `Empty`。VeanUI 提供完整的逐部件 `*Props` 通道与单包库通常缺失的 `size` 尺寸体系，默认媒体由 `SIcon` 渲染。

| 能力            | VeanUI | shadcn/ui | Ant Design Empty | Element Plus Empty | Mantine | Naive UI Empty |
| :-------------- | :----: | :-------: | :--------------: | :----------------: | :-----: | :------------: |
| Aria/样式分离   |   ✅   |    ✅     |        —         |         —          |    —    |       —        |
| 媒体 / 图标     |   ✅   |    ✅     |        ✅        |         ✅         |   ✅    |       ✅       |
| 标题            |   ✅   |     —     |        ✅        |         ✅         |   ✅    |       ✅       |
| 描述            |   ✅   |     —     |        ✅        |         ✅         |   ✅    |       ✅       |
| 操作 / 内容插槽 |   ✅   |     —     |        ✅        |         ✅         |   ✅    |       ✅       |
| 尺寸变体（6）   |   ✅   |     —     |        —         |         —          |    —    |       —        |
| 逐部件 `*Props` |   ✅   |    ✅     |        —         |         —          |    —    |       —        |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 默认媒体由 `SIcon` 渲染，开箱可直接用任意 Iconify 名称或组件；需要插图或 emoji 时请改用 `media` 插槽。
- 标题渲染为标题元素；请让空状态标题与周围文档大纲的标题层级匹配。
- 根节点默认使用虚线边框——嵌入卡片或实色表面时请通过 `class`/`ui` 覆盖。
- `Empty` 纯展示、不持有状态；不拦截焦点，也不提供交互语义。

### Roadmap

核心空状态 API 无阻塞缺口。

## FAQ

### 如何显示图标或插图？

传入 `icon`（由 `SIcon` 渲染）或使用 `media` 插槽渲染任意内容：

```vue
<SEmpty title="暂无消息" description="收件箱为空" icon="lucide:inbox" />
```

### 如何添加操作按钮？

使用 `content`（或 `default`）插槽：

```vue
<SEmpty title="暂无项目" description="创建一个以开始">
  <SButton color="primary">新建项目</SButton>
</SEmpty>
```

### 如何改变尺寸？

传入 `size`（xs–2xl）：

```vue
<SEmpty size="lg" title="大号空状态" />
```

### 如何自定义外观？

使用 `class`/`ui` 控制样式（参考 `custom-styling` 示例）；也可传入逐部件 props 单独调整 header/media/content。

### 是否无障碍？

标题为真实标题元素，组件通过 `axe-core` 零违规检查；你放入插槽中的任何操作都会保留自身的可访问语义。
