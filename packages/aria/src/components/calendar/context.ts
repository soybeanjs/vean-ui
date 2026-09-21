import { useContext, useUiContext } from '../../composables';
import type { CalendarRootContext, CalendarUiSlot } from './types';

export const [provideCalendarRootContext, useCalendarRootContext] = useContext<CalendarRootContext>('CalendarRoot');

export const [provideCalendarUi, useCalendarUi] = useUiContext<CalendarUiSlot>('CalendarUi');
