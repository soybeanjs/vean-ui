import type { Ref, ShallowRef } from 'vue';
import type { BaseProps, Side, SwipeDirection, UiClass, VNodeRef } from '../../types';
import type {
  DialogCancelEmits,
  DialogCancelProps,
  DialogCloseEmits,
  DialogCloseProps,
  DialogCompactEmits,
  DialogCompactProps,
  DialogCompactSlots,
  DialogConfirmEmits,
  DialogConfirmProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogFullscreenStateEmits,
  DialogHeaderProps,
  DialogModal,
  DialogRootEmits,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerEmits,
  DialogTriggerProps,
  DialogUiSlot
} from '../dialog/types';
import type { ResolvedDrawerSnapPoint } from './use-drawer-snap-points';

/**
 * A snap position: a fraction of the viewport (0–1), a pixel offset (> 1), or a CSS length string (`'30rem'`).
 */
export type DrawerSnapPoint = number | string;

/**
 * Modality tier of the drawer. Reuses the dialog tier vocabulary.
 *
 * - `true` — full modal: focus trap, outside pointer blocking, scroll lock
 * - `'trap-focus'` — traps focus but keeps outside pointer events alive (non-modal side panels)
 * - `false` — non-modal
 */
export type DrawerModal = DialogModal;

/**
 * Reactive inputs used to create the DrawerRoot context.
 */
export interface UseDrawerProps {
  /**
   * Whether the component is open.
   */
  open: Ref<boolean>;
  /**
   * Whether the drawer is fullscreen.
   *
   * Fullscreen defines the panel's size, so it also switches snapping off: a
   * resting snap point below "fully open" would translate a fullscreen panel
   * back down and leave its far half off-screen.
   */
  fullscreen: Ref<boolean>;
  /**
   * Snap points.
   */
  snapPoints: Ref<DrawerSnapPoint[] | undefined>;
  /**
   * Active snap point.
   */
  snapPoint: Ref<DrawerSnapPoint | null | undefined>;
  /**
   * Snap point the drawer resets to when closed, and the initial one when uncontrolled.
   */
  defaultSnapPoint: Ref<DrawerSnapPoint | null | undefined>;
  /**
   * Whether snapping walks one level at a time instead of jumping to the nearest point.
   */
  snapToSequentialPoints: Ref<boolean>;
  /**
   * Dismissible.
   */
  dismissible: Ref<boolean>;
  /**
   * Nested.
   */
  nested: Ref<boolean>;
  /**
   * Modal tier of the component context.
   */
  modal: Ref<DrawerModal>;
  /**
   * Direction the drawer dismisses towards.
   */
  swipeDirection: Ref<SwipeDirection | undefined>;
  /**
   * Direction.
   */
  side: Ref<Side>;
  /**
   * Handle only.
   */
  handleOnly: Ref<boolean>;
  /**
   * Close threshold as a fraction of the drawer size.
   */
  closeThreshold: Ref<number>;
}

/**
 * Parameters used to create the DrawerRoot context.
 */
export type DrawerRootContextParams = UseDrawerProps & DrawerEmitHandlers;

/**
 * Context for the DrawerRoot component.
 */
