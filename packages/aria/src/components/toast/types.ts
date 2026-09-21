import type { VNode, OlHTMLAttributes, LiHTMLAttributes, HTMLAttributes, ShallowRef, ComputedRef } from 'vue';
import type { Direction, Side, SwipeDirection, ToContext, UiClass, BaseProps } from '../../types';
import type { IconValue } from '../_icon/types';

/**
 * Supported toast values.
 */
export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading';

/**
 * Supported toast icon values.
 */
export type ToastIconType = Exclude<ToastType, 'default'> | 'close';

/**
 * Type information for ToastPosition.
 */
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

/**
 * Type information for ToastOffset.
 */
export type ToastOffset = Partial<Record<Side, number>> | number;

/**
 * Type information for ToastPromise.
 */
export type ToastPromise<Data = any> = Promise<Data> | (() => Promise<Data>);

/**
 * Type information for ToastHeight.
 */
export interface ToastHeight {
  /**
   * Height.
   */
  height: number;
  /**
   * Toast id.
   */
  toastId: number | string;
  /**
   * Position.
   */
  position: ToastPosition;
}

/**
 * Type information for ToastT.
 */
export interface ToastT {
  /**
   * Id.
   */
  id: number | string;
  /**
   * Toaster id.
   */
  toasterId?: string;
  /**
   * Type.
   */
  type?: ToastType;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ToastUi>;
  /**
   * Whether rich color.
   */
  richColor?: boolean;
  /**
   * Whether inverted.
   */
  inverted?: boolean;
  /**
   * Position.
   */
  position?: ToastPosition;
  /**
   * Duration.
   */
  duration?: number;
  /**
   * Whether dismissible.
   */
  dismissible?: boolean;
  /**
   * Title text rendered by the component.
   */
  title?: VNode | string;
  /**
   * Description text rendered by the component.
   */
  description?: VNode | string;
  /**
   * Icon rendered by the component.
   */
  icon?: IconValue;
  /**
   * Content.
   */
  content?: VNode;
  /**
   * Action.
   */
  action?: VNode | string;
  /**
   * Whether the component can cel.
   */
  cancel?: VNode | string;
  /**
   * Callback invoked when the action event fires.
   */
  onAction?: (event: MouseEvent) => void;
  /**
   * Callback invoked when the cancel event fires.
   */
  onCancel?: (event: MouseEvent) => void;
  /**
   * Whether this toast shows a close button. Takes precedence over the
   * provider-level `showClose`.
   */
  showClose?: boolean;
  /**
   * Whether delete.
   */
  delete?: boolean;
  /**
   * Custom.
   */
  custom?: VNode;
  /**
   * Promise.
   */
  promise?: ToastPromise;
  /**
   * Callback invoked when the dismiss event fires.
   */
  onDismiss?: (toast: ToastT) => void;
  /**
   * Callback invoked when the auto close event fires.
   */
  onAutoClose?: (toast: ToastT) => void;
  /**
   * Test id.
   */
  testId?: string;
}

/**
 * Type information for ToastExternal.
 */
export interface ToastExternal extends Omit<
  ToastT,
  'id' | 'type' | 'title' | 'content' | 'custom' | 'promise' | 'delete'
> {
  /**
   * Id.
   */
  id?: number | string;
}

/**
 * Type information for ToastCreateOptions.
 */
export interface ToastCreateOptions extends Omit<ToastT, 'id' | 'delete' | 'title'> {
  /**
   * Id.
   */
  id?: number | string;
  /**
   * Message.
   */
  message?: VNode | string;
}

/**
 * Properties for the Toast component.
 */
export interface ToastProps extends BaseProps<LiHTMLAttributes> {
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Toast.
   */
  toast: ToastT;
  /**
   * Position.
   */
  position: ToastPosition;
}

/**
 * Events for the Toast component.
 */
export interface ToastEmits {
  /**
   * Emitted when the height value changes.
   */
  'update:height': [height: ToastHeight];
  /**
   * Emitted when remove occurs.
   */
  remove: [toast: ToastT];
}

/**
 * Properties for the Toaster component.
 */
