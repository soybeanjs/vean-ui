import { provideDateRangeFieldUi } from '../date-range-field/context';
import { providePopoverUi } from '../popover/context';
import { useUiContext } from '../../composables';
import type { DateRangePickerUiSlot } from './types';

export const [provideDateRangePickerUi, useDateRangePickerUi] = useUiContext<DateRangePickerUiSlot>(
  'DateRangePickerUi',
  ui => {
    providePopoverUi(ui);
    provideDateRangeFieldUi(ui);

    return ui;
  }
);
