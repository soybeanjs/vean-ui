import type { ComputedRef, Ref, ShallowRef, VNode } from 'vue';
import type {
  BaseProps,
  Direction,
  DismissableLayerEmits,
  DismissableLayerProps,
  FocusScopeEmits,
  ForceMountProps,
  ModalityTier,
  ToContext,
  TrapFocusProps,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { PortalProps as DialogPortalProps } from '../portal/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Supported dialog alert values.
 */
export type DialogAlertType = 'default' | 'info' | 'success' | 'warning' | 'error';

/**
 * Modality tier of a dialog-like surface.
 *
 * - `true` — full modal: focus trap plus blocking of outside pointer events
 * - `'trap-focus'` — traps focus but keeps outside pointer events alive
 * - `false` — non-modal
 */
export type DialogModal = ModalityTier;

/**
 * Properties for the DialogBase component.
 */
export interface DialogBaseProps {
  /**
   * The controlled open state of the dialog. Can be bound with `v-model:open`.
   *
   * @defaultValue undefined
   */
  open?: boolean;
  /**
   * The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.
   *
   * @defaultValue false
   */
  defaultOpen?: boolean;
  /**
   * The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog
   * content will be visible to screen readers.
   *
   * @defaultValue true
   */
  modal?: boolean;
}

/**
 * Properties for the DialogRoot component.
 */
export interface DialogRootProps extends Omit<DialogBaseProps, 'modal'> {
  /**
   * The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog
   * content will be visible to screen readers.
   *
   * Set to `'trap-focus'` to trap focus while still letting outside pointer events through (non-modal side panels such
   * as `Drawer` in the `'trap-focus'` tier).
   *
   * @defaultValue true
   */
  modal?: DialogModal;
  /**
   * The text direction of the dialog
   */
  dir?: Direction;
  /**
   * Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response.
   *
   * When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes.
   *
   * @defaultValue false
   */
  isAlert?: boolean;
  /**
   * The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog.
   */
  alertType?: DialogAlertType;
  /**
   * Whether the dialog can be moved by dragging its header.
   *
   * @defaultValue false
   */
  draggable?: boolean;
  /**
   * The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`.
   *
   * @defaultValue undefined
   */
  fullscreen?: boolean;
  /**
   * The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state.
   *
   * @defaultValue false
   */
  defaultFullscreen?: boolean;
}
/**
 * Events for the DialogRoot component.
 */
export type DialogRootEmits = {
  /** Event handler called when the open state of the dialog changes. */
  'update:open': [value: boolean];
};

/**
 * Events for the fullscreen state of the dialog. Kept separate from `DialogRootEmits`
 * because the latter is shared by other disclosure primitives (popover, menu, drawer).
 */
export type DialogFullscreenStateEmits = {
  /** Event handler called when the fullscreen state of the dialog changes. */
  'update:fullscreen': [value: boolean];
};

/**
 * Properties for the DialogTrigger component.
 */
export interface DialogTriggerProps extends ButtonProps {}

/**
 * Events for the DialogTrigger component.
 */
export type DialogTriggerEmits = {
  /** Event handler called when the dialog trigger is activated. */
  click: [event: PointerEvent];
};

/**
 * Properties for the DialogOverlay component.
 */
export interface DialogOverlayProps extends ForceMountProps, BaseProps {}

/**
 * Properties for the DialogPopupImpl component.
 */
export interface DialogPopupImplProps extends TrapFocusProps, DismissableLayerProps, PrimitiveWithBaseProps {}
/**
 * Events for the DialogPopupImpl component.
 */
export type DialogPopupImplEmits = DismissableLayerEmits & FocusScopeEmits;

/**
 * Properties for the DialogPopup component.
 */
export interface DialogPopupProps
  extends Omit<DialogPopupImplProps, 'trapFocus' | 'disableOutsidePointerEvents'>, ForceMountProps {}
/**
 * Events for the DialogPopup component.
 */
export type DialogPopupEmits = DialogPopupImplEmits;

/**
 * Properties for the DialogTitle component.
 */
export interface DialogTitleProps extends BaseProps {}

/**
 * Properties for the DialogDescription component.
 */
export interface DialogDescriptionProps extends BaseProps {}

/**
 * Properties for the DialogClose component.
 */
export interface DialogCloseProps extends ButtonProps {}
/**
 * Events for the DialogClose component.
 */
export type DialogCloseEmits = {
  /** Event handler called when the dialog is requested to be closed. */
  close: [event: MouseEvent];
};

/**
 * Properties for the DialogFullscreen component.
 */
export interface DialogFullscreenProps extends ButtonProps {}
/**
 * Events for the DialogFullscreen component.
 */
export type DialogFullscreenEmits = {
  /** Event handler called when the fullscreen state of the dialog is requested to be toggled. */
  fullscreen: [event: MouseEvent];
};

/**
 * Properties for the DialogCancel component.
 */
export interface DialogCancelProps extends ButtonProps {}
/**
 * Events for the DialogCancel component.
 */
export type DialogCancelEmits = {
  /** Event handler called when the dialog is requested to be canceled. */
  cancel: [event: MouseEvent];
};

/**
 * Properties for the DialogConfirm component.
 */
export interface DialogConfirmProps extends ButtonProps {}
/**
 * Events for the DialogConfirm component.
 */
export type DialogConfirmEmits = {
  /** Event handler called when the dialog is requested to be closed by confirming. */
  confirm: [event: MouseEvent];
};

/**
 * Properties for the DialogHeader component.
 */
export interface DialogHeaderProps extends BaseProps {}

/**
 * Properties for the DialogContent component.
 */
export interface DialogContentProps extends BaseProps {}

/**
 * Properties for the DialogFooter component.
 */
export interface DialogFooterProps extends BaseProps {}

/**
 * Properties for the DialogCompact component.
 */
export interface DialogCompactProps extends DialogRootProps {
  /**
   * The title of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `title` slot is not provided.
   */
  title?: string;
  /**
   * The description of the dialog. This is used for accessibility purposes and will be rendered in the content of the dialog if the `description` slot is not provided.
   */
  description?: string;
  /**
   * The icon of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `icon` slot is not provided.
   */
  icon?: IconValue;
  /**
   * Whether show the close button in the header of the dialog.
   *
   * @defaultValue true
   */
  showClose?: boolean;
  /**
   * Whether show the fullscreen toggle button in the header of the dialog.
   *
   * @defaultValue true
   */
  showFullscreen?: boolean;
  /**
   * Whether to use the pure version of the dialog, which does not include the header and footer.
   * This is useful when you want to fully control the content of the dialog and do not need the built-in header and footer.
   *
   * @defaultValue false
   */
  pure?: boolean;
  /**
   * Whether to show the cancel button.
   *
   * When set to `onlyWarning`, the cancel button will only be shown when the dialog is an alert dialog with `alertType="warning"`.
   * When set to `true`, the cancel button will always be shown.
   *
   * @defaultValue 'onlyWarning'
   */
  showCancel?: 'onlyWarning' | boolean;
  /**
   * The text of the cancel button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `cancel` slot is not provided.
   *
   * Defaults to the localized `dialog.cancel` message from `ConfigProvider`.
   */
  cancelText?: string;
  /**
   * Whether to show the confirm button when the dialog is an alert dialog.
   *
   * The default value is `true` when the dialog is an alert dialog.
   */
  showConfirm?: boolean;
  /**
   * The text of the confirm button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `confirm` slot is not provided.
   *
   * Defaults to the localized `dialog.confirm` message from `ConfigProvider`.
   */
  confirmText?: string;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: DialogTriggerProps;
  /**
   * Properties forwarded to the overlay element.
   */
  overlayProps?: DialogOverlayProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: DialogPortalProps;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: DialogPopupProps;
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: DialogHeaderProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: DialogContentProps;
  /**
   * Properties forwarded to the footer element.
   */
  footerProps?: DialogFooterProps;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: DialogTitleProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: DialogDescriptionProps;
  /**
   * Properties forwarded to the close element.
   */
  closeProps?: DialogCloseProps;
  /**
   * Properties forwarded to the fullscreen element.
   */
  fullscreenProps?: DialogFullscreenProps;
  /**
   * Properties forwarded to the cancel element.
   */
  cancelProps?: DialogCancelProps;
  /**
   * Properties forwarded to the confirm element.
   */
  confirmProps?: DialogConfirmProps;
}

/**
 * Events for the DialogCompact component.
 */
export type DialogCompactEmits = DialogRootEmits &
  DialogFullscreenStateEmits &
  DialogTriggerEmits &
  DialogPopupEmits &
  DialogCloseEmits &
  DialogFullscreenEmits &
  DialogConfirmEmits &
  DialogCancelEmits;

/**
 * Slot properties for the DialogCompactBase component.
 */
export interface DialogCompactBaseSlotProps {
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
 * Slots for the DialogCompact component.
 */
export type DialogCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the trigger slot.
   */
  trigger?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the title slot.
   */
  title?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the description slot.
   */
  description?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the close slot.
   */
  close?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the fullscreen slot.
   */
  fullscreen?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the footer slot.
   */
  footer?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the cancel slot.
   */
  cancel?: (props: DialogCompactBaseSlotProps) => any;
  /**
   * Custom content for the confirm slot.
   */
  confirm?: (props: DialogCompactBaseSlotProps) => any;
};

/**
 * Parameters used to create the DialogRoot context.
 */
export interface DialogRootContextParams extends ToContext<
  DialogRootProps,
  'dir' | 'modal' | 'isAlert' | 'alertType' | 'draggable'
> {
  /**
   * Whether the component is open.
   */
  open: Ref<boolean | undefined>;
  /**
   * Whether the component is in fullscreen mode.
   */
  fullscreen: Ref<boolean | undefined>;
}

/**
 * Context for the DialogProvider component.
 */
export interface DialogProviderContext {
  /**
   * Dialogs used by the component context.
   */
  dialogs: ShallowRef<DialogT[]>;
}

/**
 * Context for the DialogCompact component.
 */
export interface DialogCompactContext {
  /**
   * Dialog used by the component context.
   */
  dialog: ComputedRef<DialogT | undefined>;
}

/**
 * Available UI slots for the Dialog component.
 */
export type DialogUiSlot =
  | 'overlay'
  | 'popup'
  | 'header'
  | 'content'
  | 'footer'
  | 'title'
  | 'icon'
  | 'description'
  | 'close'
  | 'fullscreen'
  | 'cancel'
  | 'confirm';

/**
 * UI class overrides for the Dialog component.
 */
export type DialogUi = UiClass<DialogUiSlot>;

export type { DialogPortalProps };

/**
 * Type information for DialogT.
 */
export interface DialogT extends Pick<DialogCompactProps, 'open' | 'icon' | 'showCancel' | 'showConfirm'> {
  /**
   * Id.
   */
  id: number | string;
  /**
   * Type.
   */
  type?: DialogAlertType;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<DialogUi>;
  /**
   * Title text rendered by the component.
   */
  title?: VNode | string;
  /**
   * Description text rendered by the component.
   */
  description?: VNode | string;
  /**
   * Content.
   */
  content?: VNode;
  /**
   * Footer.
   */
  footer?: VNode;
  /**
   * Whether the component can cel text.
   */
  cancelText?: VNode | string;
  /**
   * Confirm text.
   */
  confirmText?: VNode | string;
  /**
   * Callback invoked when the cancel event fires.
   */
  onCancel?: (event: MouseEvent) => void;
  /**
   * Callback invoked when the confirm event fires.
   */
  onConfirm?: (event: MouseEvent) => void;
  /**
   * Callback invoked when the dismiss event fires.
   */
  onDismiss?: (dialog: DialogT) => void;
}

/**
 * Type information for DialogExternal.
 */
export interface DialogExternal extends Omit<DialogT, 'id' | 'type' | 'title'> {
  /**
   * Id.
   */
  id?: number | string;
}

/**
 * Type information for DialogCreateOptions.
 */
export interface DialogCreateOptions extends Omit<DialogT, 'id'> {
  /**
   * Id.
   */
  id?: number | string;
}

/**
 * Type information for DialogSubscriber.
 */
export type DialogSubscriber = (dialog: DialogT) => void;
