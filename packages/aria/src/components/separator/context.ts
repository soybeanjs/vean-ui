import { useUiContext } from '../../composables';
import type { SeparatorUiSlot } from './types';

export const [provideSeparatorUi, useSeparatorUi] = useUiContext<SeparatorUiSlot>('SeparatorUi');
