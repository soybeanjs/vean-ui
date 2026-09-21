---
head:
  title: 提示
  description: 用于突出重要、有时效性信息——警告、错误或确认——并在其相关内容附近的提示框。SAlert 组合 AlertRoot/AlertTitle/AlertDescription/AlertClose 这一系列 Aria 基础组件（零样式）与 alertVariants 样式配方（6 个槽、8 种颜色 × 5 种变体 × 6 种尺寸）。
---

# 提示

## 概述

用于突出重要、有时效性信息——警告、错误或确认——并在其相关内容附近的提示框。`SAlert` 组合 `AlertRoot`/`AlertTitle`/`AlertDescription`/`AlertClose` 这一系列 Aria 基础组件（零样式）与 `alertVariants` 样式配方（6 个槽、8 种颜色 × 5 种变体 × 6 种尺寸）。

适用于不容错过的内联反馈。短暂、全局的通知请优先使用 `toast`；阻塞性确认请优先使用 `dialog`。全宽横幅（Banner）变体见 roadmap 中的 `Banner` 项。

## 用法

<UsageCode component="alert" />

## 特性

- 🧩 Aria/样式分离 — `AlertCompact` 聚合基础组件并组合默认图标/标题/描述/关闭；`SAlert` 只注入样式并转发插槽/事件
- 🏷️ 标题 + 描述 — `title`/`description` prop 或对应插槽
- ❌ 可关闭 — `closable` 渲染带本地化 `aria-label` 的关闭 `<button>`，由 `v-model:open` 驱动
- 🎨 8 种颜色 — `ThemeColor` 值（`primary`/`destructive`/`success`/`warning`/`info`/`carbon`/`secondary`/`accent`）
- 🖌️ 5 种变体 — `solid`/`pure`/`outline`/`soft`/`ghost`
- 📐 6 种尺寸 — xs–2xl `size`
- 🖼️ 前导图标 — `icon` prop 或 `leading` 插槽
- ♿ 无障碍 — 关闭控件为真实 `<button>`，带本地化 `aria-label`；`axe-core` 零违规

## 组件家族

- `SAlert`（样式层）— 入口包装组件；`alertVariants` 配方配合动态插槽转发
- `AlertRoot`（Aria）— 容器；经 `useControllableState` 维护 `open` 并通过 `provideAlertRootContext` 下发
- `AlertContent`（Aria）— 承载标题/描述的内容区
- `AlertTitle`（Aria）— 标题
- `AlertDescription`（Aria）— 描述
- `AlertClose`（Aria）— 关闭 `<button>`；本地化 `aria-label`，发出 `close` 并切换 `open`
- `AlertCompact`（Aria）— 聚合组件；组合图标/标题/描述/关闭并暴露各插槽

## 演示

<PlaygroundGallery component="alert" />

## API

<ComponentApi component="alert" />

## 注意事项

### 架构与对标差异

`AlertCompact` 负责图标/标题/描述/关闭的默认装配，所有基础组件保持零样式，仅由 UI 包装组件注入 `alertVariants` 类。这与 shadcn/ui 的 headless/样式分离一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供带 `type`/`closable`/`showIcon` prop 的单一样式化提示。VeanUI 暴露完整的逐槽 `*Props` 通道与单包库通常缺失的 `size` 尺寸体系，并将关闭按钮的 `aria-label` 本地化（`alert.close`），而非依赖纯 `×` 字形。

| 能力                     | VeanUI | shadcn/ui | Ant Design Alert | Element Plus Alert | Mantine Alert | Naive UI Alert |
| :----------------------- | :----: | :-------: | :--------------: | :----------------: | :-----------: | :------------: |
| Aria/样式分离            |   ✅   |    ✅     |        —         |         —          |       —       |       —        |
| 标题 + 描述              |   ✅   |    ✅     |        ✅        |         ✅         |      ✅       |       ✅       |
| 可关闭                   |   ✅   |     —     |        ✅        |         ✅         |      ✅       |       ✅       |
| 前导图标                 |   ✅   |     —     |        ✅        |         ✅         |      ✅       |       ✅       |
| 变体（solid/soft/ghost） |   ✅   |    ✅     |        —         |         —          |       —       |       —        |
| 颜色（8）                |   ✅   |    ✅     |        ✅        |         ✅         |      ✅       |       ✅       |
| 尺寸（6）                |   ✅   |     —     |        —         |         —          |       —       |       —        |
| 本地化关闭标签           |   ✅   |     —     |        —         |         ✅         |       —       |       —        |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 关闭按钮的 `aria-label` 由 `alert.close`（如 `关闭提示`）本地化而来。可通过 `SAlert` 上的 `aria-label` 或自定义 `close` 插槽覆盖。
- `open` 默认 `true`；`closable` 显示关闭按钮。用 `v-model` 绑定 `open` 以控制关闭。
- `variant="solid"` 将文本切换为颜色前景色；`soft`/`ghost` 用半透明色给背景着色。
- `icon` 前导图形为装饰性；消息内容由标题/描述承载。
- `Alert` 是静态提示框——不设置 live/alert `role`，也不自动消失；短暂通知请使用 `toast`。

### Roadmap

全宽 `Banner` 变体记录在 `docs/roadmap.md`（P2）。

## FAQ

### 如何显示标题与描述？

传入 `title`/`description` prop（或对应插槽）：

```vue
<SAlert color="warning" title="请注意" description="您的会话即将过期。" />
```

### 如何让提示可关闭？

设置 `closable` 并用 `v-model` 绑定 `open`：

```vue
<SAlert v-model:open="open" closable title="关闭我" />
```

### 如何改变颜色与变体？

使用 `color`（8 个值）与 `variant`（`solid`/`pure`/`outline`/`soft`/`ghost`）：

```vue
<SAlert color="success" variant="soft" title="已保存" description="所有更改均已存储。" />
```

### 如何添加图标？

使用 `icon` prop（经 ConfigProvider `iconRender`）或 `leading` 插槽：

```vue
<SAlert icon="lucide:info" title="信息" description="请阅读文档。" />
```

### 如何自定义关闭控件？

使用 `close` 插槽读取关闭行为（或自行提供 `aria-label`）：

```vue
<SAlert v-model:open="open" closable title="自定义关闭">
  <template #close><button type="button" aria-label="关闭" @click="open = false">×</button></template>
</SAlert>
```
