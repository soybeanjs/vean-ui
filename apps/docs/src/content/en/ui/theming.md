---
head:
  title: Theming
  description: 'VeanUI ships a three-layer theme engine: a static palette layer, a semantic token layer and a literal layer. Configure it through SConfigProvider, or drive the engine directly when you need the CSS yourself.'
---

# Theming

## Overview

VeanUI provides a flexible theming system that allows you to customize the appearance of components to match your application's design requirements. You can easily adjust colors, radius and global size settings.

Open the [theme editor](/theme-editor) to change every option against a live gallery of components — the panel there is the same `SThemeCustomizer` an application embeds for its users.

`SThemeCustomizer` takes a `ui` slot map (plus `class`) so a host can restyle the shell: `:ui="{ root: 'w-full h-[70vh]' }"` fills a sidebar instead of using the default fixed box.

## How the theme is built

The theme is **one static palette table plus one dynamic alias table**:

1. **Palette layer** (26 built-in palettes × 11 levels) is emitted as naked channels — `--zinc-100: 240 4.8% 95.9%` — once, and never changes with the theme;
2. **Semantic layer** holds every design token as a _reference_ into that table — `--background: var(--zinc-50)` — and is regenerated on every theme change. A theme switch is a reference swap, not a colour computation;
3. **Literal layer** carries the values that are not colours: dimension (`--size`), the radius ladder (`--radius` … `--radius-4xl`), the spacing grid unit (`--spacing-unit`), layering (`--z-layout` … `--z-max`), line widths and font families.

Token names follow shadcn and are **unprefixed**: `--background`, `--card` / `--popover` (+ `-foreground`), `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive` / `--success` / `--warning` / `--info` (+ `-foreground`), `--border`, `--input`, `--ring`, `--carbon`, `--chart-1` … `--chart-5`, the eight `--sidebar-*` tokens, plus our own `--mask` (the modal scrim, concentration in `--mask-alpha`). Pressed states are no longer separate tokens — compose them with an alpha modifier on the fill (`active:bg-primary/90`).

The palette layer is **static**, which is what keeps a theme switch cheap: the semantic layer only ever swaps references, so switching never recomputes a colour. The engine does **not** measure anything else — every token's level is declared in the token contract, and readability is the theme author's responsibility. `text-2xs`-style utilities, the spacing grid and the radius ladder are all declared values; check your pairs in the [theme editor](/theme-editor) (or with `axe`) rather than relying on the engine to correct them.

A token is consumed as a **channel wrapped in a function**: `hsl(var(--primary) / 0.5)`. Writing the bare `var(--primary)` as a colour silently fails (a channel triple is not a colour). Utility classes (`bg-card`, `text-muted-foreground`, `border-input`) already do the wrapping for you, and are the recommended way; when JavaScript needs the actual colour, use `resolveTokenColor` rather than string-building from the variables.

## Theme configuration

Pass a theme object to `SConfigProvider` at the root of your application:

```vue
<script setup lang="ts">
import { SConfigProvider } from '@vean/ui';
</script>

<template>
  <SConfigProvider
    :theme="{
      base: 'gray',
      primary: 'violet',
      radius: '0.5rem',
      size: 'md',
      spacing: 'default'
    }"
    persist-theme
  >
    <App />
  </SConfigProvider>
</template>
```

