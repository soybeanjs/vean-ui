import { providePopperUi } from '../popper/context';
import { useUiContext } from '../../composables';
import type { PopoverUiSlot } from './types';

export const [providePopoverUi, usePopoverUi] = useUiContext<PopoverUiSlot>('Popover', ui => {
  providePopperUi(ui);

  return ui;
});
