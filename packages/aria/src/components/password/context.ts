import { provideInputUi } from '../input/context';
import { useUiContext } from '../../composables';
import type { PasswordUiSlot } from './types';

export const [providePasswordUi, usePasswordUi] = useUiContext<PasswordUiSlot>('PasswordUi', ui => {
  provideInputUi(ui);

  return ui;
});
