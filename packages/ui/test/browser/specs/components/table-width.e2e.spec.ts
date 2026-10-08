import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import type { TableColumn } from '@vean/aria/table';
import STable from '@/components/table/table.vue';
import { renderComponent } from '../../shared/render';

const columns = (size?: number): TableColumn<{ id: number; invoice: string; status: string; amount: string }>[] => [
  { header: 'Invoice', accessorKey: 'invoice', ...(size === undefined ? {} : { size }) },
  { header: 'Status', accessorKey: 'status', ...(size === undefined ? {} : { size }) },
  { header: 'Amount', accessorKey: 'amount', ...(size === undefined ? {} : { size }), align: 'end' }
];

const data = [
  { id: 1, invoice: 'INV-001', status: 'Paid', amount: '$250.00' },
  { id: 2, invoice: 'INV-002', status: 'Pending', amount: '$150.00' }
];

const makeWrapper = (width: number, cols: unknown, tableOptions?: Record<string, unknown>) =>
  defineComponent({
    name: `TableWidth${width}`,
    setup: () => () =>
      h(
        'div',
        { style: `width:${width}px` },
        h(STable, {
          columns: cols,
          data,
          rowKey: (row: { id: number }) => row.id,
          ...(tableOptions === undefined ? {} : { tableOptions })
        } as never)
      )
  });

const measure = () => {
  const scroll = document.querySelector<HTMLElement>('[data-vean-table-scroll]')!;
  const content = document.querySelector<HTMLElement>('[data-vean-table-content]')!;
  const heads = Array.from(document.querySelectorAll<HTMLElement>('[data-vean-table-head]'));
  return {
    content: content.getBoundingClientRect().width,
    scroll: scroll.getBoundingClientRect().width,
    overflow: scroll.scrollWidth > scroll.clientWidth,
    inlineWidths: heads.map(el => el.style.width)
  };
};

describe('table intrinsic width', () => {
  it('content-sized columns fit the container instead of overflowing', async () => {
    const { unmount } = await renderComponent(makeWrapper(445, columns()), { withTheme: {} });
    const result = measure();

    expect(result.content).toBeLessThanOrEqual(result.scroll);
    expect(result.overflow).toBe(false);
    expect(result.inlineWidths).toEqual(['', '', '']);

    unmount();
  });

  it('columns without `size` are not pinned to a fixed inline width', async () => {
    const { unmount } = await renderComponent(makeWrapper(900, columns()), { withTheme: {} });
    const result = measure();

    expect(result.inlineWidths).toEqual(['', '', '']);
    expect(result.overflow).toBe(false);

    unmount();
  });

  it('an explicit column `size` is still applied', async () => {
    const { unmount } = await renderComponent(makeWrapper(900, columns(80)), { withTheme: {} });
    const result = measure();

    expect(result.inlineWidths).toEqual(['80px', '80px', '80px']);

    unmount();
  });

  it('explicitly wide columns still scroll the container', async () => {
    const { unmount } = await renderComponent(makeWrapper(445, columns(400)), { withTheme: {} });
    const result = measure();

    expect(result.content).toBeGreaterThan(result.scroll);
    expect(result.overflow).toBe(true);

    unmount();
  });

  it('a `tableOptions.defaultColumn` size is still honoured', async () => {
    const { unmount } = await renderComponent(makeWrapper(900, columns(), { defaultColumn: { size: 200 } }), {
      withTheme: {}
    });
    const result = measure();

    expect(result.inlineWidths).toEqual(['200px', '200px', '200px']);

    unmount();
  });
});
