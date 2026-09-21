import { useUiContext } from '../../composables';
import type { ColorSwatchUiSlot } from './types';

export const [provideColorSwatchUi, useColorSwatchUi] = useUiContext<ColorSwatchUiSlot>('ColorSwatch');
