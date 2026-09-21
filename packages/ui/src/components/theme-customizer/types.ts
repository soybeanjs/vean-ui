import type { ClassValue, UiClass } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * the selectable sections of the theme customizer.
 */
export type ThemeCustomizerSection =
  | 'mode'
  | 'palette'
  | 'radius'
  | 'size'
  | 'spacing'
  | 'font'
  | 'scheme'
  | 'advanced';

/**
 * the control surface of the theme customizer shell.
 *
 * `root` is the outer box (the fixed width / height lives there, so a host can
 * resize it through `ui.root`); `tabs` / `content` drive the panel scroller and
 * `panel` / `actions` are the inner regions.
 */
export type ThemeCustomizerUiSlot = 'root' | 'tabs' | 'content' | 'panel' | 'actions';

/**
 * the slot-class map of the theme customizer shell.
 */
export type ThemeCustomizerUi = UiClass<ThemeCustomizerUiSlot>;

/**
 * Properties for the ThemeCustomizer component.
 *
 * A real-app reusable theme settings body. It does not own any container
 * (popover / drawer / sidebar) — the caller hosts it and decides the shell.
 */
export interface ThemeCustomizerProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component shell.
   *
   * `ui.root` carries the outer box, so a host can drop the default fixed width
   * / height (`w-96 h-[70vh]`) when it already constrains the surface itself.
   */
  ui?: Partial<ThemeCustomizerUi>;
  /**
   * The sections to show (defaults to all).
   */
  sections?: ThemeCustomizerSection[];
  /**
   * The size forwarded to the underlying controls.
   */
  size?: ThemeSize;
  /**
   * Whether to persist changes to storage.
   *
   * @default true
   */
  persist?: boolean;
  /**
   * Whether to show the bottom action row (save preset / reset).
   *
   * @default true
   */
  showActions?: boolean;
  /**
   * Resolve a label key (section / group / variant token) to a display string.
   */
  labelResolver?: (key: string) => string;
}
