---
head:
  title: Brand Migration Guide — SoybeanUI to Vean
  description: Full migration guide for the SoybeanUI → VeanUI rename, covering package names and scope, the runtime contract renames (data-soybean-* / --soybean-*), Nuxt and UnoCSS config updates, CLI migration, plus the global replacement and verification checklists.
---

# Upgrade Guide: SoybeanUI → Vean

SoybeanUI is now **Vean** (**V**ue + Soy**bean**). This release switches the npm scope, the logical-layer package name, and the brand in one go, and also folds in the logical-layer `headless → aria` rename. Everything lands in a single version, so you only migrate once.

| Three things you need to know                                                                              |
| ---------------------------------------------------------------------------------------------------------- |
| 1. Five packages change name and scope — **every import statement must change**                            |
| 2. The `data-soybean-*` and `--soybean-*` runtime contract is renamed — **custom CSS will silently break** |
| 3. The `S` component prefix, design tokens, and the localStorage key **stay as-is**                        |

## 1. Package mapping

| Old name               | New name           | Role                                                       |
| ---------------------- | ------------------ | ---------------------------------------------------------- |
| `@soybeanjs/headless`  | **`@vean/aria`**   | Unstyled behaviour layer: a11y state machines, composables |
| `@soybeanjs/ui`        | **`@vean/ui`**     | Styled layer, `S`-prefixed components                      |
| `@soybeanjs/theme`     | **`@vean/theme`**  | Theme engine                                               |
| `@soybeanjs/ui-uno`    | **`@vean/unocss`** | UnoCSS preset                                              |
| `@soybeanjs/ui-skills` | **`@vean/skills`** | Agent skills distribution                                  |

Subpaths map **one-to-one**: replace the package name, keep everything after `/` untouched.

```diff
- import { SButton } from '@soybeanjs/ui';
- import { AccordionRoot } from '@soybeanjs/headless/accordion';
- import { useRovingFocusGroup } from '@soybeanjs/headless/composables';
- import { createTheme } from '@soybeanjs/theme';
- import { createThemeInitScript } from '@soybeanjs/theme/ssr';
- import { presetUi } from '@soybeanjs/ui-uno';
+ import { SButton } from '@vean/ui';
+ import { AccordionRoot } from '@vean/aria/accordion';
+ import { useRovingFocusGroup } from '@vean/aria/composables';
+ import { createTheme } from '@vean/theme';
+ import { createThemeInitScript } from '@vean/theme/ssr';
+ import { presetUi } from '@vean/unocss';
```

Install:

```bash
pnpm remove @soybeanjs/ui @soybeanjs/headless @soybeanjs/theme @soybeanjs/ui-uno
pnpm add @vean/ui @vean/aria @vean/theme @vean/unocss
```

> API names such as `presetUi()`, `UiUnocssOptions` and `resolveThemeMap()` are **unchanged** — only their package of origin moves.

## 2. Nuxt projects

Three config spots need updating. The third one **is not matched by the package-name rules** and is the easiest to miss:

```diff
  // nuxt.config.ts
  export default defineNuxtConfig({
-   css: ['@soybeanjs/ui/styles.css'],
-   modules: ['@unocss/nuxt', '@soybeanjs/ui/nuxt'],
+   css: ['@vean/ui/styles.css'],
+   modules: ['@unocss/nuxt', '@vean/ui/nuxt'],
    imports: {
      transform: {
-       exclude: [/headless\/dist\//]
+       exclude: [/aria\/dist\//]
      }
    }
  });
```

`imports.transform.exclude` contains a **resolved dist path**, not a package specifier, so the `@soybeanjs/headless` rule will never touch it. Update it by hand.

The module `configKey` changes too: from `@soybeanjs/ui` to `@vean/ui`. If you passed module options under the old key in `nuxt.config`, rename those as well.

## 3. UnoCSS projects

```diff
  // uno.config.ts
- import { presetUi } from '@soybeanjs/ui-uno';
+ import { presetUi } from '@vean/unocss';

- import { createTheme } from '@soybeanjs/theme';
+ import { createTheme } from '@vean/theme';
```

## 4. Runtime contract rename (⚠️ the part that fails silently)

Component **slot marker attributes** and **scoped CSS variables** are rebranded as well. TypeScript will not complain about them, so any custom stylesheet referencing the old names **fails silently**.

