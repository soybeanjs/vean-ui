---
head:
  title: 自动完成
  description: 用于根据输入内容筛选建议项并快速填充文本的自动完成组件。输入即打开，基于 Fuse 模糊搜索匹配选项，支持分组、可清空输入与数据驱动的 compact API。适用于让用户输入关键词获得自由文本建议的场景；选项来自固定列表时优先用 SSelect；选项来自已知集合且需要输入过滤时，SCombobox 是更接近的同类组件。
---

# 自动完成

## 概述

用于根据输入内容筛选建议项并快速填充文本的自动完成组件。输入即打开，基于 Fuse 模糊搜索匹配选项，支持分组、可清空输入与数据驱动的 compact API。适用于让用户输入关键词获得自由文本建议的场景；选项来自固定列表时优先用 `SSelect`；选项来自已知集合且需要输入过滤时，`SCombobox` 是更接近的同类组件。

## 用法

<UsageCode component="autocomplete" />

## 特性

- 🔍 输入即打开，基于 Fuse 模糊搜索（`threshold: 0.3`，匹配 `label` / `value` / `keywords` / `groupLabel`）
- ⌨️ 完整键盘导航——ArrowDown/Up/Home/End 打开与移动、Enter/Space 选择、typeahead、Escape 关闭
- 🗂 分组，支持组标签、分隔符与空态（无匹配 / 空数据）
- 🧹 可清空输入（`clearable` → `clearLabel` / `resetModelValueOnClear`）
- 🎛 `openOnFocus` / `openOnClick` 双打开策略，支持受控 `v-model:open`
- 📊 数据驱动 `AutocompleteCompact` API——`items` / `labelField` + 分组
- ♿ 遵循 WAI-ARIA combobox 模式——`role="combobox"` / `listbox` / `option`、`aria-activedescendant`、打开态 axe 零违规
- 🎨 `autocompleteVariants` 提供 17 个配方插槽与 7 个尺寸变体

## 演示

<PlaygroundGallery component="autocomplete" />

## API

<ComponentApi component="autocomplete" />

## 注意事项

### 架构与对标差异

VeanUI 通过复用 combobox 组件族（Anchor/Content/Item/Viewport/Trigger/Empty/Cancel，全部基于 listbox 基座 + Popper 定位）构建自动完成。`AutocompleteRoot` 关闭 combobox 内置过滤（`ignoreFilter`），把匹配委托给 compact 层的 `useFuse`，使 autocomplete 与 combobox 共享同一套交互内核，仅过滤与展示策略不同。`scv()` 配方 `autocompleteVariants` 声明 17 个插槽与 7 个尺寸变体。

| 能力                          | VeanUI | reka-ui `Combobox` | Algolia Autocomplete | Ant Design `AutoComplete` |
| :---------------------------- | :----: | :----------------: | :------------------: | :-----------------------: |
| Aria/styled 分离              |   ✅   |         ✅         |          —           |             —             |
| 输入即过滤 + 模糊匹配         |   ✅   |         —          |          ✅          |            ✅             |
| combobox/listbox 角色         |   ✅   |         ✅         |          ✅          |            ✅             |
| 键盘导航 + typeahead          |   ✅   |         ✅         |          ✅          |            ✅             |
| 分组 + 组标签                 |   ✅   |         ✅         |          —           |             —             |
| `openOnFocus` / `openOnClick` |   ✅   |         —          |          ✅          |            ✅             |
| 清空按钮 + 空态               |   ✅   |         ✅         |          —           |            ✅             |
| 数据驱动 Compact API          |   ✅   |         —          |          —           |             —             |
| axe 零违规（打开态）          |   ✅   |         —          |          —           |             —             |

### 注意事项

- 过滤在客户端以 Fuse 完成；远程建议需自行传入已过滤的 `items` 或对输入做防抖。
- 焦点移到清空按钮时弹出层保持打开（blur 圈闭判定覆盖整个 anchor 区域），仅当焦点真正离开组件时才关闭——这是已修复的回归行为，不要改回只判 trigger 的旧逻辑。
- 根节点 `disabled` 时所有条目都不可选——包括自带 `disabled` 的条目（统一 `rootDisabled || item.disabled` 守卫）。
- viewport（`role="listbox"`）默认注入本地化的 `aria-label`；可通过 `viewportProps['aria-label']` 覆盖。

## 常见问题

### 如何在不输入时也显示建议？

使用 `openOnFocus` 让输入框聚焦即打开弹出层，`openOnClick` 让点击输入框时打开。

### 如何调节模糊匹配的宽松程度？

传入 `fuseOptions` 调优 Fuse 搜索——例如调高 `threshold` 放宽匹配，或用 `keys` 限定参与匹配的字段。

### `SAutocomplete`、`SCombobox` 与 `SSelect` 有什么区别？

`SAutocomplete` 对自由文本做模糊匹配建议（Fuse）；`SCombobox` 对已知选项列表做输入过滤；`SSelect` 由触发器驱动、仅支持 typeahead、无文本输入。

### 如何清空输入并重置模型值？

传入 `clearable`。`resetModelValueOnClear` 决定清除时是否同时发出空 `modelValue`，还是仅重置搜索词。
