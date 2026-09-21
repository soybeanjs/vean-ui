<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# Vean

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/ui)](https://www.npmjs.com/package/@vean/ui)
[![npm downloads](https://img.shields.io/npm/dt/@vean/ui)](https://www.npmjs.com/package/@vean/ui)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

Vean 是一个优雅、现代、可访问且高质量的 UI 组件库，具有 shadcn-like 设计，适用于 Vue 3，构建在强大的 Aria 基础之上。它提供了一套全面、可访问、可定制且高性能的组件。

## 📚 架构

Vean 的组件运行时采用严格的**双层分离**设计。下图中的箭头表示“依赖于”：

```
应用 ──> @vean/ui ──> @vean/aria
                  │
                  └─────> @vean/theme

UnoCSS 配置 ──> @vean/unocss
                  └─────> @vean/theme
```

### 包结构

| 包             | 职责                                                | 当前清单                                       |
| -------------- | --------------------------------------------------- | ---------------------------------------------- |
| **@vean/aria** | 逻辑、状态、a11y、焦点、键盘交互与无主题组件分片    | 96 个目录（94 个公共组件组）、28 个 composable |
| **@vean/ui**   | 使用 UnoCSS 与 `@soybeanjs/cva` recipe 的样式包装层 | 96 个公共组件组、144 个带 `S` 前缀的导出       |

编译期依赖严格单向：`@vean/ui` 只从
`@vean/aria` 的公共入口导入，aria 不会反向导入 UI。运行时由样式包装
组件通过 `provideXUi(computedUi)` 注入插槽类名映射，再由被包装的 aria 分片
通过 `useUiContext()` 读取。

这里的 “Aria” 指逻辑层不携带视觉主题；定位、尺寸或交互所必需的 CSS 变量与
内联布局值仍可能存在。

部分多插槽 aria 组件还会暴露 `Compact` 聚合层，例如 `AccordionCompact` 和 `TableCompact`。它们把条目遍历以及默认内容 / 图标组合放在 aria 层完成，而 UI 层只负责样式和 props 转发。

目前采用这类 Compact 约定式组合的能力还覆盖了 card、date-field、dialog、editable、hover-card、layout、navigation-menu、pagination、popover、stepper 等稳定结构场景。

### Workspace 总览

Monorepo 还发布 `@vean/theme`、
`@vean/unocss`、源码分发 CLI `vean` 与
`@vean/skills`。两个私有应用分别承担文档站（同时承载交互式组件示例）
与 Nuxt 集成验证。

完整 workspace 地图、依赖图、构建/测试链路及事实源见
[项目架构](./docs/architecture.md)；按优先级排列的改进项与验收条件见
[架构与工程质量评估](./docs/optimize.md)。

### 样式注入机制

每个多插槽的 aria 组件都有对应的 `provide{Name}Ui` 函数。样式层通过 `@soybeanjs/cva` 的 recipe 计算类名后注入：

```ts
// 样式包装层 (packages/ui/) 中
const ui = computed(() => accordionVariants({ size: props.size }, props.ui, { root: props.class }));
provideAccordionUi(ui); // aria 通过 useAccordionUi() 读取
```

### 主题系统

- **`ThemeColor`** — 8 种语义色：`primary` · `destructive` · `success` · `warning` · `info` · `carbon` · `secondary` · `accent`
- **`ThemeSize`** — 6 种尺寸：`xs` · `sm` · `md` · `lg` · `xl` · `2xl`（基准尺寸 `md` = 16px）
- **`ConfigProvider`** — 全局设置 `dir`、`locale`、`nonce` 及默认 `tooltip` 配置，应用于整个组件树，并支持 RTL 布局切换

### 语言支持

`ConfigProvider` 当前支持以下 locale 文案包：

| 代码    | 语言         |
| ------- | ------------ |
| `zh-CN` | 简体中文     |
| `zh-TW` | 繁體中文     |
| `en`    | 英语         |
| `ar`    | 阿拉伯语     |
| `ja`    | 日语         |
| `ko`    | 韩语         |
| `de`    | 德语         |
| `fr`    | 法语         |
| `es`    | 西班牙语     |
| `pt-BR` | 巴西葡萄牙语 |
| `ru`    | 俄语         |
| `tr`    | 土耳其语     |
| `id`    | 印度尼西亚语 |

默认只有 `en` 和 `zh-CN` 会被预注册。`registerLocale` 支持两种注册方式：

- 直接传入 `LocaleRegistry` 对象。`@vean/aria/locale/{code}` 导出的内置语言文件已经是这种结构，并且自带 `dir` 元数据。
- 传入 locale key 和 `LocaleMessages`，用于快速注册一个轻量自定义语言。

简写形式 `registerLocale(key, messages)` 会将 key 作为语言名，并在未显式提供方向时回退到 `ltr`。如果你需要像 `ar` 这样的 `rtl` 元数据，请优先使用对象形式。

```ts
import { en, registerLocale } from '@vean/aria/locale';
import type { LocaleMessages } from '@vean/aria/locale';
import ar from '@vean/aria/locale/ar';

registerLocale(ar);

const customMessages: LocaleMessages = {
  ...en.messages,
  pagination: {
    ...en.messages.pagination,
    nextPage: '下一页 →',
    prevPage: '← 上一页'
  }
};

registerLocale('custom', customMessages);
```

### 包导出

**@vean/aria** 提供精细化子路径导出：

```ts
import { AccordionRoot } from '@vean/aria'; // 所有组件
import { useControllableState } from '@vean/aria/composables'; // 28 个 composable
import { transformPropsToContext } from '@vean/aria/shared'; // 纯 TS 工具
import { createMonth } from '@vean/aria/date'; // 日期工具
import { registerLocale } from '@vean/aria/locale'; // locale 注册表
import * as Aria from '@vean/aria/namespaced'; // 命名空间导入
import type { AccordionUiSlot } from '@vean/aria/accordion'; // 单组件类型
import type { UiClass } from '@vean/aria/types'; // 共享类型导出
```

框架集成还可从 `@vean/aria/nuxt` 与
`@vean/aria/resolver` 引入。

**@vean/ui** 导出：

```ts
import { SButton, SAccordion } from '@vean/ui'; // 所有组件
import '@vean/ui/styles.css'; // 预构建的 UnoCSS 样式表
// 同时提供：@vean/ui/nuxt · @vean/ui/resolver
```

## 🛠 开发工作流

如果您在仓库内新增公共组件、调整导出入口或修改 API 描述，请通过官方脚本同步生成产物，而不是手动编辑生成文件。

```bash
pnpm sui gen catalog                          # 同步组件目录（aria + ui）
pnpm sui gen api                              # 重新生成 docs api json 与 locale 模板数据
pnpm sui gen api --force                      # 即使源码指纹未变化也强制抽取
pnpm sui gen changelog                        # 重新生成 docs changelog json 与 locale 模板数据
pnpm sui gen schema                           # 重新生成 vean JSON Schema
pnpm sui gen skills                           # 重新生成 skills 分发产物
pnpm sui translate api --locale zh-CN         # 翻译待译 API 描述
pnpm sui translate changelog --locale zh-CN   # 翻译待译 changelog 摘要
pnpm sui check generated                      # 校验已提交生成数据与源码是否一致
```

生成（`sui gen`）是确定性且离线的；翻译（`sui translate`）是唯一联网的步骤。重新生成是内容感知的：内容未变化的生成文件会保留原有的 `generatedAt` 且不被重写，因此空跑不会产生任何 diff。`pnpm sui check generated` 会重跑全部生成目标并与 git 对比，CI 也会执行，因此已提交的生成数据不会再静默漂移。

API 抽取需要用 TypeDoc 编译两个包（约 40s），因此当输入与磁盘产物的指纹与上次一致时会直接跳过（约 0.15s）。指纹存放在 `node_modules/.cache/` 下且不提交；`--force` 可绕过该检查。由于生成与翻译已拆成两个动词，`sui translate <api|changelog|locale|all>` 会先刷新它要翻译的那个面，再通过 DeepL 填充待译条目（需要 `DEEPL_API_KEY`）；加 `--dry-run` 可以在不花费翻译额度的前提下查看待译数量。

当前文档站默认通过 `UsageCode`、`PlaygroundGallery` 与 `ComponentApi` 渲染组件文档；组件详情页与 `/releases` 还会消费 `apps/docs/src/generated/changelog/` 和 `apps/docs/src/generated/changelog-locales/` 下的版本日志生成数据。

因此，一旦公共 API 或示例交付面变化，也要同步维护 docs、playground 示例和 API 生成数据；如果调整了 changelog 映射、发布页展示或 changelog locale 模板，也要同步更新 changelog 生成数据。

## 📦 安装

### 使用带样式的 UI 库 (推荐)

如果您想要具有现代设计的现成组件：

```bash
pnpm add @vean/ui
```

### 使用 Aria 库

如果您想从头开始构建自己的设计系统：

```bash
pnpm add @vean/aria
```

## 🚀 使用方法

### @vean/ui

1. **引入样式**

   在您的主入口文件 (例如 `main.ts`) 中引入 CSS 文件：

```ts
import '@vean/ui/styles.css';
```

2. **全局注册 (可选)**

   您可以全局注册组件，也可以按需引入。

3. **按需引入 (推荐)**

   我们推荐使用 `unplugin-vue-components` 来自动引入组件。

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

4. **Nuxt 模块**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vean/ui/nuxt']
});
```

### @vean/aria

Aria 组件提供功能但不包含样式。

对于数据驱动的多插槽场景，如果组件提供了 `Compact` 版本，优先使用它。它是 aria 层的约定式组合入口，而基础分片仍然保留给需要完全手动拼装的场景。

```vue
<script setup>
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@vean/aria';
</script>

<template>
  <AccordionRoot>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
```

## ✨ 特性

- **可访问性**：遵循 WAI-ARIA 模式，内置角色、焦点管理与键盘导航。
- **RTL 就绪**：通过 `ConfigProvider` 即可在已支持组件间切换 LTR / RTL 布局。
- **Aria 优先**：逻辑与样式完全分离—单独使用 `@vean/aria` 可构建任意设计系统。
- **类型安全**：严格 TypeScript 编写，所有 props、emits、slot 及 context 均有完整类型。
- **多级自定义**：通过 `ui` prop 覆盖单个橪位类名，也可替换整个样式层。
- **轻量可摇树**：每个组件独立 Tree-shakable，按需引入。
- **Nuxt 就绪**：提供官方 Nuxt 模块，支持组件自动注册（`@vean/ui/nuxt`）。
- **unplugin 支持**：提供 `unplugin-vue-components` 自动导入解析器（`@vean/ui/resolver`）。

## 🤝 如何贡献

欢迎各种形式的贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解环境搭建、编码规范和 Pull Request 流程。

## 💝 致谢

- [reka-ui](https://github.com/unovue/reka-ui)
- [oku-ui](https://github.com/oku-ui/primitives)
- [shadcn-vue](https://github.com/unovue/shadcn-vue)
- [shadcn/ui](https://github.com/shadcn/ui)
- [nuxt-ui](https://github.com/nuxt/ui)
- [unocss](https://github.com/unocss/unocss)
