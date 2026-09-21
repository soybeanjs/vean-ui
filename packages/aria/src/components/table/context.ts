import { useContext, useUiContext } from '../../composables';
import type { TableCompactContext, TableEngineTable, TableUiSlot } from './types';

export const [provideTableCompactContext, useTableCompactContext] = useContext<TableCompactContext>('TableCompact');

export const [provideTableUi, useTableUi] = useUiContext<TableUiSlot>('Table');

/**
 * Access the TanStack table engine instance from anywhere inside the table
 * subtree (including slot content). Exposes the full engine API: row models,
 * grouping, faceted values, pagination, selection models, and more. The
 * instance is reactive through the engine's own atoms — never wrap it in
 * `reactive`/`ref` (deep proxies would break its identity-based memoization).
 */
export function useTableEngine(): TableEngineTable {
  return useTableCompactContext('TableEngine').table;
}
