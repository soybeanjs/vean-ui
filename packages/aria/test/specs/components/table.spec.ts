import { describe, expect, it } from 'vitest';
import {
  setTableColumnFilterEntry,
  toTableExpandedState,
  toggleTableExpandedState
} from '../../../src/components/table/shared';
import {
  defaultTableFilterFn,
  getTableColumnKey,
  getTablePinningFromColumns,
  isTableDataColumn,
  normalizeTableColumns,
  normalizeTableFilterValue
} from '../../../src/components/table/columns';
import type { TableColumn } from '../../../src/components/table/types';

describe('table columns', () => {
  it('injects a safe accessorFn for dotted accessor keys while keeping the id', () => {
    const columns = normalizeTableColumns([{ header: 'Details', accessorKey: 'details.description' }] as TableColumn[]);

    expect(columns[0].id).toBe('details.description');

    const accessorFn = (columns[0] as TableColumn & { accessorFn?: (row: unknown) => unknown }).accessorFn;

    expect(typeof accessorFn).toBe('function');
    expect(accessorFn?.({})).toBeUndefined();
    expect(accessorFn?.({ details: { description: 'x' } })).toBe('x');
  });

  it('keeps accessorKey columns unchanged through normalization', () => {
    const columns = normalizeTableColumns([
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age' }
    ] as TableColumn[]);

    expect(columns[0]).toMatchObject({ accessorKey: 'name' });
    expect(columns[1]).toMatchObject({ accessorKey: 'age' });
  });

  it('generates stable ids for type and group columns', () => {
    const columns = normalizeTableColumns([
      { type: 'selection', header: '' },
      { id: 'profile', header: 'Profile', columns: [{ header: 'Name', accessorKey: 'name' }] },
      { header: 'Age', accessorKey: 'age' }
    ] as TableColumn[]);

    expect(columns[0].id).toBe('__selection');
    expect(columns[1].id).toBe('profile');
    expect(columns[2].id).toBe('age');
  });

  it('defaults sorting, filtering, and resizing to opt-in', () => {
    const columns = normalizeTableColumns([{ header: 'Name', accessorKey: 'name' }] as TableColumn[]);

    expect(columns[0]).toMatchObject({
      enableSorting: false,
      enableColumnFilter: false,
      enableResizing: false,
      filterFn: undefined
    });
  });

  it('assigns the compound filter function to filterable columns', () => {
    const columns = normalizeTableColumns([
      { header: 'Name', accessorKey: 'name', enableColumnFilter: true }
    ] as TableColumn[]);

    expect(typeof columns[0].filterFn).toBe('function');
  });

  it('detects data and group columns', () => {
    const dataColumn = normalizeTableColumns([{ header: 'Name', accessorKey: 'name' }] as TableColumn[])[0];

    expect(isTableDataColumn(dataColumn)).toBe(true);

    const groupColumn = normalizeTableColumns([
      { id: 'group', header: 'Group', columns: [{ header: 'Name', accessorKey: 'name' }] }
    ] as TableColumn[])[0];

    expect(isTableDataColumn(groupColumn)).toBe(false);
  });

  it('resolves column keys with the documented priority', () => {
    expect(getTableColumnKey({ id: 'custom', header: 'A' } as TableColumn)).toBe('custom');
    expect(getTableColumnKey({ accessorKey: 'name' } as TableColumn)).toBe('name');
  });

  it('derives pinning state from fixed fields', () => {
    const pinning = getTablePinningFromColumns([
      { header: 'Name', accessorKey: 'name', fixed: 'start' },
      { header: 'Age', accessorKey: 'age' },
      { header: 'Action', id: 'action', fixed: 'end' }
    ] as TableColumn[]);

    expect(pinning).toEqual({ start: ['name'], end: ['action'] });
    expect(getTablePinningFromColumns([{ header: 'Age', accessorKey: 'age' }] as TableColumn[])).toBeUndefined();
  });
});

describe('table expanded state', () => {
  it('converts key lists into expanded state maps', () => {
    expect(toTableExpandedState(['1', '2'])).toEqual({ '1': true, '2': true });
  });

  it('toggles expansion of individual rows', () => {
    expect(toggleTableExpandedState({}, '1')).toEqual({ '1': true });
    expect(toggleTableExpandedState({ '1': true }, '1')).toEqual({});
    expect(toggleTableExpandedState({ '2': true }, '1')).toEqual({ '2': true, '1': true });
    expect(toggleTableExpandedState(true, '1')).toBe(true);
  });
});

describe('table filter state', () => {
  it('normalizes compound filter values', () => {
    expect(normalizeTableFilterValue('lin')).toEqual({ keyword: 'lin', values: [] });
    expect(normalizeTableFilterValue({ values: ['a', 'a', 'b'] })).toEqual({
      keyword: '',
      values: ['a', 'b']
    });
  });

  it('adds, replaces, and removes filter entries', () => {
    let state = setTableColumnFilterEntry([], 'name', 'lin');
    expect(state).toEqual([{ id: 'name', value: 'lin' }]);

    state = setTableColumnFilterEntry(state, 'name', { values: ['Ada'] });
    expect(state).toEqual([{ id: 'name', value: { values: ['Ada'] } }]);

    state = setTableColumnFilterEntry(state, 'name', undefined);
    expect(state).toEqual([]);
  });

  it('matches rows by keyword and values', () => {
    const row = {
      getValue: (id: string) => (id === 'name' ? 'Ada' : null)
    } as unknown as Parameters<typeof defaultTableFilterFn>[0];

    expect(defaultTableFilterFn(row, 'name', 'ad')).toBe(true);
    expect(defaultTableFilterFn(row, 'name', 'li')).toBe(false);
    expect(defaultTableFilterFn(row, 'name', { values: ['Ada'] })).toBe(true);
    expect(defaultTableFilterFn(row, 'name', { values: ['Linus'] })).toBe(false);
    expect(defaultTableFilterFn(row, 'name', { keyword: 'ad', values: ['Ada'] })).toBe(true);
    expect(defaultTableFilterFn(row, 'name', { keyword: 'ad', values: ['Linus'] })).toBe(false);
  });
});
