import { useContext, useUiContext } from '../../composables';
import type { TimeRangeFieldRootContext, TimeRangeFieldUiSlot } from './types';

export const [provideTimeRangeFieldRootContext, useTimeRangeFieldRootContext] =
  useContext<TimeRangeFieldRootContext>('TimeRangeFieldRoot');
export const [provideTimeRangeFieldUi, useTimeRangeFieldUi] = useUiContext<TimeRangeFieldUiSlot>('TimeRangeFieldUi');