export interface DrawerRootContext {
  /**
   * Whether the component is open (controllable).
   */
  open: Ref<boolean>;
  /**
   * Internal open state mirrored from `open`.
   */
  isOpen: Ref<boolean>;
  /**
   * Whether the drawer is fullscreen (controllable).
   */
  fullscreen: Ref<boolean>;
  /**
   * Modal used by the component context.
   */
  modal: Ref<DrawerModal>;
  /**
   * Whether the component has been opened at least once.
   */
  hasBeenOpened: Ref<boolean>;
  /**
   * Popup element ref used by the component context.
   */
  drawerRef: ShallowRef<HTMLElement | null | undefined>;
  /**
   * Set popup element ref used by the component context.
   */
  setDrawerRef: (nodeRef: VNodeRef) => void;
  /**
   * Overlay element ref used by the component context.
   */
  overlayRef: ShallowRef<HTMLElement | null | undefined>;
  /**
   * Set overlay element ref used by the component context.
   */
  setOverlayRef: (nodeRef: VNodeRef) => void;
  /**
   * Handle element ref used by the component context.
   */
  handleRef: ShallowRef<HTMLElement | null | undefined>;
  /**
   * Set handle element ref used by the component context.
   */
  setHandleRef: (nodeRef: VNodeRef) => void;
  /**
   * Direction.
   */
  side: Ref<Side>;
  /**
   * Direction the drawer dismisses towards. Defaults to the side's dismiss direction.
   */
  swipeDirection: Ref<SwipeDirection>;
  /**
   * Dismissible used by the component context.
   */
  dismissible: Ref<boolean>;
  /**
   * Handle only used by the component context.
   */
  handleOnly: Ref<boolean>;
  /**
   * Nested used by the component context.
   */
  nested: Ref<boolean>;
  /**
   * Snap points used by the component context.
   */
  snapPoints: Ref<DrawerSnapPoint[] | undefined>;
  /**
   * Whether snapping is active: snap points are configured *and* the drawer is
   * not fullscreen. Every snap-driven behaviour (resting offset, box cap, drag
   * axis set, handle cycling) keys on this flag.
   */
  hasSnapPoints: Ref<boolean>;
  /**
   * Active snap point used by the component context.
   */
  snapPoint: Ref<DrawerSnapPoint | null | undefined>;
  /**
   * Sets the active snap point and emits `update:snapPoint`.
   */
  setActiveSnapPoint: (value: DrawerSnapPoint | null) => void;
  /**
   * Snap point the drawer resets to when closed.
   */
  defaultSnapPoint: Ref<DrawerSnapPoint | null | undefined>;
  /**
   * Whether snapping walks one level at a time.
   */
  snapToSequentialPoints: Ref<boolean>;
  /**
   * Snap points resolved to `{ value, height, offset }` from measured sizes.
   */
  resolvedSnapPoints: Ref<ResolvedDrawerSnapPoint[]>;
  /**
   * Offsets (px) of the resolved snap points, index-aligned with the resolved list.
   */
  snapPointsOffset: Ref<number[]>;
  /**
   * Min offset and range of the resolved snap points, or `null` without snap points.
   */
  snapPointRange: Ref<{ minOffset: number; range: number } | null>;
  /**
   * Resting progress of the active snap point: 0 fully open, 1 closed, `null` without snap points.
   */
  snapPointProgress: Ref<number | null>;
  /**
   * Offset (px) of the active snap point, or `null` when closed/unresolved.
   */
  activeSnapPointOffset: Ref<number | null>;
  /**
   * Largest resolvable snap point size in px along the drawer's axis, or `null`
   * without snap points. Caps the popup box so its far edge cannot rest past the
   * viewport edge and hide the end of the scrolling content from every snap level.
   */
  maxSnapPointSize: Ref<number | null>;
  /**
   * Bumped whenever the measured viewport changes. The popup re-measures its
   * box on every bump so the published height and the viewport-derived snap
   * heights stay consistent instead of disagreeing for a debounce window.
   */
  viewportRevision: Ref<number>;
  /**
   * Measured popup height in px.
   */
  popupHeight: Ref<number>;
  /**
   * Reports a new measured popup height.
   */
  setPopupHeight: (height: number) => void;
  /**
   * Whether a swipe gesture is in flight.
   */
  swiping: Ref<boolean>;
  /**
   * Live swipe progress: 0 fully open, 1 fully dismissed.
   */
  swipeProgress: Ref<number>;
  /**
   * Sets the live swipe progress.
   */
  setSwipeProgress: (progress: number) => void;
  /**
   * Whether the swipe-to-open area is currently driving the popup.
   */
  swipeAreaActive: Ref<boolean>;
  /**
   * Close threshold as a fraction of the drawer size.
   */
  closeThreshold: Ref<number>;
  /**
   * Close drawer used by the component context.
   */
  closeDrawer: () => void;
  /**
   * Callback invoked when a nested drawer drags.
   */
  onNestedDrag: (percentageDragged: number) => void;
  /**
   * Callback invoked when a nested drawer releases.
   */
  onNestedRelease: (openState: boolean) => void;
  /**
   * Callback invoked when a nested drawer opens or closes.
   */
  onNestedOpenChange: (openState: boolean) => void;
  /**
   * Scale applied to the popup while a nested drawer is open.
   */
  nestedScale: Ref<number>;
  /**
   * Emit close used by the component context.
   */
  emitClose: () => void;
  /**
   * Emit drag used by the component context.
   */
  emitDrag: (percentageDragged: number) => void;
  /**
   * Emit release used by the component context.
   */
  emitRelease: (open: boolean) => void;
  /**
   * Emit open change used by the component context.
   */
  emitOpenChange: (openState: boolean) => void;
}

