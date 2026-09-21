import type { PrimitiveWithBaseProps } from '@vean/aria/primitive';
import type {
  TreeMenuBaseOptionData,
  TreeMenuCompactEmits,
  TreeMenuCompactProps,
  TreeMenuCompactSlots,
  TreeMenuUiSlot
} from '@vean/aria/tree-menu';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the TreeMenu component.
 */
export interface TreeMenuProps<
  T extends TreeMenuBaseOptionData = TreeMenuBaseOptionData
> extends TreeMenuCompactProps<T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<Record<TreeMenuUiSlot, ClassValue>>;
}

/**
 * Events for the TreeMenu component.
 */
export type TreeMenuEmits = TreeMenuCompactEmits;

/**
 * Slots for the TreeMenu component.
 */
export type TreeMenuSlots<T extends TreeMenuBaseOptionData = TreeMenuBaseOptionData> = TreeMenuCompactSlots<T>;

/**
 * Properties for the TreeMenuStyledItem component.
 */
/**
 * Available UI slots for the TreeMenuStyledItem component.
 */
export type TreeMenuStyledItemUiSlot = Extract<TreeMenuUiSlot, 'item' | 'button'>;

/**
 * UI class overrides for the TreeMenuStyledItem component.
 */
export type TreeMenuStyledItemUi = Partial<Record<TreeMenuStyledItemUiSlot, ClassValue>>;

/**
 * Properties for the TreeMenuStyledItem component.
 */
export interface TreeMenuStyledItemProps extends PrimitiveWithBaseProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: TreeMenuStyledItemUi;
  /**
   * Whether the row is disabled.
   *
   * The row carries `data-disabled` — what the recipe's disabled styles key on —
   * and `aria-disabled`. A native `button` row additionally gets the `disabled`
   * attribute; every other element only declares the state, so nested content
   * (for example a trigger inside the row) decides how it blocks itself.
   *
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Slots for the TreeMenuStyledItem component.
 */
export interface TreeMenuStyledItemSlots {
  /** Content of the row. */
  default?: () => any;
}
