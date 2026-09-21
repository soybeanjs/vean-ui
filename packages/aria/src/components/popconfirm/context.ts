import { providePopperUi } from '../popper/context';
import { useUiContext } from '../../composables';
import type { PopconfirmUiSlot } from './types';

export const [providePopconfirmUi, usePopconfirmUi] = useUiContext<PopconfirmUiSlot>('Popconfirm', ui => {
  providePopperUi(ui);

  return ui;
});
