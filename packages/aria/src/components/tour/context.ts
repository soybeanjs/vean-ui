import { providePopperUi } from '../popper/context';
import { useContext, useUiContext } from '../../composables';
import type { TourRootContext, TourUiSlot } from './types';

export const [provideTourRootContext, useTourRootContext] = useContext<TourRootContext>('TourRoot');

export const [provideTourUi, useTourUi] = useUiContext<TourUiSlot>('Tour', ui => {
  providePopperUi(ui);

  return ui;
});
