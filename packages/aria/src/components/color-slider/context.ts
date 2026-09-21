import { useContext, useUiContext } from '../../composables';
import type { ColorSliderRootContext, ColorSliderUiSlot } from './types';

export const [provideColorSliderRootContext, useColorSliderRootContext] =
  useContext<ColorSliderRootContext>('ColorSliderRoot');

export const [provideColorSliderUi, useColorSliderUi] = useUiContext<ColorSliderUiSlot>('ColorSliderUi');
