# @vean/unocss

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/unocss)](https://www.npmjs.com/package/@vean/unocss)
[![npm downloads](https://img.shields.io/npm/dt/@vean/unocss)](https://www.npmjs.com/package/@vean/unocss)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

The UnoCSS preset for Vean — the single adapter between `@vean/theme` tokens and UnoCSS.

## 📖 Introduction

`@vean/unocss` turns the declarative token contract of [`@vean/theme`](../theme/README.md) into UnoCSS theme entries, preflights, and utilities. It is the **only** UnoCSS adapter: token ownership stays in the theme package, and this preset consumes the same options object that `SConfigProvider` uses at runtime, so the compiled classes and the injected CSS cannot drift apart.

`presetUi()` returns the full recommendation stack in one call:

```
[presetWind3, presetAnimations, presetScrollbar, (presetWebFonts), vean-uno theme preset]
```

The theme layer emits colors as `${format}(var(--token) / <alpha-value>)` — the only shape in which UnoCSS alpha modifiers (`bg-primary/50`) work.

## 📦 Installation

```bash
pnpm add @vean/unocss
```

## 🚀 Usage

### presetUi

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetUi } from '@vean/unocss';

export default defineConfig({
  presets: [presetUi({ base: 'zinc', primary: 'indigo', resetCSS: true, globalCSS: true, uiCSS: true })]
});
```

Theme options (`base` / `primary` / `feedback` / `surfaceStyle` / `size` / `radius` / `spacing` / `overrides` / `format` / `darkSelector`…) are forwarded to `@vean/theme` untouched; `darkSelector` is mapped onto `presetWind3`'s `dark` config via `resolveWind3Dark()`.

### presetVean

After `npx @vean/cli@latest init`, your `uno.config.ts` can be reduced to a single preset — it reads `vean.json` and derives the theme from it:

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetVean } from '@vean/unocss';

export default defineConfig({
  presets: [presetVean()]
});
```

- `uno.base` / `uno.primary` / `uno.size` / `uno.radius` are passed through directly.
- `font.*` roles are resolved to web-font family names; `heading: 'inherit'` is the "follow sans" sentinel and loads nothing extra.
- The theme preflight (`uiCSS`) is enabled by default, so the generated theme CSS ships with the preset.
- If `vean.json` is missing or unreadable it falls back to the default theme (zinc / indigo / md).
- `overrides` can replace any derived option.

## ⚙️ Options

`UiUnocssOptions` extends the engine's `ThemeOptions`, plus:

| Option                                | Default              | Description                                                                                                         |
| :------------------------------------ | :------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `resetCSS`                            | `false`              | Include the reset preflight (box-sizing, border-width…)                                                             |
| `globalCSS`                           | `false`              | Include the global preflight (border color, background…)                                                            |
| `uiCSS`                               | `false`              | Include the UI/theme token preflight (buttons, inputs…); `presetVean` turns it on                                   |
| `fonts` / `fontProvider` / `webFonts` | — / `fontsource` / — | Web fonts via `@unocss/preset-web-fonts` (self-hosted fontsource packages by default); `webFonts` wins over `fonts` |
| `wind3`                               | —                    | Injected into `presetWind3` (`important`, `dark`, `content`…); `dark` overrides `darkSelector`                      |
| `animations`                          | —                    | Injected into the local animations preset                                                                           |
| `scrollbar`                           | —                    | Injected into the local scrollbar preset                                                                            |
| `preflights`                          | —                    | Extra preflights appended to the stack                                                                              |

## 🧩 Exports

| Export             | Description                                                      |
| :----------------- | :--------------------------------------------------------------- |
| `presetUi`         | The full recommendation preset stack                             |
| `presetVean`       | `vean.json`-driven preset (wraps `presetUi`)                     |
| `presetAnimations` | Local animations preset (`unocss-preset-animations` replacement) |
| `presetScrollbar`  | Local scrollbar preset (`unocss-preset-scrollbar` replacement)   |
| `buildGlobalCss`   | Build the global CSS preflight string                            |
| `resolveWind3Dark` | `darkSelector` → `presetWind3` dark config                       |

Types: `UiUnocssOptions`, `VeanPresetOptions`, `PresetAnimationsOptions`, `PresetScrollbarOptions`.

## 📖 Documentation

- Theme engine and token contract: [docs/theme.md](../../docs/theme.md) (§0 is the AI-agent handbook)
- Scale rationale: [docs/space-control-scale.md](../../docs/space-control-scale.md)
- Docs site: [veanui.com](https://veanui.com)

## 📄 License

[MIT](../../LICENSE)
