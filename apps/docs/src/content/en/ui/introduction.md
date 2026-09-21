---
head:
  title: Introduction
  description: 'VeanUI is an elegant, modern, accessible, and high-quality UI component system designed for Vue 3. It supports two distribution modes — install as a traditional npm package, or copy source code directly into your project via the vean CLI (shadcn-style). Built on a powerful Aria foundation, it provides a comprehensive set of accessible, customizable, and high-performance components to help developers build modern web applications quickly.'
---

# Introduction

VeanUI is an elegant, modern, accessible, and high-quality UI component system designed for Vue 3. It supports **two distribution modes** — install as a traditional npm package, or copy source code directly into your project via the `vean` CLI (shadcn-style). Built on a powerful Aria foundation, it provides a comprehensive set of accessible, customizable, and high-performance components to help developers build modern web applications quickly.

## Two Ways to Use VeanUI

VeanUI gives you the freedom to choose how components live in your project:

### NPM Package — Quick Integration

Install `@vean/ui` as a dependency and get started in minutes. Auto-import with `unplugin-vue-components`, tree-shaking, and seamless updates via your package manager. This is the recommended path for most projects.

```bash
pnpm add @vean/ui
```

### CLI · Copy-Paste — Full Source Control

Prefer owning the source code? Use the `vean` CLI to copy components directly into your project. Edit any file, customize anything — the code is yours. Pull upstream updates with `vean diff` when you want them.

```bash
npx @vean/cli@latest init
npx @vean/cli@latest add button
```

See the [Installation](/overview/installation) guide for a detailed comparison, or jump directly to the [CLI documentation](/cli).

## Why VeanUI?

### 🎨 Elegant design

VeanUI adopts a modern design language with polished visuals and smooth interactions. Every component is carefully crafted to deliver an excellent user experience across different scenarios.

### ♿ Accessibility first

All components strictly follow WAI-ARIA design patterns, ensuring they are easy to use for everyone, including users with disabilities. Accessibility features such as keyboard navigation, screen reader support, focus management, and RTL-aware direction support are built in—no extra wiring required beyond configuration.

### 🏗️ Flexible architecture

VeanUI uses an Aria architecture that fully separates logic from presentation. This means you can:

- **Use pre-styled components**: use `@vean/ui` out of the box
- **Bring your own styles**: use `@vean/aria` to build your own design system
- **Mix and match**: use both approaches in the same project

### 🎯 Type safety

Built entirely with TypeScript, VeanUI provides complete type definitions and smart IntelliSense to make development more efficient and reliable.

### 🎨 Highly customizable

Built on UnoCSS and `@soybeanjs/cva`, VeanUI supports flexible theming. You can easily adjust colors, sizes, border radius, and more to match your brand.

### 📦 Lightweight

All components support tree-shaking, so you only bundle what you actually use—keeping your final build as small as possible.

## Architecture

Vean's component runtime uses a strict **two-layer separation**. The
arrows below mean “depends on”:

```
Consumer ──> @vean/ui ──> @vean/aria
                    │
                    └───────> @vean/theme

UnoCSS config ──> @vean/unocss
                    └───────> @vean/theme
```

The compile-time dependency is one-way: `@vean/ui` imports public
`@vean/aria` entry points, while Aria never imports UI. At runtime,
styled wrappers inject slot class maps through `provideXUi(computedUi)`, and the
wrapped Aria parts read them through `useUiContext()`.

### @vean/aria - Logic layer

This is the core foundation of Vean, responsible for handling all component logic:

- **State management**: complete internal state management
- **Accessibility (A11y)**: full WAI-ARIA support
- **Keyboard interactions**: comprehensive keyboard navigation
- **Focus management**: intelligent focus trapping and restoration
- **Event handling**: a unified event handling mechanism
- **Compact aggregators**: ready-to-use aggregated components for data-driven scenarios

Aria components ship no visual theme, giving you maximum freedom to build
your own design system. Behavior-critical CSS variables or inline layout values
may still be used for positioning and interaction. If you want full control
over the look and feel—or need a unique design system—`@vean/aria` is
the best choice.

### @vean/ui - Presentation layer

This is the styled component library built on top of Aria:

- **Beautiful styling**: modern styles built with UnoCSS and `@soybeanjs/cva`
- **Ready to use**: works out of the box with minimal setup
- **Theme support**: built-in theme presets, including light/dark mode
- **Responsive design**: optimized for different screen sizes
- **Flexible customization**: override any slot's style classes via the `ui` prop

If you want to get started quickly or prefer Vean's default look, `@vean/ui` is the recommended choice.

### Component Patterns

VeanUI supports three component patterns:

#### 1. Multi-slot Base Components

For complex components that need fine-grained control over each part (like Accordion, Dialog, Card):

- Aria exposes multiple primitive components (Root, Trigger, Content, etc.)
- Uses `UiSlot` + `UiClass` to define style slots
- UI layer injects styles via `provide{Name}Ui(ui)`

#### 2. Compact Aggregators

For data-driven scenarios with stable structures (like lists, tables, form groups):

- Aria handles data iteration, default content, and structure composition
- Exposes `{Name}Compact` component with corresponding Props/Emits/Slots types
- UI wrapper focuses on style variants and prop/slot forwarding
- Examples: `AccordionCompact`, `TableCompact`, `CheckboxGroupCompact`

When you have a stable data list to render, Compact components let you accomplish the task with more concise code.

#### 3. Single-class Components

For simple atomic components (like Button, Link, Badge):

- No UiContext
- UI layer directly uses `{name}Variants({...}, props.class)` to merge styles

## Key features

### ✨ Rich component ecosystem

VeanUI provides more than 80 high-quality components covering most common web application scenarios:

- **Basic**: Button, Input, Card, Badge, etc.
- **Forms**: Form, Select, Checkbox, RadioGroup, Switch, etc.
- **Feedback**: Alert, Dialog, Toast, Tooltip, etc.
- **Navigation**: Menu, Tabs, Breadcrumb, Pagination, etc.
- **Data display**: Table, Tree, List, Avatar, etc.
- **Layout**: Layout, Separator, AspectRatio, etc.

### 🎨 Theme system

VeanUI includes a powerful theme system that supports:

- **8 semantic colors**: `primary` · `destructive` · `success` · `warning` · `info` · `carbon` · `secondary` · `accent`
- **6 sizes**: `xs` · `sm` · `md` · `lg` · `xl` · `2xl` (base `md` = 16px)
- **Multiple variants**: `solid`, `outline`, `ghost`, `link`, `plain`, `dashed`, `soft`, `raw`
- **Dark mode**: full dark theme support
- **RTL direction**: switch supported components between LTR and RTL layouts with `ConfigProvider.dir`
- **ConfigProvider**: unified configuration for `dir`, `locale`, `nonce`, and global tooltip options

### 🚀 Performance

- **Tree-shaking**: bundle only what you use
- **On-demand imports**: supports importing components as needed
- **Virtual scrolling**: optimized for large data sets
- **Lazy loading**: lazy-load images and content when appropriate

### 🔧 Developer experience

- **TypeScript**: complete type definitions
- **Auto import**: supports auto-import with `unplugin-vue-components`
- **Nuxt module**: official Nuxt module support
- **Detailed docs**: each component includes comprehensive docs and examples

## Use cases

VeanUI works well for many types of Vue 3 projects:

- **Enterprise apps**: complete ecosystem with strong accessibility
- **Admin dashboards**: rich form and data display components
- **Content sites**: elegant display components and layout system
- **Mobile-friendly apps**: responsive design for various screen sizes
- **Design systems**: Aria architecture for building custom systems

## Tech stack

VeanUI is built with:

- **Vue 3**: Composition API and `<script setup>`
- **TypeScript**: full type support
- **UnoCSS**: atomic CSS engine
- **@soybeanjs/cva**: variant recipe management

## Getting started

If you’re ready to start using Vean, check out the [Quick Start](./quick-start) guide to learn how to install and configure it.

If you want to learn more about specific components, browse the [Component docs](/components/button) for detailed APIs and examples.

## Community & support

- **GitHub**: [soybeanjs/vean-ui](https://github.com/soybeanjs/vean-ui)
- **Issues**: feel free to report problems via GitHub Issues
- **Feature requests**: pull requests are welcome

Let’s build a better Vue 3 UI component library together!
