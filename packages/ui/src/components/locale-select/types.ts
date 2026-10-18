import type { IconValue } from '@vean/aria';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the LocaleSelect component.
 *
 * A dropdown that offers the locales registered in `@vean/aria`'s locale
 * registry (`listLocales()`). Only registered locales appear, so every option
 * is a locale whose messages actually resolve — `en` and `zh-CN` are
 * pre-registered, everything else appears once the app calls
 * `registerLocale(...)` during setup.
 *
 * The component never writes the locale into `SConfigProvider`: it is either
 * controlled through `v-model:locale` or, when that is omitted, reads the
 * provider's `locale` for display only.
 */
export interface LocaleSelectProps {
  /**
   * The controlled locale key (`v-model:locale`).
   *
   * When omitted, the trigger displays the parent `SConfigProvider`'s `locale`
   * and the component emits `update:locale` without owning the value.
   */
  locale?: string;
  /**
   * Explicit locale keys to offer, in the given order. Keys missing from the
   * registry are dropped, so this narrows and reorders the registry rather than
   * extending it.
   *
   * Defaults to every registered locale, in registration order.
   */
  locales?: string[];
  /**
   * Visual size of the select trigger.
   *
   * @default 'md'
   */
  size?: ThemeSize;
  /**
   * Whether to render a leading icon in the trigger and in each option.
   *
   * There is no built-in locale-to-icon map on purpose: flags identify
   * countries, not languages (`en` is not "the US", `ar` spans 20+ countries,
   * `es` spans 20+ more), so the default is text-only. Supply `icons` to opt in.
   *
   * @default false
   */
  showIcon?: boolean;
  /**
   * Per-locale icon overrides, keyed by locale key. Only rendered when
   * `showIcon` is on. Any Iconify collection works, e.g.
   * `{ 'zh-CN': 'circle-flags:cn' }`.
   */
  icons?: Record<string, IconValue>;
  /**
   * Fallback icon for the trigger when the selected locale has no entry in
   * `icons`.
   *
   * A per-locale `icons[locale]` wins over this, because a locale-specific
   * icon is the more informative of the two; `triggerIcon` is only what the
   * trigger shows when no per-locale icon applies.
   *
   * @default 'lucide:languages'
   */
  triggerIcon?: IconValue;
  /**
   * Placeholder text rendered when the resolved locale is not registered.
   *
   * @default 'Select a locale'
   */
  placeholder?: string;
  /**
   * Accessible name for the trigger.
   *
   * The trigger has no visible text label of its own — it shows the selected
   * locale name — so without this the button would be unnamed for assistive
   * technology (axe `button-name`). Override it to localize the control's name.
   *
   * @default 'Language'
   */
  ariaLabel?: string;
}
