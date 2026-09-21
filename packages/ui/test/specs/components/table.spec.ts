import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useTableEngine } from '@vean/aria/table';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import STable from '@/components/table/table.vue';
import type { TableColumn } from '@/components/table/types';
import { tableVariants } from '@/styles/table';
import { MockResizeObserver, createMockResizeObserverEntry, delay, setupMock } from '../../shared';
import { getA11yViolations } from '../../shared/a11y';

interface TableRowData {
  id: number;
  name: string;
  age: number;
  children?: TableRowData[];
}

const columns: TableColumn[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age', align: 'center' as const }
];

const groupedColumns: TableColumn[] = [
  {
    id: 'profile',
    header: 'Profile',
    columns: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age', align: 'center' as const }
    ]
  }
];

const sortableColumns: TableColumn[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age', align: 'center' as const, enableSorting: true }
];

const filterableColumns: TableColumn[] = [
  { header: 'Name', accessorKey: 'name', enableColumnFilter: true },
  { header: 'Age', accessorKey: 'age', align: 'center' as const }
];

const fixedColumns: TableColumn[] = [
  { header: 'Name', accessorKey: 'name', size: 140, fixed: 'start' },
  { header: 'Age', accessorKey: 'age', size: 96, align: 'center' as const, fixed: 'end' }
];

const resizableColumns: TableColumn[] = [
  { header: 'Name', accessorKey: 'name', size: 140, minSize: 100, resizable: true },
  { header: 'Age', accessorKey: 'age', align: 'center' as const, size: 96 }
];

const selectionColumns: TableColumn[] = [{ type: 'selection' as const, size: 48 }, ...columns];

const expandableColumns: TableColumn[] = [{ type: 'expand' as const, size: 48 }, ...columns];

const data: TableRowData[] = [
  { id: 1, name: 'Ada', age: 32 },
  { id: 2, name: 'Linus', age: 28 }
];

const virtualizedData: TableRowData[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  age: 20 + (index % 10)
}));

const treeData: TableRowData[] = [
  {
    id: 1,
    name: 'Ada',
    age: 32,
    children: [
      { id: 11, name: 'Ada Child', age: 8 },
      { id: 12, name: 'Ada Child 2', age: 6 }
    ]
  },
  { id: 2, name: 'Linus', age: 28 }
];

function mockRect(element: Element, rect: { x?: number; y?: number; width?: number; height?: number }) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: rect.x ?? 0,
      y: rect.y ?? 0,
      top: rect.y ?? 0,
      left: rect.x ?? 0,
      right: (rect.x ?? 0) + (rect.width ?? 0),
      bottom: (rect.y ?? 0) + (rect.height ?? 0),
      width: rect.width ?? 0,
      height: rect.height ?? 0,
      toJSON: () => ({})
    })
  });
}

function dispatchPointerEvent(target: EventTarget, type: string, init: PointerEventInit) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

async function openTableFilter(wrapper: ReturnType<typeof mount>, columnLabel: string) {
  await wrapper.get(`button[aria-label="Filter ${columnLabel}"]`).trigger('click');
  await nextTick();
}

async function setTeleportedInputValue(label: string, value: string) {
  const input = document.body.querySelector(`input[aria-label="${label}"]`) as HTMLInputElement | null;

  expect(input).toBeTruthy();

  if (!input) {
    return;
  }

  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));

  await nextTick();
  await nextTick();
}

async function clickTeleportedControl(label: string) {
  const labeledControl = document.body.querySelector(`[aria-label="${label}"]`) as HTMLElement | null;
  const textControl = Array.from(document.body.querySelectorAll('button')).find(
    button => button.textContent?.trim() === label
  );
  const control = labeledControl ?? textControl ?? null;

  expect(control).toBeTruthy();

  control?.click();
  await nextTick();
  await nextTick();
}

