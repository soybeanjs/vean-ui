import { useContext, useUiContext } from '../../composables';
import type { AlertRootContextParams, AlertUiSlot } from './types';

export const [provideAlertRootContext, useAlertRootContext] = useContext(
  'AlertRoot',
  (params: AlertRootContextParams) => {
    const { open } = params;

    const onOpenChange = (value: boolean) => {
      open.value = value;
    };

    return {
      open,
      onOpenChange
    };
  }
);

export const [provideAlertUi, useAlertUi] = useUiContext<AlertUiSlot>('AlertUi');
