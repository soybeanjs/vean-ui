---
head:
  title: Toast
  description: 'Transient notifications that appear in a viewport and auto-dismiss. SToastProvider renders the toast viewports and the toast imperative API creates, updates, dismisses, and inspects notifications. It supports six types, six positions, stacking/expansion, swipe-to-dismiss, promise toasts, rich color and inverted themes, and a keyboard hotkey to focus the list.'
---

# Toast

## Overview

Transient notifications that appear in a viewport and auto-dismiss. `SToastProvider` renders the toast viewports and the `toast` imperative API creates, updates, dismisses, and inspects notifications. It supports six types, six positions, stacking/expansion, swipe-to-dismiss, promise toasts, rich color and inverted themes, and a keyboard hotkey to focus the list.

Use it for global, non-blocking feedback (saved, errors, upload progress). Prefer `alert` for inline callouts near content, and `dialog` for blocking confirmations that need a decision.

## Usage

Mount one `SToastProvider` near your app root. If your app is already wrapped with `SConfigProvider`, a default `SToastProvider` is rendered automatically unless `customToast` is set to `true`.

<UsageCode component="toast" />

## Features

- ⚡ Imperative API — `toast()` plus `toast.success/error/warning/info/loading/custom/message/promise/dismiss`
- 🎨 6 types — `default`/`success`/`info`/`warning`/`error`/`loading` with default icons
- 📍 6 positions — `top-left`/`top-right`/`top-center`/`bottom-left`/`bottom-right`/`bottom-center`
- 🗂️ Stacking — `visibleCounts` limits visible toasts per position; hover expands the stack (`defaultExpanded`)
- 👆 Swipe to dismiss — drag left/right/up/down (configurable `swipeDirections`) to remove
- ⏱️ Auto-dismiss — `duration` per toast/provider; `0` or `Infinity` disables; pauses on hover and hidden-tab
- 🔮 Promise toasts — `toast.promise(promise, { loading, success, error })` with HTTP/Error handling
- 🎛️ Actions — `action`/`cancel` buttons with callbacks; `custom` for fully custom content
- ♿ Accessible — `aria-live="polite"` region, focus management with focus return, and a hotkey (default `Alt+T`) to focus the list

## Component family

- `SToastProvider` (styled) — the entry provider; injects `toastVariants` and the animation stylesheet
- `ToastProvider` (Aria) — thin wrapper over `Toaster`
- `Toaster` (Aria) — the state owner; subscribes to `ToastState`, manages stack/expand/focus, renders the 6 viewports
- `Toast` (Aria) — a single toast; auto-close timer, swipe logic, height measurement, action/cancel/close
- `toast` (imperative) — the shared `toast` controller (`ToastState` observer) exposed on `@vean/ui`

## Demos

<PlaygroundGallery component="toast" />

## API

<ComponentApi component="toast" />

### Imperative `toast` methods

| Method                                                                      | Description                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------- |
| `toast(message, data?)`                                                     | Show a `default` toast; returns the toast id.         |
| `toast.success/error/warning/info/loading(message, data?)`                  | Show a typed toast.                                   |
| `toast.custom(component, data?)`                                            | Show a fully custom VNode.                            |
| `toast.promise(promise, { loading, success, error, description, finally })` | Bind a promise lifecycle to a toast.                  |
| `toast.dismiss(id?)`                                                        | Dismiss one toast, or all toasts when no id is given. |
| `toast.getHistory()`                                                        | Read all created toasts.                              |
| `toast.getToasts()`                                                         | Read the currently active (non-dismissed) toasts.     |

Common `data` options: `description`, `position`, `duration`, `action`/`cancel` (+ `onAction`/`onCancel`), `icon`, `richColor`, `inverted`, `showClose`, `dismissible`, `toasterId`, `id`, `ui`.

## Notes

### Architecture and benchmark differences

`Toaster` is a self-contained state owner that subscribes to a module-level `ToastState` observer and drives stacking/expansion, swipe, focus management and the auto-close timers, while `SToastProvider` only injects the recipe classes and the animation stylesheet. This is an imperative-first model like Ant Design's `message`/`notification`, Element Plus `ElMessage`, Mantine `notifications` and Naive UI `useMessage` — unlike shadcn/ui which has no global toast primitive. VeanUI distinguishes itself with stacked/expandable toasts, swipe-to-dismiss, promise toasts, and a focus hotkey, matching the ergonomics of Sonner while keeping an Aria/styled split.

| Capability                  | VeanUI | shadcn/ui | Ant Design message | Element Plus ElMessage | Mantine notifications | Naive UI useMessage |
| :-------------------------- | :----: | :-------: | :----------------: | :--------------------: | :-------------------: | :-----------------: |
| Imperative API              |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| Types (success/error/…)     |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| Positions (6)               |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| Stack / expand              |   ✅   |     —     |         —          |           —            |          ✅           |          —          |
| Swipe to dismiss            |   ✅   |     —     |         —          |           —            |           —           |          —          |
| Promise toasts              |   ✅   |     —     |         ✅         |           —            |          ✅           |         ✅          |
| Rich color / inverted       |   ✅   |     —     |         ✅         |           —            |           —           |          —          |
| Pause on hover / hidden tab |   ✅   |     —     |         ✅         |           ✅           |          ✅           |         ✅          |
| Focus hotkey                |   ✅   |     —     |         —          |           —            |           —           |          —          |

`—` = unsupported or a different interaction model.

### Cautions

- A mounted `SToastProvider` is required to render toasts; `SConfigProvider` mounts one automatically (unless `customToast`).
- `duration` of `0` or `Infinity` disables auto-dismiss; the timer pauses while the toast is hovered, expanded, or the tab is hidden.
- `visibleCounts` (default `3`) limits visible toasts per position; older toasts stack behind and expand on hover when `defaultExpanded`.
- Toasts are swipe-dismissible by default; set `dismissible: false` to disable (e.g. for `loading`).
- The viewport region is `aria-live="polite"`; the default hotkey `Alt+T` focuses the toast list. Override `hotkey`/`containerAriaLabel` as needed.

### Roadmap

No blocking gaps identified for the core toast API.

## FAQ

### How do I show a basic toast?

```ts
import { toast } from '@vean/ui';

toast('Changes saved');
```

### How do I show a typed toast?

```ts
toast.success('All good');
toast.error('Something went wrong');
toast.loading('Uploading…');
```

### How do I show a promise toast?

```ts
toast.promise(fetchData(), {
  loading: 'Loading…',
  success: data => `Loaded ${data.length} items`,
  error: 'Failed to load'
});
```

### How do I change the position or duration?

Pass `data` options to the call (or set provider defaults):

```ts
toast('Bottom left', { position: 'bottom-left', duration: 5000 });
```

### How do I keep a toast from auto-dismissing?

Set `duration: Infinity`:

```ts
toast('Stays until dismissed', { duration: Infinity });
```

### How do I render custom content?

Use `toast.custom` with a VNode, or the `custom` option:

```ts
toast.custom(h(VNode));
```
