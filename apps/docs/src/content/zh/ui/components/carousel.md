---
head:
  title: 轮播图
  description: 一个基于 Embla Carousel 构建的轮播组件，用于在有限空间内按水平或垂直方向浏览一组内容（图片、卡片、横幅等）。SCarousel 将 CarouselRoot 一族的 Aria 基础组件（零样式）与 carouselVariants 样式配方（8 个槽位：root/content/container/item/control/navigation/previous/next，6 种尺寸 × 2 种方向）组合在一起。
---

# 轮播图

## 概述

一个基于 Embla Carousel 构建的轮播组件，用于在有限空间内按水平或垂直方向浏览一组内容（图片、卡片、横幅等）。`SCarousel` 将 `CarouselRoot` 一族的 Aria 基础组件（零样式）与 `carouselVariants` 样式配方（8 个槽位：root/content/container/item/control/navigation/previous/next，6 种尺寸 × 2 种方向）组合在一起。

需要多图走马灯、商品/文章轮播、图文 banner 或任意「一次看一屏、可前后翻页」的内容时使用。若只是静态网格或瀑布流布局，应优先使用 `list` 或 `layout` 而非轮播；若需要拖拽排序或虚拟滚动长列表，应分别使用 `tree`/`list` 配合 `virtualizer`。

`SCarousel` 通过 `CarouselCompact` 聚合多个基础组件，暴露 `slides` 数据驱动用法；当需要完全自定义结构时，可回退到 `CarouselRoot`/`CarouselContent`/`CarouselContainer`/`CarouselItem`/`CarouselControl`/`CarouselNavigation`/`CarouselPrevious`/`CarouselNext` 的 Aria 组合。

## 用法

<UsageCode component="carousel" />

## 特性

- 🧩 Aria/样式拆分 — `CarouselCompact` 聚合 8 个基础组件并暴露 7 个 `*Props` 通道（content/container/item/control/navigation/previous/next）；`SCarousel` 只做样式注入与插槽/事件转发
- 🧭 水平 / 垂直 — `orientation` 切换滑动轴、方向键导航轴与布局方向
- 🌐 感知书写方向 — `dir` 传入 Embla 并在 RTL 下交换左右箭头键语义（`ArrowLeft`/`ArrowRight` 反转）
- ⌨️ 键盘可达 — 焦点在根区域时，方向键 / `ArrowLeft`/`ArrowRight` 前后翻页；`previous`/`next` 按钮在到达边界时自动 `disabled`
- ♿ 默认无障碍 — 根区域 `role="region"` + `aria-roledescription="carousel"`，每张幻灯片 `role="group"` + `aria-roledescription="slide"`；按钮默认内容与 `aria-label` 回退经 `useLocaleMessages` 本地化
- 🎛️ 受控 / 非受控 — 经 `options` 直接透传 Embla 配置（`loop`、`align`、`dragFree` 等），根插槽暴露 `scrollTo`/`scrollNext`/`scrollPrev`/`selectedIndex`/`scrollSnaps`/`progress` 等
- 🎨 8 槽位样式 — root/content/container/item/control/navigation/previous/next，6 种尺寸（xs–2xl）与 `floatNav` 浮动导航布局
- 🧩 完全可定制 — `ui` 逐槽覆盖、`class` 覆盖根元素、`slides` 数据驱动 + `item`/`control`/`previous`/`next` 插槽任意替换默认内容

## 组件家族

- `SCarousel`（styled）— 入口包装；`carouselVariants` 配方配合动态插槽转发与 `useForwardListeners` 事件合并
- `CarouselRoot`（Aria）— 状态所有者：经 `useEmblaCarousel` 初始化/销毁 Embla 实例，派生 `canScrollNext`/`canScrollPrev`/`selectedIndex`/`scrollSnaps`/`progress`；渲染 `role="region"`、`data-orientation`、本地化 `aria-label` 回退与方向键导航
- `CarouselContent`（Aria）— 视口容器；持有 Embla 根元素引用，生成并与导航按钮共享 `id`
- `CarouselContainer`（Aria）— 滑动轨道；承载所有 `CarouselItem`
- `CarouselItem`（Aria）— 单张幻灯片；`role="group"` + `aria-roledescription="slide"`
- `CarouselControl`（Aria）— 控件区容器；承载导航或自定义控件
- `CarouselNavigation`（Aria）— 前后翻页按钮的容器
- `CarouselPrevious` / `CarouselNext`（Aria）— 基于 `Button` 的前一页/后一页按钮；默认图标经 `Icon` 渲染，默认文本经 `VisuallyHidden` 隐藏并本地化
- `CarouselCompact`（Aria）— 聚合复合组件；以 `slides` 数据驱动迭代 `CarouselItem`，暴露 `item`/`control`/`previous`/`next` 插槽

## 演示

<PlaygroundGallery component="carousel" />

## API

<ComponentApi component="carousel" />

## 说明

### 架构与对标差异

