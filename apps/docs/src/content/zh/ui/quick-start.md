---
head:
  title: 快速开始
  description: VeanUI 提供两种方式将组件集成到项目中。本指南涵盖两种路径 — 选择适合你工作流程的方式。
---

# 快速开始

VeanUI 提供两种方式将组件集成到项目中。本指南涵盖两种路径 — 选择适合你工作流程的方式。

> **我应该选择哪种？** 使用 **npm 包**进行快速集成和自动更新。使用 **CLI（vean）**完全掌控源码 — 可编辑任何文件，完全自定义。查看[安装指南](/overview/installation)了解详细对比。

## 环境要求

在开始之前，请确保你的项目满足以下要求：

- **Node.js** >= 16.0.0
- **Vue** >= 3.3.0
- **包管理器**：pnpm（推荐）、npm 或 yarn

## 路径 A：CLI · 复制粘贴（shadcn 风格）

想要拥有组件源码？使用 `vean` 将组件直接复制到你的项目中。

### 1. 初始化项目

```bash
npx @vean/cli@latest init
```

这会创建 `vean.json` 配置并设置 UnoCSS。根据交互提示选择颜色、字体、图标库等。

### 2. 添加组件

```bash
npx @vean/cli@latest add button
npx @vean/cli@latest add dialog select
```

组件被复制到 `src/ui/components/` — 它们现在是项目的一部分。使用 `#ui` 别名导入：

```vue
<script setup lang="ts">
import SButton from '#ui/components/button';
</script>

<template>
  <SButton>点击</SButton>
</template>
```

### 3. 更新组件

```bash
# 查看上游变更
npx @vean/cli@latest diff button

# 更新到最新版本
npx @vean/cli@latest add button --overwrite
```

查看 [CLI 文档](/cli) 了解所有可用命令、配置选项和项目结构详情。

## 路径 B：npm 包

如果你偏好传统的依赖工作流，安装 `@vean/ui`：

```bash
# 使用 pnpm（推荐）
pnpm add @vean/ui

# 或使用 npm
npm install @vean/ui

# 或使用 yarn
yarn add @vean/ui
```

如果你想要构建自己的设计系统，安装 `@vean/aria`：

```bash
pnpm add @vean/aria
```

## 路径 B（续）：基础配置

### 引入样式

如果使用 `@vean/ui`，需要在项目入口文件中引入样式文件：

```ts
// main.ts 或 main.js
import '@vean/ui/styles.css';
```

## 使用方式

### 方式一：自动导入（推荐）

使用 `unplugin-vue-components` 可以自动导入组件，无需手动导入。

#### 安装依赖

```bash
pnpm add -D unplugin-vue-components
```

#### 配置 Vite

在 `vite.config.ts` 中配置：

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import UiResolver from '@vean/ui/resolver';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [UiResolver()]
    })
  ]
});
```

#### 使用组件

配置完成后，你可以在任何 Vue 组件中直接使用 VeanUI 组件，无需手动导入：

```vue
<template>
  <SButton>点击我</SButton>
  <SInput placeholder="请输入内容" />
  <SCard>
    <p>这是一张卡片</p>
  </SCard>
</template>
```

### 方式二：手动导入

你也可以手动导入需要的组件：

```vue
<script setup>
import { SButton, SInput, SCard } from '@vean/ui';
</script>

<template>
  <SButton>点击我</SButton>
  <SInput placeholder="请输入内容" />
  <SCard>
    <p>这是一张卡片</p>
  </SCard>
</template>
```

## Nuxt 集成

如果你使用 Nuxt 4，可以使用官方提供的 Nuxt 模块，配置更加简单：

### 安装

```bash
pnpm add @vean/ui
```

### 配置

在 `nuxt.config.ts` 中添加模块：

```ts
export default defineNuxtConfig({
  modules: ['@vean/ui/nuxt']
});
```

配置完成后，你可以在 Nuxt 项目中直接使用所有 VeanUI 组件，无需额外配置。

## 使用 Aria 组件

如果你选择使用 `@vean/aria`，你需要自己编写样式。Aria 组件提供两种使用方式：

### 方式一：使用基础组件（精细控制）

适用于需要完全自定义结构和样式的场景：

```vue
<script setup>
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@vean/aria';
</script>

