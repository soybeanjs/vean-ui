---
head:
  title: 引导
  description: 按步骤突出显示页面元素并介绍产品功能，帮助用户熟悉操作。STour 由 Aria 层管理步骤和高亮区域，使用 Popper 定位气泡，并提供键盘操作与多语言文案。
---

# 引导

## 概述

`STour` 会在目标元素附近显示说明气泡，并突出显示该元素，帮助用户逐步了解产品功能。每一步都可以指定 CSS 选择器、元素或延迟获取目标的函数，并分别设置标题、说明和气泡位置。

通常可在 `<STour>` 内按顺序声明 `<STourStep>`，并直接把模板 ref 对应元素的 `$el` 传给 `target`。步骤来自动态数据时，也可以通过 `steps` 属性传入数组。

适用于简短的新手引导或工作流程介绍。若只需展示单条静态提示，可使用 `tooltip`；若只需呈现步骤进度，可使用 `stepper`。

## 用法

<UsageCode component="tour" />

## 特性

- 🎯 可通过 CSS 选择器、`HTMLElement`、`SVGElement` 或延迟解析函数指定引导目标
- 🧭 使用 Popper 定位并自动避让；每一步都可以单独设置气泡位置
- 🔢 使用 `v-model` 控制引导开关，使用从 `0` 开始的 `v-model:current` 控制当前步骤
- ✨ 切换步骤时，高亮区域会平滑移动到新目标；若系统设置了减少动态效果，动画会相应简化
- 🔔 触发 `change` 事件时会传出从 `0` 开始的当前步骤索引
- ⌨️ 按 Escape 可关闭引导；步骤导航使用原生按钮，支持键盘操作
- 📜 默认将当前目标滚动到视口内，可通过 `autoScroll` 关闭
- 🔒 引导打开时默认锁定页面滚动；设置 `:lock-scroll="false"` 可允许页面滚动
- 🌓 默认显示页面遮罩；可隐藏遮罩、调整目标高亮区域的留白和圆角，也可设置点击遮罩关闭
- 🎨 可按步骤控制遮罩、箭头和关闭按钮的显示；通过 `ui.mask` 类自定义遮罩颜色
- 🔘 默认以圆点显示步骤进度，也可通过 `indicators` 插槽自定义
- 🧭 支持 12 种标准位置；未指定目标时，气泡显示在视口中央
- 📜 可配置 `scrollIntoViewOptions`，也可关闭 Escape 关闭行为
- 📐 气泡默认宽 `520px`；目标高亮区域默认留白 `6px`、圆角 `2px`
- 🎨 设置 `type="primary"` 可使用主色强调气泡，无遮罩时也清晰醒目
- 🌐 按钮文案和步骤播报会随 `ConfigProvider` 的语言设置切换
- 🎨 支持六种尺寸，并可通过 `ui` 分别覆盖各插槽样式

## 组件

- `STour`：管理引导状态、目标高亮、气泡和步骤导航。
- `STourStep`：声明单个引导目标、内容及该步骤的配置。

## 演示

<PlaygroundGallery component="tour" />

## API

<ComponentApi component="tour" />

## 注意事项

### 实现方式与能力对比

Aria 层负责步骤状态、目标测量、键盘关闭行为和高亮区域计算；`STour` 负责外观并透传插槽。组件采用逻辑与样式分离的组合方式，同时内置目标解析和气泡定位能力。

