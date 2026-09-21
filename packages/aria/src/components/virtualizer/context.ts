import { computed } from 'vue';
import { useContext } from '../../composables';
import type { VirtualizerRootContextParams } from './types';

export const [provideVirtualizerContext, useVirtualizerContext] = useContext(
  'Virtualizer',
  (params: VirtualizerRootContextParams) => {
    const { dynamic, isHorizontal } = params;

    const isVerticalDynamic = computed(() => dynamic.value && !isHorizontal.value);

    return {
      ...params,
      isVerticalDynamic
    };
  }
);
