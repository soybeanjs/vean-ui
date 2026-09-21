---
head:
  title: 下拉菜单
  description: 由按钮触发向用户展示的菜单，例如一组操作或功能入口。SDropdownMenu 是基于 Aria menu 基础组件（MenuOptions/MenuItem/…）构建的数据驱动菜单，经共享 popover portal 渲染。家族还提供复选（SDropdownMenuCheckbox，多选）、单选（SDropdownMenuRadio，单选）与自定义（SDropdownMenuWrapper）变体。
---

# 下拉菜单

## 概述

由按钮触发向用户展示的菜单，例如一组操作或功能入口。`SDropdownMenu` 是基于 Aria menu 基础组件（`MenuOptions`/`MenuItem`/…）构建的数据驱动菜单，经共享 popover portal 渲染。家族还提供复选（`SDropdownMenuCheckbox`，多选）、单选（`SDropdownMenuRadio`，单选）与自定义（`SDropdownMenuWrapper`）变体。

下拉菜单适合紧凑的操作菜单。导航菜单请用 `nav-menu`；丰富的悬停预览请用 `hover-card`。

## 用法

<UsageCode component="dropdown-menu" />

## 特性

- 🧩 基于 Aria menu — 构建于共享 menu 基础组件，带完整键盘导航（方向键/Home/End/PageUp/PageDown）、类型过滤与 roving focus
- 🖱️ 触发模式 — `trigger="click"` 或 `"hover"`；`delayDuration`/`skipDelayDuration` 调节悬停延迟
- 📊 数据驱动 — 传入 `items`（含 `value`/`label`/`icon`/`disabled`/`hidden`/`separator`…）或使用条目插槽
- ☑️ 复选变体 — `SDropdownMenuCheckbox` 用 `v-model` 实现多选
- 🔘 单选变体 — `SDropdownMenuRadio` 用 `v-model` 实现单选
- 🧩 自定义变体 — `SDropdownMenuWrapper` 用于完全自定义菜单内容
- 🎯 定位 — popper `placement` + `showArrow`
- 🎭 模态 — `modal` 控制外部指针拦截与焦点陷阱
- 🪜 子菜单 — 嵌套子菜单，按侧打开/关闭键（RTL 感知）
- 🙈 隐藏项 — 条目标记 `hidden` 后（连同整棵子树）不会出现在菜单中
- ♿ 无障碍 — `role="menu"`/`menuitem`、复选/单选 `aria-checked`、`axe-core` 零违规

## 组件家族

- `SDropdownMenu`（样式层）— 数据驱动菜单；转发至 `DropdownMenuCompact`
- `SDropdownMenuCheckbox`（样式层）— 带 `v-model` 的多选菜单
- `SDropdownMenuRadio`（样式层）— 带 `v-model` 的单选菜单
- `SDropdownMenuWrapper`（样式层）— 自定义内容菜单
- `DropdownMenuCompact` / `DropdownMenuWrapperCompact` / `DropdownMenuCheckboxCompact` / `DropdownMenuRadioCompact`（Aria）— 聚合组件
- `MenuOptions`/`MenuItem`/…（Aria）— 共享 menu 基础组件（roving focus、键盘导航、子菜单）

## 演示

<PlaygroundGallery component="dropdown-menu" />

## API

<ComponentApi component="dropdown-menu" />

## 注意事项

### 架构与对标差异

下拉菜单家族在 popover portal 内组合共享 `menu` 基础组件（`MenuOptions`/`MenuItem`）；UI 包装组件只注入共享 `menuVariants` 类（经 `provideMenuUi`）并转发 prop/插槽。这与 radix-ui/shadcn-ui 的 headless menu 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供带 `items`/`onSelect` prop 的单一样式化下拉；VeanUI 额外提供专用复选/单选/自定义变体、`size` 尺寸体系，以及经共享 menu 层的完整键盘/类型过滤行为。

| 能力             | VeanUI | shadcn/ui | Ant Design Dropdown | Element Plus Dropdown | Mantine Menu | Naive UI Dropdown |
| :--------------- | :----: | :-------: | :-----------------: | :-------------------: | :----------: | :---------------: |
| Aria/样式分离    |   ✅   |    ✅     |          —          |           —           |      —       |         —         |
| 数据驱动条目     |   ✅   |    ✅     |         ✅          |          ✅           |      ✅      |        ✅         |
| 复选 / 单选      |   ✅   |    ✅     |          —          |           —           |      ✅      |         —         |
| 触发 click/hover |   ✅   |    ✅     |         ✅          |          ✅           |      ✅      |        ✅         |
| 键盘 + 类型过滤  |   ✅   |    ✅     |          —          |           —           |      —       |         —         |
| 子菜单           |   ✅   |    ✅     |         ✅          |          ✅           |      ✅      |        ✅         |
| 尺寸（6）        |   ✅   |     —     |          —          |           —           |      —       |         —         |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `SDropdownMenu` 默认 `modal`（`true`）；传 `modal={false}` 获得轻量、非阻塞菜单。
- `trigger` 接受 `"click"`（默认）或 `"hover"`；悬停时调节 `delayDuration`（打开）与 `skipDelayDuration`（触发间隔）。
- `items` 为数据驱动；用对应条目插槽（`item`、`item-leading`、`item-trailing`）自定义渲染。
- 复选/单选变体用 `v-model` 绑定选择；单选期望单一值，复选期望数组。
- 菜单经 portal 渲染；仅在 `portalProps: { disabled: true }` 时置于相对定位的祖先内。

### Roadmap

不适用——dropdown-menu 对当前对标集已功能完备。

## FAQ

### 如何构建基础操作菜单？

传入 `items` 与 `trigger` 插槽：

```vue
<SDropdownMenu
  :items="[
    { value: 'edit', label: '编辑' },
    { value: 'delete', label: '删除', disabled: true }
  ]"
>
  <template #trigger><SButton>操作</SButton></template>
</SDropdownMenu>
```

### 如何使用复选（多选）变体？

使用带 `v-model` 的 `SDropdownMenuCheckbox`：

```vue
<SDropdownMenuCheckbox v-model="selected" :items="items">
  <template #trigger><SButton>筛选</SButton></template>
</SDropdownMenuCheckbox>
```

### 如何使用单选变体？

使用带 `v-model` 的 `SDropdownMenuRadio`：

```vue
<SDropdownMenuRadio v-model="sort" :items="sortOptions">
  <template #trigger><SButton>排序</SButton></template>
</SDropdownMenuRadio>
```

### 如何构建完全自定义的菜单？

使用 `SDropdownMenuWrapper` 并用 `MenuItem` 填充默认插槽：

```vue
<SDropdownMenuWrapper>
  <template #trigger><SButton>打开</SButton></template>
  <MenuItem value="a">条目 A</MenuItem>
  <MenuItem value="b">条目 B</MenuItem>
</SDropdownMenuWrapper>
```

### 如何在悬停时打开？

设置 `trigger="hover"` 并调整延迟：

```vue
<SDropdownMenu trigger="hover" :delay-duration="100" :items="items">
  <template #trigger><SButton>悬停</SButton></template>
</SDropdownMenu>
```
