---
head:
  title: 头像
  description: 用于展示用户头像的图片组件，支持加载失败时的回退内容。SAvatar 组合 AvatarRoot/AvatarImage/AvatarFallback 这一系列 Aria 基础组件（零样式）与 avatarVariants 样式配方（3 个槽：root/image/fallback，xs–2xl 共 6 种尺寸）。
---

# 头像

## 概述

用于展示用户头像的图片组件，支持加载失败时的回退内容。`SAvatar` 组合 `AvatarRoot`/`AvatarImage`/`AvatarFallback` 这一系列 Aria 基础组件（零样式）与 `avatarVariants` 样式配方（3 个槽：root/image/fallback，xs–2xl 共 6 种尺寸）。

适用于用户资料、团队成员/参与者列表，以及任何需要「身份图片 + 优雅降级」的场景——当图片加载缓慢、缺失或失败时显示回退内容。静态或纯装饰性图片请优先使用 `image`、`icon`；需要在内容到达前预留空间时优先使用 `skeleton`。

`SAvatar` 通过 `AvatarCompact` 聚合这些基础组件，提供以 `src` 为核心的 API，并支持 `fallback-label` 与 `delay-ms`。需要完全自定义组合时，可直接使用 Aria 层的 `AvatarRoot`/`AvatarImage`/`AvatarFallback` 基础组件。

## 用法

<UsageCode component="avatar" />

## 特性

- 🧩 Aria/样式分离 — `AvatarCompact` 聚合 `AvatarRoot`/`AvatarImage`/`AvatarFallback` 并暴露 `image`/`fallback` 插槽；`SAvatar` 只注入样式并转发插槽/事件
- 🖼️ 优雅加载 — 图片真正加载完成后才显示；加载中或加载失败时显示回退文本/插槽
- 🎭 回退插槽 — 自定义 `fallback` 插槽可将文本标签替换为首字母、图标或任意 VNode
- ⏱️ 延迟控制 — `delay-ms` 延迟回退内容出现，仅面向慢网络用户
- 🎨 6 种尺寸 — 通过 `size` 使用统一的 `ThemeSize` 尺寸体系（xs–2xl）
- ♿ 无障碍友好 — 加载后的图片自动继承回退文本作为可访问名称，默认回退文本以真实内容渲染；`axe-core` 零违规
- 🧩 完全可定制 — 支持逐槽 `ui` 覆盖、根节点 `class` 覆盖，以及 `image`/`fallback` 插槽替换默认内容

## 组件家族

- `SAvatar`（样式层）— 入口包装组件；`avatarVariants` 配方配合动态插槽转发
- `AvatarRoot`（Aria）— 容器；通过 `provideAvatarRootContext` 维护共享的图片加载状态
- `AvatarImage`（Aria）— `<img>`；通过 `useImageLoadingStatus` 追踪加载状态，加载完成前隐藏
- `AvatarFallback`（Aria）— 回退内容；仅在图片未加载（且超过 `delay-ms`）时渲染
- `AvatarCompact`（Aria）— 聚合组件；组合 root/image/fallback，并将图片 `alt` 默认设为 `fallback-label`

## 演示

<PlaygroundGallery component="avatar" />

## API

<ComponentApi component="avatar" />

## 注意事项

### 架构与对标差异

`AvatarCompact` 负责加载状态编排（何时显示哪一部分），所有基础组件保持零样式，仅由 UI 包装组件注入 `avatarVariants` 类。这与 shadcn/ui 的 `Avatar`/`AvatarImage`/`AvatarFallback` headless 三件套及 Radix 的 `Avatar` 原语一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供单一样式化 `Avatar` 组件（`alt`/`src` prop）。VeanUI 刻意将回退文本与图片 `alt` 统一收敛到聚合层（`fallback-label`），使加载后的图片无需使用者重复声明即可拥有可访问名称。

| 能力                    | VeanUI | shadcn/ui | Ant Design Avatar | Element Plus Avatar | Mantine Avatar | Naive UI Avatar |
| :---------------------- | :----: | :-------: | :---------------: | :-----------------: | :------------: | :-------------: |
| Aria/样式分离           |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| 图片 + 回退文本/插槽    |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| 回退延迟（`delay-ms`）  |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| 可访问名称自动派生      |   ✅   |     —     |         —         |          —          |       —        |        —        |
| 复合组件 + 逐部件 props |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| 可配置尺寸（ThemeSize） |   ✅   |   class   |        ✅         |         ✅          |       ✅       |       ✅        |

`—` = 不支持或采用不同交互模型（AntD/Element Plus/Mantine/Naive UI 为单一样式化组件；shadcn/ui 将图片 `alt` 交由使用者处理且无回退延迟）。

### 运行时注意

- 图片仅在加载完成后才渲染（并暴露 `alt`），在此之前可见内容为回退内容。不要依赖加载事件之前 DOM 中已存在图片元素。
- 图片加载失败时，`loadingStatusChange` 会发出 `'error'`，回退内容保持可见。可监听该事件驱动日志或重试逻辑。
- `fallback-label` 既作为回退文本，也作为加载后图片的可访问名称。若头像为纯装饰性且应被辅助技术跳过，请将 `imageProps.alt` 设为 `''`。
- `delay-ms` 只延迟*回退内容*；图片仍会立即开始加载，因此网络良好时仍优先显示图片。
- 根节点为 `<span>`（非 `<button>`/链接），默认不可聚焦、不可交互——需要可点击时应在外层包裹链接或按钮。

## FAQ

### 图片未加载时如何显示首字母？

传入 `fallback-label`（或使用 `fallback` 插槽），它会在图片加载中或加载失败后渲染：

```vue
<SAvatar src="https://example.com/avatar.png" fallback-label="JD" />
```

### 如何延迟回退内容以适配慢网络？

使用 `:delay-ms`；在给定毫秒内图片未加载时，回退内容才会出现：

```vue
<SAvatar src="https://example.com/avatar.png" fallback-label="JD" :delay-ms="1000" />
```

### 如何用图标代替文本作为回退内容？

使用 `fallback` 插槽渲染任意内容：

```vue
<SAvatar src="https://example.com/avatar.png">
  <template #fallback><SIcon icon="lucide:user" /></template>
</SAvatar>
```

### 如何响应图片加载失败？

监听 `@loading-status-change`；它会发出 `'loading'` / `'loaded'` / `'error'`：

```vue
<SAvatar src="https://example.com/avatar.png" fallback-label="JD" @loading-status-change="onStatus" />
```

### 如何制作纯装饰性头像？

将 `imageProps.alt` 设为 `''`，辅助技术将跳过该图片：

```vue
<SAvatar src="https://example.com/logo.png" :image-props="{ alt: '' }" />
```