<template>
  <AccordionRoot>
    <AccordionItem value="item-1">
      <AccordionTrigger>这是标题</AccordionTrigger>
      <AccordionContent>这是内容区域，你可以在这里放置任何内容。</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>另一个标题</AccordionTrigger>
      <AccordionContent>另一个内容区域。</AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style scoped>
/* 在这里添加你的自定义样式 */
</style>
```

### 方式二：使用 Compact 组件（数据驱动）

适用于结构稳定、数据驱动的场景，代码更简洁：

```vue
<script setup>
import { AccordionCompact } from '@vean/aria';

const items = [
  {
    value: 'item-1',
    title: '这是标题',
    description: '这是内容区域，你可以在这里放置任何内容。'
  },
  {
    value: 'item-2',
    title: '另一个标题',
    description: '另一个内容区域。'
  }
];
</script>

<template>
  <AccordionCompact :items="items" />
</template>

<style scoped>
/* 在这里添加你的自定义样式 */
</style>
```

> Compact 组件由 Aria 层负责数据遍历和默认内容渲染，让你用更少的代码完成常见任务。

## 主题配置

VeanUI 支持灵活的主题配置。你可以通过 `ConfigProvider` 组件来配置全局主题：

```vue
<script setup>
import { SConfigProvider } from '@vean/ui';

const themeConfig = {
  theme: {
    base: 'gray',
    primary: 'indigo',
    radius: '0.625rem'
  },
  size: 'md'
};
</script>

<template>
  <SConfigProvider :theme="themeConfig">
    <YourApp />
  </SConfigProvider>
</template>
```

## RTL 配置

VeanUI 组件支持通过 `SConfigProvider` 切换布局方向。当你的产品需要从右到左布局时，在应用根节点设置 `dir="rtl"` 即可：

```vue
<template>
  <SConfigProvider dir="rtl">
    <YourApp />
  </SConfigProvider>
</template>
```

更具体的能力边界和配置方式，可以继续查看 [ConfigProvider 文档](/components/config-provider)。

## 第一个示例

让我们创建一个简单的示例来验证安装是否成功：

```vue
<template>
  <div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold">VeanUI 示例</h1>

    <SButton color="primary" @click="handleClick">点击按钮</SButton>

    <SInput v-model="inputValue" placeholder="请输入内容" class="w-64" />

    <SCard>
      <template #header>
        <h3>卡片标题</h3>
      </template>
      <p>这是卡片的内容区域。</p>
      <template #footer>
        <SButton size="small">操作</SButton>
      </template>
    </SCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');

function handleClick() {
  alert('按钮被点击了！');
}
</script>
```

## 常见问题

### 样式没有生效？

1. 确保已经引入了样式文件：`import '@vean/ui/styles.css'`
2. 检查浏览器控制台是否有错误信息

### TypeScript 类型错误？

1. 确保安装了 `@vean/ui` 的最新版本
2. 检查 `tsconfig.json` 中的类型配置
3. 重启 TypeScript 服务器

### 组件无法自动导入？

1. 确保已正确配置 `unplugin-vue-components`
2. 检查 `vite.config.ts` 中的配置是否正确
3. 重启开发服务器

### 在 Nuxt 中使用时出现问题？

1. 确保使用的是 Nuxt 4
2. 检查 `nuxt.config.ts` 中的模块配置
3. 清除 `.nuxt` 缓存目录后重新启动

## 下一步

现在你已经成功安装了 Vean，可以：

1. 浏览 [组件文档](/components)，了解所有可用组件
2. 查看 [主题配置](../theming) 文档，学习如何自定义主题
3. 访问 [GitHub](https://github.com/soybeanjs/vean-ui) 查看源码和示例

祝你使用愉快！如果遇到任何问题，欢迎在 GitHub Issues 中提出。
