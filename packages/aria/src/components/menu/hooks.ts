import { computed } from 'vue';
import { keysOf } from '../../shared';
import { COMMON_SLOTS } from './shared';

export const useCommonSlotNames = <T extends Record<string, any>>(slots: T) => {
  return computed(() => keysOf(slots).filter(key => (COMMON_SLOTS as (keyof T)[]).includes(key)));
};
