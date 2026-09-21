import { useContext, useUiContext } from '../../composables';
import type { DateRangeFieldRootContext, DateRangeFieldUiSlot } from './types';

export const [provideDateRangeFieldRootContext, useDateRangeFieldRootContext] =
  useContext<DateRangeFieldRootContext>('DateRangeFieldRoot');

export const [provideDateRangeFieldUi, useDateRangeFieldUi] = useUiContext<DateRangeFieldUiSlot>('DateRangeFieldUi');
