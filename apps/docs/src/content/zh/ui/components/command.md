---
head:
  title: 命令面板
  description: 用于快速搜索与执行命令的命令面板组件。SCommand 是基于 Aria listbox 基础组件与 Fuse 模糊匹配构建的可搜索命令面板。它把过滤、分组条目聚合与默认条目组合逻辑委托给 Aria CommandCompact；UI 包装组件只注入样式。
---

# 命令面板

## 概述

用于快速搜索与执行命令的命令面板组件。`SCommand` 是基于 Aria listbox 基础组件与 Fuse 模糊匹配构建的可搜索命令面板。它把过滤、分组条目聚合与默认条目组合逻辑委托给 Aria `CommandCompact`；UI 包装组件只注入样式。

命令面板适合 ⌘K 式面板、可搜索菜单或内联类型过滤。普通操作菜单请用 `dropdown-menu`；紧凑单选列表请用 `select`。

## 用法

<UsageCode component="command" />

> `SCommand` 现在会把过滤、分组条目聚合与默认条目组合逻辑委托给 Aria `CommandCompact`。如果需要无样式、数据驱动的组合入口，可从 `@vean/aria/command` 直接导入 `CommandCompact`。

## 特性

- 🔎 模糊搜索 — 基于 Fuse 对 `label`/`groupLabel`/`description` 匹配，`fuseOptions` 可配置（threshold、`resultLimit`、空搜索全匹配）
- 🧩 Aria/样式分离 — `CommandCompact` 负责过滤、分组与条目组合；`SCommand` 只注入样式
- 📊 分组数据 — `items` 支持嵌套组 `items`（label/value/icon/description/disabled/separator）与扁平条目
- 🔍 条目描述 — `description` 在标签下方渲染为次级文本，并参与内置过滤
- 🚀 外部过滤 — `external-filter` 跳过内置模糊过滤，让 items 由外部引擎（如全文内容搜索）过滤与排序
- ⌨️ 键盘导航 — 完整 listbox roving focus（方向键）、选择与 `highlight`/`select` 事件
- 🏷️ 图标 + 快捷键 — 每项 `icon` 与 `shortcut`（渲染为 `Kbd`）
- 🧹 可清空 — `clearable` 显示尾部清空控件；`placeholder`/`emptyLabel` 本地化空态
- 🔒 禁用 — `disabled` 禁用输入并阻止选择
- ♿ 无障碍 — `role="listbox"`/`option`、带 `aria-label` 的列表、带标签的输入、`axe-core` 零违规

## 组件家族

- `SCommand`（样式层）— 入口包装组件；`commandVariants` 配方配合动态插槽转发
- `CommandCompact`（Aria）— 聚合组件；负责搜索、分组、过滤与默认条目组合
- `ListboxRoot`/`ListboxFilter`/`ListboxContent`/`ListboxGroup`/`ListboxGroupLabel`/`ListboxItem`（Aria）— 底层 listbox 基础组件
- `Kbd`（Aria）— 渲染条目 `shortcut`

## 演示

<PlaygroundGallery component="command" />

## API

<ComponentApi component="command" />

## 注意事项

### 架构与对标差异

`CommandCompact` 负责 Fuse 搜索、分组条目聚合与默认条目组合，底层 listbox 基础组件保持零样式，仅由 UI 包装组件注入 `commandVariants` 类。这与 cmdk/shadcn-ui 的 headless command 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供 select/autocomplete 而非专用命令面板；VeanUI 提供真正的 `⌘K` 式命令面板，带 Fuse 模糊搜索、分组数据、图标/快捷键与完整 listbox 键盘行为。

| 能力             | VeanUI | shadcn/ui (cmdk) | Ant Design | Element Plus | Mantine | Naive UI |
| :--------------- | :----: | :--------------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离    |   ✅   |        ✅        |     —      |      —       |    —    |    —     |
| 模糊搜索（Fuse） |   ✅   |        ✅        |     —      |      —       |    —    |    —     |
| 分组数据         |   ✅   |        ✅        |     ✅     |      ✅      |   ✅    |    ✅    |
| 图标 + 快捷键    |   ✅   |        ✅        |     —      |      —       |   ✅    |    —     |
| 键盘导航         |   ✅   |        ✅        |     ✅     |      ✅      |   ✅    |    ✅    |
| 空态             |   ✅   |        ✅        |     ✅     |      ✅      |   ✅    |    ✅    |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `searchTerm` 可用 `v-model:searchTerm` 控制；过滤由 Fuse 执行（默认 `threshold: 0.1`、`resultLimit: 12`、空搜索全匹配）。
- `items` 接受分组对象（嵌套 `items`）与扁平条目；`separator: true` 在组/条目后渲染分隔线。
- `shortcut` 渲染为 `Kbd`（如 `['command', 'h']`）；`icon` 渲染前导图标。
- `clearable` 显示尾部清空控件，重置 `searchTerm`；空态使用本地化 `command.noResults` 消息。
- 底层 listbox 处理键盘/roving focus；选择发出 `select` 与 `update:modelValue`。

### Roadmap

不适用——command 对当前对标集已功能完备。

## FAQ

### 如何构建命令面板？

传入 `items` 与 `placeholder`：

```vue
<SCommand
  placeholder="输入命令..."
  :items="[
    { label: '搜索 Emoji', value: 'emoji', icon: 'lucide:smile' },
    { label: '帮助', value: 'help', icon: 'lucide:help-circle', shortcut: ['command', 'h'] }
  ]"
  @select="onSelect"
/>
```

### 如何分组条目？

在分组对象下嵌套 `items` 并加 `separator`：

```vue
<SCommand
  :items="[
    {
      label: '建议',
      value: 'suggestions',
      separator: true,
      items: [{ label: '日历', value: 'calendar' }]
    }
  ]"
/>
```

### 如何控制搜索词？

用 `v-model:searchTerm` 绑定 `searchTerm` 并调整 `fuse-options`：

```vue
<SCommand v-model:searchTerm="query" :items="items" :fuse-options="{ threshold: 0.3 }" />
```

### 如何显示空态？

设置 `empty-label`（回退到本地化 `command.noResults`）：

```vue
<SCommand :items="items" empty-label="未找到结果" />
```

### 如何处理选择？

监听 `select` 与 `update:modelValue`：

```vue
<SCommand :items="items" @select="value => run(value)" />
```

### 如何显示条目描述？

给条目加 `description`——它会在标签下方渲染为次级文本，并参与内置模糊过滤：

```vue
<SCommand :items="[{ label: '日历', value: 'calendar', description: '日程管理视图' }]" />
```

### 如何用外部搜索引擎代替内置过滤？

设置 `external-filter`：跳过内置模糊过滤，`items` 原样渲染（保留你自己的排序）。`searchTerm` 仍通过 `v-model:searchTerm` / `update:searchTerm` 同步，供你驱动自己的搜索——例如全文内容搜索：

```vue
<SCommand v-model:searchTerm="query" external-filter :items="results" @select="open" />
```
