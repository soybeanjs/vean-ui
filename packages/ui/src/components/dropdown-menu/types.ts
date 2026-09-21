import type {
  DropdownMenuWrapperCompactProps,
  DropdownMenuWrapperCompactEmits,
  DropdownMenuCompactProps,
  DropdownMenuCompactEmits,
  DropdownMenuCompactSlots,
  DropdownMenuCheckboxCompactProps,
  DropdownMenuCheckboxCompactEmits,
  DropdownMenuCheckboxCompactSlots,
  DropdownMenuRadioCompactProps,
  DropdownMenuRadioCompactEmits,
  DropdownMenuRadioCompactSlots
} from '@vean/aria/dropdown-menu';
import type { AcceptableBooleanValue, DefinedValue } from '@vean/aria/types';
import type { MenuUiBaseProps } from '../menu/types';

/**
 * Properties for the DropdownMenuWrapper component.
 */
export interface DropdownMenuWrapperProps extends MenuUiBaseProps, DropdownMenuWrapperCompactProps {}

/**
 * Events for the DropdownMenuWrapper component.
 */
export type DropdownMenuWrapperEmits = DropdownMenuWrapperCompactEmits;

// Menu
/**
 * Properties for the DropdownMenu component.
 */
export type DropdownMenuProps<T extends DefinedValue = DefinedValue> = Omit<MenuUiBaseProps, 'indicatorPosition'> &
  DropdownMenuCompactProps<T>;

/**
 * Events for the DropdownMenu component.
 */
export type DropdownMenuEmits<T extends DefinedValue = DefinedValue> = DropdownMenuCompactEmits<T>;

/**
 * Slots for the DropdownMenu component.
 */
export type DropdownMenuSlots<T extends DefinedValue = DefinedValue> = DropdownMenuCompactSlots<T>;

// Menu Checkbox
/**
 * Properties for the DropdownMenuCheckbox component.
 */
export type DropdownMenuCheckboxProps<T extends DefinedValue = DefinedValue> = MenuUiBaseProps &
  DropdownMenuCheckboxCompactProps<T>;

/**
 * Events for the DropdownMenuCheckbox component.
 */
export type DropdownMenuCheckboxEmits<T extends DefinedValue = DefinedValue> = DropdownMenuCheckboxCompactEmits<T>;

/**
 * Slots for the DropdownMenuCheckbox component.
 */
export type DropdownMenuCheckboxSlots<T extends DefinedValue = DefinedValue> = DropdownMenuCheckboxCompactSlots<T>;

// Menu Radio
/**
 * Properties for the DropdownMenuRadio component.
 */
export type DropdownMenuRadioProps<T extends AcceptableBooleanValue = AcceptableBooleanValue> = MenuUiBaseProps &
  DropdownMenuRadioCompactProps<T>;

/**
 * Events for the DropdownMenuRadio component.
 */
export type DropdownMenuRadioEmits<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  DropdownMenuRadioCompactEmits<T>;

/**
 * Slots for the DropdownMenuRadio component.
 */
export type DropdownMenuRadioSlots<T extends AcceptableBooleanValue = AcceptableBooleanValue> =
  DropdownMenuRadioCompactSlots<T>;
