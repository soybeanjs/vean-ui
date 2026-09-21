---
head:
  title: 标签页
  description: 一组分层的内容区块——即标签面板——一次只显示一个。
---

# 标签页

## 概述

一组分层的内容区块——即标签面板——一次只显示一个。

## 特性

- **WAI-ARIA 标签页模式** — 列表渲染为 `tablist`，触发器为 `role="tab"`，面板为 `role="tabpanel"`；活动标签带 `aria-selected`，每个触发器通过 `aria-controls`/`aria-labelledby` 关联面板，`aria-orientation` 反映布局方向。
- **数据驱动的 Compact 组合** — `STabs` 将条目迭代、默认触发器/内容组合与指示器渲染委托给泛型 Aria `TabsCompact<T>`，由它负责每个条目的 ARIA 接线。
- **受控/非受控状态** — `modelValue` 支持 `v-model`（受控）；`defaultValue` 提供非受控用法，底层基于 `useControllableState`。
- **两种激活模式** — `activationMode: 'automatic'` 在聚焦时激活标签（ARIA 默认）；`'manual'` 仅在点击 / `Enter` / `Space` 时激活。
- **完整键盘导航** — `useRovingFocusGroup` 提供方向键（与 Home/End）移动并跳过禁用标签；`Enter` / `Space` 激活聚焦的标签。
- **基于 Presence 的内容挂载** — `unmountOnHide: true`（默认）在退出动画后卸载非活动面板；`false` 保持所有面板挂载但带 `hidden` 属性；`forceMount` 无条件将面板保留在 DOM 中。
- **动画指示器** — 滑动指示器通过 CSS 变量（`--vean-tabs-indicator-size` / `--vean-tabs-indicator-position`）追踪活动标签，由 `ResizeObserver` 测量并在值/方向变化时重新定位；RTL 偏移自动镜像。
- **水平与垂直布局** — `orientation: 'vertical'` 纵向堆叠列表并让指示器沿块轴移动。
- **三个自定义插槽** — `trigger`（scoped `{ ...item, active }`）、`content`（scoped `{ ...item, active }`）与 `indicator`。
- **六种视觉变体** — `size`（xs…2xl）、`orientation`（horizontal / vertical）、`shape`（square / rounded）、`fill`（full / auto）与 `enableIndicator`（回退为实心活动触发器样式），通过 `tabsVariants` 的 `scv()` 配方应用。
- **Aria 组合** — `TabsRoot` / `TabsList` / `TabsTrigger` / `TabsContent` / `TabsIndicator` / `TabsCompact` 均可从 `@vean/aria/tabs` 导入，用于完全自定义样式构建。

## 用法

<UsageCode component="tabs" />

> `STabs` 现在将条目迭代、默认触发器/内容组合与指示器渲染委托给 Aria 的 `TabsCompact`。如需无样式、数据驱动的用法，请从 `@vean/aria/tabs` 导入 `TabsCompact`。

## 演示

<PlaygroundGallery component="tabs" />

## API

<ComponentApi component="tabs" />

## 备注

### 架构与竞品对比

| 关注点                           | VeanUI                                          | shadcn-vue / Radix `Tabs`          | Ant Design `Tabs`                   | Element Plus `Tabs` |
| :------------------------------- | :---------------------------------------------- | :--------------------------------- | :---------------------------------- | :------------------ |
| Aria / 样式双层分离              | ✅ `@vean/aria/tabs` + `scv()`                  | ✅ Aria 原语                       | ❌ 单一包                           | ❌ 单一包           |
| 数据驱动 Compact API             | ✅ 泛型 `TabsCompact<T>` + `items`              | ✅ `TabList`/`Tab`/`TabPanel` 部件 | ✅ 配置驱动（items）                | ✅ 配置驱动         |
| 受控/非受控                      | ✅ `modelValue` / `defaultValue`                | ✅ `modelValue` / `defaultValue`   | ✅ `activeKey` / `defaultActiveKey` | ✅ `v-model`        |
| 激活模式                         | ✅ `automatic` / `manual`                       | ✅                                 | ❌（始终自动）                      | ❌（始终自动）      |
| 键盘导航                         | ✅ roving focus（方向键/Home/End）+ Enter/Space | ✅ roving focus                    | ✅ 方向键 / Home / End              | ✅ 方向键           |
| 禁用标签跳过                     | ✅ roving focus 跳过禁用条目                    | ✅                                 | ✅                                  | ✅                  |
| Presence / forceMount 内容       | ✅ `unmountOnHide` + `forceMount` + 退出动画    | ✅ `forceMount`                    | ❌                                  | ❌                  |
| 动画指示器                       | ✅ CSS 变量 + ResizeObserver + RTL 镜像         | ❌（无内置指示器）                 | ✅ ink bar（line 类型）             | ❌                  |
| 水平 + 垂直                      | ✅ `orientation`                                | ✅                                 | ✅ `tabPosition`                    | ✅ `tab-position`   |
| 变体系统                         | ✅ size × orientation × shape × fill            | ❌（自行定制样式）                 | ✅ type / size / tabBarGutter       | ✅ type / size      |
| 自定义插槽                       | ✅ `trigger` / `content` / `indicator`          | ✅ 部件级                          | ✅ `label` / `children`             | ✅ `label` / `icon` |
| ARIA 接线（controls/labelledby） | ✅ 每项自动接线                                 | ✅ 自动                            | ✅                                  | ✅                  |

