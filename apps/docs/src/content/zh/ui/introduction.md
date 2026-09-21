---
head:
  title: 介绍
  description: VeanUI 是一个优雅、现代、可访问且高质量的 UI 组件系统，专为 Vue 3 设计。它支持两种分发模式 — 作为传统的 npm 包安装，或通过 vean CLI 将源码直接复制到你的项目中（shadcn 风格）。构建在强大的 Aria 基础之上，提供了一套全面、可访问、可定制且高性能的组件，帮助开发者快速构建现代化的 Web 应用。
---

# 介绍

VeanUI 是一个优雅、现代、可访问且高质量的 UI 组件系统，专为 Vue 3 设计。它支持**两种分发模式** — 作为传统的 npm 包安装，或通过 `vean` CLI 将源码直接复制到你的项目中（shadcn 风格）。构建在强大的 Aria 基础之上，提供了一套全面、可访问、可定制且高性能的组件，帮助开发者快速构建现代化的 Web 应用。

## 两种使用方式

VeanUI 让你自由选择组件在项目中的存在方式：

### npm 包 — 快速集成

将 `@vean/ui` 作为依赖安装，几分钟即可上手。通过 `unplugin-vue-components` 自动导入、Tree-shaking 优化体积，以及包管理器无缝升级。这是大多数项目的推荐方式。

```bash
pnpm add @vean/ui
```

### CLI · 复制粘贴 — 完全掌控源码

想要完全拥有源码？使用 `vean` CLI 将组件直接复制到你的项目中。可编辑任何文件，完全自定义 — 代码属于你。随时通过 `vean diff` 查看上游更新并按需合并。

```bash
npx @vean/cli@latest init
npx @vean/cli@latest add button
```

查看[安装指南](/overview/installation)了解详细对比，或直接跳转到 [CLI 文档](/cli)。

## 为什么选择 Vean？

### 🎨 优雅的设计

VeanUI 采用现代化的设计语言，组件外观精美，交互流畅。每个组件都经过精心设计，确保在不同场景下都能提供出色的用户体验。

### ♿ 可访问性优先

所有组件都严格遵循 WAI-ARIA 设计模式，确保残障用户也能轻松使用。键盘导航、屏幕阅读器支持、焦点管理以及 RTL 方向适配等能力都已内置，开发者只需通过配置即可启用。

### 🏗️ 灵活的架构

VeanUI 采用 Aria 架构，将逻辑层和表现层完全分离。这意味着你可以：

- **使用现成的样式组件**：直接使用 `@vean/ui`，开箱即用
- **自定义样式**：使用 `@vean/aria` 构建完全属于自己的设计系统
- **混合使用**：在同一个项目中同时使用两种方式

### 🎯 类型安全

完全使用 TypeScript 编写，提供完整的类型定义和智能提示，让开发过程更加高效和可靠。

### 🎨 高度可定制

基于 UnoCSS 和 `@soybeanjs/cva` 构建，支持灵活的主题定制。你可以轻松修改颜色、尺寸、圆角等样式属性，打造符合品牌特色的界面。

### 📦 轻量级

所有组件都支持 Tree-shaking，只打包你实际使用的代码，确保最终产物体积最小化。

## 架构设计

VeanUI 的组件运行时采用严格的 **双层分离** 架构模型。下图中的箭头表示
“依赖于”：

```text
应用 ──> @vean/ui ──> @vean/aria
                  │
                  └─────> @vean/theme

UnoCSS 配置 ──> @vean/unocss
                  └─────> @vean/theme
```

编译期依赖保持单向：`@vean/ui` 只从
`@vean/aria` 的公共入口导入，Aria 不会反向导入 UI。运行时由样式
包装组件通过 `provideXUi(computedUi)` 注入插槽类名映射，再由被包装的 Aria
分片通过 `useUiContext()` 读取。

### @vean/aria - 逻辑层

这是 VeanUI 的核心基础，负责处理所有业务逻辑：

- **状态管理**：组件内部状态的完整管理
- **可访问性 (A11y)**：完整的 WAI-ARIA 支持
- **键盘交互**：完整的键盘导航支持
- **焦点管理**：智能的焦点捕获和恢复
- **事件处理**：统一的事件处理机制
- **Compact 聚合组件**：为数据驱动场景提供开箱即用的聚合组件

Aria 组件不携带视觉主题，给你最大的自由度来构建自己的设计系统。定位与交互
所需的 CSS 变量或内联布局值仍可能存在。如果你想要完全控制组件的外观，或者需要
构建一个独特的设计系统，Aria 包是你的最佳选择。

### @vean/ui - 表现层

这是基于 Aria 构建的带样式组件库：

