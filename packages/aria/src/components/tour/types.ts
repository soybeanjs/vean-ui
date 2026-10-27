import type { ComputedRef, ShallowRef, VNodeChild } from 'vue';
import type { Direction, Placement, UiClass } from '../../types';
import type {
  PopperArrowProps,
  PopperPositioningPositionerProps,
  PopperPositioningPopupProps,
  PopperPortalProps,
  PopperReferenceElement,
  PopperUiSlot
} from '../popper/types';

/** A target element, selector, or lazy resolver for a tour step. */
export type TourTarget = HTMLElement | SVGElement | string | (() => HTMLElement | SVGElement | null | undefined);

/** Why the tour was closed. */
export type TourCloseReason = 'close-button' | 'mask' | 'escape' | 'finish';

/** Content and target configuration for one tour step. */
export interface TourStep {
  /** Element to highlight and position the bubble against. */
  target?: TourTarget;
  /** Step heading. */
  title?: string;
  /** Supporting step content. */
  description?: string;
  /** Step-specific popup placement. Overrides the tour-level placement. */
  placement?: Placement;
  /** Whether to render the mask for this step. Overrides the tour-level setting. */
  showMask?: boolean;
  /** Whether to render the popup arrow for this step. Overrides the tour-level setting. */
  showArrow?: boolean;
  /** Whether to render the close button for this step. Overrides the tour-level setting. */
  showClose?: boolean;
}

/** Props for a declarative TourStep component. */
export type TourStepProps = TourStep;

/** Slots exposed by a declarative TourStep component. */
export type TourStepSlots = {
  default?: () => VNodeChild;
};

interface TourStepDefinition extends TourStep {
  content?: () => VNodeChild;
}

/** Properties for the TourRoot component. */
export interface TourRootProps {
  /** Ordered steps for data-driven usage. Omit when using TourStep children. */
  steps?: readonly TourStep[];
  /** Whether the tour is open. Bind with `v-model`. */
  modelValue?: boolean;
  /** Whether the tour is open. Alias for `modelValue`, bind with `v-model:open`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Zero-based active step. Bind with `v-model:current`. */
  current?: number;
  /** Initial active step when uncontrolled. Defaults to `0`. */
  defaultCurrent?: number;
  /**
   * Default popup placement, overridden by the active step's placement.
   *
   * @defaultValue 'bottom'
   */
  placement?: Placement;
  /** Reading direction for the floating popup. */
  dir?: Direction;
  /** Whether page scrolling is locked while the tour is open. @defaultValue true */
  lockScroll?: boolean;
  /**
   * Scroll the active target into view when a step opens.
   *
   * @defaultValue true
   */
  autoScroll?: boolean;
  /**
   * Options passed to `Element.scrollIntoView`. `false` disables scrolling. Defaults to smooth, centered scrolling.
   *
   * @defaultValue true
   */
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  /**
   * Whether Escape closes the tour.
   *
   * @defaultValue true
   */
  closeOnPressEscape?: boolean;
  /**
   * Space between the target bounds and the spotlight cutout, in pixels.
   * @defaultValue 6
   */
  spotlightPadding?: number;
  /**
   * Corner radius of the spotlight cutout, in pixels.
   * @defaultValue 2
   */
  spotlightRadius?: number;
}

/** Events for the TourRoot component. */
export type TourRootEmits = {
  /** Emitted when the open state changes. */
  'update:modelValue': [value: boolean];
  /** Emitted when the open state changes. */
  'update:open': [value: boolean];
  /** Emitted when the active zero-based step changes. */
  'update:current': [value: number];
  /** Emitted when the tour closes. */
  close: [reason: TourCloseReason];
  /** Emitted after the final step is completed with its zero-based index. */
  finish: [current: number];
  /** Emitted when the active step changes. The index starts at `0`. */
  change: [current: number];
};

/** Events for the TourCompact component. */
export type TourCompactEmits = TourRootEmits;

