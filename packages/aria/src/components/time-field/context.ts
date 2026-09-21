import { useContext, useUiContext } from '../../composables';
import type { TimeFieldRootContext, TimeFieldUiSlot } from './types';

export const [provideTimeFieldRootContext, useTimeFieldRootContext] = useContext<TimeFieldRootContext>('TimeFieldRoot');

export const [provideTimeFieldUi, useTimeFieldUi] = useUiContext<TimeFieldUiSlot>('TimeFieldUi');
