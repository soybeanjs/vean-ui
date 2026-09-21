import { useDirection } from '../config-provider/context';
import { useUiContext, useContext } from '../../composables';
import type { ToolbarRootContext, ToolbarRootContextParams, ToolbarUiSlot } from './types';

export const [provideToolbarRootContext, useToolbarRootContext] = useContext(
  'ToolbarRoot',
  (params: ToolbarRootContextParams): ToolbarRootContext => {
    const dir = useDirection(() => params.dir.value);

    return {
      ...params,
      dir
    };
  }
);

export const [provideToolbarUi, useToolbarUi] = useUiContext<ToolbarUiSlot>('ToolbarUi');
