import type { ShallowRef } from 'vue';
import type { ForceMountProps, ToContext } from '../../types';
import type {
  PopperRootProps,
  PopperPositionerEmits,
  PopperAnchorProps,
  PopperArrowProps,
  PopperOpenChangeReason,
  PopperPopupProps,
  PopperPortalProps,
  PopperPositionerProps
} from '../popper/types';

/**
 * Properties for the HoverCardRoot component.
 */
export interface HoverCardRootProps extends PopperRootProps {
  /** The open state of the hover card when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean;
  /** The controlled open state of the hover card. */
  open?: boolean;
  /** The duration from when the pointer enters the trigger until the hover card opens. */
  openDelay?: number;
  /** The duration from when the pointer leaves the trigger or popup until the hover card closes. */
  closeDelay?: number;
}

/**
 * Events for the HoverCardRoot component.
 */
export interface HoverCardRootEmits {
  /** Event handler called when the open state of the hover card changes. */
  'update:open': [value: boolean, reason?: PopperOpenChangeReason];
}

/**
 * Properties for the HoverCardPositionerImpl component.
 */
export interface HoverCardPositionerImplProps extends PopperPositionerProps {}
/**
 * Events for the HoverCardPositionerImpl component.
 */
export type HoverCardPositionerImplEmits = Pick<
  PopperPositionerEmits,
  'escapeKeyDown' | 'pointerDownOutside' | 'focusOutside'
>;

/**
 * Properties for the HoverCardPositioner component.
 */
export interface HoverCardPositionerProps extends HoverCardPositionerImplProps, ForceMountProps {}
/**
 * Events for the HoverCardPositioner component.
 */
export type HoverCardPositionerEmits = HoverCardPositionerImplEmits;

/**
 * Properties for the HoverCardPopup component.
 */
export interface HoverCardPopupProps extends PopperPopupProps {}

/**
 * Parameters used to create the HoverCardRoot context.
 */
export type HoverCardRootContextParams = ToContext<HoverCardRootProps, 'openDelay' | 'closeDelay'>;

/**
 * Context for the HoverCardRoot component. Open state, timers, grace and dismiss live on the
 * Popper root context; only the HoverCard-specific selection tracking stays here.
 */
export interface HoverCardRootContext extends HoverCardRootContextParams {
  /**
   * Whether the popup currently contains a text selection (blocks delayed closes).
   */
  hasSelectionRef: ShallowRef<boolean>;
  /**
   * Whether a pointer down started on the popup (blocks delayed closes).
   */
  isPointerDownOnPopupRef: ShallowRef<boolean>;
}

export type {
  PopperArrowProps as HoverCardArrowProps,
  PopperUiSlot as HoverCardUiSlot,
  PopperUi as HoverCardUi
} from '../popper/types';
export type { PopperPortalProps as HoverCardPortalProps } from '../popper/types';
export type { PopperAnchorProps as HoverCardTriggerProps } from '../popper/types';

/**
 * Properties for the HoverCardCompact component.
 */
export interface HoverCardCompactProps extends HoverCardRootProps {
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
  triggerProps?: PopperAnchorProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: PopperPortalProps;
  /**
   * Properties forwarded to the positioner element.
   */
  positionerProps?: HoverCardPositionerProps;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: HoverCardPopupProps;
  /**
   * Properties forwarded to the arrow element.
   */
  arrowProps?: PopperArrowProps;
}

/**
 * Events for the HoverCardCompact component.
 */
export type HoverCardCompactEmits = HoverCardRootEmits & HoverCardPositionerEmits;

/**
 * Slots for the HoverCardCompact component.
 */
export type HoverCardCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the trigger slot.
   */
  trigger?: () => any;
};