/**
 * Properties for the DrawerRoot component.
 */
export type DrawerRootProps = Omit<DialogRootProps, 'modal'> & {
  /**
   * Modality tier. `true` blocks outside pointer events, `'trap-focus'` only traps focus,
   * `false` keeps the surface non-modal.
   *
   * @defaultValue true
   */
  modal?: DrawerModal;
  /**
   * The controlled snap point. Can be bound with `v-model:snapPoint`.
   */
  snapPoint?: DrawerSnapPoint | null;
  /**
   * The snap point used when the drawer is initially rendered. Use when you do not need to control it.
   * Defaults to the first entry of `snapPoints`.
   */
  defaultSnapPoint?: DrawerSnapPoint | null;
  /**
   * When `true`, snaps to the next sequential snap point (one step at a time).
   * When `false`, snaps to the nearest snap point by distance.
   *
   * @defaultValue false
   */
  snapToSequentialPoints?: boolean;
  /**
   * Close threshold as a fraction of the drawer size (0–1).
   *
   * @defaultValue 0.25
   */
  closeThreshold?: number;
  /**
   * The swipe direction that dismisses the drawer. Defaults to the direction
   * opposite the drawer's entry edge (`side`).
   */
  swipeDirection?: SwipeDirection;
  /**
   * Whether fixed.
   */
  fixed?: boolean;
  /**
   * Whether dismissible.
   *
   * @defaultValue true
   */
  dismissible?: boolean;
  /**
   * Whether nested.
   *
   * @defaultValue false
   */
  nested?: boolean;
  /**
   * Direction.
   *
   * @defaultValue 'bottom'
   */
  side?: Side;
  /** When `true` the `body` doesn't get any styles assigned from the drawer */
  noBodyStyles?: boolean;
  /**
   * Whether handle only.
   *
   * @defaultValue false
   */
  handleOnly?: boolean;
  /**
   * Whether prevent scroll restoration.
   */
  preventScrollRestoration?: boolean;
  /**
   * Snap points used to position the drawer.
   * Use numbers between 0 and 1 to represent fractions of the viewport height,
   * numbers greater than 1 as pixel values, or strings in `px`/`rem` units.
   */
  snapPoints?: DrawerSnapPoint[];
};

/**
 * Events for the DrawerRoot component.
 */
export type DrawerRootEmits = DialogRootEmits &
  DialogFullscreenStateEmits & {
    /**
     * Emitted while dragging with the live progress: 0 fully open, 1 closed.
     */
    drag: [percentageDragged: number];
    /**
     * Emitted when a drag gesture releases; `true` when the drawer stays open.
     */
    release: [open: boolean];
    /**
     * Emitted when close occurs.
     */
    close: [];
    /**
     * Emitted when the snap point value changes.
     */
    'update:snapPoint': [val: DrawerSnapPoint | null];
  };

/**
 * Slots for the DrawerRoot component.
 */
export type DrawerRootSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: { open: boolean; close: () => void }) => any;
};

/**
 * Type information for DrawerEmitHandlers.
 */
