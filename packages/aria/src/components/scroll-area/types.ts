import type { ComputedRef, CSSProperties, ShallowRef } from 'vue';
import type { Direction, ToContext, UiClass } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Supported scroll area values.
 */
export type ScrollAreaType = 'auto' | 'always' | 'hover' | 'scroll' | 'glimpse';
/**
 * Type information for ScrollAreaOrientation.
 */
export type ScrollAreaOrientation = 'horizontal' | 'vertical';
/**
 * State values for ScrollAreaState.
 */
export type ScrollAreaState = 'hidden' | 'visible';

/**
 * Properties for the ScrollAreaRoot component.
 */
export interface ScrollAreaRootProps extends PrimitiveWithBaseProps {
  /** Controls scrollbar visibility behavior. */
  type?: ScrollAreaType;
  /** The reading direction of the scroll area. */
  dir?: Direction;
  /** Delay before transient scrollbars are hidden. */
  scrollHideDelay?: number;
}

/**
 * Properties for the ScrollAreaViewport component.
 */
export interface ScrollAreaViewportProps extends PrimitiveWithBaseProps {
  /** Adds a nonce to the injected style tag. */
  nonce?: string;
}

/**
 * Properties for the ScrollAreaScrollbar component.
 */
export interface ScrollAreaScrollbarProps extends PrimitiveWithBaseProps {
  /** The scrollbar orientation. */
  orientation?: ScrollAreaOrientation;
}

/**
 * Properties for the ScrollAreaThumb component.
 */
export interface ScrollAreaThumbProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ScrollAreaCorner component.
 */
export interface ScrollAreaCornerProps extends PrimitiveWithBaseProps {}

/**
 * Events for the ScrollAreaRoot component.
 */
export type ScrollAreaRootEmits = {};

/**
 * Properties for the ScrollAreaCompact component.
 */
export interface ScrollAreaCompactProps extends ScrollAreaRootProps {
  /**
   * Properties forwarded to the viewport element.
   */
  viewportProps?: ScrollAreaViewportProps;
  /**
   * Properties forwarded to the vertical scrollbar element.
   */
  verticalScrollbarProps?: ScrollAreaScrollbarProps;
  /**
   * Properties forwarded to the horizontal scrollbar element.
   */
  horizontalScrollbarProps?: ScrollAreaScrollbarProps;
  /**
   * Properties forwarded to the thumb elements.
   */
  thumbProps?: ScrollAreaThumbProps;
  /**
   * Properties forwarded to the corner element.
   */
  cornerProps?: ScrollAreaCornerProps;
}

/**
 * Events for the ScrollAreaCompact component.
 */
export type ScrollAreaCompactEmits = ScrollAreaRootEmits;

/**
 * Slots for the ScrollAreaCompact component.
 */
export type ScrollAreaCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
};

/**
 * Context for the ScrollAreaRoot component.
 */
export interface ScrollAreaRootContext extends ToContext<ScrollAreaRootProps, 'scrollHideDelay' | 'type'> {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Whether the item is hovered.
   */
  isHovering: ShallowRef<boolean>;
  /**
   * Reference to the root element.
   */
  rootElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Viewport element used by the component context.
   */
  viewportElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Content element used by the component context.
   */
  contentElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Whether scrollbar xenabled.
   */
  scrollbarXEnabled: ShallowRef<boolean>;
  /**
   * Whether scrollbar yenabled.
   */
  scrollbarYEnabled: ShallowRef<boolean>;
  /**
   * Whether scrollbar xvisible.
   */
  scrollbarXVisible: ShallowRef<boolean>;
  /**
   * Whether scrollbar yvisible.
   */
  scrollbarYVisible: ShallowRef<boolean>;
  /**
   * Scrollbar xsize used by the component context.
   */
  scrollbarXSize: ShallowRef<number>;
  /**
   * Scrollbar ysize used by the component context.
   */
  scrollbarYSize: ShallowRef<number>;
  /**
   * Callback invoked when the viewport changes.
   */
  onViewportChange: (element?: HTMLElement) => void;
  /**
   * Callback invoked when the content changes.
   */
  onContentChange: (element?: HTMLElement) => void;
  /**
   * Callback invoked when the scrollbar enabled changes.
   */
  onScrollbarEnabledChange: (orientation: ScrollAreaOrientation, enabled: boolean) => void;
  /**
   * Callback invoked when the scrollbar visible changes.
   */
  onScrollbarVisibleChange: (orientation: ScrollAreaOrientation, visible: boolean) => void;
  /**
   * Callback invoked when the scrollbar size changes.
   */
  onScrollbarSizeChange: (orientation: ScrollAreaOrientation, size: number) => void;
}

/**
 * Context for the ScrollAreaScrollbar component.
 */
export interface ScrollAreaScrollbarContext {
  /**
   * Orientation of the component.
   */
  orientation: ComputedRef<ScrollAreaOrientation>;
  /**
   * Data state used by the component context.
   */
  dataState: ComputedRef<ScrollAreaState>;
  /**
   * Whether the component has overflow.
   */
  hasOverflow: ComputedRef<boolean>;
  /**
   * Thumb style used by the component context.
   */
  thumbStyle: ComputedRef<CSSProperties>;
  /**
   * Callback invoked when the thumb pointer down event fires.
   */
  onThumbPointerDown: (event: PointerEvent) => void;
  /**
   * Callback invoked when the thumb pointer up event fires.
   */
  onThumbPointerUp: () => void;
}

/**
 * Available UI slots for the ScrollArea component.
 */
export type ScrollAreaUiSlot = 'root' | 'viewport' | 'scrollbar' | 'thumb' | 'corner';

/**
 * UI class overrides for the ScrollArea component.
 */
export type ScrollAreaUi = UiClass<ScrollAreaUiSlot>;
