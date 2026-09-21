import type { ComputedRef, ShallowRef, VNodeChild } from 'vue';
import type { Padding, ReferenceElement, Side } from '@floating-ui/dom';
import type {
  Align,
  BaseProps,
  Direction,
  DisclosureState,
  DismissableLayerEmits,
  FocusScopeEmits,
  ForceMountProps,
  Placement,
  UiClass,
  VNodeRef
} from '../../types';
import type { ButtonProps } from '../button';
import type { PortalProps } from '../portal';
import type { PrimitiveWithBaseProps } from '../primitive';

export type PopperTriggerType = 'click' | 'hover' | 'contextmenu';

export type PopperReferenceElement = ReferenceElement;

export type PopperOpenChangeReason =
  | 'trigger-click'
  | 'trigger-hover'
  | 'trigger-contextmenu'
  | 'trigger-focus'
  | 'dismiss-outside'
  | 'dismiss-escape'
  | 'parent-close'
  | 'imperative';

export interface PopperRootProps {
  dir?: Direction;
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  disabled?: boolean;
}

export type PopperRootEmits = {
  'update:open': [value: boolean, reason: PopperOpenChangeReason];
};

export interface PopperRootSlotProps {
  open: boolean;
  reason: PopperOpenChangeReason;
  close: () => void;
  dir: Direction;
}

export type PopperRootSlots = {
  default?: (props: PopperRootSlotProps) => VNodeChild;
};

export interface PopperTriggerProps extends ButtonProps {
  trigger?: PopperTriggerType;
  reference?: ReferenceElement;
  openDelay?: number;
  closeDelay?: number;
  skipDelayDuration?: number;
  pressOpenDelay?: number;
  openOnFocus?: boolean;
  /**
   * Open delay applied to focus-driven opens. Defaults to `openDelay`; set `0` to open
   * instantly on focus (Tooltip semantics).
   *
   * @defaultValue inherit from `openDelay`
   */
  focusOpenDelay?: number;
  /**
   * When `true`, focus-driven opening only responds to keyboard/programmatic focus
   * (`:focus-visible`), ignoring pointer-derived focus.
   *
   * @defaultValue false
   */
  focusVisibleOnly?: boolean;
  /**
   * How the trigger references its popup for assistive technology.
   *
   * - `controls`: `aria-expanded` + `aria-controls` (expandable widgets: popover / menu)
   * - `describedby`: `aria-describedby` while open (tooltip-like descriptions)
   * - `none`: no popup-reference attributes
   *
   * @defaultValue 'controls'
   */
  ariaMode?: PopperTriggerAriaMode;
}

export type PopperTriggerAriaMode = 'controls' | 'describedby' | 'none';

export interface PopperTriggerConfiguration {
  type: PopperTriggerType;
  openDelay: number;
  focusOpenDelay: number;
  closeDelay: number;
  skipDelayDuration: number;
  pressOpenDelay: number;
  openOnFocus: boolean;
  disabled: boolean;
}

/**
 * Parameters for creating the shared delay-group context.
 */
export interface PopperDelayGroupParams {
  /**
   * How much time a user has to open another member without incurring the open
   * delay again, counted from the last member close.
   */
  skipDelayDuration: ComputedRef<number>;
}

/**
 * Shared hover-delay coordination across sibling Popper roots — the
 * `FloatingDelayGroup` pattern. While any member stays open (or within the
 * skip-delay window after the last member closes) other members skip their
 * open delay. Nested roots (submenus, popups inside a popup) never join the
 * group; they keep their own per-root delay machine.
 */
export interface PopperDelayGroupContext {
  /** Whether the next member hover open incurs its open delay (skip-delay window state). */
  isOpenDelayed: ShallowRef<boolean>;
  /** Reports a member opened; resets the skip-delay window. */
  onMemberOpen: (member: PopperRootContext) => void;
  /** Reports a member closed; starts the skip-delay window once the last member closed. */
  onMemberClose: (member: PopperRootContext) => void;
}

/**
 * Properties for the positioner that floats above the anchor. Mirrors the positioning surface of
 * the Aria `PopperPositioner` with the prototype's own defaults.
 */
