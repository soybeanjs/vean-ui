import { useContext, useUiContext } from '../../composables';
import type { DateFieldRootContext, DateFieldUiSlot } from './types';

export const [provideDateFieldRootContext, useDateFieldRootContext] = useContext<DateFieldRootContext>('DateFieldRoot');
export const [provideDateFieldUi, useDateFieldUi] = useUiContext<DateFieldUiSlot>('DateFieldUi');