### 运行时注意事项

1. **聚焦激活** — `activationMode: 'automatic'`（默认）下，通过键盘聚焦标签（或 `ArrowRight`/`ArrowLeft`）即激活；`'manual'` 下仅点击或按 `Enter`/`Space` 激活。
2. **指示器测量** — 指示器在列表 ref 挂载后、值/方向变化时与尺寸变化时对活动触发器定位；仅在首次成功测量后渲染。
3. **RTL 定位** — `dir: 'rtl'` 下指示器偏移被镜像（`list.clientWidth - offsetLeft - offsetWidth`），CSS `rtl:-translate-x-…` 翻转位移，指示器始终锚定活动标签。
4. **内容 Presence** — `unmountOnHide: true` 时非活动面板内容在退出动画后移除；`false` 时保持挂载但带 `hidden` 属性；`forceMount` 将面板保留在 DOM 中，非活动面板仍受 `hidden` 约束。
5. **受控与非受控** — 提供了 `modelValue` 时，内部写入只发出 `update:modelValue`；DOM 跟随 prop，外部变更自动重新渲染。
6. **禁用标签** — 禁用触发器仅保留 roving focus 所需的可聚焦性（`data-disabled`，非原生 `disabled` 属性），以便方向键跳过；`mousedown` 与键盘激活被阻止。
7. **ARIA id** — 触发器与面板通过确定性 id 关联（`soybean-tabs-trigger-{value}` / `soybean-tabs-content-{value}`）；`aria-controls` 仅在对应面板注册自身后输出。

## FAQ

### 如何从自动激活切换到手动激活？

设置 `activationMode="manual"`。手动模式下聚焦标签不再激活；用户通过点击或按 `Enter`/`Space` 激活。这符合面板渲染较慢场景下的 WAI-ARIA 标签页模式。

### 为什么指示器没有立即出现？

指示器需要对活动触发器进行首次测量（偏移 + 尺寸）。它在列表元素挂载或值变化后立即渲染。真实浏览器中 `ResizeObserver` 通知也会触发重新测量，保证尺寸变化时保持对齐。

### `unmountOnHide` 控制什么？

`true`（默认）时，切换标签会在退出动画后从 DOM 移除非活动面板内容——利于性能。`false` 时所有面板保持挂载，但非活动面板带 `hidden`——利于保留状态（滚动位置、表单输入）。

### 键盘导航是如何处理的？

列表是 roving-focus 组：`ArrowLeft`/`ArrowRight`（垂直模式为 `ArrowUp`/`ArrowDown`）移动焦点，`Home`/`End` 跳到第一个/最后一个标签，禁用标签被跳过，`Enter`/`Space` 激活聚焦的标签。

### 能完全自定义标签渲染吗？

可以——`trigger` 插槽接收 scoped `{ ...item, active }`，`content` 插槽接收 `{ ...item, active }`，`indicator` 替换指示器内容。如需完全自定义结构，可从 `@vean/aria/tabs` 组合 `TabsRoot` / `TabsList` / `TabsTrigger` / `TabsContent` / `TabsIndicator`，并通过 `provideTabsUi`（或 `STabs` 的 `ui` prop）注入样式。

### 需要自己接线 `aria-controls` 吗？

不需要。每个触发器在面板挂载后自动将 `aria-controls` 指向其面板 id（`soybean-tabs-content-{value}`），每个面板也通过 `aria-labelledby` 指回触发器——条目增删时两者保持同步。
