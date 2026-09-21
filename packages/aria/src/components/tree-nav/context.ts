import { provideMenuUi } from '../menu/context';
import { useContext, useUiContext } from '../../composables';
import type { TreeNavRootContextParams, TreeNavUiSlot } from './types';

export const [provideTreeNavRootContext, useTreeNavRootContext] = useContext(
  'TreeNavRoot',
  (params: TreeNavRootContextParams) => ({ ...params })
);

export const [provideTreeNavUi, useTreeNavUi] = useUiContext<TreeNavUiSlot>('TreeNavUi', ui => {
  provideMenuUi(ui);

  return ui;
});
