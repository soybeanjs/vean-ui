# UI THEME SYSTEM

> 本目录是主题引擎在 UI 层的接线（适配器 / 状态核心 / 面板元数据）。引擎本身的架构、token 契约与接入手册见 [docs/design/theme.md](../../../../docs/design/theme.md)（§0 是 AI Agent 速览）。

Design tokens, class merging, and size context for the styled layer.

## FILES

| File        | Role                                                                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`  | `ThemeColor` (8 role colors: primary, secondary, accent, destructive, success, warning, info, carbon), `ThemeSize` (xs…2xl), `ThemePresetColors` / `ThemePresetInput` |
| `config.ts` | `themeSizeMap` (px values per size), `themeSizeRatio` (relative to md=16px)                                                                                           |
| `index.ts`  | Barrel re-export                                                                                                                                                      |

## KEY CONCEPTS

- **Direct recipe merge**: multi-slot wrappers pass `props.ui` and local slot overrides directly into `scv()` results instead of going through a separate helper.

## CONVENTIONS

- Size ratio is relative to `md` (16px = 1.0). Use `themeSizeRatio` for proportional scaling.
- `ThemeColor` and `ThemeSize` are the canonical variant axis types — variant definitions in components must use these.
- Slot-based wrappers should prefer `scv()` recipe calls with direct merge args, while single-class wrappers should use `${name}Variants({...}, props.class)` directly.
- Theme-layer changes can cascade into most UI wrappers; if they alter public class contracts or variant axes, also verify generated UI component metadata and affected docs/playground surfaces.
