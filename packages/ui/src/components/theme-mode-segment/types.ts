import type { ThemeModePreference } from '@vean/theme';
import type { SegmentOptionData, SegmentProps } from '../segment/types';

/**
 * Option data of the ThemeModeSegment component: the value is fixed to
 * `ThemeModePreference` and the label comes from the theme locale.
 */
export type ThemeModeSegmentOption = SegmentOptionData<ThemeModePreference>;

/**
 * Properties for the ThemeModeSegment component.
 *
 * A context-bound segmented control bound to the active `SConfigProvider`
 * theme. It exposes the three `ThemeModePreference` options — `auto` (follows
 * the OS `prefers-color-scheme`), `light`, and `dark` — as icon-led segment
 * options. Visual props are inherited from `SegmentProps` (with `shape`
 * defaulting to `rounded`); `items`, `modelValue`, and `defaultValue` are not
 * exposed — the option list is fixed and the state is owned by the theme
 * context shared across all theme components.
 */
export interface ThemeModeSegmentProps extends Omit<
  SegmentProps<ThemeModeSegmentOption>,
  'items' | 'modelValue' | 'defaultValue'
> {
  /**
   * Whether to render the localized label next to the scheme icon. When
   * `false`, the label stays visually hidden so each option keeps an
   * accessible name.
   *
   * @default false
   */
  showLabel?: boolean;
}
