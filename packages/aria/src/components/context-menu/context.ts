import { useContext } from '../../composables';
import type { ContextMenuRootContextParams } from './types';

export const [provideContextMenuRootContext, useContextMenuRootContext] =
  useContext<ContextMenuRootContextParams>('ContextMenuRoot');