describe('STable', () => {
  describe('rendering', () => {
    it('renders column headers and cell values', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Name');
      expect(wrapper.text()).toContain('Age');
      expect(wrapper.text()).toContain('Ada');
      expect(wrapper.text()).toContain('Linus');
      wrapper.unmount();
    });

    it('renders grouped headers within a single semantic table', () => {
      const wrapper = mount(STable, {
        props: {
          columns: groupedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('table')).toHaveLength(1);
      expect(wrapper.findAll('thead tr')).toHaveLength(2);
      expect(wrapper.get('th[colspan="2"]').text()).toContain('Profile');
      wrapper.unmount();
    });

    it('forwards custom cell slots to the Aria data table', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        slots: {
          age: props => {
            const { value } = props as { value: number };

            return h('span', { 'data-testid': 'age-cell' }, `Age: ${value}`);
          }
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-testid="age-cell"]')).toHaveLength(2);
      expect(wrapper.text()).toContain('Age: 32');
      wrapper.unmount();
    });

    it('renders type column headers without leaking generated ids', () => {
      const wrapper = mount(STable, {
        props: {
          columns: [...expandableColumns, { type: 'index' as const }] as TableColumn[],
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const heads = wrapper.findAll('thead th');

      expect(heads[0].text()).toBe('');
      expect(heads.at(-1)?.text()).toBe('#');
      expect(wrapper.find('thead').text()).not.toContain('__index');
      expect(wrapper.find('thead').text()).not.toContain('__expand');
      wrapper.unmount();
    });

    it('renders the default empty state when there are no rows', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data: [],
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('No data');
      expect(wrapper.text()).toContain('There is no data to display.');
      expect(wrapper.get('tbody td[colspan="2"]').text()).toContain('No data');
      expect(wrapper.findAll('tbody tr')).toHaveLength(1);

      wrapper.unmount();
    });

    it('allows overriding the empty state with the empty slot', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data: [],
          rowKey: row => row.id
        },
        slots: {
          empty: ({ columnSize }: any) => {
            return h('div', { 'data-testid': 'table-empty', 'data-column-size': columnSize }, 'Custom empty');
          }
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-testid="table-empty"]').attributes('data-column-size')).toBe('2');
      expect(wrapper.text()).toContain('Custom empty');
      expect(wrapper.text()).not.toContain('No data');

      wrapper.unmount();
    });

    it('uses dir on the root element and css text-align for logical alignment', () => {
      const alignedColumns: TableColumn[] = [
        { header: 'Name', accessorKey: 'name' },
        { header: 'Age', accessorKey: 'age', align: 'end' },
        { header: '#', type: 'index', size: 48 }
      ];

      const wrapper = mount(STable, {
        props: {
          dir: 'rtl',
          columns: alignedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const heads = wrapper.findAll('th');
      const cells = wrapper.findAll('td');

      expect(wrapper.get('div[dir="rtl"]')).toBeTruthy();
      expect(heads[0].attributes('style')).toContain('text-align: start;');
      expect(heads[1].attributes('style')).toContain('text-align: end;');
      expect(heads[2].attributes('style')).toContain('text-align: center;');
      expect(heads[0].attributes('align')).toBeUndefined();
      expect(cells[0].attributes('style')).toContain('text-align: start;');
      expect(cells[1].attributes('style')).toContain('text-align: end;');
      expect(cells[2].attributes('style')).toContain('text-align: center;');

      wrapper.unmount();
    });
  });

  describe('selection state', () => {
    it('emits row interaction events with row metadata', async () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const firstRow = wrapper.findAll('tbody tr')[0];
      const expectedPayload = {
        rowData: data[0],
        rowKey: 1,
        index: 0,
        level: 1,
        hasChildren: false
      };

      const rowEvents = [
        ['click', 'rowClick'],
        ['dblclick', 'rowDblclick'],
        ['contextmenu', 'rowContextmenu'],
        ['mouseenter', 'rowMouseenter'],
        ['mouseleave', 'rowMouseleave']
      ] as const;

      for (const [domEvent, emittedEvent] of rowEvents) {
        await firstRow.trigger(domEvent);

        expect(wrapper.emitted(emittedEvent)?.[0]?.[0]).toBeInstanceOf(MouseEvent);
        expect(wrapper.emitted(emittedEvent)?.[0]?.[1]).toMatchObject(expectedPayload);
      }

      wrapper.unmount();
    });

    it('uses the UI header-selection slot to toggle all visible rows', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await wrapper.get('[aria-label="Select all rows"]').trigger('click');

      expect(wrapper.emitted('update:selected')?.[0]?.[0]).toEqual([1, 2]);
      wrapper.unmount();
    });

    it('emits update:selected when a row checkbox is clicked', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await wrapper.get('[aria-label="Select row Ada"]').trigger('click');

      expect(wrapper.emitted('update:selected')).toBeTruthy();
      expect(wrapper.emitted('update:selected')?.[0]?.[0]).toEqual([1]);
      wrapper.unmount();
    });

    it('uses pressed button semantics for single-selection controls', () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id,
          multiple: false,
          selected: 1
        },
        attachTo: document.body
      });

      const control = wrapper.get('button[aria-label="Select row Ada"]');

      expect(control.attributes('aria-pressed')).toBe('true');
      expect(control.attributes('role')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('sorting and filtering', () => {
    it('forwards custom sort slots with live sort state', async () => {
      const customSortSlots: Record<string, (props: any) => any> = {
        'header-sort': (props: { sortOrder?: 'asc' | 'desc'; ariaLabel?: string; toggleSort?: () => void }) => {
          const { sortOrder, ariaLabel, toggleSort } = props;

          return h(
            'button',
            {
              type: 'button',
              'data-testid': 'sort-trigger',
              'aria-label': ariaLabel,
              onClick: () => toggleSort?.()
            },
            [h('span', { 'data-testid': 'sort-indicator' }, sortOrder ?? 'none')]
          );
        }
      };

      const wrapper = mount(STable, {
        props: {
          columns: sortableColumns,
          data,
          rowKey: row => row.id
        },
        slots: customSortSlots,
        attachTo: document.body
      });

      expect(wrapper.get('[data-testid="sort-indicator"]').text()).toBe('none');

      await wrapper.get('[data-testid="sort-trigger"]').trigger('click');

      expect(wrapper.get('[data-testid="sort-indicator"]').text()).toBe('asc');
      wrapper.unmount();
    });

    it('sorts rows when a sortable header is activated and emits update:sorting', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: sortableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await wrapper.get('button[aria-label="Sort by Age"]').trigger('click');

      expect(wrapper.emitted('update:sorting')?.[0]?.[0]).toEqual([{ id: 'age', desc: false }]);
      expect(wrapper.findAll('tbody tr')[0].text()).toContain('Linus');
      wrapper.unmount();
    });

    it('emits an empty sorting state after cycling the sortable header', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: sortableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const sortTrigger = wrapper.get('button[aria-label="Sort by Age"]');

      await sortTrigger.trigger('click');
      await sortTrigger.trigger('click');
      await sortTrigger.trigger('click');

      expect(wrapper.emitted('update:sorting')?.[0]?.[0]).toEqual([{ id: 'age', desc: false }]);
      expect(wrapper.emitted('update:sorting')?.[1]?.[0]).toEqual([{ id: 'age', desc: true }]);
      expect(wrapper.emitted('update:sorting')?.[2]?.[0]).toEqual([]);
      wrapper.unmount();
    });

    it('keeps controlled sort state until the parent writes back', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: sortableColumns,
          data,
          rowKey: row => row.id,
          sorting: [{ id: 'age', desc: false }]
        },
        attachTo: document.body
      });

      await wrapper.get('button[aria-label="Sort by Age, currently ascending"]').trigger('click');

      expect(wrapper.emitted('update:sorting')?.[0]?.[0]).toEqual([{ id: 'age', desc: true }]);
      expect(wrapper.findAll('tbody tr')[0].text()).toContain('Linus');

      wrapper.unmount();
    });

    it('filters rows when using the floating filter search input', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: filterableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await openTableFilter(wrapper, 'Name');
      await setTeleportedInputValue('Search filter options for Name', 'Lin');

      expect(wrapper.emitted('update:columnFilters')?.at(-1)?.[0]).toEqual([{ id: 'name', value: 'Lin' }]);
      expect(wrapper.findAll('tbody tr')).toHaveLength(1);
      expect(wrapper.get('tbody').text()).toContain('Linus');
      expect(wrapper.get('tbody').text()).not.toContain('Ada');
      wrapper.unmount();
    });

    it('filters rows when selecting options from the floating filter panel', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: filterableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await openTableFilter(wrapper, 'Name');
      await clickTeleportedControl('Select Linus');

      expect(wrapper.emitted('update:columnFilters')?.at(-1)?.[0]).toEqual([
        { id: 'name', value: { values: ['Linus'] } }
      ]);
      expect(wrapper.findAll('tbody tr')).toHaveLength(1);
      expect(wrapper.get('tbody').text()).toContain('Linus');
      expect(wrapper.get('tbody').text()).not.toContain('Ada');
      wrapper.unmount();
    });

    it('clears floating filter selections when clicking clear', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: filterableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await openTableFilter(wrapper, 'Name');
      await clickTeleportedControl('Select Linus');
      await clickTeleportedControl('Clear');

      expect(wrapper.emitted('update:columnFilters')?.at(-1)?.[0]).toEqual([]);
      expect(wrapper.findAll('tbody tr')).toHaveLength(2);
      expect(wrapper.get('tbody').text()).toContain('Ada');
      expect(wrapper.get('tbody').text()).toContain('Linus');
      wrapper.unmount();
    });

    it('supports custom filter slots with option toggles', async () => {
      const customFilterSlots = {
        'header-filter': (props: {
          filterOptions: Array<{ label: string; value: string }>;
          toggleFilterOption: (value: string) => void;
          isFilterOptionSelected: (value: string) => boolean;
        }) => {
          const { filterOptions, toggleFilterOption, isFilterOptionSelected } = props;

          return h(
            'div',
            { 'data-testid': 'custom-filter' },
            filterOptions.map(option =>
              h(
                'button',
                {
                  type: 'button',
                  'data-testid': `filter-option-${option.value}`,
                  'data-selected': isFilterOptionSelected(option.value),
                  onClick: () => toggleFilterOption(option.value)
                },
                option.label
              )
            )
          );
        }
      } as any;

      const wrapper = mount(STable, {
        props: {
          columns: filterableColumns,
          data,
          rowKey: row => row.id
        },
        slots: customFilterSlots,
        attachTo: document.body
      });

      await wrapper.get('[data-testid="filter-option-Linus"]').trigger('click');

      expect(wrapper.emitted('update:columnFilters')?.at(-1)?.[0]).toEqual([
        { id: 'name', value: { values: ['Linus'] } }
      ]);
      expect(wrapper.findAll('tbody tr')).toHaveLength(1);
      expect(wrapper.get('tbody').text()).toContain('Linus');
      expect(wrapper.get('tbody').text()).not.toContain('Ada');
      wrapper.unmount();
    });
  });

  describe('fixed and resizable columns', () => {
    it('applies sticky offsets to fixed columns', () => {
      const wrapper = mount(STable, {
        props: {
          columns: fixedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const startHead = wrapper.get('th[data-fixed-side="start"]');
      const endHead = wrapper.get('th[data-fixed-side="end"]');

      expect(startHead.attributes('style')).toContain('position: sticky;');
      expect(startHead.attributes('style')).toContain('inset-inline-start: 0px;');
      expect(endHead.attributes('style')).toContain('inset-inline-end: 0px;');
      expect(wrapper.get('td[data-fixed-side="start"]').attributes('style')).toContain('inset-inline-start: 0px;');
      wrapper.unmount();
    });

    it('keeps logical fixed sides in rtl and lets css mirror them', () => {
      const wrapper = mount(STable, {
        props: {
          dir: 'rtl',
          columns: fixedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const startHead = wrapper.get('th[data-fixed-side="start"]');
      const endHead = wrapper.get('th[data-fixed-side="end"]');

      expect(startHead.attributes('style')).toContain('inset-inline-start: 0px;');
      expect(endHead.attributes('style')).toContain('inset-inline-end: 0px;');
      expect(wrapper.get('td[data-fixed-side="start"]').attributes('style')).toContain('inset-inline-start: 0px;');

      wrapper.unmount();
    });

    it('uses measured widths when calculating offsets for multiple left fixed columns', async () => {
      class TestResizeObserver extends MockResizeObserver {
        static instance: MockResizeObserver | null = null;

        constructor(callback: ResizeObserverCallback) {
          super(callback);
          TestResizeObserver.instance = this;
        }
      }

      const measuredFixedColumns: TableColumn[] = [
        { header: 'Name', accessorKey: 'name', size: 140, fixed: 'start' },
        { header: 'Age', accessorKey: 'age', size: 96, align: 'center' as const, fixed: 'start' },
        { header: 'Id', accessorKey: 'id', size: 120 }
      ];

      const cleanup = setupMock('ResizeObserver', TestResizeObserver as unknown as typeof ResizeObserver);
      const wrapper = mount(STable, {
        props: {
          columns: measuredFixedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const heads = wrapper.findAll('th');
      const table = wrapper.get('table').element;

      mockRect(heads[0].element, { x: 0, y: 0, width: 176, height: 40 });
      mockRect(heads[1].element, { x: 176, y: 0, width: 108, height: 40 });
      mockRect(heads[2].element, { x: 284, y: 0, width: 120, height: 40 });

      TestResizeObserver.instance?.trigger([createMockResizeObserverEntry(table, { width: 404, height: 120 })]);

      await delay(30);
      await nextTick();

      expect(heads[0].attributes('style')).toContain('inset-inline-start: 0px;');
      expect(heads[1].attributes('style')).toContain('inset-inline-start: 176px;');
      expect(heads[0].attributes('data-fixed-last-start')).toBeUndefined();
      expect(heads[1].attributes('data-fixed-last-start')).toBe('');
      expect(wrapper.findAll('td[data-fixed-side="start"]')[1]?.attributes('style')).toContain(
        'inset-inline-start: 176px;'
      );
      expect(wrapper.findAll('td[data-fixed-side="start"]')[0]?.attributes('data-fixed-last-start')).toBeUndefined();
      expect(wrapper.findAll('td[data-fixed-side="start"]')[1]?.attributes('data-fixed-last-start')).toBe('');

      wrapper.unmount();
      cleanup();
    });

    it('uses logical start offsets for multiple fixed columns in rtl', async () => {
      class TestResizeObserver extends MockResizeObserver {
        static instance: MockResizeObserver | null = null;

        constructor(callback: ResizeObserverCallback) {
          super(callback);
          TestResizeObserver.instance = this;
        }
      }

      const measuredFixedColumns: TableColumn[] = [
        { header: 'Name', accessorKey: 'name', size: 140, fixed: 'start' },
        { header: 'Age', accessorKey: 'age', size: 96, align: 'center' as const, fixed: 'start' },
        { header: 'Id', accessorKey: 'id', size: 120 }
      ];

      const cleanup = setupMock('ResizeObserver', TestResizeObserver as unknown as typeof ResizeObserver);
      const wrapper = mount(STable, {
        props: {
          dir: 'rtl',
          columns: measuredFixedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const heads = wrapper.findAll('th');
      const table = wrapper.get('table').element;

      mockRect(heads[0].element, { x: 0, y: 0, width: 176, height: 40 });
      mockRect(heads[1].element, { x: 176, y: 0, width: 108, height: 40 });
      mockRect(heads[2].element, { x: 284, y: 0, width: 120, height: 40 });

      TestResizeObserver.instance?.trigger([createMockResizeObserverEntry(table, { width: 404, height: 120 })]);

      await delay(30);
      await nextTick();

      expect(heads[0].attributes('style')).toContain('inset-inline-start: 0px;');
      expect(heads[1].attributes('style')).toContain('inset-inline-start: 176px;');
      expect(heads[0].attributes('data-fixed-last-start')).toBeUndefined();
      expect(heads[1].attributes('data-fixed-last-start')).toBe('');
      expect(wrapper.findAll('td[data-fixed-side="start"]')[1]?.attributes('style')).toContain(
        'inset-inline-start: 176px;'
      );
      expect(wrapper.findAll('td[data-fixed-side="start"]')[0]?.attributes('data-fixed-last-start')).toBeUndefined();
      expect(wrapper.findAll('td[data-fixed-side="start"]')[1]?.attributes('data-fixed-last-start')).toBe('');

      wrapper.unmount();
      cleanup();
    });

    it('marks the last start fixed and first end fixed columns for styling', () => {
      const bidirectionalFixedColumns: TableColumn[] = [
        { header: 'Name', accessorKey: 'name', size: 140, fixed: 'start' },
        { header: 'Age', accessorKey: 'age', size: 96, align: 'center' as const, fixed: 'start' },
        { header: 'Id', accessorKey: 'id', size: 120 },
        {
          header: 'Name Copy',
          accessorFn: row => row.name,
          id: 'name-copy',
          size: 140,
          fixed: 'end'
        },
        { header: 'Id Copy', accessorFn: row => row.id, id: 'id-copy', size: 120, fixed: 'end' }
      ];

      const wrapper = mount(STable, {
        props: {
          columns: bidirectionalFixedColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const startHeads = wrapper.findAll('th[data-fixed-side="start"]');
      const endHeads = wrapper.findAll('th[data-fixed-side="end"]');
      const startCells = wrapper.findAll('td[data-fixed-side="start"]');
      const endCells = wrapper.findAll('td[data-fixed-side="end"]');

      expect(startHeads[0]?.attributes('data-fixed-last-start')).toBeUndefined();
      expect(startHeads[1]?.attributes('data-fixed-last-start')).toBe('');
      expect(endHeads[0]?.attributes('data-fixed-first-end')).toBe('');
      expect(endHeads[1]?.attributes('data-fixed-first-end')).toBeUndefined();
      expect(startCells[0]?.attributes('data-fixed-last-start')).toBeUndefined();
      expect(startCells[1]?.attributes('data-fixed-last-start')).toBe('');
      expect(endCells[0]?.attributes('data-fixed-first-end')).toBe('');
      expect(endCells[1]?.attributes('data-fixed-first-end')).toBeUndefined();

      wrapper.unmount();
    });

    it('adapts pointer resizing to rtl logical direction', async () => {
      const wrapper = mount(STable, {
        props: {
          dir: 'rtl',
          columns: resizableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const head = wrapper.get('th');
      const handle = wrapper.get('button[aria-label="Resize Name column"]');

      mockRect(head.element, { x: 0, y: 0, width: 140, height: 40 });

      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 140,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 100, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 100, clientY: 20, pointerId: 1 });

      await nextTick();

      expect(wrapper.emitted('update:columnSizing')?.at(-1)?.[0]).toEqual({ name: 180 });
      expect(head.attributes('style')).toContain('width: 180px;');
      wrapper.unmount();
    });

    it('updates column widths when a resize handle is dragged', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: resizableColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const head = wrapper.get('th');
      const handle = wrapper.get('button[aria-label="Resize Name column"]');

      mockRect(head.element, { x: 0, y: 0, width: 140, height: 40 });

      dispatchPointerEvent(handle.element, 'pointerdown', {
        clientX: 140,
        clientY: 20,
        pointerId: 1
      });
      dispatchPointerEvent(document, 'pointermove', { clientX: 180, clientY: 20, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 180, clientY: 20, pointerId: 1 });

      await nextTick();

      expect(wrapper.emitted('update:columnSizing')?.at(-1)?.[0]).toEqual({ name: 180 });
      expect(head.attributes('style')).toContain('width: 180px;');
      wrapper.unmount();
    });
  });

  describe('virtualized rows', () => {
    it('renders a virtualized subset and updates on scroll', async () => {
      class TestResizeObserver extends MockResizeObserver {
        static instance: MockResizeObserver | null = null;

        constructor(callback: ResizeObserverCallback) {
          super(callback);
          TestResizeObserver.instance = this;
        }
      }

      const cleanup = setupMock('ResizeObserver', TestResizeObserver as unknown as typeof ResizeObserver);
      const wrapper = mount(STable, {
        props: {
          virtual: true,
          height: 120,
          estimateSize: 30,
          columns,
          data: virtualizedData,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const root = wrapper.findComponent({ name: 'TableRoot' }).element as HTMLElement;
      const scroll = wrapper.findComponent({ name: 'TableScroll' }).element as HTMLElement;
      let scrollTop = 0;

      Object.defineProperties(scroll, {
        clientHeight: { configurable: true, value: 120 },
        scrollHeight: { configurable: true, value: 3000 },
        scrollTop: {
          configurable: true,
          get: () => scrollTop,
          set: value => {
            scrollTop = value;
          }
        },
        getBoundingClientRect: {
          configurable: true,
          value: () => ({
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: 400,
            bottom: 120,
            width: 400,
            height: 120,
            toJSON: () => ({})
          })
        }
      });

      TestResizeObserver.instance?.trigger([createMockResizeObserverEntry(scroll, { width: 400, height: 120 })]);

      await delay(30);
      await nextTick();

      expect(root.getAttribute('style')).toBeNull();
      expect(scroll.getAttribute('style')).toContain('height: 120px;');
      expect(wrapper.text()).toContain('User 1');
      expect(wrapper.text()).not.toContain('User 100');
      expect(wrapper.findAll('tbody tr').length).toBeLessThan(virtualizedData.length);
      expect(wrapper.find('tbody tr[aria-hidden="true"] td').attributes('style')).toContain('height: 2610px;');

      scroll.scrollTop = 900;
      scroll.dispatchEvent(new Event('scroll'));

      await delay(30);
      await nextTick();

      expect(wrapper.text()).toContain('User 30');
      expect(wrapper.find('tbody tr[aria-hidden="true"] td').attributes('style')).toContain('height: 660px;');

      wrapper.unmount();
      cleanup();
    });
  });

  describe('expanded state', () => {
    it('emits update:expanded and renders expanded row content', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: expandableColumns,
          data,
          rowKey: row => row.id
        },
        slots: {
          'expanded-row': props => {
            const { row } = props as { row: Record<string, any> };

            return h('div', { 'data-testid': `expanded-${row.id}` }, `Expanded ${row.name}`);
          }
        },
        attachTo: document.body
      });

      await wrapper.find('[aria-label="Expand row Ada"]').trigger('click');

      expect(wrapper.emitted('update:expanded')).toBeTruthy();
      expect(wrapper.emitted('update:expanded')?.[0]?.[0]).toEqual({ '1': true });
      expect(wrapper.find('[data-testid="expanded-1"]').text()).toContain('Expanded Ada');
      wrapper.unmount();
    });
  });

  describe('tree rows', () => {
    it('renders nested rows and toggles children from the first data column', async () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data: treeData,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Ada');
      expect(wrapper.text()).not.toContain('Ada Child');

      await wrapper.get('[aria-label="Expand row Ada"]').trigger('click');

      expect(wrapper.emitted('update:expanded')?.[0]?.[0]).toEqual({ '1': true });
      expect(wrapper.text()).toContain('Ada Child');
      expect(wrapper.get('tbody tr[data-level="2"]').text()).toContain('Ada Child');

      wrapper.unmount();
    });

    it('keeps ancestor rows visible when filtering matches descendants', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: filterableColumns,
          data: treeData,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      await openTableFilter(wrapper, 'Name');
      await setTeleportedInputValue('Search filter options for Name', 'Child 2');

      expect(wrapper.text()).toContain('Ada');
      expect(wrapper.text()).toContain('Ada Child 2');
      expect(wrapper.text()).not.toContain('Linus');

      wrapper.unmount();
    });
  });

  describe('defaults', () => {
    it('renders multi-select checkboxes by default without passing multiple', () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.get('[aria-label="Select all rows"]')).toBeTruthy();
      expect(wrapper.findAll('[aria-label^="Select row"]')).toHaveLength(data.length);
      expect(wrapper.findAll('tbody button[aria-pressed]')).toHaveLength(0);

      wrapper.unmount();
    });

    it('renders row radios and hides select-all when multiple is false', () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id,
          multiple: false
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('tbody button[aria-pressed]')).toHaveLength(data.length);
      expect(wrapper.find('[aria-label="Select all rows"]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('controlled state', () => {
    it('keeps controlled selection without internal mutation', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id,
          selected: [1]
        },
        attachTo: document.body
      });

      await wrapper.get('[aria-label="Select row Linus"]').trigger('click');

      expect(wrapper.emitted('update:selected')?.[0]?.[0]).toEqual([1, 2]);
      expect(wrapper.get('[aria-label="Select row Ada"]').classes()).toContain('peer');

      wrapper.unmount();
    });
  });

  describe('data attributes', () => {
    it('renders data-vean-table-* attributes without leaking as/asChild', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-table-root]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-scroll]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-content]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-header]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-body]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-row]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-head]')).toBeTruthy();
      expect(wrapper.get('[data-vean-table-cell]')).toBeTruthy();

      const root = wrapper.get('[data-vean-table-root]').element;

      expect(root.hasAttribute('aschild')).toBe(false);
      expect(root.hasAttribute('as')).toBe(false);

      wrapper.unmount();
    });
  });

  describe('localization', () => {
    it('localizes filter popover copy via the ConfigProvider locale', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { locale: 'zh-CN' },
        slots: {
          default: h(STable, {
            columns: filterableColumns,
            data,
            rowKey: row => row.id
          })
        },
        attachTo: document.body
      });
      await nextTick();

      await wrapper.get('button[aria-label="筛选「Name」"]').trigger('click');
      await nextTick();

      const searchInput = document.body.querySelector(
        'input[aria-label="搜索「Name」的筛选选项"]'
      ) as HTMLInputElement | null;

      expect(searchInput).toBeTruthy();
      expect(searchInput?.placeholder).toBe('搜索 Name');
      expect(document.body.textContent).toContain('2 个选项');

      await clickTeleportedControl('选择 Linus');

      expect(document.body.textContent).toContain('已选 1 项');

      await clickTeleportedControl('清除');

      expect(wrapper.findComponent({ name: 'STable' }).emitted('update:columnFilters')?.at(-1)?.[0]).toEqual([]);

      wrapper.unmount();
    });

    it('localizes the empty state via the ConfigProvider locale', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { locale: 'zh-CN' },
        slots: {
          default: h(STable, {
            columns,
            data: [],
            rowKey: row => row.id
          })
        },
        attachTo: document.body
      });
      await nextTick();

      expect(wrapper.text()).toContain('暂无数据');
      expect(wrapper.text()).toContain('当前没有可显示的数据。');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(STable, {
        props: {
          columns: selectionColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });

  describe('engine escape hatch', () => {
    it('falls back to the columnDef.cell render function when no slot matches', () => {
      const renderColumns: TableColumn[] = [
        { header: 'Name', accessorKey: 'name' },
        {
          header: 'Age',
          accessorKey: 'age',
          cell: info => h('span', { 'data-testid': 'cell-render' }, `Age:${info.getValue()}`)
        }
      ];

      const wrapper = mount(STable, {
        props: {
          columns: renderColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-testid="cell-render"]')).toHaveLength(2);
      expect(wrapper.text()).toContain('Age:32');
      wrapper.unmount();
    });

    it('falls back to the columnDef.header render function when no slot matches', () => {
      const renderColumns: TableColumn[] = [
        {
          header: (props: any) => h('span', { 'data-testid': 'header-render' }, `H:${props.column.id}`),
          accessorKey: 'name'
        },
        { header: 'Age', accessorKey: 'age' }
      ];

      const wrapper = mount(STable, {
        props: {
          columns: renderColumns,
          data,
          rowKey: row => row.id
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-testid="header-render"]').text()).toBe('H:name');
      wrapper.unmount();
    });

    it('exposes slot props with the engine table and column instances', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        slots: {
          name: props => {
            const { table, engineColumn } = props as {
              table?: { getRowModel?: unknown };
              engineColumn?: { id?: string };
            };

            return h('span', { 'data-testid': 'engine-probe' }, `${typeof table?.getRowModel}:${engineColumn?.id}`);
          }
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-testid="engine-probe"]').text()).toBe('function:name');
      wrapper.unmount();
    });

    it('injects the engine instance via useTableEngine inside slot content', () => {
      const EngineProbe = defineComponent({
        setup() {
          const table = useTableEngine();

          return () => h('span', { 'data-testid': 'inject-probe' }, String(table.getRow('1').original.name));
        }
      });

      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        slots: {
          name: () => h(EngineProbe)
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-testid="inject-probe"]').text()).toBe('Ada');
      wrapper.unmount();
    });

    it('exposes the engine instance as the exposed root', async () => {
      const Probe = defineComponent({
        setup() {
          const engine = useTableEngine();

          return () =>
            h(
              'span',
              { 'data-testid': 'engine-sort-probe' },
              engine
                .getSortedRowModel()
                .rows.map(row => row.original.name)
                .join(',')
            );
        }
      });

      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id
        },
        slots: {
          name: () => h(Probe)
        },
        attachTo: document.body
      });

      const exposed = wrapper.vm as unknown as Record<string, unknown>;

      expect(typeof exposed.getRowModel).toBe('function');
      expect(typeof exposed.setSorting).toBe('function');

      (exposed.setSorting as (updater: unknown) => void)([{ id: 'age', desc: false }]);
      await nextTick();
      // external changes take a second tick: state write-back syncs the engine
      // atoms, then the memoized row model recomputes and the render flushes
      await nextTick();

      expect(wrapper.emitted('update:sorting')?.[0]?.[0]).toEqual([{ id: 'age', desc: false }]);
      expect(wrapper.findAll('tbody tr')[0].text()).toContain('Linus');
      expect(wrapper.get('[data-testid="engine-sort-probe"]').text()).toContain('Linus');
      wrapper.unmount();
    });

    it('passes engine options through the tableOptions prop', () => {
      const wrapper = mount(STable, {
        props: {
          columns,
          data,
          rowKey: row => row.id,
          tableOptions: {
            initialState: { columnVisibility: { age: false } }
          }
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('thead th')).toHaveLength(1);
      expect(wrapper.text()).not.toContain('Age');
      wrapper.unmount();
    });
  });
});

describe('STable rounded ladder', () => {
  /**
   * `rounded: true` 按 size 取**固定的圆角长度**，刻意不跟随主题半径种子：
   * 表格的圆角是"外观"而不是"随主题缩放的刻度"，所以它与 `--radius-*` 脱钩，
   * 改主题种子不会让表格变形。下面的映射就是这张策略表本身。
   */
  const fixedRadii = {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.125rem',
    lg: '1.375rem',
    xl: '1.625rem',
    '2xl': '1.75rem'
  } as const;

  const sizes = Object.keys(fixedRadii) as (keyof typeof fixedRadii)[];

  it('maps each size onto its fixed corner radius', () => {
    for (const size of sizes) {
      const { root } = tableVariants({ size, rounded: true });

      expect(root, size).toContain(`[--rounded:${fixedRadii[size]}]`);
      // 固定值就是字面量：不吃主题种子，任何主题下同一 size 的圆角一致
      expect(root, `${size} must not read a theme rung`).not.toContain('--radius-');
    }
  });

  it('keeps the default table on the theme seed', () => {
    // 默认（`rounded: false`）跟随主题种子，因此与同一卡片里的圆角齐平；
    // UnoCSS 把 `[--x:--y]` 规范化为 `var(--y)`，所以两者等价
    expect(tableVariants({ size: 'md' }).root).toContain('[--rounded:--radius]');
    expect(tableVariants({}).root).toContain('[--rounded:--radius]');
  });

  it('renders the mapped radius on the rounded table', () => {
    const wrapper = mount(STable, {
      props: { columns: [], data: [], rounded: true, size: 'xl' as const } as never
    });

    expect(wrapper.get('[data-vean-table-root]').classes()).toContain('[--rounded:1.625rem]');
    wrapper.unmount();
  });
});
