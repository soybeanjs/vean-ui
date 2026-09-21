---
head:
  title: Playground
  description: 'Run the component examples in the browser and switch between the UI and Chart libraries.'
---

# Playground

> Every shipped example, rendered live in the browser.

The playground lists the example SFCs bundled with the docs site and runs the selected one for real — no static snapshots.

## How it works

- **Library** — the select in the card header switches between `Aria`, `UI`, `Admin` and `Chart`. Examples currently exist for `UI` and `Chart`; the remaining libraries show an empty state until their examples land.
- **Tabs** — one tab per example folder (`apps/docs/src/examples/<library>/<component>/index.vue`).
- **Viewport** — every preview carries a screen-resolution switcher. `Desktop` is the fluid default; `Mobile` and `Tablet` pin the frame to a device width (390 px / 768 px) so responsive behaviour can be inspected without resizing the browser; `Fullscreen` lifts the preview into a viewport-filling layer, left with `Esc` or the exit button. Each example keeps its own resolution, and the frame publishes it through `provideViewportContext`, so components that resolve a mobile mode themselves (`SLayout`, `SAppShell`) switch with the switcher instead of the browser window.
- **Deep links** — the active tab is mirrored to the `?tab=` query parameter, so a specific example can be shared by URL.

## Where examples come from

Examples are plain SFCs under `apps/docs/src/examples/`. The same files back the `## Demos` section of every component page, so a change in the playground is a change in the documentation.