`CarouselRoot` 拥有 Embla 实例的完整生命周期（初始化/重初始化/销毁、`select`/`reInit` 事件同步滚动状态），所有基础组件保持零样式，仅 UI 包装注入 `carouselVariants` 类名。这与 shadcn/ui 的 headless/styled 分离一致，区别于 Ant Design、Element Plus、Mantine、Naive UI 等把轮播作为单一「带样式组件 + 配置 prop」的单包方案。VeanUI 刻意把 `autoplay`、`loop`、`align` 等行为交由 `options` 透传给 Embla 插件体系，而不是逐个声明为顶层 prop，从而保持 API 精简并让用户接入任意 Embla 插件。前后翻页按钮默认 `disabled` 在到达边界时由 `canScrollNext`/`canScrollPrev` 派生，而非依赖 `loop` 配置。

| 能力                           | VeanUI  | shadcn/ui | Ant Design Carousel | Element Plus Carousel | Mantine Carousel | Naive UI Carousel |
| :----------------------------- | :-----: | :-------: | :-----------------: | :-------------------: | :--------------: | :---------------: |
| Aria/样式拆分                  |   ✅    |    ✅     |          —          |           —           |        —         |         —         |
| 水平 / 垂直方向                |   ✅    |     —     |         ✅          |          ✅           |        ✅        |        ✅         |
| 感知书写方向（RTL）            |   ✅    |    ✅     |         ✅          |           —           |        —         |         —         |
| 方向键导航                     |   ✅    |     —     |         ✅          |          ✅           |        —         |         —         |
| 本地化按钮 / 区域 `aria-label` |   ✅    |     —     |          —          |           —           |        —         |         —         |
| `autoplay` / `loop` / 对齐     | options |  options  |        props        |         props         |      props       |       props       |
| 复合组件 + 逐部件 props        |   ✅    |    ✅     |          —          |           —           |        —         |         —         |

`—` = 不支持或非同一交互模型（AntD/Element Plus/Mantine/Naive UI 为单包配置式轮播；shadcn/ui 的 Carousel 区块为复制源码的 headless 组合，但导航按钮文本硬编码且无方向键导航）。

### 注意事项

- `SCarousel` 依赖 Embla Carousel 的布局引擎；在 SSR 下首屏不会测量真实尺寸，需在客户端挂载后才能正确计算滚动吸附与 `canScrollNext`/`canScrollPrev`，请勿在服务端渲染阶段依赖 `selectedIndex`/`progress` 的初始值。
- `options` 与 `plugins` 为响应式透传：变化时会 `reInit` Embla 实例。频繁改动 `options` 对象字面量会触发不必要的重建，建议用 `ref`/`shallowRef` 或稳定引用传入。
- 默认 `floatNav: true` 会把上一页/下一页按钮绝对定位到内容两侧；在窄容器（如 `max-w-60`）下按钮可能溢出可视区，改用 `float-nav="false"` 或通过 `ui` 覆盖导航定位。
- 默认前后翻页按钮的图标是 `lucide:arrow-left`/`lucide:arrow-right`，由 ConfigProvider 的 `iconRender` 渲染；未配置时 `Icon` 组件默认不渲染图标，此时仅 `VisuallyHidden` 文本承载可访问名称。
- `CarouselItem` 的 `key` 由 item 顺序推导（`index`），因此 `slides` 重排不会触发生命周期复用——若列表项为有状态组件，请自行保证顺序稳定。

## 常见问题

### 如何开启自动播放？

在 `options` 中配置 `{ loop: true }` 并接入 Embla 的 `Autoplay` 插件，通过 `plugins` 传入：

```vue
<SCarousel :slides="slides" :options="{ loop: true }" :plugins="[Autoplay()]" />
```

### 如何自定义指示点（dots）？

使用 `control` 插槽，从插槽参数取 `scrollSnaps` 与 `selectedIndex` 自行渲染指示点，并可通过 `scrollTo` 跳转：

```vue
<template #control="{ scrollSnaps, selectedIndex, scrollTo }">
  <div v-for="(_, index) in scrollSnaps" :key="index" @click="scrollTo(index)" />
</template>
```

### 如何显示进度或页码？

`progress` 插槽参数为 0–100 的滚动进度（首屏为 0），可配合 `SProgress` 渲染；页码可用 `selectedIndex + 1` 与 `scrollSnaps.length` 计算（见 `06-progress`、`05-snap` 示例）。

### 如何让一次显示多张幻灯片？

通过 `ui` 覆盖 `item` 槽的 `basis`（如 `basis-1/2 md:basis-1/3`），并用 `options` 的 `align`/`containScroll` 控制吸附行为（见 `04-multi` 示例）。

### 如何本地化上一页/下一页按钮与区域名称？

按钮文本与区域 `aria-label` 回退跟随 ConfigProvider 的语言环境（`carousel.previous` / `carousel.next` / `carousel.ariaLabel`）；需要时用 `aria-label` 按实例覆盖。

### 如何用自定义内容替换默认按钮？

使用 `previous`/`next` 插槽或 `control` 插槽渲染自定义控件，插槽参数包含 `canScrollNext`/`canScrollPrev` 与 `scrollNext`/`scrollPrev`。
