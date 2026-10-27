export { default as TourRoot } from './tour-root.vue';
export { default as TourCompact } from './tour-compact.vue';
export { default as TourStepRoot } from './tour-step-root.vue';

export { provideTourUi } from './context';

export type {
  TourTarget,
  TourCloseReason,
  TourStep,
  TourStepProps,
  TourStepSlots,
  TourRootProps,
  TourRootEmits,
  TourCompactProps,
  TourCompactEmits,
  TourCompactSlots,
  TourSlotProps,
  TourUiSlot,
  TourUi
} from './types';