| 能力                       | VeanUI 引导 | [Ant Design 引导](https://ant.design/components/tour/) | [Element Plus 引导](https://element-plus.org/en-US/component/tour) | [Mantine 引导](https://mantine.dev/core/tour/) |
| :------------------------- | :---------: | :----------------------------------------------------: | :----------------------------------------------------------------: | :--------------------------------------------: |
| 行为与样式分层             |     ✅      |                           —                            |                                 —                                  |                       —                        |
| 选择器、元素或解析函数目标 |     ✅      |                           ✅                           |                                 ✅                                 |                       ✅                       |
| 受控步骤                   |     ✅      |                           ✅                           |                                 ✅                                 |                       ✅                       |
| 每步单独设置位置           |     ✅      |                           ✅                           |                                 ✅                                 |                       ✅                       |
| 按区域定制样式             |     ✅      |                           ✅                           |                                部分                                |                       ✅                       |

### 使用须知

- 目标选择器或元素必须在对应步骤激活时存在；每次切换步骤时都会重新查询选择器。
- `v-model` 控制引导的显示状态；`v-model:current` 控制从 `0` 开始的当前步骤，因此第一步为 `0`。`v-model:open` 仍可作为显示状态的别名。
- 未指定 `target` 时，气泡显示在视口中央，遮罩不会挖空目标区域，适合欢迎语或结束提示。
- 气泡使用非模态对话框，不会锁定焦点。按 Escape 可关闭引导；遮罩会拦截高亮区域以外的指针操作。启用 `maskClosable` 后，点击遮罩也会关闭引导。
- `showMask` 默认开启。设置 `:show-mask="false"` 可保留气泡而不遮暗页面；可查看“遮罩配置”演示。
- 气泡默认宽 `520px`，在较窄的视口中会自动收窄。高亮区域与目标边缘默认间隔 `6px`、圆角为 `2px`，可分别通过 `spotlightPadding` 和 `spotlightRadius` 调整。
- 箭头尖端默认与目标间隔 `12px`，可通过 `positionerProps.sideOffset` 调整。
- 组件默认通过 Portal 将内容挂载到 `document.body`。如需使用其他容器，可通过 `portalProps` 配置。
- 默认会平滑滚动到当前目标。如果宿主应用自行管理滚动，可关闭 `autoScroll`。
- 引导打开期间默认锁定页面滚动；设置 `:lock-scroll="false"` 可允许用户滚动页面。
- `scrollIntoViewOptions` 接受 `ScrollIntoViewOptions` 对象或 `false`；也可以用 `:auto-scroll="false"` 快速关闭滚动。
- `closeOnPressEscape` 默认开启。若宿主应用自行处理 Escape，可将其设为 `false`。
- 每一步都可以单独设置 `showMask`、`showArrow` 或 `showClose`；未设置时沿用引导组件的默认值。

## 常见问题

### 如何开始引导？

用 `v-model` 绑定布尔值，并在自己的启动按钮中将其设为 `true`。组件本身不提供启动按钮。

### 可以把 Vue 模板 ref 用作目标吗？

可以。在 `<STour>` 内声明 `<STourStep>`，并把组件 ref 的 `$el` 传给 `target`：

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const profileButton = shallowRef<{ $el: HTMLButtonElement }>();
</script>

<template>
  <SButton @click="open = true">开始引导</SButton>
  <SButton ref="profileButton">个人资料</SButton>
  <STour v-model="open">
    <STourStep :target="profileButton?.$el" title="个人资料">
      <p>在这里管理个人资料。</p>
    </STourStep>
  </STour>
</template>
```

### 如何控制当前步骤？

用 `v-model:current` 控制当前步骤，索引从 `0` 开始，因此第一步为 `0`。

### 如何为某一步单独设置位置？

在对应步骤上设置 `placement`，即可单独调整该步的位置；未设置时沿用引导组件的默认位置。

### 如何只显示气泡而不显示遮罩？

设置 `:show-mask="false"`。气泡仍会根据目标定位；需要遮罩时将其设回 `true`，也可查看“遮罩配置”演示。

### 如何替换整个气泡内容？

使用 `content` 插槽。插槽参数包含当前步骤、当前步骤序号、总步数，以及 `previous`、`next`、`close` 操作。`STour` 的默认插槽专用于按顺序声明 `STourStep`。

### 如何自定义步骤指示器？

使用 `indicators` 插槽；参数 `current` 从 `0` 开始，`total` 表示步骤总数。默认指示器为圆点；即使自定义指示器，屏幕阅读器仍会收到本地化的步骤播报。

### 如何自定义遮罩颜色？

通过 `ui` 设置 `mask` 类名，例如 `:ui="{ mask: 'fill-primary/35' }"`。若只想在某一步隐藏遮罩，可将该步骤的 `showMask` 设为 `false`。

### `change` 事件的参数是什么？

事件参数是从 `0` 开始的步骤索引，与 `current` 及 Element Plus 一致。默认 `v-model` 用于控制引导的显示状态。

### 如何在无遮罩时突出引导气泡？

设置 `:show-mask="false"` 并使用 `type="primary"`。主色样式会同步调整文字、箭头和操作按钮的颜色，让气泡在无遮罩页面上也足够醒目。
