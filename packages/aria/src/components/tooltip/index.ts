export { default as TooltipCompact } from './tooltip-compact.vue';
export { default as TooltipProvider } from './tooltip-provider.vue';
export { default as TooltipRoot } from './tooltip-root.vue';
export { default as TooltipTrigger } from './tooltip-trigger.vue';
export { PopperPortal as TooltipPortal } from '../popper';
export { default as TooltipPositioner } from './tooltip-positioner.vue';
export { default as TooltipPopup } from './tooltip-popup.vue';
export { PopperArrow as TooltipArrow } from '../popper';

export { provideTooltipUi } from './context';

export type {
  TooltipCompactProps,
  TooltipCompactEmits,
  TooltipCompactSlots,
  TooltipProviderContext,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipRootEmits,
  TooltipTriggerProps,
  TooltipPopupProps,
  TooltipPositionerProps,
  TooltipPositionerEmits,
  TooltipDataState
} from './types';

export type {
  PopperArrowProps as TooltipArrowProps,
  PopperUiSlot as TooltipUiSlot,
  PopperUi as TooltipUi
} from '../popper/types';
export type { PopperPortalProps as TooltipPortalProps } from '../popper/types';
