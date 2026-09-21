import { useContext, useUiContext } from '../../composables';
import type { SliderRootContext, SliderUiSlot } from './types';

export const [provideSliderRootContext, useSliderRootContext] = useContext<SliderRootContext>('SliderRoot');

export const [provideSliderUi, useSliderUi] = useUiContext<SliderUiSlot>('SliderUi');
