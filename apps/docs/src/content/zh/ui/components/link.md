---
head:
  title: 链接
  description: 'SLink 是一个多态链接组件，支持内部路由（通过 RouterLink）和外部链接（通过 <a> 标签）。自动检测外部链接并设置安全的 target 和 rel 属性，支持禁用状态和多态渲染（as/asChild）。'
---

# 链接

## 概述

`SLink` 是一个多态链接组件，支持内部路由（通过 `RouterLink`）和外部链接（通过 `<a>` 标签）。自动检测外部链接并设置安全的 `target` 和 `rel` 属性，支持禁用状态和多态渲染（`as`/`asChild`）。

## 特性

- 🔗 **智能路由**：自动区分内部路由（`to`）与外部链接（`href`），无 RouterLink 环境下优雅降级为 `<a>`。
- 🧩 **可插拔链接组件**：通过 `SConfigProvider` 的 `linkComponent` 注入框架专属组件（如 Nuxt `NuxtLink`）。
- 🛡️ **安全默认值**：外部链接自动设置 `target="_blank"` 和 `rel="noopener noreferrer"`，防止反向链接攻击。
- 🔧 **多态渲染**：通过 `as`/`asChild` 支持渲染为任意元素或组件。
- ♿ **无障碍禁用**：禁用状态设置 `aria-disabled`、`role="link"`、`tabindex="-1"`，并阻止点击事件。
- 🎨 **样式定制**：通过 `class` prop 覆盖样式，`linkVariants` 提供基础工具类。

## 用法

<UsageCode component="link" />

## 演示

<PlaygroundGallery component="link" />

## 无障碍

- **禁用状态**：设置 `aria-disabled="true"`、`role="link"`、`tabindex="-1"`，并通过 `preventDefault()` 阻止点击导航。视觉上通过 `data-disabled` 属性触发 `cursor-not-allowed` 和 `opacity-50`。
- **外部链接安全**：自动添加 `rel="noopener noreferrer"`，防止新打开的页面访问 `window.opener`。

## API

<ComponentApi component="link" />

## 说明

### 架构与基准差异

VeanUI 将链接拆分为 Aria 层（路由检测、禁用处理、`RouterLink` 集成）和 styled 层（`linkVariants` 样式）。这不同于 Nuxt Link、React Router Link 等单包方案。

| 方面     | VeanUI                                                   | Nuxt Link / React Router Link / Next.js Link |
| :------- | :------------------------------------------------------- | :------------------------------------------- |
| 架构     | Aria + styled 分层                                       | 单包                                         |
| 路由检测 | 自动检测 `http` 前缀、`external` prop、RouterLink 可用性 | 显式 `<NuxtLink>` / `<Link>`                 |
| 外部链接 | 自动 `target="_blank"` + `rel="noopener noreferrer"`     | 需手动设置                                   |
| 禁用状态 | `aria-disabled` + `tabindex="-1"` + `preventDefault`     | 需手动处理                                   |
| 多态     | `as`/`asChild` via `Primitive`                           | `as` / `passHref`                            |
| 样式     | UnoCSS 工具类 + `linkVariants`                           | CSS Modules / styled / 无                    |

### FAQ

**何时用 `to` vs `href`？**
使用 `to` 进行内部路由导航（依赖 `RouterLink`），使用 `href` 进行外部链接跳转。当 `to` 为 `http` 开头的字符串时，组件自动视为外部链接并渲染 `<a>` 标签。

**没有安装 vue-router 时能用吗？**
可以。组件通过 `resolveComponent('RouterLink')` 检测 RouterLink 是否可用。不可用时自动降级为 `<a>` 标签渲染。

**可以对接框架专属的链接组件吗（如 Nuxt `NuxtLink`、带语言前缀的 `Link`）？**
可以。在 `SConfigProvider` 上设置 `linkComponent`（与 `iconRender` 相同的注入机制），`Link` 的内部链接将改用该组件渲染，替代全局 `RouterLink`。`LinkProps` 未声明的框架专属 props（如 `locale`）会以 attrs 透传给注入组件，可通过模块增强 `LinkProps` 获得类型提示。外部链接仍渲染原生 `<a>`。

**如何禁用链接？**
设置 `disabled: true`。组件会设置 `aria-disabled="true"`、`tabindex="-1"`、`role="link"`，并通过 `preventDefault()` 阻止点击导航。视觉上添加 `data-disabled` 属性触发 `cursor-not-allowed` 和 `opacity-50`。

**`as` 和 `asChild` 有什么区别？**
`as` 指定根元素标签（如 `as="button"` 渲染为 `<button>`）。`asChild` 让组件不渲染自身根元素，而是将属性和事件透传给子元素（类似 Radix UI 的 `asChild` 模式）。

**`target` 和 `rel` 的默认值是什么？**
外部链接默认 `target="_blank"`、`rel="noopener noreferrer"`；内部路由默认 `target="_self"`。可通过 props 显式覆盖。
