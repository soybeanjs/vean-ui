import type {
  PageTabsCompactEmits,
  PageTabsCompactProps,
  PageTabsCompactSlots,
  PageTabsOptionData,
  PageTabsUi
} from '@vean/aria/page-tabs';
import type { ClassValue } from '@vean/aria/types';
import type { PageTabsVariant } from '@/styles/page-tabs';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the PageTabs component.
 */
export interface PageTabsProps<T extends PageTabsOptionData = PageTabsOptionData> extends PageTabsCompactProps<T> {
  /**
   * root element class
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Visual variant of the component.
   */
  variant?: PageTabsVariant;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<PageTabsUi>;
}

/**
 * Events for the PageTabs component.
 */
export type PageTabsEmits<T extends PageTabsOptionData = PageTabsOptionData> = PageTabsCompactEmits<T>;

/**
 * Slots for the PageTabs component.
 */
export type PageTabsSlots<T extends PageTabsOptionData = PageTabsOptionData> = PageTabsCompactSlots<T>;

export type { PageTabsVariant };
