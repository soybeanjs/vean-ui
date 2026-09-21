# @vean/nuxt

[English](./README.md) | 中文

用于验证 `@vean/ui` 集成的最小 Nuxt fixture。

## 📖 概述

此应用用于验证仓库内 Nuxt module 与 UnoCSS 接线。它是复用 playground 首页的
薄壳，而不是独立的完整示例应用：

- 通过 Nuxt 模块自动导入 `S` 前缀组件
- UnoCSS 集成实现原子化 CSS 样式
- 复用 playground 页面与主题 context
- 为 `en` 与 `zh-CN` 配置 `@nuxtjs/i18n` module

## 🛠 开发

```bash
# 安装依赖
pnpm install

# 启动 Nuxt 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 🏗 技术栈

- **Nuxt 4** — Vue 框架
- **@vean/ui** — 带样式组件库
- **@vean/ui/nuxt** — Nuxt 自动注册模块
- **UnoCSS** — 原子化 CSS 引擎
- **Vue I18n** — 国际化

## 📁 项目结构

```
apps/nuxt/
├── app/
│   ├── app.vue       # SConfigProvider 包裹的最小演示页
│   └── theme.ts      # 本地主题 context provider
├── nuxt.config.ts    # UI module、i18n、UnoCSS
├── uno.config.ts     # 共享 Vean preset 栈
├── package.json
└── tsconfig.json
```

## 当前 Fixture 限制

- Nuxt i18n 配置引用 `en.json` 与 `zh-CN.json`，但 `apps/nuxt` 下目前没有
  locale fixture 文件；将其作为 i18n 示例前需先补齐或验证解析路径。
- 当前 workspace 没有专用 `typecheck` 脚本或集成测试。

完整跨应用依赖图见[项目架构](../../docs/architecture.md)。
