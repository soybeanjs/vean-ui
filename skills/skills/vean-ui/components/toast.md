# Toast

Source URL: https://veanui.com/components/toast
Markdown URL: https://veanui.com/components/toast.md
Category: Feedback
Description: Transient notifications that appear in a viewport and auto-dismiss. SToastProvider renders the toast viewports and the toast imperative API creates, updates, dismisses, and inspects notifications. It supports six types, six positions, stacking/expansion, swipe-to-dismiss, promise toasts, rich color and inverted themes, and a keyboard hotkey to focus the list.

## Overview

Transient notifications that appear in a viewport and auto-dismiss. `SToastProvider` renders the toast viewports and the `toast` imperative API creates, updates, dismisses, and inspects notifications. It supports six types, six positions, stacking/expansion, swipe-to-dismiss, promise toasts, rich color and inverted themes, and a keyboard hotkey to focus the list.

Use it for global, non-blocking feedback (saved, errors, upload progress). Prefer `alert` for inline callouts near content, and `dialog` for blocking confirmations that need a decision.

## Usage

Mount one `SToastProvider` near your app root. If your app is already wrapped with `SConfigProvider`, a default `SToastProvider` is rendered automatically unless `customToast` is set to `true`.

Usage examples for toast are rendered on the site.

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

Interactive demos for toast are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (2): Toaster, ToastProvider.

### Toaster

#### Props

Properties for the Toaster component.

- `id`: Id. (type `string`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `hotkey`: Hotkey. (type `string[]`; optional)
- `customAriaLabel`: Custom aria label. (type `string`; optional)
- `containerAriaLabel`: Container aria label. (type `string`; optional)
- `position`: Position. (type `ToastPosition`; optional)
- `defaultExpanded`: Whether default expanded. (type `boolean`; optional)
- `duration`: The duration (in milliseconds) before the toast automatically closes. Set to `0` or `Infinity` to disable auto-dismissal. (type `number`; optional)
- `gap`: Gap. (type `number`; optional)
- `offset`: The maximum number of visible toasts per position. (type `ToastOffset`; default `3`; optional)
- `visibleCounts`: Visible counts. (type `number`; optional)
- `swipeDirections`: Swipe directions. (type `SwipeDirection[]`; optional)
- `showIcon`: Whether to show an icon. (type `boolean`; optional)
- `showClose`: Whether toasts show a close button by default. A toast-level `showClose` takes precedence over this default. (type `boolean`; default `true`; optional)
- `icons`: Icons. (type `Partial<Record<ToastIconType, IconValue>>`; optional)
- `toastProps`: Properties forwarded to the toast element. (type `LiHTMLAttributes`; optional)
- `wrapperProps`: Properties forwarded to the wrapper element. (type `HTMLAttributes`; optional)
- `contentProps`: Properties forwarded to the content element. (type `HTMLAttributes`; optional)
- `titleProps`: Properties forwarded to the title element. (type `HTMLAttributes`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `HTMLAttributes`; optional)
- `iconProps`: Properties forwarded to the icon component. (type `HTMLAttributes`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `HTMLAttributes`; optional)
- `actionProps`: Properties forwarded to the action element. (type `HTMLAttributes`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `HTMLAttributes`; optional)
- `closeProps`: Properties forwarded to the close element. (type `HTMLAttributes`; optional)

### ToastProvider

#### Props

Properties for the ToastProvider component.

- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `ToastUi`; optional)
- `id`: Id. (type `string`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `hotkey`: Hotkey. (type `string[]`; optional)
- `customAriaLabel`: Custom aria label. (type `string`; optional)
- `containerAriaLabel`: Container aria label. (type `string`; optional)
- `position`: Position. (type `ToastPosition`; optional)
- `defaultExpanded`: Whether default expanded. (type `boolean`; optional)
- `duration`: The duration (in milliseconds) before the toast automatically closes. Set to `0` or `Infinity` to disable auto-dismissal. (type `number`; optional)
- `gap`: Gap. (type `number`; optional)
- `offset`: The maximum number of visible toasts per position. (type `ToastOffset`; default `3`; optional)
- `visibleCounts`: Visible counts. (type `number`; optional)
- `swipeDirections`: Swipe directions. (type `SwipeDirection[]`; optional)
- `showIcon`: Whether to show an icon. (type `boolean`; optional)
- `showClose`: Whether toasts show a close button by default. A toast-level `showClose` takes precedence over this default. (type `boolean`; default `true`; optional)
- `icons`: Icons. (type `Partial<Record<ToastIconType, IconValue>>`; optional)
- `toastProps`: Properties forwarded to the toast element. (type `LiHTMLAttributes`; optional)
- `wrapperProps`: Properties forwarded to the wrapper element. (type `HTMLAttributes`; optional)
- `contentProps`: Properties forwarded to the content element. (type `HTMLAttributes`; optional)
- `titleProps`: Properties forwarded to the title element. (type `HTMLAttributes`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `HTMLAttributes`; optional)
- `iconProps`: Properties forwarded to the icon component. (type `HTMLAttributes`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `HTMLAttributes`; optional)
- `actionProps`: Properties forwarded to the action element. (type `HTMLAttributes`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `HTMLAttributes`; optional)
- `closeProps`: Properties forwarded to the close element. (type `HTMLAttributes`; optional)

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
