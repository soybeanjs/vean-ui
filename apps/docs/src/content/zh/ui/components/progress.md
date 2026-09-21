---
head:
  title: 进度条
  description: 用于展示任务完成进度的指示组件，支持确定值和不确定状态。SProgress 组合 Aria 层 ProgressRoot/ProgressIndicator 基础组件与 progressVariants 样式配方；SProgressCircle 通过 progressCircleVariants 提供环形变体。两者共享经 SProgressProvider 暴露的命令式 API（progress.start()/done()）。
---

# 进度条

## 概述

用于展示任务完成进度的指示组件，支持确定值和不确定状态。`SProgress` 组合 Aria 层 `ProgressRoot`/`ProgressIndicator` 基础组件与 `progressVariants` 样式配方；`SProgressCircle` 通过 `progressCircleVariants` 提供环形变体。两者共享经 `SProgressProvider` 暴露的命令式 API（`progress.start()`/`done()`）。

适用于上传、下载、多步流程或页面顶部加载条。无限等待请优先使用 `spinner`；内容加载前的空间预留请优先使用 `skeleton`。

## 用法

<UsageCode component="progress" />

## 特性

- 🧩 Aria/样式分离 — `ProgressRoot`/`ProgressIndicator` 负责状态、`role="progressbar"` ARIA 与派生值；`SProgress` 注入 `progressVariants`
- 🔢 确定 / 不确定 — `modelValue` 显示具体数值；省略则显示不确定进度条
- 🎨 8 种颜色 — 指示条上的 `ThemeColor` 值
- 📐 6 种尺寸 — xs–2xl `size`
- ⭕ 环形变体 — `SProgressCircle` 提供圆形仪表盘，支持可配置 `strokeWidth`
- 🏷️ 自定义标签 — `getValueLabel`/`getValueText` 决定 `aria-label`/`aria-valuetext`
- ⚡ 命令式 API — 通过 `SProgressProvider` 使用 `progress.start()`/`set()`/`inc()`/`done()` 等，用于页面顶部加载
- ♿ 无障碍 — `role="progressbar"` 带 `aria-valuemin/max/now` 与本地化 `aria-label` 回退

## 组件家族

- `SProgress`（样式层）— 线性包装组件；`progressVariants` 配方
- `SProgressCircle`（样式层）— 环形包装组件；`progressCircleVariants` 配方
- `SProgressProvider`（样式层）— 挂载命令式进度层
- `ProgressRoot`（Aria）— 状态所有者；规范化 `modelValue`/`max`，派生状态与百分比，渲染 `role="progressbar"`
- `ProgressIndicator`（Aria）— 填充条；经 CSS 变量/transform 按 `dir` 定位
- `ProgressCircleCompact` / `ProgressCompact`（Aria）— 聚合组件
- `progress`（命令式）— 共享的 `start`/`set`/`inc`/`done`/`configure` 控制器

## 演示

<PlaygroundGallery component="progress" />

## 环形进度

```vue
<script setup lang="ts">
import { SProgressCircle } from '@vean/ui';
</script>

<template>
  <SProgressCircle :model-value="72" size="xl">
    <template #default="{ valuePercent }">{{ Math.round(valuePercent ?? 0) }}%</template>
  </SProgressCircle>
</template>
```

`SProgressCircle` 支持与 `SProgress` 相同的属性、事件、插槽参数和 `Ui` 类型，并额外提供以下属性：

<DataTable preset="props" :data="[
  { name: 'strokeWidth', type: 'number', default: '8', description: '环形指示器的描边宽度。' },
]"/>

## 进度条 Provider

在调用命令式 `progress(...)` API 之前，需要在应用根部附近挂载一次 `SProgressProvider`。`SConfigProvider` 会自动挂载它，因此大多数场景下可以直接调用 `progress`。

```vue
<script setup lang="ts">
import { SButton, SProgressProvider, progress } from '@vean/ui';

const handleClick = () => {
  progress.start();

  window.setTimeout(() => {
    progress.done();
  }, 1200);
};
</script>

<template>
  <SProgressProvider />
  <SButton @click="handleClick">开始加载</SButton>
</template>
```

### `progress` 方法

