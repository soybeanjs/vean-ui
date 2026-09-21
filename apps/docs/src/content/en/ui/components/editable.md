---
head:
  title: Editable
  description: 'An inline text editor that switches between preview and edit states. In preview mode the value is shown as a focusable text node (or a placeholder); focusing, double-clicking, or clicking the edit button enters edit mode, then submitting (Enter/blur/submit trigger) or cancelling (Esc/cancel trigger) returns to preview. The structure follows the Aria core + styled wrapper split: the 8 EditableRoot-family components in @vean/aria (zero styles) own the full state machine, and SEditable injects the editableVariants styles (8 slots: root/area/preview/input/controls/editTrigger/submitTrigger/cancelTrigger).'
---

# Editable

## Overview

An inline text editor that switches between preview and edit states. In preview mode the value is shown as a focusable text node (or a placeholder); focusing, double-clicking, or clicking the edit button enters edit mode, then submitting (Enter/blur/submit trigger) or cancelling (Esc/cancel trigger) returns to preview. The structure follows the Aria core + styled wrapper split: the 8 `EditableRoot`-family components in `@vean/aria` (zero styles) own the full state machine, and `SEditable` injects the `editableVariants` styles (8 slots: root/area/preview/input/controls/editTrigger/submitTrigger/cancelTrigger).

## Usage

<UsageCode component="editable" />

## Features

- 🔀 Two-state machine — preview/edit switching with `update:state` reporting `edit` / `submit` / `cancel`
- 🖱️ Activation modes — `activationMode`: `focus` (focus to edit, default), `dblclick` (double-click to edit), `none` (edit only via the edit trigger or `edit()`)
- ⌨️ Submit modes — `submitMode`: `blur` (submit on blur, default), `enter` (submit on Enter), `both`, `none` (blur cancels only); Esc always cancels
- 🔁 Controlled/uncontrolled — `modelValue` + `update:modelValue` for controlled, `defaultValue` for uncontrolled; the `submit` event carries the submitted value
- 🎛️ Editing UX — `selectOnFocus` (select all on focus), `startWithEditMode` (enter edit on mount), `maxLength`, `autoResize` (inline-grid width)
- 🧩 Aria/styled split — `EditableCompact` aggregates the 8 primitives and exposes 6 `*Props` channels (area/preview/input/editTrigger/submitTrigger/cancelTrigger)
- ♿ Accessible by default — focusable preview (`tabindex="0"`), full keyboard support (Enter submits / Esc cancels), localized trigger `aria-label`s, and a hidden input proxy (`VisuallyHiddenInput`) for forms
- 🎨 8-slot styling — root/area/preview/input/controls/editTrigger/submitTrigger/cancelTrigger plus `size` variants (xs–2xl)

## Component family

- `SEditable` (styled) — the entry wrapper; pure `defineProps` + `editableVariants` with dynamic 8-slot forwarding and `useForwardListeners` event merging
- `EditableRoot` (Aria) — the state-machine owner: holds `modelValue`/`inputValue`/`isEditing`/`placeholder`/`isEmpty`, exposes `edit`/`cancel`/`submit`; renders `data-dismissable-layer` for blur/outside-click handling; inside a `.form` container with a `name` it renders the hidden input proxy
- `EditableArea` (Aria) — the container; uses an inline-grid layout when `autoResize` is on
- `EditablePreview` (Aria) — the preview text; `tabindex = disabled ? -1 : 0`, activated on focusin/dblclick
- `EditableInput` (Aria) — the real input; activate/cancel/submit keyboard handling and `selectOnFocus` selection
- `EditableEditTrigger` / `EditableSubmitTrigger` / `EditableCancelTrigger` (Aria) — `Button`-based triggers; `aria-label` falls back to `useLocaleMessages` localized messages; disabled when `disabled || readonly`
- `EditableCompact` (Aria) — the aggregated composite of root/area/preview/input and the three triggers; slot props provide `modelValue`/`inputValue`/`isEditing`/`isEmpty`/`edit`/`cancel`/`submit`

## Demos

<PlaygroundGallery component="editable" />

- 01 Basic — controlled `v-model` + placeholder with `submit` / `update:state` events
- 02 Size — `size` variants
- 03 Disabled — `disabled`
- 04 Activation mode — `focus` vs `dblclick`
- 05 Custom styling — 8-slot `ui` overrides

## API

<ComponentApi component="editable" />

## Notes

### Architecture and benchmark differences

`EditableRoot` uses `useControllableState` to unify controlled/uncontrolled; `inputValue` (the edit buffer) is separate from `modelValue` (the committed value), and `currentValue` picks one based on the state. While editing, an external `modelValue` push does not overwrite the in-progress input (it is written back only on submit/cancel), so a controlled parent cannot stomp the user's typing. Activation (focus/dblclick/edit trigger) and submission (blur/enter/submit trigger) are decoupled both ways; `useFocusOutside`/`usePointerdownOutside` gate on `isEditing` to implement submit-on-blur. `autoResize` uses an inline-grid + `grid-template-columns: auto` layout so the input hugs its content. The API is co-designed with reka-ui's `Editable` (activation/submit modes, `selectOnFocus`, `startWithEditMode`, and the form proxy are all present); Ant Design's `Typography` editable only offers button activation plus a controlled `editing` flag; Element Plus and shadcn/ui have no equivalent component; Mantine's `EditableText` covers a subset of the activation/submit behavior.

