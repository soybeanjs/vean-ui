import { useContext, useUiContext } from '../../composables';
import type { CalendarRangeRootContext, CalendarRangeUiSlot } from './types';

export const [provideCalendarRangeRootContext, useCalendarRangeRootContext] =
  useContext<CalendarRangeRootContext>('CalendarRangeRoot');

export const [provideCalendarRangeUi, useCalendarRangeUi] = useUiContext<CalendarRangeUiSlot>('CalendarRangeUi');