- **精美的样式**：使用 UnoCSS 和 `@soybeanjs/cva` 构建的现代化样式
- **开箱即用**：无需额外配置即可使用
- **主题支持**：内置多种主题配置，支持亮色/暗色模式
- **响应式设计**：所有组件都针对不同屏幕尺寸进行了优化
- **灵活定制**：通过 `ui` prop 覆盖任意插槽的样式类

如果你想要快速开始项目，或者喜欢 VeanUI 的默认设计风格，直接使用 `@vean/ui` 是最佳选择。

### 组件模式

VeanUI 支持三种组件模式：

#### 1. 多插槽基础组件

适用于需要精细控制每个部分的复杂组件（如 Accordion、Dialog、Card）：

- Aria 暴露多个分片组件（Root、Trigger、Content 等）
- 使用 `UiSlot` + `UiClass` 定义样式槽位
- UI 层通过 `provide{Name}Ui(ui)` 注入样式

#### 2. Compact 聚合组件

适用于数据驱动且结构稳定的场景（如列表、表格、表单组）：

- Aria 负责数据遍历、默认内容和结构组合
- 暴露 `{Name}Compact` 组件和对应的 Props/Emits/Slots 类型
- UI wrapper 专注于样式变体和 props/slots 转发
- 例如：`AccordionCompact`、`TableCompact`、`CheckboxGroupCompact`

当你有一个结构稳定的数据列表需要渲染时，Compact 组件能让你用更简洁的代码完成任务。

#### 3. 单类名组件

适用于简单的原子组件（如 Button、Link、Badge）：

- 无 UiContext
- UI 层直接使用 `{name}Variants({...}, props.class)` 合并样式

## 核心特性

### ✨ 丰富的组件生态

VeanUI 提供了 80+ 高质量组件，覆盖了 Web 应用开发中的大部分场景：

- **基础组件**：Button、Input、Card、Badge 等
- **表单组件**：Form、Select、Checkbox、RadioGroup、Switch 等
- **反馈组件**：Alert、Dialog、Toast、Tooltip 等
- **导航组件**：Menu、Tabs、Breadcrumb、Pagination 等
- **数据展示**：Table、Tree、List、Avatar 等
- **布局组件**：Layout、Separator、AspectRatio 等

### 🎨 主题系统

VeanUI 内置了强大的主题系统，支持：

- **8 种语义颜色**：`primary` · `destructive` · `success` · `warning` · `info` · `carbon` · `secondary` · `accent`
- **6 种尺寸**：`xs` · `sm` · `md` · `lg` · `xl` · `2xl`（基准 `md` = 16px）
- **多种变体**：`solid`、`outline`、`ghost`、`link`、`plain`、`dashed`、`soft`、`raw`
- **暗色模式**：完整的暗色主题支持
- **RTL 方向**：通过 `ConfigProvider.dir` 在已支持组件间切换 LTR / RTL 布局
- **ConfigProvider**：统一配置 `dir`、`locale`、`nonce` 和全局 tooltip 选项

### 🚀 性能优化

- **Tree-shaking**：只打包使用的代码
- **按需加载**：支持按需引入组件
- **虚拟滚动**：大数据量场景下的性能优化
- **懒加载**：图片和内容的懒加载支持

### 🔧 开发体验

- **TypeScript 支持**：完整的类型定义
- **自动导入**：支持 `unplugin-vue-components` 自动导入
- **Nuxt 模块**：官方 Nuxt 模块支持
- **详细的文档**：每个组件都有详细的文档和示例

## 适用场景

VeanUI 适用于各种类型的 Vue 3 项目：

- **企业级应用**：提供完整的组件生态和可访问性支持
- **管理后台**：丰富的表单和数据展示组件
- **内容网站**：优雅的展示组件和布局系统
- **移动端应用**：响应式设计，适配各种屏幕尺寸
- **设计系统**：Aria 架构支持构建自定义设计系统

## 技术栈

VeanUI 基于以下技术构建：

- **Vue 3**：使用 Composition API 和 `<script setup>` 语法
- **TypeScript**：完整的类型支持
- **UnoCSS**：原子化 CSS 引擎
- **@soybeanjs/cva**：变体 recipe 管理工具

## 开始使用

如果你已经准备好开始使用 Vean，可以查看 [快速开始](./quick-start) 文档，了解如何安装和配置 Vean。

如果你想要了解更多关于组件的信息，可以浏览 [组件文档](/components/button)，每个组件都有详细的 API 文档和使用示例。

## 社区与支持

- **GitHub**：[soybeanjs/vean-ui](https://github.com/soybeanjs/vean-ui)
- **问题反馈**：欢迎在 GitHub Issues 中提出问题
- **功能建议**：欢迎提交 Pull Request

让我们一起构建更好的 Vue 3 UI 组件库！
