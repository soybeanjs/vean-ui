import type { UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { InputCompactProps, InputCompactEmits, InputUiSlot } from '../input/types';

/**
 * Properties for the PasswordVisible component.
 */
export interface PasswordVisibleProps extends ButtonProps {}

/**
 * Slot properties for the PasswordCompact component.
 */
export interface PasswordCompactSlotProps {
  /**
   * Current model value.
   */
  modelValue?: string;
  /**
   * Clear handler.
   */
  clear: () => void;
  /**
   * Whether the password is visible.
   */
  visible: boolean;
  /**
   * Toggle password visibility.
   */
  toggle: () => void;
}

/**
 * Properties for the PasswordCompact component.
 */
export interface PasswordCompactProps extends InputCompactProps {
  /**
   * Controlled password visibility.
   */
  visible?: boolean;
  /**
   * The initial visibility state when it is not controlled.
   *
   * @defaultValue false
   */
  defaultVisible?: boolean;
  /**
   * Properties forwarded to the visible element.
   */
  visibleProps?: ButtonProps;
}

/**
 * Events for the PasswordCompact component.
 */
export type PasswordCompactEmits = InputCompactEmits & {
  /**
   * Emitted when the visible state changes.
   */
  'update:visible': [visible: boolean];
};

/**
 * Slots for the PasswordCompact component.
 */
export type PasswordCompactSlots = {
  /**
   * Custom content for the leading slot.
   */
  leading?: (props: PasswordCompactSlotProps) => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: (props: PasswordCompactSlotProps) => any;
  /**
   * Custom content for the clear slot.
   */
  clear?: (props: PasswordCompactSlotProps) => any;
  /**
   * Custom content for the visible slot.
   */
  visible?: (props: PasswordCompactSlotProps) => any;
};

/**
 * Available UI slots for the Password component.
 */
export type PasswordUiSlot = InputUiSlot | 'visible';

/**
 * UI class overrides for the Password component.
 */
export type PasswordUi = UiClass<PasswordUiSlot>;
