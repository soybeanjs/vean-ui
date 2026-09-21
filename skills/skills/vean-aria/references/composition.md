# Aria Composition Patterns

Use this reference when the user is composing custom wrappers or deciding between primitive parts and Compact components.

## Base primitives

Use base primitives when you need full control over structure and styling.

Example shape:

- `DialogRoot`
- `DialogTrigger`
- `DialogPortal`
- `DialogOverlay`
- `DialogContent`
- `DialogTitle`
- `DialogDescription`

This pattern is best when your layout is custom or when you need to place slots in exact DOM positions.

## Compact components

Use Compact components when the structure is stable and the input is data-driven.

Examples:

- `AccordionCompact`
- `TableCompact`
- `CheckboxGroupCompact`

Compact components reduce boilerplate by keeping item iteration and default content composition inside aria.

## Custom styled wrappers

For multi-slot components, compute your own slot classes and inject them with `provide{Name}Ui(ui)`.

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AccordionRoot, provideAccordionUi } from '@vean/aria';

const ui = computed(() => ({
  root: 'space-y-1',
  item: 'border rounded-md',
  trigger: 'flex w-full items-center py-3 px-4',
  content: 'px-4 pb-3 text-sm',
  header: 'flex',
  description: ''
}));

provideAccordionUi(ui);
</script>

<template>
  <AccordionRoot>
    <slot />
  </AccordionRoot>
</template>
```

For single-element components such as `Button`, there is no UiContext. Apply classes directly.

## Controlled vs uncontrolled

- Use `v-model` or explicit model props when you need external state control.
- Use `default*` props when you only need an initial value.

## Where to go next

- Load [components.md](components.md) to find the component family.
- Then open the exact shared component reference file for the component you need.