| Capability                              | VeanUI | reka-ui | Ant Design Typography | Mantine EditableText | Element Plus | shadcn/ui |
| :-------------------------------------- | :----: | :-----: | :-------------------: | :------------------: | :----------: | :-------: |
| Aria/styled split                       |   ✅   |   ✅    |           —           |          —           |      —       |     —     |
| Activation mode (focus/dblclick/none)   |   ✅   |   ✅    |           —           |          ⚠️          |      —       |     —     |
| Submit mode (blur/enter/none/both)      |   ✅   |   ✅    |           —           |          ⚠️          |      —       |     —     |
| Esc to cancel                           |   ✅   |   ✅    |          ⚠️           |          ✅          |      —       |     —     |
| `selectOnFocus`                         |   ✅   |   ✅    |           —           |          ✅          |      —       |     —     |
| `startWithEditMode`                     |   ✅   |   ✅    |          ⚠️           |          ✅          |      —       |     —     |
| `autoResize` (width fits content)       |   ✅   |   ✅    |           —           |          —           |      —       |     —     |
| Form proxy (`name` + form hidden input) |   ✅   |   ✅    |           —           |          —           |      —       |     —     |
| Localized trigger `aria-label`          |   ✅   |   ⚠️    |           —           |          —           |      —       |     —     |
| Controlled/uncontrolled + submit event  |   ✅   |   ✅    |          ✅           |          ✅          |      —       |     —     |

`⚠️` = partial (Mantine covers activation/submit subsets via `activateOnFocus`/`submitOnBlur`; AntD covers `startWithEditMode`-like behavior through the controlled `editing` flag; reka-ui hardcodes the trigger `aria-label`, while VeanUI localizes it with `useLocaleMessages`).

### Cautions

- An external controlled update does not overwrite in-progress input: while editing, `modelValue` pushes are not written into the edit buffer — the input is written back on submit/cancel, avoiding "typing being stomped"; outside edit mode the value stays synced.
- Blur submission depends on focus leaving the component root: `useFocusOutside` listens on the document `focusin` event, so `submitMode` logic runs only when focus moves outside; with `submitMode: 'none'` blur just cancels.
- Form integration: the `VisuallyHiddenInput` proxy renders only when the component sits in a container with the `.form` class (`isFormControl`) and a `name` is provided; otherwise no hidden input is emitted.
- `placeholder` accepts a string or an `{ edit, preview }` object — separate texts for edit and preview states.
- `readonly` and `disabled` differ: `readonly` blocks entering edit (`edit()` guard + disabled triggers + readonly input) without touching the value; `disabled` additionally disables preview focus and the hidden proxy.
- A custom `preview` slot has no default `tabindex` — provide a focusable element or activate via `EditableEditTrigger`.
- With `activationMode: 'none'`, focus does not enter edit — activate only via the edit trigger or the exposed `edit()` (`defineExpose`).
- In controlled usage, listen to `submit` for the final committed value (Enter/blur/submit trigger all follow the same path); `update:modelValue` fires at the same time.

## FAQ

### How do I edit on double-click instead of focus?

Set `activationMode="dblclick"`:

```vue
<SEditable activation-mode="dblclick" default-value="Double click to edit" />
```

### How do I cancel on blur instead of submitting?

Set `submitMode="none"` — blur runs `cancel()` (no `submit`/`update:modelValue`), Esc still cancels, and Enter still submits:

```vue
<SEditable submit-mode="none" default-value="Blur cancels" />
```

### How do I trigger editing with a button?

Use `EditableEditTrigger` (available in the Aria composite), or call the exposed method via a ref:

```vue
<SEditable ref="editableRef" default-value="Edit via button" />
<button @click="editableRef?.edit()">Edit</button>
```

### How do I get the value after submitting?

Listen to the `submit` event (it fires together with `update:modelValue`):

```vue
<SEditable v-model="value" @submit="onSubmit" />
```

```ts
function onSubmit(value: string) {
  // the committed value
}
```

### How do I make the input resize to its content?

Enable `autoResize` — the input container uses an inline-grid layout and follows the content width:

```vue
<SEditable auto-resize default-value="Auto width" />
```

### How do I submit along with a native form?

Place the component inside a form container with the `.form` class and pass a `name`; the component renders a hidden input proxy that submits with the form:

```vue
<form class="form" @submit.prevent>
  <SEditable name="nickname" default-value="Nickname" />
  <button type="submit">Submit</button>
</form>
```

### How do I select all text when editing starts?

Set `selectOnFocus` — entering edit focuses the input and selects the existing content for direct overwrite:

```vue
<SEditable select-on-focus default-value="Select on focus" />
```