export interface ToasterProps extends BaseProps<OlHTMLAttributes> {
  /**
   * Id.
   */
  id?: string;
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
  /**
   * Hotkey.
   */
  hotkey?: string[];
  /**
   * Custom aria label.
   */
  customAriaLabel?: string;
  /**
   * Container aria label.
   */
  containerAriaLabel?: string;
  /**
   * Position.
   */
  position?: ToastPosition;
  /**
   * Whether default expanded.
   */
  defaultExpanded?: boolean;
  /**
   * The duration (in milliseconds) before the toast automatically closes. Set to `0` or `Infinity` to disable auto-dismissal.
   */
  duration?: number;
  /**
   * Gap.
   */
  gap?: number;
  /**
   *  The maximum number of visible toasts per position.
   *
   * @default 3
   */
  offset?: ToastOffset;
  /**
   * Visible counts.
   */
  visibleCounts?: number;
  /**
   * Swipe directions.
   */
  swipeDirections?: SwipeDirection[];
  /**
   * Whether to show an icon.
   */
  showIcon?: boolean;
  /**
   * Whether toasts show a close button by default. A toast-level `showClose`
   * takes precedence over this default.
   *
   * @default true
   */
  showClose?: boolean;
  /**
   * Icons.
   */
  icons?: Partial<Record<ToastIconType, IconValue>>;
  /**
   * Properties forwarded to the toast element.
   */
  toastProps?: LiHTMLAttributes;
  /**
   * Properties forwarded to the wrapper element.
   */
  wrapperProps?: HTMLAttributes;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: HTMLAttributes;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: HTMLAttributes;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: HTMLAttributes;
  /**
   * Properties forwarded to the icon component.
   */
  iconProps?: HTMLAttributes;
  /**
   * Properties forwarded to the footer element.
   */
  footerProps?: HTMLAttributes;
  /**
   * Properties forwarded to the action element.
   */
  actionProps?: HTMLAttributes;
  /**
   * Properties forwarded to the cancel element.
   */
  cancelProps?: HTMLAttributes;
  /**
   * Properties forwarded to the close element.
   */
  closeProps?: HTMLAttributes;
}

/**
 * Properties for the ToastProvider component.
 */
export interface ToastProviderProps extends ToasterProps {}

/**
 * Type information for ToastDismiss.
 */
export interface ToastDismiss {
  /**
   * Id.
   */
  id: number | string;
  /**
   * Whether dismiss.
   */
  dismiss: boolean;
}

/**
 * Type information for ToastOrDismiss.
 */
export type ToastOrDismiss = ToastT | ToastDismiss;

/**
 * Type information for ToastSubscriber.
 */
export type ToastSubscriber = (toast: ToastOrDismiss) => void;

/**
 * Type information for ToastPromiseResult.
 */
export interface ToastPromiseResult extends ToastExternal {
  /**
   * Message.
   */
  message: VNode | string;
}

/**
 * Type information for ToastPromiseResolver.
 */
export type ToastPromiseResolver<Result, Data = any> = Result | ((data: Data) => Result | Promise<Result>);

/**
 * Type information for ToastPromiseData.
 */
export type ToastPromiseData<ToastData = any> = Omit<ToastExternal, 'description'> & {
  /**
   * Whether the component is loading.
   */
  loading?: VNode | string;
  /**
   * Success.
   */
  success?: ToastPromiseResolver<ToastPromiseResult | VNode | string, ToastData>;
  /**
   * Error.
   */
  error?: ToastPromiseResolver<ToastPromiseResult | VNode | string>;
  /**
   * Description text rendered by the component.
   */
  description?: ToastPromiseResolver<VNode | string>;
  /**
   * Finally.
   */
  finally?: () => void | Promise<void>;
};

/**
 * Context for the Toaster component.
 */
export interface ToasterContext extends ToContext<
  ToasterProps & Required<Pick<ToasterProps, 'gap' | 'duration' | 'visibleCounts'>>,
  | 'dir'
  | 'gap'
  | 'duration'
  | 'visibleCounts'
  | 'defaultExpanded'
  | 'swipeDirections'
  | 'showIcon'
  | 'showClose'
  | 'toastProps'
  | 'wrapperProps'
  | 'contentProps'
  | 'titleProps'
  | 'descriptionProps'
  | 'iconProps'
  | 'footerProps'
  | 'actionProps'
  | 'cancelProps'
  | 'closeProps'
> {
  /**
   * Icons used by the component context.
   */
  icons: ComputedRef<Record<ToastIconType, IconValue>>;
  /**
   * All toasts used by the component context.
   */
  allToasts: ComputedRef<Record<ToastPosition, ToastT[]>>;
  /**
   * All heights used by the component context.
   */
  allHeights: ComputedRef<Record<ToastPosition, ToastHeight[]>>;
  /**
   * Interacting position used by the component context.
   */
  interactingPosition: ShallowRef<ToastPosition | null>;
  /**
   * Expanded position used by the component context.
   */
  expandedPosition: ShallowRef<ToastPosition | null>;
}

/**
 * Available UI slots for the Toast component.
 */
export type ToastUiSlot =
  | 'toaster'
  | 'toast'
  | 'wrapper'
  | 'content'
  | 'title'
  | 'description'
  | 'icon'
  | 'footer'
  | 'action'
  | 'cancel'
  | 'close';

/**
 * UI class overrides for the Toast component.
 */
export type ToastUi = UiClass<ToastUiSlot>;
