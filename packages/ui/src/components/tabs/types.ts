import type { TabsCompactEmits, TabsCompactProps, TabsCompactSlots, TabsOptionData, TabsUi } from '@vean/aria/tabs';
import type { AcceptableValue, ClassValue } from '@vean/aria/types';
import type { TabsFill, TabsShape } from '@/styles/tabs';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Tabs component.
 */
export interface TabsProps<T extends TabsOptionData = TabsOptionData> extends TabsCompactProps<T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /** Styled tabs ui slots, including `indicatorContent` for the compact indicator body. */
  ui?: Partial<TabsUi>;
  /**
   * Fill.
   */
  fill?: TabsFill;
  /**
   * Shape of the component.
   */
  shape?: TabsShape;
}

/**
 * Events for the Tabs component.
 */
export type TabsEmits<T extends AcceptableValue = AcceptableValue> = TabsCompactEmits<T>;

/**
 * Slots for the Tabs component.
 */
export type TabsSlots<T extends TabsOptionData = TabsOptionData> = TabsCompactSlots<T>;

export type { TabsOptionData } from '@vean/aria/tabs';
