# @vean/unocss

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/unocss)](https://www.npmjs.com/package/@vean/unocss)
[![npm downloads](https://img.shields.io/npm/dt/@vean/unocss)](https://www.npmjs.com/package/@vean/unocss)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

Vean 的 UnoCSS 预设——`@vean/theme` token 与 UnoCSS 之间的唯一适配层。

## 📖 简介

`@vean/unocss` 把 [`@vean/theme`](../theme/README.md) 的声明式 token 契约转成 UnoCSS 的 theme 条目、preflight 与工具类。它是**唯一**的 UnoCSS 适配器:token 归属仍在主题包,而本预设消费的对象与运行时 `SConfigProvider` 用的是同一份选项,因此编译出的类名与注入的 CSS 不会分叉。

`presetUi()` 一次调用即返回完整推荐栈:

```
[presetWind3, presetAnimations, presetScrollbar, (presetWebFonts), vean-uno 主题预设]
```

主题层把颜色发射为 `${format}(var(--token) / <alpha-value>)`——这是 UnoCSS alpha 修饰符(`bg-primary/50`)能生效的唯一形态。

## 📦 安装

```bash
pnpm add @vean/unocss
```

## 🚀 使用

### presetUi

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetUi } from '@vean/unocss';

export default defineConfig({
  presets: [presetUi({ base: 'zinc', primary: 'indigo', resetCSS: true, globalCSS: true, uiCSS: true })]
});
```

主题选项(`base` / `primary` / `feedback` / `surfaceStyle` / `size` / `radius` / `spacing` / `overrides` / `format` / `darkSelector`…)会原样转发给 `@vean/theme`;`darkSelector` 经 `resolveWind3Dark()` 映射到 `presetWind3` 的 `dark` 配置。

### presetVean

`npx @vean/cli@latest init` 之后,`uno.config.ts` 可以简化为单个预设——它读取 `vean.json` 并据此推导主题:

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetVean } from '@vean/unocss';

export default defineConfig({
  presets: [presetVean()]
});
```

- `uno.base` / `uno.primary` / `uno.size` / `uno.radius` 直接透传。
- `font.*` 角色会解析成 web font 字体名;`heading: 'inherit'` 是"跟随 sans"的哨兵值,不额外加载字体。
- 主题 preflight(`uiCSS`)默认开启,生成的主题 CSS 随预设一起产出。
- `vean.json` 缺失或不可读时回退到默认主题(zinc / indigo / md)。
- `overrides` 可替换任何推导出的选项。

## ⚙️ 选项

`UiUnocssOptions` 继承引擎的 `ThemeOptions`,另有:

| 选项                                  | 默认                 | 说明                                                                                            |
| :------------------------------------ | :------------------- | :---------------------------------------------------------------------------------------------- |
| `resetCSS`                            | `false`              | 是否包含 reset preflight(box-sizing、border-width…)                                             |
| `globalCSS`                           | `false`              | 是否包含 global preflight(边框色、背景…)                                                        |
| `uiCSS`                               | `false`              | 是否包含 UI/主题 token preflight(按钮、输入框…);`presetVean` 默认开启                           |
| `fonts` / `fontProvider` / `webFonts` | — / `fontsource` / — | 经 `@unocss/preset-web-fonts` 加载 web 字体(默认自托管 fontsource 包);`webFonts` 优先于 `fonts` |
| `wind3`                               | —                    | 注入 `presetWind3`(`important`、`dark`、`content`…);`dark` 优先于 `darkSelector`                |
| `animations`                          | —                    | 注入本地动画预设                                                                                |
| `scrollbar`                           | —                    | 注入本地滚动条预设                                                                              |
| `preflights`                          | —                    | 追加到预设栈的额外 preflight                                                                    |

## 🧩 导出

| 导出               | 说明                                           |
| :----------------- | :--------------------------------------------- |
| `presetUi`         | 完整推荐预设栈                                 |
| `presetVean`       | 由 `vean.json` 驱动的预设(包装 `presetUi`)     |
| `presetAnimations` | 本地动画预设(替代 `unocss-preset-animations`)  |
| `presetScrollbar`  | 本地滚动条预设(替代 `unocss-preset-scrollbar`) |
| `buildGlobalCss`   | 构建 global CSS preflight 字符串               |
| `resolveWind3Dark` | `darkSelector` → `presetWind3` dark 配置       |

类型:`UiUnocssOptions`、`VeanPresetOptions`、`PresetAnimationsOptions`、`PresetScrollbarOptions`。

## 📖 文档

- 主题引擎与 token 契约:[docs/theme.md](../../docs/theme.md)(§0 是 AI Agent 手册)
- 刻度依据:[docs/space-control-scale.md](../../docs/space-control-scale.md)
- 文档站:[veanui.com](https://veanui.com)

## 📄 License

[MIT](../../LICENSE)