export interface PopperPositionerProps extends BaseProps, ForceMountProps {
  /**
   * The placement of the floating element.
   *
   * If used, it will override the `side` and `align` props.
   *
   * @defaultValue undefined
   */
  placement?: Placement;
  /**
   * The preferred side of the trigger to render against when open. Will be reversed when collisions occur and
   * avoidCollisions is enabled.
   *
   * @defaultValue 'bottom'
   */
  side?: Side;
  /**
   * The distance in pixels from the trigger.
   *
   * @defaultValue 0
   */
  sideOffset?: number;
  /**
   * Flip to the opposite side when colliding with boundary.
   *
   * @defaultValue true
   */
  sideFlip?: boolean;
  /**
   * The preferred alignment against the trigger. May change when collisions occur.
   *
   * @defaultValue 'center'
   */
  align?: Align;
  /**
   * An offset in pixels from the `start` or `end` alignment options.
   *
   * @defaultValue 0
   */
  alignOffset?: number;
  /**
   * Flip alignment when colliding with boundary.
   * May only occur when `prioritizePosition` is true.
   *
   * @defaultValue true
   */
  alignFlip?: boolean;
  /**
   * When `true`, overrides the side and align preferences to prevent collisions with boundary edges.
   *
   * @defaultValue true
   */
  avoidCollisions?: boolean;
  /**
   * The element used as the collision boundary. By default this is the viewport, though you can provide additional
   * element(s) to be included in this check.
   *
   * @defaultValue [ ]
   */
  collisionBoundary?: Element | null | Array<Element | null>;
  /**
   * The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for
   * all sides), or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @defaultValue 0
   */
  collisionPadding?: Padding;
  /**
   * The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it
   * from overflowing the corners.
   *
   * @defaultValue 0
   */
  arrowPadding?: number;
  /**
   * When `true`, hides the arrow when it cannot be centered
   * to the reference element.
   *
   * @defaultValue true
   */
  hideShiftedArrow?: boolean;
  /**
   * The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the trigger is at
   * least partially in the boundary whilst "always" will keep the content in the boundary regardless.
   *
   * @defaultValue 'partial'
   */
  sticky?: 'partial' | 'always';
  /**
   * Whether to hide the content when the trigger becomes fully occluded.
   *
   * @defaultValue false
   */
  hideWhenDetached?: boolean;
  /**
   * The type of CSS position property to use.
   *
   * @defaultValue 'fixed'
   */
  positionStrategy?: 'absolute' | 'fixed';
  /**
   * Strategy to update the position of the floating element on every animation frame.
   *
   * @defaultValue 'optimized'
   */
  updatePositionStrategy?: 'optimized' | 'always';
  /**
   * Whether to disable the update position for the content when the layout shifted.
   *
   * @defaultValue false
   */
  disableUpdateOnLayoutShift?: boolean;
  /**
   * Force content to be position within the viewport. Might overlap the reference element, which may not be desired.
   *
   * @defaultValue false
   */
  prioritizePosition?: boolean;
  /**
   * The custom element or virtual element that will be set as the reference to position the floating element. If
   * provided, it will replace the default anchor element.
   */
  reference?: ReferenceElement;
  /**
   * Whether focus is trapped inside the popup while open (Tab cycles within the layer and body
   * scroll is locked for modal layers).
   *
   * @defaultValue modal
   */
  trapFocus?: boolean;
  /**
   * When `true`, hovering the popup closes instead of keeping it open (the grace area is disabled,
   * so leaving the trigger closes the layer immediately).
   *
   * @defaultValue false
   */
  disableHoverableContent?: boolean;
  /**
   * Callback invoked when the pointer finally leaves the grace area. Lets an upper layer (e.g.
   * Tooltip) run area-scoped close logic without registering its own second grace area.
   */
  onGracePointerExit?: () => void;
}

export type PopperPositionerEmits = DismissableLayerEmits &
  FocusScopeEmits & {
    placed: [];
  };

export interface PopperPopupProps extends BaseProps {}

export interface PopperArrowProps extends BaseProps {}

export interface PopperPortalProps extends PortalProps {}

/** Properties for the anchor (reference) element, optionally overriding the reference. */
export interface PopperAnchorProps extends PrimitiveWithBaseProps {
  reference?: ReferenceElement;
}

/** Data provided by the positioner for the popup and arrow to consume. */
export interface PopperPositionerContextParams {
  arrowX: ComputedRef<number>;
  arrowY: ComputedRef<number>;
  hideArrow: ComputedRef<boolean>;
  placedSide: ComputedRef<Side>;
  placedAlign: ComputedRef<Align>;
  isPositioned: ComputedRef<boolean>;
  setArrowElement: (nodeRef: VNodeRef) => void;
}

export interface PopperSubProps extends PopperRootProps {}

