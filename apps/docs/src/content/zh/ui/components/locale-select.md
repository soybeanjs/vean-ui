---
head:
  title: 语言选择
  description: SLocaleSelect 是一个提供 @vean/aria 语言注册表中已注册语言的下拉选择器。只有已注册的语言才会出现，因此每个选项的语言包都能真正生效 —— en 与 zh-CN 开箱即注册，其余语言在调用 registerLocale() 后自动出现。
---

# 语言选择

## 概述

`SLocaleSelect` 是一个提供 `@vean/aria` 语言注册表中已注册语言的下拉选择器。它读取 `listLocales()`，因此选项集合就是「语言包能真正解析到」的那个集合。`en` 与 `zh-CN` 开箱即注册；其余语言在应用初始化时调用 `registerLocale()` 之后立即出现。

组件不会把 locale 写回 `SConfigProvider`。它要么通过 `v-model:locale` 受控，要么在未传值时只读取 provider 的 `locale` 用于展示。

## 用法

<UsageCode component="locale-select" />

## 特性

- 🗂 注册表驱动的选项 —— 列表来自 `listLocales()`，不是硬编码的语言表，因此挂载后再调用 `registerLocale()` 会立即反映出来
- 🈶 原生语言名 —— 选项渲染 `LocaleRegistry.name`（`English`、`简体中文`、`日本語`），不靠国旗也能识别语言
- ↕️ `locales` prop 可收窄与重排注册表；未注册的 key 会被丢弃，而不是作为无效选项给出
- 🔗 `v-model:locale` 受控，未受控时回落到父级 `SConfigProvider` 的 locale
- 🎨 `showIcon` + `icons` 可选开启每语言图标；默认纯文字

## 演示

<PlaygroundGallery component="locale-select" />

## API

<ComponentApi component="locale-select" />

## 注意事项

### 为什么默认不带国旗

国旗标识的是国家而不是语言，且映射必然出错：`en` 不是「美国」，`ar` 覆盖 20 多个国家，`es` 与 `pt` 同理。Element、Ant Design 与 Vean 文档站的语言切换都改用文字或通用语言图标，原因就在这里。默认纯文字；确实想要国旗时传 `icons`（例如 `{ 'zh-CN': 'circle-flags:cn' }`）。

### 已注册的语言才是契约

只提供已注册的语言，是刻意设计：若列出全部 13 个内置语言包，界面会出现 `ja`、`ko` 等选项，而 `useLocaleMessages()` 对它们会静默回落到 `en`——因为这些语言在注册之前并不在注册表中。

```ts
import { registerLocale } from '@vean/aria/locale';
import ja from '@vean/aria/locale/ja';
import zhTW from '@vean/aria/locale/zh-TW';

registerLocale(ja);
registerLocale(zhTW);
```

注册表是 `shallowReactive` 的，因此挂载后注册也会让已挂载的 `SLocaleSelect` 重新渲染，并让 `useLocaleMessages()` 重新解析。

### 提醒

- 组件不持有 locale。要真正切换应用语言，需把 `v-model:locale` 绑定到传给 `SConfigProvider` `locale` 的同一个值，或自行写回。
- `SConfigProvider.locale` 是 prop 而非状态 —— 内层的 `SLocaleSelect` 无法就地修改它。