| 方法           | 说明                                                 |
| -------------- | ---------------------------------------------------- |
| `start()`      | 按默认起点和启动延迟显示进度条，并启动自动递增动画。 |
| `set(value)`   | 将原始进度值设置到 `minimum` 到 `maximum` 之间。     |
| `inc()`        | 增加当前进度值。                                     |
| `dec()`        | 减少当前进度值。                                     |
| `trickle()`    | 执行一次自动递增步进。                               |
| `done()`       | 完成进度条并在配置延迟后隐藏。                       |
| `configure()`  | 更新共享进度配置。                                   |
| `pause()`      | 暂停自动递增。                                       |
| `resume()`     | 恢复自动递增。                                       |
| `remove()`     | 立即隐藏进度条。                                     |
| `reset()`      | 重置共享进度状态与配置。                             |
| `isStarted()`  | 检查进度流程是否已启动。                             |
| `isRendered()` | 检查当前是否已挂载进度 provider。                    |
| `promise()`    | 将进度生命周期绑定到 Promise 或 Promise 工厂。       |

## API

<ComponentApi component="progress" />

## 注意事项

### 架构与对标差异

`ProgressRoot` 负责数值规范化（`getValidMax`/`getValidModelValue`）、状态派生（`indeterminate`/`loading`/`complete`）与 `role="progressbar"` ARIA 契约，基础组件保持零样式，仅由 UI 包装组件注入配方类。这与 shadcn/ui 的 headless/样式分离一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供单一样式化进度组件。VeanUI 的差异化能力是 `nprogress` 风格的命令式控制器（`progress.start()`/`done()`）与 `SProgressCircle` 环形仪表盘——单包库通常将其作为独立组件处理或直接缺失。

| 能力                         | VeanUI | shadcn/ui | Ant Design Progress | Element Plus Progress | Mantine Progress | Naive UI Progress |
| :--------------------------- | :----: | :-------: | :-----------------: | :-------------------: | :--------------: | :---------------: |
| 线性进度                     |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| 环形进度                     |   ✅   |     —     |         ✅          |          ✅           |        ✅        |        ✅         |
| 不确定状态                   |   ✅   |     —     |         ✅          |          ✅           |        ✅        |        ✅         |
| 命令式 API（`start`/`done`） |   ✅   |     —     |          —          |           —           |        —         |         —         |
| 颜色变体（8）                |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| 尺寸变体（6）                |   ✅   |     —     |          —          |           —           |        —         |         —         |
| `role="progressbar"` ARIA    |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| 自定义数值标签               |   ✅   |     —     |          —          |          ✅           |        ✅        |        ✅         |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 确定值时 `aria-label` 回退为本地化百分比标签（`45%`）；本地化 `progress.ariaLabel` 仅适用于不确定进度。显式传入 `aria-label` 可覆盖两者。
- 不确定进度（无 `modelValue`）没有 `aria-valuenow`；其 `data-state` 为 `indeterminate`。
- 命令式 `progress` API 需要已挂载的 `SProgressProvider`——`SConfigProvider` 会自动挂载一个。
- `SProgressCircle` 描边宽度被钳制在 1 到 `viewbox/4` 之间；传入 `strokeWidth` 可调整粗细。
- 指示条使用 `transform` + CSS 变量，并在 RTL 下经 `dir` 交换方向。

### Roadmap

核心进度条 API 无阻塞缺口。

## FAQ

### 如何显示确定值？

传入 `model-value`：

```vue
<SProgress :model-value="45" />
```

### 如何显示不确定进度条？

省略 `model-value`：

```vue
<SProgress />
```

### 如何使用页面顶部加载条？

挂载 `SProgressProvider`（或依赖 `SConfigProvider`）并调用命令式 API：

```vue
<script setup>
const load = () => {
  progress.start();
  setTimeout(() => progress.done(), 1200);
};
</script>
<template><SButton @click="load">加载</SButton></template>
```

### 如何自定义播报标签？

传入 `get-value-label`/`get-value-text` 或显式 `aria-label`：

```vue
<SProgress :model-value="45" aria-label="上传进度" />
```

### 环形还是线性？

仪表盘/统计场景用 `SProgressCircle`（紧凑圆环），全宽线性指示或顶部加载条用 `SProgress`。
