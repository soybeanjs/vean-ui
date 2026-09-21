---
head:
  title: 安装
  description: VeanUI 提供两种方式将组件添加到项目中，选择适合你工作流程的方式。
---

# 安装

VeanUI 提供两种方式将组件添加到项目中，选择适合你工作流程的方式。

## 对比

|              | npm 包                      | CLI (vean)                                                     |
| ------------ | --------------------------- | -------------------------------------------------------------- |
| **工作原理** | 安装 `@vean/ui` 作为依赖    | 将源码复制到你的项目中                                         |
| **自定义**   | 通过 props 和 CSS 变量配置  | 完全控制源码 — 可编辑任何文件                                  |
| **更新**     | `pnpm update` 获取最新版本  | `vean diff` 显示变更，你选择合并哪些                           |
| **打包体积** | Tree-shaking 移除未使用组件 | 只有你添加的组件存在于项目中                                   |
| **适合**     | 快速原型开发，标准设置      | 自定义设计系统，完全控制                                       |
| **安装**     | `pnpm add @vean/ui`         | `npx @vean/cli@latest init && npx @vean/cli@latest add button` |

## npm 包（推荐大多数项目使用）

一条命令安装样式组件库：

```bash
pnpm add @vean/ui
```

## 导入样式

```ts
import '@vean/ui/styles.css';
```

直接从包中导入组件：

```vue
<script setup lang="ts">
import { SButton } from '@vean/ui';
</script>

<template>
  <SButton>点击</SButton>
</template>
```

### 可选：使用 unplugin-vue-components 自动导入

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite';
import UiResolver from '@vean/ui/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [UiResolver()]
    })
  ]
});
```

现在无需手动导入即可使用组件：

```vue
<template>
  <SButton>点击</SButton>
  <!-- 自动导入 -->
</template>
```

## CLI — 复制粘贴（shadcn 风格）

如果你想完全控制组件源码？使用 `vean` CLI 将组件直接复制到你的项目中。

### 1. 初始化

```bash
npx @vean/cli@latest init
```

这会创建 `vean.json` 配置文件，并设置 UnoCSS 别名。

### 2. 添加组件

```bash
npx @vean/cli@latest add button
```

组件源文件被复制到你的项目中：

```
src/ui/
├── components/
│   └── button/
│       ├── button.vue
│       ├── index.ts
│       └── types.ts
├── styles/
│   └── button.ts
└── theme/
    └── index.ts
```

### 3. 使用组件

所有组件使用 `#ui` 导入别名：

```vue
<script setup lang="ts">
import SButton from '#ui/components/button';
</script>
```

### 4. 更新组件

```bash
# 查看变更
npx @vean/cli@latest diff button

# 更新到最新版本
npx @vean/cli@latest add button --overwrite
```

### CLI 参考

查看 [CLI 文档](/cli) 获取完整的命令参考。

## 下一步

- [快速开始](/overview/quick-start) — 从零搭建项目
- [主题定制](/overview/theming) — 自定义颜色、字体和尺寸
- [组件](/components) — 浏览所有可用组件
