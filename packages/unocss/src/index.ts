/**
 * `@vean/unocss` — UnoCSS preset for Vean.
 *
 * Token 单一权威是 `@vean/theme`；本包只做适配：
 * - `preset.ts` 组装推荐 preset 栈（wind3 + animations + scrollbar + fonts + theme preflight）
 * - `theme.ts` 从 `@vean/theme` 派生 theme.colors / theme 键映射与 token preflight
 * - `animations.ts` 本地动画 preset（替代 `unocss-preset-animations`）
 * - `scrollbar.ts` 本地滚动条样式 preset（替代 `unocss-preset-scrollbar`）
 * - `global-css.ts` 生成全局基础样式
 * - `vean.ts` 读取 `vean.json` 的桥接 preset
 *
 * 按功能拆分文件，这里统一汇总导出。
 */
export { presetUi, resolveWind3Dark } from './preset';
export { presetAnimations } from './animations';
export type { PresetAnimationsOptions } from './animations';
export { presetScrollbar } from './scrollbar';
export type { PresetScrollbarOptions } from './scrollbar';
export {
  buildPaletteColors,
  buildRoleRampColors,
  buildSemanticColors,
  buildThemeColors,
  buildThemeEntries,
  buildThemePreflight,
  cssAlphaColorRef,
  cssColorRef
} from './theme';
export { buildGlobalCss } from './global-css';
export { presetVean } from './vean';
export type { VeanPresetOptions } from './vean';
export type { UiUnocssOptions } from './options';
