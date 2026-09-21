---
head:
  title: 右键菜单
  description: 在指针位置显示的菜单，通过右键触发。SContextMenu 是基于共享 Aria menu 基础组件构建的数据驱动菜单，经 contextmenu 事件在指针位置打开（触屏上也可长按，经 pressOpenDelay）。家族还提供复选（SContextMenuCheckbox）、单选（SContextMenuRadio）与自定义（SContextMenuWrapper）变体。
---

# 右键菜单

## 概述

在指针位置显示的菜单，通过右键触发。`SContextMenu` 是基于共享 Aria menu 基础组件构建的数据驱动菜单，经 `contextmenu` 事件在指针位置打开（触屏上也可长按，经 `pressOpenDelay`）。家族还提供复选（`SContextMenuCheckbox`）、单选（`SContextMenuRadio`）与自定义（`SContextMenuWrapper`）变体。

右键菜单适合指针相关的操作（文件、画布、树节点）。按钮触发的菜单请用 `dropdown-menu`；丰富的悬停预览请用 `hover-card`。

## 用法

<UsageCode component="context-menu" />

## 特性

- 🖱️ 右键触发 — 经 `contextmenu` 事件在指针位置打开；`event.preventDefault()` 阻止原生菜单
- 📱 长按触发 — `pressOpenDelay`（默认 700ms）在触屏/触控笔上长按打开
- 🧩 基于 Aria menu — 构建于共享 menu 基础组件，带完整键盘导航、类型过滤与 roving focus
- 📊 数据驱动 — 传入 `items`（含 `value`/`label`/`icon`/`disabled`/`hidden`/`separator`…）或使用条目插槽
- 🙈 隐藏项 — 条目标记 `hidden` 后（连同整棵子树）不会出现在菜单中
- ☑️ 复选 / 🔘 单选变体 — `SContextMenuCheckbox`/`SContextMenuRadio` 用于可选择的菜单
- 🧩 自定义变体 — `SContextMenuWrapper` 用于完全自定义菜单内容
- 🎭 模态 — `modal` 控制外部指针拦截与焦点陷阱
- ♿ 无障碍 — `role="menu"`/`menuitem`、复选/单选 `aria-checked`、`axe-core` 零违规

## 组件家族

- `SContextMenu`（样式层）— 数据驱动菜单；转发至 `ContextMenuCompact`
- `SContextMenuCheckbox` / `SContextMenuRadio`（样式层）— 带 `v-model` 的可选择菜单
- `SContextMenuWrapper`（样式层）— 自定义内容菜单
- `ContextMenuCompact` / `ContextMenuWrapperCompact` / `ContextMenuCheckboxCompact` / `ContextMenuRadioCompact`（Aria）— 聚合组件
- `ContextMenuRoot` / `ContextMenuTrigger` / `ContextMenuContent`（Aria）— 指针锚定的触发器与菜单表面
- `MenuOptions`/`MenuItem`/…（Aria）— 共享 menu 基础组件

## 演示

<PlaygroundGallery component="context-menu" />

## API

<ComponentApi component="context-menu" />

## 注意事项

### 架构与对标差异

右键菜单家族在指针锚定的 popover portal 内组合共享 `menu` 基础组件；UI 包装组件只注入共享 `menuVariants` 类（经 `provideMenuUi`）并转发 prop/插槽。这与 radix-ui/shadcn-ui 的 headless menu 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供单一样式化右键菜单（或复用其下拉的 `trigger="contextmenu"`）；VeanUI 额外提供复选/单选/自定义变体、`size` 尺寸体系，以及经共享 menu 层的完整键盘/类型过滤行为。

| 能力            | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :-------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| 指针定位        |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |
| 右键触发        |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |
| 长按（触屏）    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 复选 / 单选     |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| 键盘 + 类型过滤 |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 尺寸（6）       |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 菜单经 `contextmenu` 在指针位置打开；`pressOpenDelay` 控制触屏长按（默认 700ms）。
- `SContextMenu` 默认 `modal`（`true`）；传 `modal={false}` 获得轻量菜单。
- `items` 为数据驱动；用对应条目插槽（`item`、`item-leading`、`item-trailing`）自定义渲染。
- 复选/单选变体用 `v-model` 绑定选择；单选期望单一值，复选期望数组。
- 菜单经 portal 在指针位置渲染；右键时 `event.preventDefault()` 抑制浏览器原生菜单。

### Roadmap

不适用——context-menu 对当前对标集已功能完备。

## FAQ

### 如何构建基础右键菜单？

传入 `items` 并包裹一个触发区域：

```vue
<SContextMenu
  :items="[
    { value: 'copy', label: '复制' },
    { value: 'paste', label: '粘贴' },
    { type: 'separator' },
    { value: 'delete', label: '删除', disabled: true }
  ]"
>
  <div class="target">在此右键</div>
</SContextMenu>
```

### 如何在触屏上长按打开？

调整 `press-open-delay`：

```vue
<SContextMenu :press-open-delay="500" :items="items">
  <div class="target">长按打开</div>
</SContextMenu>
```

### 如何使用复选/单选变体？

使用带 `v-model` 的 `SContextMenuCheckbox`/`SContextMenuRadio`：

```vue
<SContextMenuCheckbox v-model="selected" :items="items">
  <div class="target">右键</div>
</SContextMenuCheckbox>
```

### 如何构建自定义菜单？

使用 `SContextMenuWrapper` 与 `MenuItem`：

```vue
<SContextMenuWrapper>
  <div class="target">右键</div>
  <MenuItem value="a">条目 A</MenuItem>
  <MenuItem value="b">条目 B</MenuItem>
</SContextMenuWrapper>
```