/** Props exposed to the TourRoot default slot. */
export interface TourSlotProps {
  /** Active step definition. */
  step: TourStep | undefined;
  /** Active step number, starting from `1`. */
  currentStep: number;
  /** Active step index, starting from `0`; useful for custom indicators. */
  current: number;
  /** Number of configured tour steps. */
  totalSteps: number;
  /** Number of configured tour steps; alias for custom indicators. */
  total: number;
  /** Whether the active step is the first step. */
  isFirstStep: boolean;
  /** Whether the active step is the final step. */
  isLastStep: boolean;
  /** Move to the previous step when one exists. */
  previous: () => void;
  /** Move to the next step or finish the tour. */
  next: () => void;
  /** Close the tour with an optional close reason. */
  close: (reason?: TourCloseReason) => void;
}

/** Context shared by the Tour primitives. */
export interface TourRootContext {
  open: ShallowRef<boolean>;
  currentStep: ComputedRef<number>;
  totalSteps: ComputedRef<number>;
  activeStep: ComputedRef<TourStepDefinition | undefined>;
  targetElement: ShallowRef<HTMLElement | SVGElement | undefined>;
  targetRect: ShallowRef<DOMRect | null>;
  viewportSize: ShallowRef<{ width: number; height: number }>;
  maskPath: ComputedRef<string>;
  reference: ComputedRef<PopperReferenceElement>;
  dir: ComputedRef<Direction>;
  isFirstStep: ComputedRef<boolean>;
  isLastStep: ComputedRef<boolean>;
  previous: () => void;
  next: () => void;
  close: (reason?: TourCloseReason) => void;
  registerStep: (id: symbol, resolveStep: () => TourStepDefinition) => void;
  unregisterStep: (id: symbol) => void;
}

/** Properties for the TourCompact component. */
export interface TourCompactProps extends TourRootProps {
  /**
   * Whether to render the dimming mask and target spotlight.
   *
   * @defaultValue true
   */
  showMask?: boolean;
  /**
   * Whether clicking the mask closes the tour.
   *
   * @defaultValue false
   */
  maskClosable?: boolean;
  /**
   * Whether to render the popper arrow.
   *
   * @defaultValue true
   */
  showArrow?: boolean;
  /**
   * Whether to render the close button.
   *
   * @defaultValue true
   */
  showClose?: boolean;
  /**
   * Whether to render the localized step counter.
   *
   * @defaultValue true
   */
  showProgress?: boolean;
  /** Text for the previous-step button. Defaults to the active locale. */
  previousText?: string;
  /** Text for the next-step button. Defaults to the active locale. */
  nextText?: string;
  /** Text for the final-step button. Defaults to the active locale. */
  finishText?: string;
  /** Accessible label for the close button. Defaults to the active locale. */
  closeLabel?: string;
  /** Properties forwarded to the portal. */
  portalProps?: PopperPortalProps;
  /** Properties forwarded to the floating positioner. `open`, `reference` and `placement` are controlled by Tour. */
  positionerProps?: Omit<PopperPositioningPositionerProps, 'open' | 'reference' | 'placement'>;
  /** Properties forwarded to the popup surface. */
  popupProps?: PopperPositioningPopupProps;
  /** Properties forwarded to the arrow. */
  arrowProps?: PopperArrowProps;
}

/** Slots exposed by the TourCompact component. */
export type TourCompactSlots = {
  /** Ordered TourStep children. */
  default?: () => VNodeChild;
  /** Replaces the complete default popup content. */
  content?: (props: TourSlotProps) => VNodeChild;
  /** Custom active step title. */
  title?: (props: TourSlotProps) => VNodeChild;
  /** Custom active step description. */
  description?: (props: TourSlotProps) => VNodeChild;
  /** Replaces the default step indicator dots. `current` is zero-based. */
  indicators?: (props: TourSlotProps) => VNodeChild;
  /** Custom close button content. */
  close?: (props: TourSlotProps) => VNodeChild;
  /** Custom previous button content. */
  previous?: (props: TourSlotProps) => VNodeChild;
  /** Custom next or finish button content. */
  next?: (props: TourSlotProps) => VNodeChild;
};

/** Available UI slots for the Tour component. */
export type TourUiSlot =
  | PopperUiSlot
  | 'mask'
  | 'header'
  | 'title'
  | 'description'
  | 'footer'
  | 'indicators'
  | 'indicator'
  | 'progress'
  | 'actions'
  | 'previous'
  | 'next'
  | 'close';

/** UI class overrides for the Tour component. */
export type TourUi = UiClass<TourUiSlot>;
