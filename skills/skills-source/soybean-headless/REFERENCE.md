# SoybeanHeadless Fundamentals

Use this file as the headless-surface overview before loading narrower references.

## Installation

```bash
pnpm add @soybeanjs/headless
```

## What the package gives you

- unstyled, accessible Vue 3 primitives
- state management and keyboard behavior
- WAI-ARIA semantics and focus management
- Compact aggregations for stable, data-driven structures
- shared composables, utilities, date helpers, and locale bundles

## Sub-path exports

```ts
import { AccordionRoot } from '@soybeanjs/headless';
import { useControllableState } from '@soybeanjs/headless/composables';
import { createMonth } from '@soybeanjs/headless/date';
import * as H from '@soybeanjs/headless/namespaced';
import { transformPropsToContext } from '@soybeanjs/headless/shared';
import type { UiClass } from '@soybeanjs/headless/types';
```

## Locale support

`@soybeanjs/headless` ships locale bundles and registration helpers under `@soybeanjs/headless/locale`.

```ts
import { en, registerLocale } from '@soybeanjs/headless/locale';
import type { LocaleMessages } from '@soybeanjs/headless/locale';
import ar from '@soybeanjs/headless/locale/ar';

registerLocale(ar);

const customMessages: LocaleMessages = {
  ...en.messages
};

registerLocale('custom', customMessages);
```

## Styling boundary

- Headless components do not ship styles.
- For multi-slot wrappers, you can inject a computed class map with `provide{Name}Ui(ui)`.
- For simple single-element components, apply classes directly without UiContext.

## Documentation routes

- `https://ui.soybeanjs.cn/llms.txt`
- `https://ui.soybeanjs.cn/llms-full.txt`
- `https://ui.soybeanjs.cn/components/{name}.md`

Those docs are shared with the styled package, but generated API summaries include headless exports too.

## Where to go next

- Load [references/composition.md](references/composition.md) for base primitives vs Compact components and custom wrapper patterns.
- Load [references/components.md](references/components.md) to browse the component families.