| Option          | Type                                                                               | Default     | What it does                                                                                                     |
| :-------------- | :--------------------------------------------------------------------------------- | :---------- | :--------------------------------------------------------------------------------------------------------------- |
| `base`          | a neutral palette key (`slate` / `mist` / `gray` / `zinc` / `neutral` / `stone` …) | `'zinc'`    | The palette every neutral token reads (surfaces, text, borders).                                                 |
| `primary`       | any palette key (26 built-ins, neutral or chromatic)                               | `'indigo'`  | The brand palette: `primary`, `ring`, `chart-1…5` and the `primary` role ramp follow it.                         |
| `feedback`      | `classic` / `vivid` / `subtle` / `modern` / `professional`                         | `'classic'` | Which palettes back the four status roles (`destructive` / `success` / `warning` / `info`).                      |
| `surfaceStyle`  | `'layered'` / `'flat'`                                                             | `'layered'` | `layered` tints the page so raised surfaces read above it; `flat` keeps every surface at the mode extreme.       |
| `size`          | `xs` / `sm` / `md` / `lg` / `xl` / `2xl`, or a length (`'15px'` / `'0.95rem'`)     | `'md'`      | The root font size — the density knob: every rem-based token scales with it.                                     |
| `radius`        | `2xs` … `2xl`, or a length                                                         | `'md'`      | The radius **seed**: the seven rungs are `calc(var(--radius) * k)`, so changing the seed moves the whole ladder. |
| `spacing`       | `compact` / `default` / `relaxed` / `spacious`, or a multiplier (0 < k ≤ 4)        | `'default'` | The spacing grid unit (`--spacing-unit`): padding, margin and gap utilities are coefficients on it.              |
| `borderOpacity` | number (0 – 1)                                                                     | `1`         | Scales the decorative hairline alpha (`--border-alpha` / `--input-alpha`). Not applied to `--mask-alpha`.        |
| `overrides`     | `{ light?: { [token]: TokenOverride }, dark?: … }`                                 | —           | Per-mode token overrides — the sharpest tool; see below. May include `token.*` refs.                             |
| `preset`        | an inline `{ light, dark }` colour set, or `{ name }` referencing a stored preset  | —           | A reusable colour set; resolved into `overrides` before the engine runs.                                         |
| `prefix`        | `false` / a string                                                                 | `false`     | Namespaces every variable (`--acme-background`). Set it only when the page hosts another design system.          |
| `format`        | `'hsl'` / `'oklch'`                                                                | `'hsl'`     | The palette layer's channel format (the semantic layer only holds references, so it does not care).              |
| `darkSelector`  | `'class'` / `'media'` / a selector                                                 | `'class'`   | How dark mode is expressed in the emitted CSS (`.dark` by default).                                              |
| `styleTarget`   | `'html'` / `':root'`                                                               | `':root'`   | Where the light block is attached.                                                                               |

`SConfigProvider` also takes `persistTheme` (read/write the theme envelope in `localStorage`), `themeConfig` (the envelope injected during SSR), `presetProvider` (resolve a stored preset name on the server), `nonce` and `isServer`.

## Custom color tokens (`overrides`)

`overrides` replaces individual tokens per mode. It has the highest priority — it is applied on top of the derived base / primary / feedback / sidebar tokens (chart colours are derived from `primary` and can be overridden per token too):

```vue
<script setup lang="ts">
import { SConfigProvider } from '@vean/ui';
</script>

<template>
  <SConfigProvider
    :theme="{
      base: 'gray',
      primary: 'violet',
      radius: '0.5rem',
      overrides: {
        light: {
          background: 'oklch(100% 0 0)',
          foreground: 'stone.950',
          card: 'oklch(100% 0 0)',
          'card-foreground': 'stone.950',
          primary: 'violet.700',
          ring: 'violet.500',
          border: 'stone.200',
          input: 'stone.200'
        },
        dark: {
          background: 'stone.950',
          foreground: 'stone.50',
          card: 'stone.900',
          'card-foreground': 'stone.50',
          primary: 'violet.400',
          ring: 'violet.600',
          border: 'oklch(100% 0 0 / 0.1)',
          input: 'oklch(100% 0 0 / 0.15)'
        }
      }
    }"
  >
    <App />
  </SConfigProvider>
</template>
```

Keys are the **token names** (`background`, `card-foreground`, `sidebar-ring`, …) — the same names the utility classes use, in kebab case. An override value takes one of five forms (the `TokenOverride` type): a palette level reference (`stone.950`), a simple key (`white` / `black`), an `hsl(...)` / `oklch(...)` colour in CSS Color 4 syntax (with an optional `/ <alpha>`), or a **token reference** `token.${name}` (e.g. `ring: 'token.primary'` — the map copies the target token's value at resolve time; colour values land before references). Colour components always carry a `%` — `hsl(238.732 83.529% 66.667%)`, `oklch(60% 0.2 250)` — never the unitless spelling (it must stay the same shape as the palette layer's channels). Raw channel triples (`0 0% 100%`) and hex / `rgb()` are outside the type — the former are format-ambiguous, and for the latter convert first with `colord(...).toHslString()` / `toOklchString()`.

**A complete colour is encoded into the theme format's channels** (a token is consumed as `hsl(var(--vean-x) / <alpha>)`, so a complete colour would invalidate every declaration): `border: 'oklch(100% 0 0 / 0.1)'` puts the channels into `--border` and the `0.1` into `--border-alpha`. An alpha written into a token that has no companion variable is dropped (use the `/N` utility modifier for transparency). A value that is neither a valid reference nor parseable (`transparent` / `inherit` / an unknown palette / **a self-reference such as `primary: 'token.primary'`** / `token.ghost` / a cyclic `token.*` chain) is **ignored**, and the token keeps its nominal value; so is a key that is not a token — a stale or hand-written key can neither reach the stylesheet nor break it.

