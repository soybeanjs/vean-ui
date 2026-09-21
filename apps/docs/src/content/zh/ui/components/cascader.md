---
head:
  title: 级联选择
  description: 用于从层级树数据中选择值的级联选择组件。它渲染多列联动面板，支持单选/多选、完整路径值模式、父子勾选状态联动、本地过滤与远程搜索、子级懒加载以及大数据量下的虚拟滚动。适用于选项按树形组织且需要逐级选择的场景；扁平选项列表请用 SSelect 或 SCombobox。
---

# 级联选择

## 概述

用于从层级树数据中选择值的级联选择组件。它渲染多列联动面板，支持单选/多选、完整路径值模式、父子勾选状态联动、本地过滤与远程搜索、子级懒加载以及大数据量下的虚拟滚动。适用于选项按树形组织且需要逐级选择的场景；扁平选项列表请用 `SSelect` 或 `SCombobox`。

## 用法

<UsageCode component="cascader" />

## 特性

- 🗂 多列联动面板——路径按层级逐列展开
- ☑️ 单选/多选，父子勾选状态级联（`showCheckedStrategy`：child / parent）
- 🛤 完整路径值模式（`pathMode`）——modelValue 携带完整值/标签路径
- ⏳ 数据加载——子级懒加载（`loadChildren`）、防抖远程搜索（`searchDelay`）、本地过滤（`filter`）与本地化空态
- 📜 每列内建虚拟滚动（`virtualScroll`，`itemSize` / `height` 可配）
- ⌨️ 完整键盘导航——方向键跨列移动、Enter 选择，另支持 click/hover 展开
- ♿ WAI-ARIA tree 语义——trigger `role="combobox"` + `aria-haspopup="tree"`、option `role="treeitem"`、打开态 axe 零违规
- 🎨 `cascaderVariants` 提供 16 个配方插槽与 7 个尺寸变体

## 演示

<PlaygroundGallery component="cascader" />

## API

<ComponentApi component="cascader" />

## 注意事项

### 架构与对标差异

VeanUI 以自研数据引擎（`useCascaderData`）实现级联选择，不复用 listbox 的 selection/collection 基座（其单选值 + 扁平列表模型不适合树形级联）：`shallowReactive` 节点树缓存 `pathValues` / `pathLabels` / `level` 使查找 O(1)，`menus` computed 计算可见列，级联勾选走 `setCheckedDeep` / `recomputeAncestors` / `collectCheckedNodes`。`CascaderOption` 通过可取消的自定义事件（`select` / `expand`）派发交互（对齐 reka-ui）。`scv()` 配方 `cascaderVariants` 声明 16 个插槽与 7 个尺寸变体。

| 能力                    | VeanUI | Ant Design `Cascader` | reka-ui `Cascader` | Element Plus `Cascader` |
| :---------------------- | :----: | :-------------------: | :----------------: | :---------------------: |
| Aria/styled 分离        |   ✅   |           —           |         ✅         |            —            |
| 多列面板                |   ✅   |          ✅           |         ✅         |           ✅            |
| 级联复选 + 半选状态     |   ✅   |          ✅           |         —          |           ✅            |
| 懒加载 / 远程搜索       |   ✅   |          ✅           |         ✅         |           ✅            |
| showCheckedStrategy     |   ✅   |          ✅           |         —          |            —            |
| pathMode（路径值）      |   ✅   |          ✅           |         —          |            —            |
| 虚拟滚动                |   ✅   |           —           |         —          |            —            |
| 可取消自定义事件        |   ✅   |           —           |         ✅         |            —            |
| locale 文案（非硬编码） |   ✅   |           —           |         —          |           ✅            |
| axe 零违规（打开态）    |   ✅   |           —           |         —          |            —            |

### 注意事项

- 内建文案全部本地化（`LocaleCascaderMessages`）；需要按实例覆盖时使用 `emptyLabel` / `clearLabel` 或对应 `aria-label` attrs。
- filterable 模式下 trigger 变为 `tabindex=-1`，焦点落在搜索输入框——键盘导航从搜索框开始。
- 搜索模式下点击非叶子节点仅高亮，不展开多列路径（与 AntD 存在交互差异）——如需要可自行展开。
- disabled 条目上的 `select` / `expand` 事件仍会触发（先派发后守卫）但不会改变 modelValue；消费方可自行判断。

## 常见问题

### 如何让值携带完整路径而非最后一级？

开启 `pathMode`，modelValue 将携带完整值/标签路径，而不只是最深节点。

### 如何从接口懒加载子级？

传入 `loadChildren` 返回节点的子级；引擎会跟踪加载状态并在完成后发出 `loaded` 事件。

### 如何做远程过滤？

使用 `searchDelay` 防抖并提供自定义 `filter` 实现（或直接传入已过滤的 `items`）；内置过滤在客户端按路径标签匹配。

### 如何只提交勾选的叶子？

配置 `showCheckedStrategy: 'child'`，父节点勾选时只收集叶子节点；`'parent'` 则提交父节点。
