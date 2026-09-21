export { default as DialogCompact } from './dialog-compact.vue';
export { default as DialogProvider } from './dialog-provider.vue';
export { default as DialogRoot } from './dialog-root.vue';
export { default as DialogTrigger } from './dialog-trigger.vue';
export { default as DialogPortal } from '../portal/portal.vue';
export { default as DialogOverlay } from './dialog-overlay.vue';
export { default as DialogPopup } from './dialog-popup.vue';
export { default as DialogHeader } from './dialog-header.vue';
export { default as DialogContent } from './dialog-content.vue';
export { default as DialogTitle } from './dialog-title.vue';
export { default as DialogDescription } from './dialog-description.vue';
export { default as DialogFooter } from './dialog-footer.vue';
export { default as DialogClose } from './dialog-close.vue';
export { default as DialogFullscreen } from './dialog-fullscreen.vue';
export { default as DialogCancel } from './dialog-cancel.vue';
export { default as DialogConfirm } from './dialog-confirm.vue';

export { provideDialogUi } from './context';
export { dialog } from './state';

export type {
  DialogCompactProps,
  DialogCompactEmits,
  DialogCompactSlots,
  DialogCompactBaseSlotProps,
  DialogRootProps,
  DialogRootEmits,
  DialogModal,
  DialogFullscreenStateEmits,
  DialogTriggerProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogPopupProps,
  DialogPopupEmits,
  DialogHeaderProps,
  DialogContentProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
  DialogCloseEmits,
  DialogFullscreenProps,
  DialogFullscreenEmits,
  DialogConfirmProps,
  DialogConfirmEmits,
  DialogCancelProps,
  DialogCancelEmits,
  DialogUiSlot,
  DialogUi
} from './types';
