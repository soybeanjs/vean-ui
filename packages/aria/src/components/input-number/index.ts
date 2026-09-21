export { default as InputNumberCompact } from './input-number-compact.vue';
export { default as InputNumberRoot } from './input-number-root.vue';
export { default as InputNumberControl } from './input-number-control.vue';
export { default as InputNumberIncrement } from './input-number-increment.vue';
export { default as InputNumberDecrement } from './input-number-decrement.vue';
export { default as InputNumberClear } from './input-number-clear.vue';

export { provideInputNumberUi } from './context';

export type {
  InputNumberCompactProps,
  InputNumberCompactEmits,
  InputNumberCompactSlotProps,
  InputNumberCompactSlots,
  InputNumberRootProps,
  InputNumberRootEmits,
  InputNumberControlProps,
  InputNumberIncrementProps,
  InputNumberDecrementProps,
  InputNumberClearProps,
  InputNumberClearEmits,
  InputNumberUiSlot,
  InputNumberUi
} from './types';
