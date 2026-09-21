import { describe, expect, it } from 'vitest';
import { getSortableInsertionRange, getSortableProjectedIndex } from '../../../src/composables/use-sortable-list';
import type { SortableView } from '../../../src/composables/use-sortable-list';

const createView = (
  id: string,
  order: number,
  group: string | number | null = null,
  disabled = false
): SortableView => ({
  id,
  order,
  group,
  disabled,
  element: undefined
});

describe('getSortableInsertionRange', () => {
  it('covers the whole list when every item shares one group', () => {
    const views = [createView('a', 0), createView('b', 1), createView('c', 2)];

    expect(getSortableInsertionRange(views, 1)).toEqual({ min: 0, max: 2 });
  });

  it('stops at a group change so groups stay aggregated', () => {
    // pinned (0) in front, unpinned (1) behind
    const views = [createView('p1', 0, 0), createView('p2', 1, 0), createView('u1', 2, 1), createView('u2', 3, 1)];

    expect(getSortableInsertionRange(views, 0)).toEqual({ min: 0, max: 1 });
    expect(getSortableInsertionRange(views, 3)).toEqual({ min: 2, max: 3 });
  });

  it('treats a locked item as a barrier', () => {
    const views = [createView('locked', 0, null, true), createView('a', 1), createView('b', 2), createView('c', 3)];

    // `a` can never be inserted before the locked item
    expect(getSortableInsertionRange(views, 1)).toEqual({ min: 1, max: 3 });
  });

  it('confines an item sandwiched between locked items', () => {
    const views = [
      createView('locked-a', 0, null, true),
      createView('a', 1),
      createView('locked-b', 2, null, true),
      createView('b', 3)
    ];

    expect(getSortableInsertionRange(views, 1)).toEqual({ min: 1, max: 1 });
  });

  it('degrades to an empty window for an out-of-range index', () => {
    expect(getSortableInsertionRange([createView('a', 0)], 4)).toEqual({ min: 4, max: 4 });
  });
});

describe('getSortableProjectedIndex', () => {
  const range = { min: 0, max: 4 };

  it('projects onto the first slot before every centre', () => {
    expect(getSortableProjectedIndex([100, 200, 300, 400], 50, range)).toBe(0);
  });

  it('counts the centres the pointer already passed', () => {
    expect(getSortableProjectedIndex([100, 200, 300, 400], 250, range)).toBe(2);
  });

  it('projects onto the last slot after every centre', () => {
    expect(getSortableProjectedIndex([100, 200, 300, 400], 900, range)).toBe(4);
  });

  it('clamps into the insertion window', () => {
    const window = { min: 2, max: 3 };

    expect(getSortableProjectedIndex([100, 200, 300, 400], 50, window)).toBe(2);
    expect(getSortableProjectedIndex([100, 200, 300, 400], 900, window)).toBe(3);
  });
});
