import { useDirection } from '../config-provider/context';
import { useContext, useUiContext } from '../../composables';
import type { AnchorRootContextParams, AnchorUiSlot } from './types';

export const [provideAnchorRootContext, useAnchorRootContext] = useContext(
  'AnchorRoot',
  (params: AnchorRootContextParams) => {
    const dir = useDirection(() => params.dir.value);

    return {
      ...params,
      dir
    };
  }
);

export const [provideAnchorUi, useAnchorUi] = useUiContext<AnchorUiSlot>('AnchorUi');
