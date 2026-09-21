import { useDirection } from '../config-provider/context';
import { useContext } from '../../composables';
import type { TreeRootContextParams } from './types';

export const [provideTreeRootContext, useTreeRootContext] = useContext('TreeRoot', (params: TreeRootContextParams) => {
  const dir = useDirection(() => params.dir.value);

  return {
    ...params,
    dir
  };
});