export type PopperSubEmits = PopperRootEmits;

export type PopperSubSlots = PopperRootSlots;

export interface PopperSubTriggerProps extends PopperTriggerProps {}

export interface PopperCompactProps extends PopperRootProps {
  trigger?: PopperTriggerType;
  openDelay?: number;
  closeDelay?: number;
  skipDelayDuration?: number;
  pressOpenDelay?: number;
  openOnFocus?: boolean;
  placement?: Placement;
  showArrow?: boolean;
  triggerProps?: PopperTriggerProps;
  portalProps?: PopperPortalProps;
  positionerProps?: PopperPositionerProps;
  popupProps?: PopperPopupProps;
  arrowProps?: PopperArrowProps;
}

export type PopperCompactEmits = PopperRootEmits & PopperPositionerEmits;

export type PopperCompactSlots = {
  default?: (props: PopperRootSlotProps) => VNodeChild;
  trigger?: () => VNodeChild;
};

export type PopperUiSlot = 'anchor' | 'positioner' | 'popup' | 'arrow' | 'trigger' | 'subTrigger';

export type PopperUi = UiClass<PopperUiSlot>;

/**
 * Properties for the positioning-only root. The positioning primitives have no open state,
 * trigger, or dismissal of their own — domain layers (Select / Combobox / Cascader / …)
 * own the interaction and mount these parts purely for floating placement.
 */
export interface PopperPositioningRootProps {
  /**
   * The direction of the content. Used for RTL-aware rendering of the popup.
   */
  dir?: Direction;
}

/**
 * Anchor and arrow are shared between the interactive shell and positioning-only trees;
 * use `PopperAnchorProps` / `PopperArrowProps` for both.
 */

/**
 * Properties for the positioning-only positioner. Same positioning surface as
 * `PopperPositionerProps` minus the interactive-shell concerns (presence, focus trap,
 * hoverable content) plus an `open` input the domain layer wires to its own state.
 * Fields are spelled out (not `Omit`) so the SFC compiler can resolve runtime props keys.
 */
export interface PopperPositioningPositionerProps extends BaseProps {
  /**
   * Whether the floating layer is open. Drives the positioning lifecycle (`isPositioned`
   * resets when open flips); the positioning primitive itself has no open state, so
   * consumers wire their own open state here.
   *
   * @defaultValue true
   */
  open?: boolean;
  /**
   * The placement of the floating element.
   *
   * If used, it will override the `side` and `align` props.
   *
   * @defaultValue undefined
   */
  placement?: Placement;
  /**
   * The preferred side of the anchor to render against when open. Will be reversed when collisions occur and
   * avoidCollisions is enabled.
   *
   * @defaultValue 'bottom'
   */
  side?: Side;
  /**
   * The distance in pixels from the anchor.
   *
   * @defaultValue 0
   */
  sideOffset?: number;
  /**
   * Flip to the opposite side when colliding with boundary.
   *
   * @defaultValue true
   */
  sideFlip?: boolean;
  /**
   * The preferred alignment against the anchor. May change when collisions occur.
   *
   * @defaultValue 'center'
   */
  align?: Align;
  /**
   * An offset in pixels from the `start` or `end` alignment options.
   *
   * @defaultValue 0
   */
  alignOffset?: number;
  /**
   * Flip alignment when colliding with boundary.
   * May only occur when `prioritizePosition` is true.
   *
   * @defaultValue true
   */
  alignFlip?: boolean;
  /**
   * When `true`, overrides the side and align preferences to prevent collisions with boundary edges.
   *
   * @defaultValue true
   */
  avoidCollisions?: boolean;
  /**
   * The element used as the collision boundary. By default this is the viewport, though you can provide additional
   * element(s) to be included in this check.
   *
   * @defaultValue [ ]
   */
  collisionBoundary?: Element | null | Array<Element | null>;
  /**
   * The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for
   * all sides), or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @defaultValue 0
   */
  collisionPadding?: Padding;
  /**
   * The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it
   * from overflowing the corners.
   *
   * @defaultValue 0
   */
  arrowPadding?: number;
  /**
   * When `true`, hides the arrow when it cannot be centered
   * to the reference element.
   *
   * @defaultValue false
   */
  hideShiftedArrow?: boolean;
  /**
   * The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the anchor is at
   * least partially in the boundary whilst "always" will keep the content in the boundary regardless.
   *
   * @defaultValue 'partial'
   */
  sticky?: 'partial' | 'always';
  /**
   * Whether to hide the content when the anchor becomes fully occluded.
   *
   * @defaultValue false
   */
  hideWhenDetached?: boolean;
  /**
   * The type of CSS position property to use.
   *
   * @defaultValue 'fixed'
   */
  positionStrategy?: 'absolute' | 'fixed';
  /**
   * Strategy to update the position of the floating element on every animation frame.
   *
   * @defaultValue 'optimized'
   */
  updatePositionStrategy?: 'optimized' | 'always';
  /**
   * Whether to disable the update position for the content when the layout shifted.
   *
   * @defaultValue false
   */
  disableUpdateOnLayoutShift?: boolean;
  /**
   * Force content to be position within the viewport. Might overlap the reference element, which may not be desired.
   *
   * @defaultValue false
   */
  prioritizePosition?: boolean;
  /**
   * The custom element or virtual element that will be set as the reference to position the floating element. If
   * provided, it will replace the default anchor element.
   */
  reference?: ReferenceElement;
}

