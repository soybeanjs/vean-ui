# LocaleSelect

Source URL: https://veanui.com/components/locale-select
Markdown URL: https://veanui.com/components/locale-select.md
Category: Utilities
Description: SLocaleSelect is a dropdown that offers the locales registered in @vean/aria's locale registry. Only registered locales appear, so every option is one whose messages actually resolve — en and zh-CN ship registered, everything else appears once the app calls registerLocale().

## Overview

`SLocaleSelect` is a dropdown that offers the locales registered in `@vean/aria`'s locale registry. It reads `listLocales()`, so the option list is the set of locales whose messages actually resolve. `en` and `zh-CN` are pre-registered; every other language appears the moment the app calls `registerLocale()` during setup.

The component never writes the locale into `SConfigProvider`. It is either controlled through `v-model:locale`, or — when that is omitted — it reads the provider's `locale` for display only.

## Usage

Usage examples for locale-select are rendered on the site.

## Features

- 🗂 Registry-driven options — the list is `listLocales()`, not a hardcoded language table, so a `registerLocale()` call after mount shows up immediately
- 🈶 Native names — options render `LocaleRegistry.name` (`English`, `简体中文`, `日本語`), which identifies the language without a country flag
- ↕️ `locales` prop narrows and reorders the registry; unregistered keys are dropped rather than offered as dead options
- 🔗 `v-model:locale` for control, falling back to the parent `SConfigProvider` locale when uncontrolled
- 🎨 `showIcon` + `icons` opt into per-locale icons; text-only by default

## Demos

Interactive demos for locale-select are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): LocaleSelect.

### LocaleSelect

#### Props

Properties for the LocaleSelect component.

A dropdown that offers the locales registered in `@vean/aria`'s locale
registry (`listLocales()`). Only registered locales appear, so every option
is a locale whose messages actually resolve — `en` and `zh-CN` are
pre-registered, everything else appears once the app calls
`registerLocale(...)` during setup.

The component never writes the locale into `SConfigProvider`: it is either
controlled through `v-model:locale` or, when that is omitted, reads the
provider's `locale` for display only.

- `locale`: The controlled locale key (`v-model:locale`). When omitted, the trigger displays the parent `SConfigProvider`'s `locale` and the component emits `update:locale` without owning the value. (type `string`; optional)
- `locales`: Explicit locale keys to offer, in the given order. Keys missing from the registry are dropped, so this narrows and reorders the registry rather than extending it. Defaults to every registered locale, in registration order. (type `string[]`; optional)
- `size`: Visual size of the select trigger. (type `ThemeSize`; default `'md'`; optional)
- `showIcon`: Whether to render a leading icon in the trigger and in each option. There is no built-in locale-to-icon map on purpose: flags identify countries, not languages (`en` is not "the US", `ar` spans 20+ countries, `es` spans 20+ more), so the default is text-only. Supply `icons` to opt in. (type `boolean`; default `false`; optional)
- `icons`: Per-locale icon overrides, keyed by locale key. Only rendered when `showIcon` is on. Any Iconify collection works, e.g. `{ 'zh-CN': 'circle-flags:cn' }`. (type `Record<string, IconValue>`; optional)
- `triggerIcon`: Fallback icon for the trigger when the selected locale has no entry in `icons`. A per-locale `icons[locale]` wins over this, because a locale-specific icon is the more informative of the two; `triggerIcon` is only what the trigger shows when no per-locale icon applies. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'lucide:languages'`; optional)
- `placeholder`: Placeholder text rendered when the resolved locale is not registered. (type `string`; default `'Select a locale'`; optional)
- `ariaLabel`: Accessible name for the trigger. The trigger has no visible text label of its own — it shows the selected locale name — so without this the button would be unnamed for assistive technology (axe `button-name`). Override it to localize the control's name. (type `string`; default `'Language'`; optional)

## Notes

### Why no flags by default

Flags identify countries, not languages, and the mismatch is unavoidable: `en` is not "the US", `ar` covers 20+ countries, and so do `es` and `pt`. Element, Ant Design, and the Vean docs site all switch languages with text or a generic language glyph for this reason. The default is text-only; pass `icons` (e.g. `{ 'zh-CN': 'circle-flags:cn' }`) when a country flag is genuinely what you want.

### Registered locales are the contract

Only registered locales are offered. This is deliberate: a picker that lists all 13 bundled language files would advertise `ja` or `ko` while `useLocaleMessages()` silently falls back to `en` for them, because those languages are not in the registry until registered.

```ts
import { registerLocale } from '@vean/aria/locale';
import ja from '@vean/aria/locale/ja';
import zhTW from '@vean/aria/locale/zh-TW';

registerLocale(ja);
registerLocale(zhTW);
```

The registry is `shallowReactive`, so registering after mount re-renders an already-mounted `SLocaleSelect` and re-resolves `useLocaleMessages()`.

### Cautions

- The component does not own the locale. To actually change the app language you must bind `v-model:locale` to the same value passed to `SConfigProvider`'s `locale`, or write the value back yourself.
- `SConfigProvider.locale` is a prop, not state — a nested `SLocaleSelect` cannot mutate it in place.
