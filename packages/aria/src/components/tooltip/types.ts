import type { ForceMountProps, Placement, ToContext } from '../../types';
import type {
  PopperAnchorProps,
  PopperArrowProps,
  PopperOpenChangeReason,
  PopperPopupProps,
  PopperPortalProps,
  PopperPositionerEmits,
  PopperPositionerProps,
  PopperRootProps
} from '../popper/types';

/**
 * Properties for the TooltipProvider component.
 */
export interface TooltipProviderProps {
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   *
   * @defaultValue 150
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   *
   * @defaultValue 300
   */
  skipDelayDuration?: number;
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   *
   * @defaultValue false
   */
  disableHoverableContent?: boolean;
  /**
   * When `true`, clicking on trigger will not close the content.
   *
   * @defaultValue false
   */
  disableClosingTrigger?: boolean;
  /**
   * When `true`, disable tooltip
   *
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Prevent the tooltip from opening if the focus did not come from the keyboard by matching against the
   * `:focus-visible` selector. This is useful if you want to avoid opening it when switching browser tabs or closing a
   * dialog.
   *
   * @defaultValue false
   */
  ignoreNonKeyboardFocus?: boolean;
  /**
   * Props to be passed down to the positioner. Useful when you need to control the positioner, such as disabling it when the trigger is disabled.
   */
  positionerProps?: TooltipPositionerProps;
}

/**
 * Context provided by `TooltipProvider` (or a local fallback created by `TooltipRoot`).
 *
 * Pure config resolution (prop → ancestor provider → global config). The cross-instance
 * skip-delay coordination lives in the Popper delay group provided alongside this context.
 */
export interface TooltipProviderContext extends ToContext<
  TooltipProviderProps,
  | 'delayDuration'
  | 'skipDelayDuration'
  | 'disableHoverableContent'
  | 'disableClosingTrigger'
  | 'disabled'
  | 'ignoreNonKeyboardFocus'
  | 'positionerProps'
> {}

/**
 * Parameters used to create the TooltipRoot context.
 */
export type TooltipRootContextParams = ToContext<
  TooltipProviderProps,
  | 'delayDuration'
  | 'disableHoverableContent'
  | 'disableClosingTrigger'
  | 'disabled'
  | 'ignoreNonKeyboardFocus'
  | 'positionerProps'
> & {
  /**
   * Id of the visually hidden tooltip description element (`aria-describedby` target).
   */
  popupId: string;
  /**
   * The provider context backing this root (ancestor `TooltipProvider` or local fallback).
   */
  provider: TooltipProviderContext;
};

/**
 * Properties for the TooltipRoot component.
 */
export interface TooltipRootProps extends PopperRootProps, TooltipProviderProps {
  /** The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean;
  /** The controlled open state of the tooltip. */
  open?: boolean;
}
/**
 * Events for the TooltipRoot component.
 */
export interface TooltipRootEmits {
  /** Event handler called when the open state of the tooltip changes. */
  'update:open': [value: boolean, reason?: PopperOpenChangeReason];
}

/**
 * State values for TooltipDataState.
 */
export type TooltipDataState = 'closed' | 'delayed-open' | 'instant-open';

/**
 * Properties for the TooltipPositionerImpl component.
 */
export interface TooltipPositionerImplProps extends PopperPositionerProps {}
/**
 * Events for the TooltipPositionerImpl component.
 */
export type TooltipPositionerImplEmits = PopperPositionerEmits;

/**
 * Properties for the TooltipPositioner component.
 */
export interface TooltipPositionerProps extends TooltipPositionerImplProps, ForceMountProps {}
/**
 * Events for the TooltipPositioner component.
 */
export type TooltipPositionerEmits = TooltipPositionerImplEmits;

/**
 * Properties for the TooltipPopup component.
 */
export interface TooltipPopupProps extends PopperPopupProps {
  /**
   * By default, screen readers will announce the content inside the component.
   *
   * If this is not descriptive enough, or you have content that cannot be announced, use `aria-label` as a more
   * descriptive label.
   */
  ariaLabel?: string;
}

export type { PopperAnchorProps as TooltipTriggerProps } from '../popper/types';

/**
 * Properties for the TooltipCompact component.
 */
export interface TooltipCompactProps extends TooltipRootProps {
  /**
   * Content.
   */
  content?: string;
  /**
   * Placement.
   */
  placement?: Placement;
  /**
   * Whether to show an arrow.
   */
  showArrow?: boolean;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: PopperAnchorProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: PopperPortalProps;
  /**
   * Properties forwarded to the positioner element.
   */
  positionerProps?: TooltipPositionerProps;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: TooltipPopupProps;
  /**
   * Properties forwarded to the arrow element.
   */
  arrowProps?: PopperArrowProps;
}

/**
 * Events for the TooltipCompact component.
 */
export type TooltipCompactEmits = TooltipRootEmits & TooltipPositionerEmits;

/**
 * Slots for the TooltipCompact component.
 */
export type TooltipCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the trigger slot.
   */
  trigger?: () => any;
};