export interface DrawerEmitHandlers {
  /**
   * Emit drag.
   */
  emitDrag: (percentageDragged: number) => void;
  /**
   * Emit release.
   */
  emitRelease: (open: boolean) => void;
  /**
   * Emit close.
   */
  emitClose: () => void;
  /**
   * Emit open change.
   */
  emitOpenChange: (openState: boolean) => void;
  /**
   * Emit snap point change.
   */
  emitSnapPointChange: (value: DrawerSnapPoint | null) => void;
}

/**
 * Properties for the DrawerTrigger component.
 */
export interface DrawerTriggerProps extends DialogTriggerProps {}

/**
 * Events for the DrawerTrigger component.
 */
export type DrawerTriggerEmits = DialogTriggerEmits;

/**
 * Properties for the DrawerHeader component.
 */
export interface DrawerHeaderProps extends DialogHeaderProps {}

/**
 * Properties for the DrawerContent component.
 */
export interface DrawerContentProps extends DialogContentProps {}

/**
 * Properties for the DrawerFooter component.
 */
export interface DrawerFooterProps extends DialogFooterProps {}

/**
 * Properties for the DrawerTitle component.
 */
export interface DrawerTitleProps extends DialogTitleProps {}

/**
 * Properties for the DrawerDescription component.
 */
export interface DrawerDescriptionProps extends DialogDescriptionProps {}

/**
 * Properties for the DrawerClose component.
 */
export interface DrawerCloseProps extends DialogCloseProps {}

/**
 * Events for the DrawerClose component.
 */
export type DrawerCloseEmits = DialogCloseEmits;

/**
 * Properties for the DrawerCancel component.
 */
export interface DrawerCancelProps extends DialogCancelProps {}

/**
 * Events for the DrawerCancel component.
 */
export type DrawerCancelEmits = DialogCancelEmits;

/**
 * Properties for the DrawerConfirm component.
 */
export interface DrawerConfirmProps extends DialogConfirmProps {}

/**
 * Events for the DrawerConfirm component.
 */
export type DrawerConfirmEmits = DialogConfirmEmits;

/**
 * Properties for the DrawerHandle component.
 */
export interface DrawerHandleProps extends BaseProps {
  /**
   * Whether prevent cycle.
   */
  preventCycle?: boolean;
}

/**
 * Properties for the DrawerViewport component.
 */
export interface DrawerViewportProps extends BaseProps {}

/**
 * Properties for the DrawerSwipeArea component.
 */
export interface DrawerSwipeAreaProps extends BaseProps {
  /**
   * Override the swipe side that opens the drawer. Defaults to the opposite of the root swipe direction.
   */
  swipeDirection?: SwipeDirection;
  /**
   * Disable swipe-to-open.
   *
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Properties for the DrawerIndent component.
 */
export interface DrawerIndentProps extends BaseProps {}

/**
 * Properties for the DrawerIndentBackground component.
 */
export interface DrawerIndentBackgroundProps extends BaseProps {}

/**
 * Properties for the DrawerCompact component.
 */
export type DrawerCompactProps = Omit<DialogCompactProps, 'modal'> &
  DrawerRootProps & {
    /**
     * Properties forwarded to the handle element.
     */
    handleProps?: DrawerHandleProps;
    /**
     * Render the opt-in swipe-to-open area at the drawer's edge.
     *
     * @defaultValue false
     */
    swipeable?: boolean;
    /**
     * Properties forwarded to the swipe area element.
     */
    swipeAreaProps?: DrawerSwipeAreaProps;
  };

/**
 * Events for the DrawerCompact component.
 */
export type DrawerCompactEmits = Omit<DialogCompactEmits, 'close'> & DrawerRootEmits;

/**
 * Slots for the DrawerCompact component.
 */
export type DrawerCompactSlots = DialogCompactSlots;

/**
 * Available UI slots for the Drawer component.
 */
export type DrawerUiSlot = DialogUiSlot | 'handle' | 'swipeArea' | 'indent' | 'indentBackground';

/**
 * UI class overrides for the Drawer component.
 */
export type DrawerUi = UiClass<DrawerUiSlot>;
