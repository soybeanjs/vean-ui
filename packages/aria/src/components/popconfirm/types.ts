import type { BaseProps, Placement, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type {
  PopperAnchorProps,
  PopperArrowProps as PopconfirmArrowProps,
  PopperPopupProps,
  PopperPortalProps as PopconfirmPortalProps,
  PopperPositionerEmits,
  PopperPositionerProps,
  PopperRootEmits,
  PopperRootProps,
  PopperTriggerProps,
  PopperUiSlot
} from '../popper/types';

/**
 * Supported popconfirm values.
 */
export type PopconfirmType = 'error' | 'success' | 'warning' | 'info';

/**
 * Properties for the PopconfirmRoot component.
 */
export interface PopconfirmRootProps extends PopperRootProps {}

/**
 * Events for the PopconfirmRoot component.
 */
export type PopconfirmRootEmits = PopperRootEmits;

/**
 * Properties for the PopconfirmTrigger component.
 */
export interface PopconfirmTriggerProps extends PopperTriggerProps {}

/**
 * Properties for the PopconfirmClose component.
 */
export interface PopconfirmCloseProps extends ButtonProps {}
/**
 * Events for the PopconfirmClose component.
 */
export type PopconfirmCloseEmits = {
  /**
   * Emitted when close occurs.
   */
  close: [event: PointerEvent];
};

/**
 * Properties for the PopconfirmPositioner component.
 */
export interface PopconfirmPositionerProps extends PopperPositionerProps {}
/**
 * Events for the PopconfirmPositioner component.
 */
export type PopconfirmPositionerEmits = PopperPositionerEmits;

/**
 * Properties for the PopconfirmPopup component.
 */
export interface PopconfirmPopupProps extends PopperPopupProps {}

/**
 * Properties for the PopconfirmAnchor component.
 */
export interface PopconfirmAnchorProps extends PopperAnchorProps {}

/**
 * Properties for the PopconfirmConfirm component.
 */
export interface PopconfirmConfirmProps extends ButtonProps {}
/**
 * Events for the PopconfirmConfirm component.
 */
export type PopconfirmConfirmEmits = {
  /**
   * Emitted when confirm occurs.
   */
  confirm: [event: PointerEvent];
};

/**
 * Properties for the PopconfirmCancel component.
 */
export interface PopconfirmCancelProps extends ButtonProps {}
/**
 * Events for the PopconfirmCancel component.
 */
export type PopconfirmCancelEmits = {
  /**
   * Emitted when cancel occurs.
   */
  cancel: [event: PointerEvent];
};

/**
 * Properties for the PopconfirmHeader component.
 */
export interface PopconfirmHeaderProps extends BaseProps {}

/**
 * Properties for the PopconfirmTitle component.
 */
export interface PopconfirmTitleProps extends BaseProps {}

/**
 * Properties for the PopconfirmDescription component.
 */
export interface PopconfirmDescriptionProps extends BaseProps {}

/**
 * Properties for the PopconfirmContent component.
 */
export interface PopconfirmContentProps extends BaseProps {}

/**
 * Properties for the PopconfirmFooter component.
 */
export interface PopconfirmFooterProps extends BaseProps {}

/**
 * Properties for the PopconfirmCompact component.
 */
export interface PopconfirmCompactProps extends PopconfirmRootProps {
  /**
   * Type.
   */
  type?: PopconfirmType;
  /**
   * Placement.
   */
  placement?: Placement;
  /**
   * Title text rendered by the component.
   */
  title?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
  /**
   * Content.
   */
  content?: string;
  /**
   * Whether to show an arrow.
   *
   * @defaultValue true
   */
  showArrow?: boolean;
  /**
   * Whether to show an icon.
   *
   * @defaultValue true
   */
  showIcon?: boolean;
  /**
   * The text of the confirm button.
   *
   * Defaults to the localized `dialog.confirm` message from `ConfigProvider`.
   */
  confirmText?: string;
  /**
   * The text of the cancel button.
   *
   * Defaults to the localized `dialog.cancel` message from `ConfigProvider`.
   */
  cancelText?: string;
  /**
   * Determines whether the cancel button is shown.
   *
   * @defaultValue 'onlyWarning'
   */
  showCancel?: 'onlyWarning' | boolean;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: PopconfirmTriggerProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: PopconfirmPortalProps;
  /**
   * Properties forwarded to the positioner element.
   */
  positionerProps?: PopconfirmPositionerProps;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: PopconfirmPopupProps;
  /**
   * Properties forwarded to the arrow element.
   */
  arrowProps?: PopconfirmArrowProps;
  /**
   * Properties forwarded to the close element.
   */
  closeProps?: PopconfirmCloseProps;
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: PopconfirmHeaderProps;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: PopconfirmTitleProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: PopconfirmDescriptionProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: PopconfirmContentProps;
  /**
   * Properties forwarded to the footer element.
   */
  footerProps?: PopconfirmFooterProps;
  /**
   * Properties forwarded to the confirm element.
   */
  confirmProps?: PopconfirmConfirmProps;
  /**
   * Properties forwarded to the cancel element.
   */
  cancelProps?: PopconfirmCancelProps;
}

/**
 * Events for the PopconfirmCompact component.
 */
export type PopconfirmCompactEmits = PopconfirmRootEmits &
  PopconfirmPositionerEmits &
  PopconfirmConfirmEmits &
  PopconfirmCancelEmits;

/**
 * Slot properties for the PopconfirmCompact component.
 */
export interface PopconfirmCompactBaseSlotProps {
  /**
   * Whether the component is open.
   */
  open: boolean;
  /**
   * Close exposed in the slot scope.
   */
  close: () => void;
}

/**
 * Slots for the PopconfirmCompact component.
 */
export type PopconfirmCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: PopconfirmCompactBaseSlotProps) => any;
  /**
   * Custom content for the trigger slot.
   */
  trigger?: (props: PopconfirmCompactBaseSlotProps) => any;
  /**
   * Custom content for the title slot.
   */
  title?: (props: PopconfirmCompactBaseSlotProps) => any;
  /**
   * Custom content for the description slot.
   */
  description?: (props: PopconfirmCompactBaseSlotProps) => any;
  /**
   * Custom content for the footer slot.
   */
  footer?: (props: PopconfirmCompactBaseSlotProps) => any;
  /**
   * Custom content for the close slot.
   */
  close?: (props: PopconfirmCompactBaseSlotProps) => any;
};

/**
 * Available UI slots for the Popconfirm component.
 */
export type PopconfirmUiSlot =
  | PopperUiSlot
  | 'close'
  | 'header'
  | 'icon'
  | 'title'
  | 'description'
  | 'content'
  | 'footer'
  | 'cancel'
  | 'confirm';

/**
 * UI class overrides for the Popconfirm component.
 */
export type PopconfirmUi = UiClass<PopconfirmUiSlot>;

export type { PopconfirmArrowProps, PopconfirmPortalProps };
