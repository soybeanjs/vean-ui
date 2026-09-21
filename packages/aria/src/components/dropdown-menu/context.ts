import { useDirection } from '../config-provider/context';
import { useContext } from '../../composables';
import type { DropdownMenuRootContextParams } from './types';

export const [provideDropdownMenuRootContext, useDropdownMenuRootContext] = useContext(
  'DropdownMenuRoot',
  (params: DropdownMenuRootContextParams) => {
    const dir = useDirection(params.dir);

    return {
      ...params,
      dir
    };
  }
);
