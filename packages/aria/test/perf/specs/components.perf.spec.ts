import { describe, expect, it, afterAll } from 'vitest';
import { assertWithinCeiling, formatBenchmarks } from '../shared/benchmark';
import type { BenchmarkStats } from '../shared/benchmark';
import { benchmarkMount } from '../shared/mount';
import { AccordionCompact } from '../../../src/components/accordion';
import { SelectCompact } from '../../../src/components/select';
import { TableCompact } from '../../../src/components/table';
import type { TableColumn } from '../../../src/components/table';

const stats: BenchmarkStats[] = [];

afterAll(() => {
  console.log(`\n${formatBenchmarks(stats)}\n`);
});

const record = async (pending: Promise<BenchmarkStats>): Promise<BenchmarkStats> => {
  const value = await pending;

  stats.push(value);

  return value;
};

interface Row {
  age: number;
  id: number;
  name: string;
}

const columns: TableColumn<Row>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age' }
];

const rows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({ age: 20 + (index % 40), id: index, name: `User ${index}` }));

/**
 * Table mount cost.
 *
 * This is the component where a mount regression is expensive: it renders one
 * component per cell, so 100 rows × 2 columns is 200 child components inside one
 * mount. The interesting questions are (a) is the cost linear in rows, and (b)
 * does virtualization actually bound it.
 *
 * 100 rows is chosen as the gate target rather than 500: it is a realistic
 * non-virtualized page, and 50 iterations of a 500-row mount would make this
 * file the slowest thing in the repo for no extra signal. 500 runs with fewer
 * iterations purely to show the curve.
 */
describe('TableCompact mount cost', () => {
  it('mounts 10 rows', async () => {
    const result = await record(
      benchmarkMount(
        {
          component: TableCompact,
          name: 'TableCompact/10-rows',
          props: () => ({ columns, data: rows(10), rowKey: (row: Row) => row.id })
        },
        { iterations: 40, warmup: 5 }
      )
    );

    assertWithinCeiling(result, 40);
    expect(result.iterations).toBe(40);
  });

  it('mounts 100 rows', async () => {
    const result = await record(
      benchmarkMount(
        {
          component: TableCompact,
          name: 'TableCompact/100-rows',
          props: () => ({ columns, data: rows(100), rowKey: (row: Row) => row.id })
        },
        { iterations: 40, warmup: 5 }
      )
    );

    assertWithinCeiling(result, 250);
  });

  it('mounts 500 rows without exploding', async () => {
    const result = await record(
      benchmarkMount(
        {
          component: TableCompact,
          name: 'TableCompact/500-rows',
          props: () => ({ columns, data: rows(500), rowKey: (row: Row) => row.id })
        },
        { iterations: 12, warmup: 3 }
      )
    );

    // Roughly 5× the 100-row cost. A super-linear blow-up (an O(n²) row scan, a
    // per-row layout thrash) lands far above this and is the regression this
    // ceiling exists to catch.
    assertWithinCeiling(result, 1500);
  });
});

describe('AccordionCompact mount cost', () => {
  it('mounts 10 items', async () => {
    const items = Array.from({ length: 10 }, (_, index) => ({ title: `Section ${index}`, value: `s${index}` }));

    const result = await record(
      benchmarkMount(
        { component: AccordionCompact, name: 'AccordionCompact/10-items', props: () => ({ items, type: 'single' }) },
        { iterations: 40, warmup: 5 }
      )
    );

    assertWithinCeiling(result, 60);
  });

  it('mounts 100 items', async () => {
    const items = Array.from({ length: 100 }, (_, index) => ({ title: `Section ${index}`, value: `s${index}` }));

    const result = await record(
      benchmarkMount(
        { component: AccordionCompact, name: 'AccordionCompact/100-items', props: () => ({ items, type: 'single' }) },
        { iterations: 40, warmup: 5 }
      )
    );

    assertWithinCeiling(result, 400);
  });
});

describe('SelectCompact mount cost', () => {
  it('mounts 100 options', async () => {
    const items = Array.from({ length: 100 }, (_, index) => ({ label: `Option ${index}`, value: `o${index}` }));

    const result = await record(
      benchmarkMount(
        {
          component: SelectCompact,
          name: 'SelectCompact/100-options',
          props: () => ({ items, placeholder: 'Pick' })
        },
        { iterations: 30, warmup: 5 }
      )
    );

    assertWithinCeiling(result, 150);
  });
});
