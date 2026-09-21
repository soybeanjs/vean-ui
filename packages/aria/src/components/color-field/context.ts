import { useContext, useUiContext } from '../../composables';
import type { ColorFieldRootContext, ColorFieldUiSlot } from './types';

export const [provideColorFieldRootContext, useColorFieldRootContext] =
  useContext<ColorFieldRootContext>('ColorFieldRoot');

export const [provideColorFieldUi, useColorFieldUi] = useUiContext<ColorFieldUiSlot>('ColorFieldUi');
