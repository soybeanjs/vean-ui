import { shallowRef } from 'vue';
import { providePopperUi } from '../popper/context';
import { useContext, useUiContext } from '../../composables';
import type { PopperUiSlot } from '../popper/types';
import type { HoverCardRootContext, HoverCardRootContextParams } from './types';

export const [provideHoverCardRootContext, useHoverCardRootContext] = useContext(
  'HoverCardRoot',
  (params: HoverCardRootContextParams): HoverCardRootContext => {
    const hasSelectionRef = shallowRef(false);
    const isPointerDownOnPopupRef = shallowRef(false);

    return {
      ...params,
      hasSelectionRef,
      isPointerDownOnPopupRef
    };
  }
);

export const [provideHoverCardUi, useHoverCardUi] = useUiContext<PopperUiSlot>('HoverCard', ui => {
  providePopperUi(ui);

  return ui;
});
