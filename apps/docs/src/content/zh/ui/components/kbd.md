---
head:
  title: 键盘按键
  description: 'SKbd 组件用于表示键盘输入元素，通常用于展示快捷键和组合键。它包裹原生 <kbd> 元素，并可选地将键名符号化（如 shift → ⇧、enter → ↵），修饰键（meta、alt、ctrl）会根据平台自动解析。'
---

# 键盘按键

## 概述

`SKbd` 组件用于表示键盘输入元素，通常用于展示快捷键和组合键。它包裹原生 `<kbd>` 元素，并可选地将键名符号化（如 `shift` → `⇧`、`enter` → `↵`），修饰键（`meta`、`alt`、`ctrl`）会根据平台自动解析。

适用于在 tooltip、帮助对话框或内联文档中展示 `⌘K`、`Ctrl+S` 等快捷键。

## 用法

<UsageCode component="kbd" />

## 功能

- ⌨️ **符号化** — 自动将已知键名（`shift`、`enter`、`tab`、方向键等）转换为 Unicode 符号。
- 🖥️ **平台感知修饰键** — `meta`、`alt`、`ctrl` 根据用户系统解析为正确符号（macOS 为 `⌘`/`⌥`/`⌃`，Windows 为 `⊞`/`alt`/`ctrl`）。
- 🎨 **变体** — `solid`、`outline`（默认）、`ghost` 三种视觉样式。
- 📐 **尺寸缩放** — 六档尺寸（`xs`–`2xl`）控制高度、最小宽度与字号。
- 🌡️ **凸起效果** — 可选 `raised` prop 添加 2px 阴影，呈现按键帽的触感外观。
- 🔗 **组合键** — 当 `value` 为数组时，`data-group` 属性启用字间距以提升可读性。
- ♿ **语义化** — 使用原生 `<kbd>` 元素，天然对屏幕阅读器友好。
- 🌐 **暗色模式** — 使用语义化颜色 token，自动适配暗色主题。

## 演示

<PlaygroundGallery component="kbd" />

## API

<ComponentApi component="kbd" />

## 注意事项

### 架构与对标差异

VeanUI 将 `Kbd` 拆分为 Aria 层（`@vean/aria/kbd`，负责 `<kbd>` 元素、符号化逻辑（`useKbd` 组合式函数）、`data-group` 状态）与 styled 层（`@vean/ui`，负责 `cv()` 变体配方（size/variant/raised））。这与 shadcn/ui 的 headless/styled 分离一致。`useKbd` 是 `createSharedComposable` 单例，通过 `navigator.userAgent` 检测 macOS。

| 维度     | VeanUI                                                 | shadcn/ui `Kbd` | Mantine `Kbd` | Ant Design |
| :------- | :----------------------------------------------------- | :-------------- | :------------ | :--------- |
| 架构     | Aria + styled 分离                                     | 仅 styled       | 仅 styled     | —          |
| 符号化   | `useKbd` 组合式函数；20 个键符号 + 平台感知修饰键      | —               | —             | —          |
| 平台感知 | 通过 `navigator.userAgent` 解析 macOS / Windows 修饰键 | —               | —             | —          |
| 变体     | `solid` / `outline` / `ghost`                          | —               | —             | —          |
| 尺寸缩放 | `xs`–`2xl`                                             | `sm`–`lg`       | `xs`–`xl`     | —          |
| 凸起效果 | `raised` prop（2px 阴影）                              | —               | —             | —          |
| 组合键   | `data-group` + 字间距                                  | —               | —             | —          |

### 运行时注意事项

- **平台检测**：`useKbd` 在 `onMounted` 中通过 `navigator.userAgent` 检测 macOS。SSR 时修饰键（`meta`、`alt`、`ctrl`）渲染为空格占位符，客户端水合后更新为正确符号。这可能导致修饰键的水合不匹配警告；Vue 会在挂载时解决。非修饰键（如 `shift` → `⇧`、`enter` → `↵`）为静态值，SSR 安全。
- **大小写敏感**：`KbdKey` 中的已知键名为小写（`shift`、`enter`、`tab`）。传入大写字符串如 `Shift` 不会匹配符号表，将回退为 `SHIFT`（大写）。符号化时请始终使用小写键名。
- **单例组合式函数**：`useKbd` 是 `createSharedComposable` — 平台检测仅运行一次并在所有 `SKbd` 实例间共享，避免重复的 `navigator` 检查。

### 常见问题

**如何显示 `Ctrl+K` 这样的组合键？**
传入数组：`<SKbd :value="['ctrl', 'K']" />`。组件会将符号化后的值拼接，并添加 `data-group` 启用字间距。macOS 上 `ctrl` 解析为 `⌃`，输出为 `⌃K`。

**如何禁用符号化？**
将 `symbolize` 设为 `false`：`<SKbd value="shift" :symbolize="false" />` 渲染原始文本 `shift` 而非 `⇧`。

**为什么修饰键在服务端显示为空格？**
`meta`、`alt`、`ctrl` 需要平台检测（`navigator.userAgent`），仅在浏览器中运行。SSR 时渲染空格占位符，水合后更新为正确符号（`⌘`、`⌥`、`⌃`）。可使用非修饰键，或接受修饰键的水合更新。

**如何完全自定义内容？**
使用默认插槽：`<SKbd><span class="my-style">⌘P</span></SKbd>`。插槽会完全替代 `value` prop。