export type PopperPositioningPositionerEmits = {
  /** Event handler called when the positioner is placed */
  placed: [];
};

/**
 * Properties for the positioning-only popup.
 */
export interface PopperPositioningPopupProps extends BaseProps {}

export interface PopperRootContext {
  open: ShallowRef<boolean>;
  reason: ShallowRef<PopperOpenChangeReason>;
  dir: ComputedRef<Direction>;
  modal: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
  dataState: ComputedRef<DisclosureState>;
  triggerType: ShallowRef<PopperTriggerType>;
  triggerElement: ShallowRef<HTMLElement | undefined>;
  positionerElement: ShallowRef<HTMLElement | undefined>;
  popupElement: ShallowRef<HTMLElement | undefined>;
  anchorElement: ShallowRef<PopperReferenceElement | undefined>;
  triggerId: ShallowRef<string>;
  popupId: ShallowRef<string>;
  hasCustomAnchor: ComputedRef<boolean>;
  parent: PopperRootContext | undefined;
  children: ShallowRef<readonly PopperRootContext[]>;
  isSub: ComputedRef<boolean>;
  nestingLevel: ComputedRef<number>;
  isPointerInTransit: ShallowRef<boolean>;
  isPointerInTree: ComputedRef<boolean>;
  /** Whether the next hover open still incurs `openDelay` (skip-delay window state). */
  isOpenDelayed: ShallowRef<boolean>;
  /** Whether the most recent open went through the open delay (drives `delayed-open` data states). */
  wasOpenDelayed: ShallowRef<boolean>;
  configureTrigger: (configuration: PopperTriggerConfiguration) => void;
  onOpenChange: (value: boolean, reason?: PopperOpenChangeReason) => void;
  onOpenToggle: (reason: PopperOpenChangeReason) => void;
  onHoverOpen: (reason?: Extract<PopperOpenChangeReason, 'trigger-hover' | 'trigger-focus'>) => void;
  onHoverClose: (reason?: Extract<PopperOpenChangeReason, 'trigger-hover' | 'trigger-focus'>) => void;
  cancelHoverClose: () => void;
  onTriggerElementChange: (element: HTMLElement | undefined) => void;
  /**
   * Overrides the element the hover grace area anchors to. Defaults to the trigger element;
   * domains with a shared hover surface (e.g. a menubar container) set this so the grace
   * corridor spans the whole surface instead of a single trigger.
   */
  graceTriggerElement: ShallowRef<HTMLElement | undefined>;
  onGraceTriggerElementChange: (element: HTMLElement | undefined) => void;
  onPositionerElementChange: (element: HTMLElement | undefined) => void;
  onPopupElementChange: (element: HTMLElement | undefined) => void;
  onAnchorElementChange: (element: PopperReferenceElement | undefined) => void;
  onPositionerUpdateChange: (update: (() => void) | undefined) => void;
  requestPositionerUpdate: () => void;
  onTriggerPointerInsideChange: (value: boolean) => void;
  onPopupPointerInsideChange: (value: boolean) => void;
  registerCustomAnchor: () => () => void;
  /**
   * Registers a domain-level veto for delayed hover closes (e.g. HoverCard text selection).
   * The guard is consulted when the close timer fires; returning `true` keeps the layer open.
   */
  registerHoverCloseGuard: (guard?: () => boolean) => void;
  registerChild: (child: PopperRootContext) => () => void;
  closeDescendants: () => void;
  clearTimers: () => void;
}
