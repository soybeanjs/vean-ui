import { afterAll, describe, expect, it } from 'vitest';
import {
  filterHiddenTreeNodes,
  flattenChildren,
  fuzzySearch,
  getTreePaths,
  resolveTreeNavigation
} from '../../../src/shared';
import type { TreeNavigationNode } from '../../../src/shared';
import { assertWithinCeiling, benchmark, formatBenchmarks } from '../shared/benchmark';
import type { BenchmarkStats } from '../shared/benchmark';

/**
 * Pure hot paths.
 *
 * These are the functions that run on every keystroke, every focus move and
 * every data refresh, so their cost multiplies by interaction rate rather than
 * by mount count. They run in the browser tier anyway (one config, one mental
 * model) even though none of them touch the DOM: the ceilings are set from
 * browser-mode numbers so the tier stays internally consistent.
 *
 * Sizes are chosen at the point where the cost starts to matter for a real
 * screen: 1000 rows is a virtualized table's dataset, 5000 options is a large
 * combobox, 2000 tree nodes is a file explorer.
 */
const stats: BenchmarkStats[] = [];

afterAll(() => {
  console.log(`\n${formatBenchmarks(stats)}\n`);
});

const record = async (pending: Promise<BenchmarkStats>): Promise<BenchmarkStats> => {
  const value = await pending;

  stats.push(value);

  return value;
};

interface TreeNode {
  children?: TreeNode[];
  hidden?: boolean;
  value: string;
}

/** A branching tree of `count` nodes, three levels deep. */
const makeTree = (count: number): TreeNode[] => {
  const leaves = Array.from({ length: count }, (_, index) => ({ value: `leaf-${index}` }));

  return Array.from({ length: 10 }, (_, groupIndex) => ({
    children: leaves.slice(groupIndex * (count / 10), (groupIndex + 1) * (count / 10)),
    value: `group-${groupIndex}`
  }));
};

/** A flat visible-node list, as tree navigation receives it. */
const makeNavigationNodes = (count: number): TreeNavigationNode[] =>
  Array.from({ length: count }, (_, index) => ({
    expanded: false,
    hasChildren: index % 5 === 0,
    level: index % 5 === 0 ? 0 : 1,
    value: `node-${index}`
  }));

describe('tree helpers', () => {
  it('filters hidden nodes out of a 1000-node tree', async () => {
    // Called wherever a tree re-renders with a visibility fold. It allocates a
    // new tree on every call, so this is the allocation cost, not a search.
    const tree = makeTree(1000).map((node, index) =>
      index % 2 === 0 ? { ...node, hidden: true, value: `${node.value}-hidden` } : node
    );

    const result = await record(
      benchmark('tree/filterHidden-1000', () => filterHiddenTreeNodes(tree), { batch: 200, iterations: 40, warmup: 5 })
    );

    assertWithinCeiling(result, 0.2);
  });

  it('flattens a 1000-node tree', async () => {
    const tree = makeTree(1000);

    const result = await record(
      benchmark('tree/flattenChildren-1000', () => flattenChildren(tree), { batch: 200, iterations: 40, warmup: 5 })
    );

    assertWithinCeiling(result, 0.2);
  });

  it('resolves the path to a deep leaf in a 1000-node tree', async () => {
    // Worst case: the target is in the last branch, so the DFS walks everything.
    const tree = makeTree(1000).map(node => {
      const { children, ...rest } = node;

      return { ...rest, children: children?.map(child => ({ value: child.value })) };
    });

    const result = await record(
      benchmark('tree/getTreePaths-last', () => getTreePaths('leaf-999', tree as never), {
        batch: 100,
        iterations: 40,
        warmup: 5
      })
    );

    assertWithinCeiling(result, 0.2);
  });
});

describe('tree keyboard navigation', () => {
  const nodes = makeNavigationNodes(2000);

  it('moves focus down through a 2000-node visible list', async () => {
    // Runs on every ArrowDown. `findIndex` plus a scan is O(n); this benchmark is
    // what would catch someone adding a nested scan inside it.
    const result = await record(
      benchmark('tree-nav/down-2000', () => resolveTreeNavigation(nodes, 'node-1000', 'down'), {
        batch: 200,
        iterations: 40,
        warmup: 5
      })
    );

    assertWithinCeiling(result, 0.05);
  });

  it('resolves Home on a 2000-node visible list', async () => {
    const result = await record(
      benchmark('tree-nav/home-2000', () => resolveTreeNavigation(nodes, 'node-1999', 'home'), {
        batch: 200,
        iterations: 40,
        warmup: 5
      })
    );

    assertWithinCeiling(result, 0.05);
  });

  it('treats an unknown current value as a no-op without scanning children', async () => {
    const result = await record(
      benchmark('tree-nav/missing-2000', () => resolveTreeNavigation(nodes, 'not-present', 'down'), {
        batch: 200,
        iterations: 40,
        warmup: 5
      })
    );

    assertWithinCeiling(result, 0.05);
  });
});

describe('fuzzy search', () => {
  const entries = Array.from({ length: 5000 }, (_, index) => ({
    id: index,
    label: `Item number ${index}`,
    tags: `tag-${index % 50}`
  }));

  it('scans 5000 entries on a single-field query', async () => {
    // This is the Command palette / combobox keystroke path. `limit` is what keeps
    // the caller cheap; the scan itself is unavoidable.
    const result = await record(
      benchmark('fuzzy/1-key-5000', () => fuzzySearch('item 42', entries, { keys: ['label'], limit: 20 }), {
        batch: 10,
        iterations: 30,
        warmup: 5
      })
    );

    assertWithinCeiling(result, 2);
  });

  it('scans 5000 entries on a weighted two-field query', async () => {
    const result = await record(
      benchmark(
        'fuzzy/2-keys-5000',
        () => fuzzySearch('item 42', entries, { keys: ['label', 'tags'], weights: [2, 1], limit: 20 }),
        { batch: 10, iterations: 30, warmup: 5 }
      )
    );

    assertWithinCeiling(result, 3);
  });

  it('returns early on an empty query', async () => {
    // The guard that keeps a fresh, empty palette from scanning anything.
    const result = await record(
      benchmark('fuzzy/empty-query', () => fuzzySearch('', entries, { keys: ['label'] }), {
        batch: 1000,
        iterations: 30,
        warmup: 5
      })
    );

    expect(result.p95).toBeLessThan(0.01);
  });
});
