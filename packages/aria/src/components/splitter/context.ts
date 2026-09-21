import { useDirection } from '../config-provider/context';
import { useContext, useUiContext } from '../../composables';
import type { SplitterGroupContext, SplitterUiSlot } from './types';

export const [provideSplitterGroupContext, useSplitterGroupContext] = useContext(
  'SplitterGroup',
  (params: SplitterGroupContext) => {
    const dir = useDirection(() => params.dir.value);

    return {
      ...params,
      dir
    };
  }
);

export const [provideSplitterUi, useSplitterUi] = useUiContext<SplitterUiSlot>('SplitterUi');
