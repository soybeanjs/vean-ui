import type { UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { DialogRootEmits } from '../dialog/types';
import type {
  PopperRootProps,
  PopperPositionerProps,
  PopperPositionerEmits,
  PopperPopupProps,
  PopperArrowProps,
  PopperPortalProps,
  PopperUiSlot
} from '../popper/types';

/**
 * Properties for the PopoverRoot component.
 */
export interface PopoverRootProps extends PopperRootProps {}

/**
 * Events for the PopoverRoot component.
 */
export type PopoverRootEmits = DialogRootEmits;

/**
 * Properties for the PopoverClose component.
 */
export interface PopoverCloseProps extends ButtonProps {}
/**
 * Events for the PopoverClose component.
 */
export type PopoverCloseEmits = {
  /**
   * Emitted when close occurs.
   */
  close: [PointerEvent];
};

/**
 * Properties for the PopoverPositioner component.
 */
export interface PopoverPositionerProps extends PopperPositionerProps {}
/**
 * Events for the PopoverPositioner component.
 */
export type PopoverPositionerEmits = PopperPositionerEmits;

/**
 * Properties for the PopoverPopup component.
 */
export interface PopoverPopupProps extends PopperPopupProps {}

/**
 * Properties for the PopoverTrigger component.
 */
export interface PopoverTriggerProps extends ButtonProps {}

export type { PopperAnchorProps as PopoverAnchorProps } from '../popper/types';

/**
 * Properties for the PopoverCompact component.
 */
export interface PopoverCompactProps extends PopoverRootProps {
  /**
   * Placement.
   */
  placement?: PopperPositionerProps['placement'];
  /**
   * Whether to show an arrow.
   */
  showArrow?: boolean;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: PopoverTriggerProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: PopperPortalProps;
  /**
   * Properties forwarded to the positioner element.
   */
  positionerProps?: PopoverPositionerProps;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: PopoverPopupProps;
  /**
   * Properties forwarded to the arrow element.
   */
  arrowProps?: PopperArrowProps;
  /**
   * Properties forwarded to the close element.
   */
  closeProps?: PopoverCloseProps;
}

/**
 * Events for the PopoverCompact component.
 */
export type PopoverCompactEmits = PopoverRootEmits & PopoverPositionerEmits;

/**
 * Slots for the PopoverCompact component.
 */
export type PopoverCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: { open: boolean; close: () => void }) => any;
  /**
   * Custom content for the trigger slot.
   */
  trigger?: () => any;
  /**
   * Custom content for the close slot.
   */
  close?: () => any;
};

/**
 * Available UI slots for the Popover component.
 */
export type PopoverUiSlot = PopperUiSlot | 'close';

/**
 * UI class overrides for the Popover component.
 */
export type PopoverUi = UiClass<PopoverUiSlot>;
