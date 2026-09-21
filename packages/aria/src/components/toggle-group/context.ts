import { useDirection } from '../config-provider/context';
import { useContext, useUiContext } from '../../composables';
import type { ToggleGroupRootContextParams, ToggleGroupUiSlot } from './types';

export const [provideToggleGroupRootContext, useToggleGroupRootContext] = useContext(
  'ToggleGroupRoot',
  (params: ToggleGroupRootContextParams) => {
    const dir = useDirection(() => params.dir.value);

    return {
      ...params,
      dir
    };
  }
);

export const [provideToggleGroupUi, useToggleGroupUi] = useUiContext<ToggleGroupUiSlot>('ToggleGroupUi');
