import { useContext, useUiContext } from '../../composables';
import type { ColorAreaRootContext, ColorAreaUiSlot } from './types';

export const [provideColorAreaRootContext, useColorAreaRootContext] = useContext<ColorAreaRootContext>('ColorAreaRoot');

export const [provideColorAreaUi, useColorAreaUi] = useUiContext<ColorAreaUiSlot>('ColorAreaUi');
