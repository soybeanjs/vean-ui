import { shallowRef } from 'vue';
import { useContext, useUiContext } from '../../composables';
import type { CarouselRootContext, CarouselUiSlot } from './types';

export const [provideCarouselRootContext, useCarouselRootContext] = useContext(
  'CarouselRoot',
  (params: CarouselRootContext) => {
    const contentId = shallowRef('');

    const setContentId = (id: string) => {
      contentId.value = id;
    };

    return {
      ...params,
      contentId,
      setContentId
    };
  }
);

export const [provideCarouselUi, useCarouselUi] = useUiContext<CarouselUiSlot>('CarouselUi');
