import { providePopperUi } from '../popper/context';
import { useContext, useUiContext } from '../../composables';
import type { PopperUiSlot } from '../popper/types';
import type { TooltipProviderContext, TooltipRootContextParams } from './types';

export const [provideTooltipProviderContext, useTooltipProviderContext] = useContext(
  'TooltipProvider',
  (params: TooltipProviderContext) => params
);

export const [provideTooltipRootContext, useTooltipRootContext] = useContext(
  'TooltipRoot',
  (params: TooltipRootContextParams) => params
);

export const [provideTooltipUi, useTooltipUi] = useUiContext<PopperUiSlot>('Tooltip', ui => {
  providePopperUi(ui);

  return ui;
});