**Notes and caveats:**

- **Light and dark are independent.** An override applies to the mode you put it in: `dark` keeps its own declared levels rather than being derived from `light`. Write both sides when you want both.
- **An override is applied verbatim.** It is not measured, corrected or reported — the engine has no opinion about readability (nothing walks a level on your behalf since decision #26).
- **Overrides are per token, not per role.** To recolour the whole brand, change `primary` (the palette) rather than every token that reads it.
- **The engine is a pure function.** Nothing here touches the DOM: the provider resolves the map, emits the alias block and patches its own `<style id="vean-theme">`.

## Saved presets (`theme.preset`)

A preset is a named colour set a user can re-apply — the theme customizer saves them into the theme envelope. Pass one inline, or reference a stored one by name:

```vue
<template>
  <SConfigProvider
    :theme="{
      base: 'gray',
      primary: 'violet',
      preset: { name: 'midnight' }
    }"
    persist-theme
  >
    <App />
  </SConfigProvider>
</template>
```

An inline preset is just an `overrides` object split by mode (`preset: { light: { … }, dark: { … } }`) and is always honoured. A `{ name }` reference is resolved against the presets carried by the theme envelope — which requires `persistTheme` on the client, and `presetProvider` (an app-level registry resolver) on the server, so SSR renders the same colours the client persisted. A name that cannot be resolved falls back to the built-in colours.

## Using the engine directly

The provider is the normal path — it owns the `<style>` element, the persisted envelope and the cross-tab sync. When you need the CSS yourself (an SSR pass, a static build, a screenshot service), the pipeline underneath is public:

```ts
import { emitThemeCss, generatePaletteCss, resolveThemeMap, resolveTokenColor } from '@vean/theme';
import { buildThemeCss } from '@vean/ui';

// resolve + emit in one call (what SConfigProvider inlines)
const css = buildThemeCss({ base: 'gray', primary: 'violet' });

// or step by step: the map is the single intermediate representation
const map = resolveThemeMap({ base: 'gray', primary: 'violet' });
emitThemeCss(map); // Layer 2 — the alias block, regenerated per theme
generatePaletteCss(); // Layer 1 — the static palette table, ship it once

// JavaScript that needs a colour value (a canvas, a chart library)
resolveTokenColor({ primary: 'violet' }, 'primary', 'dark'); // 'hsl(258.3 89.5% 66.3%)'
resolveThemeColors({}, 'light'); // every token of a mode
```

`map` is the single intermediate representation: its `light` / `dark` maps hold one `palette.level` reference per token, and `Object.keys(map.light)` is the contract's token count.

With **[UnoCSS](/overview/installation)**, `presetUi()` (or `presetVean()` when the theme lives in `vean.json`) ships the palette layer and the default alias block as its preflight, so the tokens resolve with no runtime JavaScript; `@vean/ui/styles.css` is the equivalent prebuilt stylesheet. The adapter maps every token to a utility (`bg-card`, `text-card-foreground`, `border-input`, `bg-chart-1`), the palettes to `bg-indigo-500`-style rungs, and the roles to `bg-primary-500` / `text-destructive-100` style ramps.

### Colors

The theme system uses tailwindcss color presets.

<TailwindPalette />

## Component-level Style Customization

In addition to global theme configuration, you can fine-tune individual component styles using the `ui` prop.

### Using the ui prop

Multi-slot components support overriding each slot's style classes via the `ui` prop:

```vue
<script setup lang="ts">
import { SAccordion } from '@vean/ui';

const items = [
  { title: 'Title 1', value: 'item-1', description: 'Content 1' },
  { title: 'Title 2', value: 'item-2', description: 'Content 2' }
];
</script>

<template>
  <SAccordion
    :items="items"
    :ui="{
      root: 'border-2 border-primary',
      item: 'bg-card hover:bg-accent',
      trigger: 'text-lg font-bold',
      content: 'text-sm text-muted-foreground'
    }"
  />
</template>
```

### class prop merging

All components support the `class` prop, which intelligently merges with default styles:

```vue
<template>
  <SButton class="w-full rounded-full">Custom Button</SButton>
</template>
```
