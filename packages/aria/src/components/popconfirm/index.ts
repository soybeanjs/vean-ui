export { default as PopconfirmCompact } from './popconfirm-compact.vue';
export { default as PopconfirmRoot } from './popconfirm-root.vue';
export { default as PopconfirmTrigger } from './popconfirm-trigger.vue';
export { default as PopconfirmAnchor } from './popconfirm-anchor.vue';
export { default as PopconfirmPositioner } from './popconfirm-positioner.vue';
export { default as PopconfirmPopup } from './popconfirm-popup.vue';
export { default as PopconfirmClose } from './popconfirm-close.vue';
export { default as PopconfirmHeader } from './popconfirm-header.vue';
export { default as PopconfirmTitle } from './popconfirm-title.vue';
export { default as PopconfirmDescription } from './popconfirm-description.vue';
export { default as PopconfirmContent } from './popconfirm-content.vue';
export { default as PopconfirmFooter } from './popconfirm-footer.vue';
export { default as PopconfirmConfirm } from './popconfirm-confirm.vue';
export { default as PopconfirmCancel } from './popconfirm-cancel.vue';
export { PopperArrow as PopconfirmArrow } from '../popper';
export { PopperPortal as PopconfirmPortal } from '../popper';

export { providePopconfirmUi } from './context';

export type {
  PopconfirmCompactProps,
  PopconfirmCompactEmits,
  PopconfirmCompactSlots,
  PopconfirmCompactBaseSlotProps,
  PopconfirmRootProps,
  PopconfirmRootEmits,
  PopconfirmTriggerProps,
  PopconfirmAnchorProps,
  PopconfirmCloseProps,
  PopconfirmCloseEmits,
  PopconfirmPositionerProps,
  PopconfirmPositionerEmits,
  PopconfirmPopupProps,
  PopconfirmConfirmProps,
  PopconfirmConfirmEmits,
  PopconfirmCancelProps,
  PopconfirmCancelEmits,
  PopconfirmHeaderProps,
  PopconfirmTitleProps,
  PopconfirmDescriptionProps,
  PopconfirmContentProps,
  PopconfirmFooterProps,
  PopconfirmType,
  PopconfirmUiSlot,
  PopconfirmUi,
  PopconfirmArrowProps,
  PopconfirmPortalProps
} from './types';
