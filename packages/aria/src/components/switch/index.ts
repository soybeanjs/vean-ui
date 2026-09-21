export { default as SwitchRoot } from './switch-root.vue';
export { default as SwitchControl } from './switch-control.vue';
export { default as SwitchThumb } from './switch-thumb.vue';
export { default as SwitchCompact } from './switch-compact.vue';

export { provideSwitchUi } from './context';

export type {
  SwitchCompactSlotProps,
  SwitchCompactProps,
  SwitchCompactEmits,
  SwitchCompactSlots,
  SwitchRootProps,
  SwitchRootEmits,
  SwitchControlProps,
  SwitchThumbProps,
  SwitchUiSlot,
  SwitchUi
} from './types';
