import { provideDateFieldUi } from '../date-field/context';
import { providePopoverUi } from '../popover/context';
import { useUiContext } from '../../composables';
import type { DatePickerUiSlot } from './types';

export const [provideDatePickerUi, useDatePickerUi] = useUiContext<DatePickerUiSlot>('DatePickerUi', ui => {
  providePopoverUi(ui);
  provideDateFieldUi(ui);

  return ui;
});
