---
head:
  title: Card
  description: 'A container that groups related content and actions into a bordered, shadowed surface. SCard is a UI-only composition over the admitted collapsible primitives (CollapsibleRoot/CollapsibleContent/CollapsibleTrigger) plus its own header/title/description/footer chrome, styled by the cardVariants recipe (8 slots, 6 sizes, scrollable/split flags).'
---

# Card

## Overview

A container that groups related content and actions into a bordered, shadowed surface. `SCard` is a **UI-only** component: it composes the admitted Aria `collapsible` primitives (`CollapsibleRoot` / `CollapsibleContent` / `CollapsibleTrigger`) for the only real behavior a card has — collapsing — and owns its own header/title/description/footer chrome, styled by the `cardVariants` recipe (8 slots, 6 sizes, `scrollable`/`split` flags).

Use it for dashboards, profile blocks, settings panels, or any content that benefits from a titled, sectioned container. Prefer `list` or `table` for repetitive data rows, and `popover`/`dialog` for floating or modal surfaces.

The card is **collapsible by default** — the content area animates open/closed and can be driven with `v-model:open`. There is no Aria `card` family: the chrome nodes are presentation-only, so they live in the UI layer and keep `data-vean-card-*` attributes for styling and tests.

## Usage

<UsageCode component="card" />

## Features

- 🧩 UI-only over admitted primitives — the collapsible behavior comes from the Aria `collapsible` family; `SCard` owns the chrome and injects the `cardVariants` classes through `provideCollapsibleUi`
- 🧱 Composite structure — `header`/`title`/`description`/`content`/`footer` plus `title-leading`/`title-trailing`/`extra` slots
- 🔽 Collapsible — the content animates open/closed (`CollapsibleRoot`/`CollapsibleContent`), controlled with `v-model:open`/`defaultOpen`
- ➗ Split sections — `split` adds `divide-y` dividers between title/content/footer
- 📜 Scrollable content — `scrollable` makes the content area scroll when it exceeds the card height
- 🎨 6 sizes — xs–2xl `size` matching `ThemeSize`
- 🎛️ Per-part control — `title`/`description` as props or slots; `headerProps`/`contentProps`/`footerProps`/`titleProps` forwarded to each part
- ♿ Accessible by default — title renders as a real `<h3>`, the collapsible trigger exposes `aria-expanded`, and `axe-core` reports zero violations

## Component family

- `SCard` — the entry component; renders `CollapsibleRoot` (`defaultOpen: true`) plus the `header` / `title-root` / `title` / `description` / `content` / `footer` nodes, and feeds the `cardVariants` recipe to `provideCollapsibleUi`
- `SCardCollapsibleTrigger` — the collapsible trigger bound to the card state; renders a chevron `SButtonIcon` by default and exposes the `open` state through its slot props

## Demos

<PlaygroundGallery component="card" />

## API

<ComponentApi component="card" />

## Notes

### Architecture and benchmark differences

`Card` is the **UI-only** exemplar of the Aria admission rule: its only real logic is collapsing, which the admitted `collapsible` family already provides, so no Aria `card` family exists. `SCard` owns the structure orchestration (header/footer visibility, default title/description) and hands the recipe's `root` / `content` / `trigger` slots to `provideCollapsibleUi`, so `CollapsibleRoot` / `CollapsibleContent` / `CollapsibleTrigger` resolve their own classes from `cardVariants`. This mirrors shadcn/ui's composition-first approach, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single styled card with `title`/`extra`/`actions` props. VeanUI makes the card **collapsible by default** through the `CollapsibleRoot` primitive, a deliberate extension most libraries do not offer on a card; `split` and `scrollable` are toggled via recipe variants rather than layout props.

| Capability                   | VeanUI | shadcn/ui | Ant Design Card | Element Plus Card | Mantine Card | Naive UI Card |
| :--------------------------- | :----: | :-------: | :-------------: | :---------------: | :----------: | :-----------: |
| Aria/styled split            |   ✅   |    ✅     |        —        |         —         |      —       |       —       |
| Header / title / description |   ✅   |    ✅     |       ✅        |        ✅         |      ✅      |      ✅       |
| Footer                       |   ✅   |    ✅     |       ✅        |        ✅         |      ✅      |      ✅       |
| Extra (actions) slot         |   ✅   |     —     |       ✅        |        ✅         |      ✅      |      ✅       |
| Collapsible content          |   ✅   |     —     |        —        |         —         |      —       |       —       |
| Split / divider              |   ✅   |     —     |       ✅        |        ✅         |      ✅      |       —       |
| Scrollable content           |   ✅   |     —     |       ✅        |         —         |      —       |      ✅       |
| Size variants (6)            |   ✅   |     —     |       ✅        |        ✅         |      ✅      |      ✅       |
| Per-part `*Props` channels   |   ✅   |    ✅     |        —        |         —         |      —       |       —       |

`—` = unsupported or a different interaction model.

### Cautions

- The card is collapsible and defaults to open (`defaultOpen: true`). When collapsed, the content (and footer) is removed from the flow; footer visibility depends on the open state.
- The title renders as a fixed `<h3>`. If your page's heading hierarchy differs, wrap or restyle the title so it does not skip levels.
- The content node carries `tabindex="-1"` so a scrollable body can receive programmatic focus; it is not an interactive control by itself. Override it through `contentProps`.
- `SCardCollapsibleTrigger` renders an icon-only button, so pass `aria-label` (e.g. `aria-label="Toggle card content"`) to give it an accessible name.
- `split` applies `divide-y`; combine it with a `size` to control the vertical rhythm. `scrollable` only takes effect when the card has a constrained height.
- The content padding adjusts automatically based on `data-header-visible`/`data-footer-visible` (and the collapsible `data-state`) so a bare content-only card still looks balanced.

### Roadmap

No blocking gaps identified for the core card API. A `card`-level interactive action bar / `CardActions` shortcut and hover-lift style variants are evaluated enhancements tracked in `docs/roadmap.md`.

## FAQ

### How do I build a card with a title and description?

Pass `title`/`description` props (or the matching slots):

```vue
<SCard title="Settings" description="Manage your preferences">
  <p>Body content</p>
</SCard>
```

### How do I add actions to the header?

Use the `extra` slot (or `title-leading`/`title-trailing` around the title):

```vue
<SCard title="Profile">
  <template #extra><SButton variant="pure">Edit</SButton></template>
  <p>Body content</p>
</SCard>
```

### How do I make a collapsible card?

Bind `open` with `v-model` (or set `default-open`):

```vue
<SCard v-model:open="open" title="Collapsible">
  <p>This content can collapse.</p>
</SCard>
```

### How do I make the content scrollable?

Keep the card height constrained and set `scrollable`:

```vue
<SCard scrollable class="h-80" title="Long list">
  <p v-for="i in 50" :key="i">Row {{ i }}</p>
</SCard>
```

### How do I split the sections with dividers?

Set `split` to add `divide-y` dividers between header/content/footer:

```vue
<SCard split title="Divided">
  <template #footer><SButton>Save</SButton></template>
  <p>Body content</p>
</SCard>
```
