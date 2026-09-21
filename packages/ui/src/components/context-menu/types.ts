import type {
  ContextMenuWrapperCompactProps,
  ContextMenuWrapperCompactEmits,
  ContextMenuCompactProps,
  ContextMenuCompactEmits,
  ContextMenuCompactSlots,
  ContextMenuCheckboxCompactProps,
  ContextMenuCheckboxCompactEmits,
  ContextMenuCheckboxCompactSlots,
  ContextMenuRadioCompactProps,
  ContextMenuRadioCompactEmits,
  ContextMenuRadioCompactSlots
} from '@vean/aria/context-menu';
import type { AcceptableBooleanValue, DefinedValue } from '@vean/aria/types';
import type { MenuUiBaseProps } from '../menu/types';

/**
 * Properties for the ContextMenuWrapper component.
 */
export interface ContextMenuWrapperProps extends MenuUiBaseProps, ContextMenuWrapperCompactProps {}

/**
 * Events for the ContextMenuWrapper component.
 */
export type ContextMenuWrapperEmits = ContextMenuWrapperCompactEmits;

// Menu
/**
 * Properties for the ContextMenu component.
 */
export type ContextMenuProps<T extends DefinedValue = DefinedValue> = Omit<MenuUiBaseProps, 'indicatorPosition'> &
  ContextMenuCompactProps<T>;

/**
 * Events for the ContextMenu component.
 */
export type ContextMenuEmits<T extends DefinedValue = DefinedValue> = ContextMenuCompactEmits<T>;

/**
 * Slots for the ContextMenu component.
 */
export type ContextMenuSlots<T extends DefinedValue = DefinedValue> = ContextMenuCompactSlots<T>;

// Menu Checkbox
/**
 * Properties for the ContextMenuCheckbox component.
 */
export type ContextMenuCheckboxProps<T extends DefinedValue = DefinedValue> = MenuUiBaseProps &
  ContextMenuCheckboxCompactProps<T>;

/**
 * Events for the ContextMenuCheckbox component.
 */
export type ContextMenuCheckboxEmits<T extends DefinedValue = DefinedValue> = ContextMenuCheckboxCompactEmits<T>;

/**
 * Slots for the ContextMenuCheckbox component.
 */
export type ContextMenuCheckboxSlots<T extends DefinedValue = DefinedValue> = ContextMenuCheckboxCompactSlots<T>;

// Menu Radio
/**
 * Properties for the ContextMenuRadio component.
 */
export type ContextMenuRadioProps<T extends AcceptableBooleanValue = AcceptableBooleanValue> = MenuUiBaseProps &
  ContextMenuRadioCompactProps<T>;

/**
 * Events for the ContextMenuRadio component.
 */
export type ContextMenuRadioEmits<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  ContextMenuRadioCompactEmits<T>;

/**
 * Slots for the ContextMenuRadio component.
 */
export type ContextMenuRadioSlots<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  ContextMenuRadioCompactSlots<T>;
