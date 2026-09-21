import { computed } from 'vue';
import { useContext, useUiContext } from '../../composables';
import type { ScrollAreaRootContext, ScrollAreaScrollbarContext, ScrollAreaUiSlot } from './types';

export const [provideScrollAreaRootContext, useScrollAreaRootContext] =
  useContext<ScrollAreaRootContext>('ScrollAreaRoot');

export const [provideScrollAreaScrollbarContext, useScrollAreaScrollbarContext] =
  useContext<ScrollAreaScrollbarContext>('ScrollAreaScrollbar');

export const [provideScrollAreaUi, useScrollAreaUi] = useUiContext<ScrollAreaUiSlot>('ScrollAreaUi', ui =>
  computed(() => ui.value ?? {})
);
