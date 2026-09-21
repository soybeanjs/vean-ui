import type {
  BreadcrumbCompactEmits,
  BreadcrumbCompactProps,
  BreadcrumbCompactSlots,
  BreadcrumbOptionData,
  BreadcrumbUi
} from '@vean/aria/breadcrumb';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Breadcrumb component.
 */
export interface BreadcrumbProps<
  T extends BreadcrumbOptionData = BreadcrumbOptionData
> extends BreadcrumbCompactProps<T> {
  /**
   * root class
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<BreadcrumbUi>;
}

/**
 * Events for the Breadcrumb component.
 */
export type BreadcrumbEmits<T extends BreadcrumbOptionData = BreadcrumbOptionData> = BreadcrumbCompactEmits<T>;

/**
 * Slots for the Breadcrumb component.
 */
export type BreadcrumbSlots<T extends BreadcrumbOptionData = BreadcrumbOptionData> = BreadcrumbCompactSlots<T>;

export type { BreadcrumbOptionData } from '@vean/aria/breadcrumb';
