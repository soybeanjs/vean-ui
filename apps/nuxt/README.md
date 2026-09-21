# @vean/nuxt

English | [中文](./README.zh-CN.md)

Minimal Nuxt integration fixture for `@vean/ui`.

## 📖 Overview

This app verifies the repository's Nuxt module and UnoCSS wiring. It is a
self-contained minimal demo page rather than a full example app:

- Auto-import of `S`-prefixed components via the Nuxt module
- UnoCSS integration for utility-first styling
- Local `SConfigProvider` theme context (`app/theme.ts`) with SSR-safe
  initialization via `createThemeInitScript`
- `@nuxtjs/i18n` module configuration for `en` and `zh-CN`

## 🛠 Development

```bash
# Install dependencies
pnpm install

# Start Nuxt dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🏗 Tech Stack

- **Nuxt 4** — Vue framework
- **@vean/ui** — Styled component library
- **@vean/ui/nuxt** — Nuxt module for auto-registration
- **UnoCSS** — Utility-first CSS engine
- **Vue I18n** — Internationalization

## 📁 Project Structure

```
apps/nuxt/
├── app/
│   ├── app.vue       # Minimal demo page wrapped in SConfigProvider
│   └── theme.ts      # Local theme context provider
├── nuxt.config.ts    # UI module, i18n, UnoCSS
├── uno.config.ts     # Shared Vean preset stack
├── package.json
└── tsconfig.json
```

## Current Fixture Limits

- The Nuxt i18n configuration references `en.json` and `zh-CN.json`, but locale
  fixture files are not currently present under `apps/nuxt`. Validate or add
  them before using this as an i18n reference.
- The workspace currently has no dedicated `typecheck` script or integration
  test for this fixture.

See [Project architecture](../../docs/architecture.md) for the complete
cross-app dependency graph.
