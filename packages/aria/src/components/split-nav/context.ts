import { computed } from 'vue';
import { useDirection } from '../config-provider/context';
import { provideMenuUi } from '../menu/context';
import { provideTreeMenuUi } from '../tree-menu/context';
import { provideTreeNavUi } from '../tree-nav/context';
import { useContext, useUiContext } from '../../composables';
import type { SplitNavRootContextParams, SplitNavUiSlot } from './types';

export const [provideSplitNavRootContext, useSplitNavRootContext] = useContext(
  'SplitNavRoot',
  (params: SplitNavRootContextParams) => {
    const dir = useDirection(params.dir);

    return {
      ...params,
      dir
    };
  }
);

export const [provideSplitNavUi, useSplitNavUi] = useUiContext<SplitNavUiSlot>('SplitNavUi', ui => {
  provideTreeNavUi(computed(() => ({})));
  provideMenuUi(computed(() => ({})));
  provideTreeMenuUi(computed(() => ({})));

  return ui;
});
