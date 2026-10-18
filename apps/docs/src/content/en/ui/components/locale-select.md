---
head:
  title: LocaleSelect
  description: "SLocaleSelect is a dropdown that offers the locales registered in @vean/aria's locale registry. Only registered locales appear, so every option is one whose messages actually resolve — en and zh-CN ship registered, everything else appears once the app calls registerLocale()."
---

# LocaleSelect

## Overview

`SLocaleSelect` is a dropdown that offers the locales registered in `@vean/aria`'s locale registry. It reads `listLocales()`, so the option list is the set of locales whose messages actually resolve. `en` and `zh-CN` are pre-registered; every other language appears the moment the app calls `registerLocale()` during setup.

The component never writes the locale into `SConfigProvider`. It is either controlled through `v-model:locale`, or — when that is omitted — it reads the provider's `locale` for display only.

## Usage

<UsageCode component="locale-select" />

## Features

- 🗂 Registry-driven options — the list is `listLocales()`, not a hardcoded language table, so a `registerLocale()` call after mount shows up immediately
- 🈶 Native names — options render `LocaleRegistry.name` (`English`, `简体中文`, `日本語`), which identifies the language without a country flag
- ↕️ `locales` prop narrows and reorders the registry; unregistered keys are dropped rather than offered as dead options
- 🔗 `v-model:locale` for control, falling back to the parent `SConfigProvider` locale when uncontrolled
- 🎨 `showIcon` + `icons` opt into per-locale icons; text-only by default

## Demos

<PlaygroundGallery component="locale-select" />

## API

<ComponentApi component="locale-select" />

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