```diff
- [data-soybean-dialog-content] { max-width: 40rem; }
+ [data-vean-dialog-content] { max-width: 40rem; }

- [data-soybean-tree-item][data-state='open'] { font-weight: 600; }
+ [data-vean-tree-item][data-state='open'] { font-weight: 600; }

- .layout { height: var(--soybean-layout-header-height); }
+ .layout { height: var(--vean-layout-header-height); }
```

| Contract         | Scale                                                         | Typical use                                        |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| `data-soybean-*` | 511 unique attributes (`data-soybean-{family}-{slot}`)        | Custom style selectors, e2e test selectors         |
| `--soybean-*`    | 92 unique variables (scoped sizes/offsets: layout, popper, …) | Reading component measurements for adaptive layout |

**The one exception: design tokens are unaffected.** `--primary`, `--background`, `--size`, `--radius`, `--chart-*` and friends never carried a brand prefix (they stay shadcn-compatible), so they need no changes.

```css
/* No change needed here */
:root {
  --primary: 222 47% 11%;
  --size: 16px;
  --radius: 0.5rem;
}
```

If your project leans on `data-soybean-*` or `--soybean-*`, `--runtime-contract` in §6 rewrites them in one pass.

## 5. What explicitly does not change

| Unchanged                                                       | Why                                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| `S` component prefix (`SButton`, `SDialog`, `SAccordionRoot`)   | Not a single component is renamed — only the import source moves |
| Design tokens `--primary` / `--size` / `--radius` / `--chart-*` | No brand prefix; shadcn-compatible contract                      |
| `localStorage` key `__SOYBEAN_THEME`                            | Deliberately kept, so saved user themes are not silently wiped   |
| `Symbol.for('ConfigProvider')`, `UiClass` and other types       | Contain no brand string                                          |
| `@soybeanjs/cva`, `@soybeanjs/colord`                           | General-purpose utils, still in the original scope               |

> **What does the `S` stand for?** **`S` = Styled**, marking the styled-wrapper layer. It sits opposite the unprefixed primitives in `@vean/aria` (`Button`, `Dialog`) and is what lets both layers coexist in one file:
>
> ```ts
> import { Button } from '@vean/aria'; // unstyled behaviour
> import { SButton } from '@vean/ui'; // styled wrapper
> ```
>
> The prefix is unrelated to branding, so it **does not change with the rename**. Switching it to `V` would cost every downstream project a full rename for zero benefit, and would collide with Vuetify's `VBtn` / `VCard` prefix.

## 6. Migrate with `vean migrate` (or by hand)

```bash
# Preview — nothing is written by default
npx @vean/cli@latest migrate rebrand

# Apply
npx @vean/cli@latest migrate rebrand --write

# If your code contains [data-soybean-*] selectors or var(--soybean-*)
npx @vean/cli@latest migrate rebrand --write --runtime-contract

# Also migrate sbean CLI references (renames sbean.json to vean.json)
npx @vean/cli@latest migrate rebrand --write --cli

# If you hardcoded the old site, CDN or repository URLs
npx @vean/cli@latest migrate rebrand --write --new-domain veanui.com --repo-slug soybeanjs/vean-ui
```

