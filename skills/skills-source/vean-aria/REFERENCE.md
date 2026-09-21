# Vean Aria Fundamentals

Use this file as the aria-surface overview before loading narrower references.

## Installation

```bash
pnpm add @vean/aria
```

## What the package gives you

- unstyled, accessible Vue 3 primitives
- state management and keyboard behavior
- WAI-ARIA semantics and focus management
- Compact aggregations for stable, data-driven structures
- shared composables, utilities, date helpers, and locale bundles

## Sub-path exports

```ts
import { AccordionRoot } from '@vean/aria';
import { useControllableState } from '@vean/aria/composables';
import { createMonth } from '@vean/aria/date';
import * as H from '@vean/aria/namespaced';
import { transformPropsToContext } from '@vean/aria/shared';
import type { UiClass } from '@vean/aria/types';
```

## Locale support

`@vean/aria` ships locale bundles and registration helpers under `@vean/aria/locale`.

```ts
import { en, registerLocale } from '@vean/aria/locale';
import type { LocaleMessages } from '@vean/aria/locale';
import ar from '@vean/aria/locale/ar';

registerLocale(ar);

const customMessages: LocaleMessages = {
  ...en.messages
};

registerLocale('custom', customMessages);
```

## Styling boundary

- Aria components do not ship styles.
- For multi-slot wrappers, you can inject a computed class map with `provide{Name}Ui(ui)`.
- For simple single-element components, apply classes directly without UiContext.

## Documentation routes

- `https://veanui.com/llms.txt`
- `https://veanui.com/llms-full.txt`
- `https://veanui.com/components/{name}.md`

Those docs are shared with the styled package, but generated API summaries include aria exports too.

## Where to go next

- Load [references/composition.md](references/composition.md) for base primitives vs Compact components and custom wrapper patterns.
- Load [references/components.md](references/components.md) to browse the component families.