The command is a **rule-based text rewrite** (not an AST transform): package specifiers always
apply, while the runtime-contract, CLI and hostname tiers are opt-in. It is dry-run by default,
idempotent, and never touches `node_modules`, build output, lock files or `CHANGELOG.md`.
Hostnames: `ui.soybeanjs.cn` → `--new-domain`, `r2.soybeanjs.tech` → `assets.<new-domain>`
(override with `--new-cdn`); the CDN object-path prefix `/soybeanjs/` is deliberately preserved —
rewriting it without moving the objects would 404. Full option list: [`vean migrate`](/cli#vean-migrate).

The command **only targets SoybeanUI-era projects**: a preflight looks for `@soybeanjs/*`
dependencies in `package.json`, a `sbean.json`, `@soybeanjs/*` specifiers in source,
`data-soybean-*` / `--soybean-*` contracts and `sbean` invocations. When none are present it refuses
to run — exit code 1, nothing written; a project with only old hostname links is refused as well
unless a hostname flag was passed explicitly. Use `--force` if you really need to override. Every run
ends with two project-specific blocks: **Worth adding** (opt-in flags that still match something) and
**Still manual** (only the steps that apply).

**Equivalent manual replacements** (if you would rather not run the command, replace these
longest-first; `@soybeanjs/ui` is a prefix of `@soybeanjs/ui-uno` / `@soybeanjs/ui-skills`, so the
order matters):

| From                   | To             | Applies to                                                          |
| ---------------------- | -------------- | ------------------------------------------------------------------- |
| `@soybeanjs/headless`  | `@vean/aria`   | imports, Nuxt `modules`, docs                                       |
| `@soybeanjs/ui-uno`    | `@vean/unocss` | imports, UnoCSS config                                              |
| `@soybeanjs/ui-skills` | `@vean/skills` | imports                                                             |
| `@soybeanjs/ui`        | `@vean/ui`     | imports, `css`, Nuxt `modules`, module `configKey`                  |
| `@soybeanjs/theme`     | `@vean/theme`  | imports                                                             |
| `data-soybean-`        | `data-vean-`   | custom CSS selectors, e2e selectors, scripts (§4)                   |
| `--soybean-`           | `--vean-`      | custom CSS variables (§4)                                           |
| `sbean`                | `vean`         | CLI commands and references (the config file name is handled below) |

> Do not touch `@soybeanjs/cva` / `@soybeanjs/colord`, which stay in the original scope.

**Still manual after the command:**

1. Delete `pnpm-lock.yaml` / `package-lock.json`, reinstall and swap packages: `pnpm remove @soybeanjs/ui @soybeanjs/headless && pnpm add @vean/ui @vean/aria`.
2. Verify the Nuxt `imports.transform.exclude` reads `/aria\/dist\//` (the command rewrites that string; double-check the config itself).
3. Update custom registry / mirror URLs to the new domain; the old host serves path-preserving redirects during the transition (§9).
4. `sbean.json`: with `--cli` the command renames it to `vean.json`; if a `vean.json` already exists the command keeps both and you merge them by hand.

Finish with the verification checklist in §8.

## 7. CLI migration (`sbean` → `vean`)

```diff
- npx sbean add button
+ npx @vean/cli@latest add button

- pnpm sbean init
+ pnpm dlx @vean/cli@latest init
```

Rename the config file as well:

```bash
git mv sbean.json vean.json
```

The `init` / `add` / `build` / `diff` / `mcp` subcommands and their flags are **unchanged** — only the binary name and the config filename move.

## 8. Migration checklist

```bash
# 1. Old package names should be gone
#    (cva / colord / ui-x are out of scope and may still appear)
rg "@soybeanjs/(headless|ui|theme|ui-uno|ui-skills)" . --glob '!node_modules' --glob '!*lock*'
#    Expect: no output

# 2. The runtime contract should be gone
#    (unless you intentionally kept old selectors)
rg "data-soybean-|--soybean-" . --glob '!node_modules'
#    Expect: no output

# 3. Typecheck and build
pnpm typecheck && pnpm build
```

- [ ] All five old packages replaced in `package.json`
- [ ] `pnpm-lock.yaml` deleted and dependencies reinstalled
- [ ] Nuxt: `modules`, `css`, `imports.transform.exclude`, and the module `configKey` updated
- [ ] UnoCSS: preset import source updated
- [ ] `[data-soybean-*]` / `var(--soybean-*)` in custom CSS replaced
- [ ] Old attribute selectors in e2e tests replaced
- [ ] `sbean.json` renamed to `vean.json`; `sbean` commands switched to `vean`
- [ ] `pnpm typecheck` and `pnpm build` pass

## 9. Transition period

- The old packages receive one final forwarder release (re-exporting `@vean/*` with a console warning). They stay installable but get no further updates.
- The old domain (`ui.soybeanjs.cn`) does **path-preserving 301s**: `/r/*`, `/schema/*`, `/components/*.md`, `/llms*.txt` are reachable at the same paths on the new domain (`veanui.com`), so **existing installations of the old `sbean` CLI keep working**. Both domains stay online for at least 12 months.
- Once the transition ends, the old packages are marked `deprecated` and the old domain keeps its 301s until SEO equity has fully transferred. **Migrate now rather than relying on the forwarder packages.**
