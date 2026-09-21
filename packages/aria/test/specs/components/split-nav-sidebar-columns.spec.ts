import { describe, expect, it } from 'vitest';
import { resolveSplitNavSidebarColumns } from '../../../src/components/split-nav/shared';
import type { SplitNavOptionData } from '../../../src/components/split-nav/types';

const items: SplitNavOptionData[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'draft', label: 'Draft', hidden: true },
  {
    value: 'workbench',
    label: 'Workbench',
    children: [
      {
        value: 'projects',
        label: 'Projects',
        children: [{ value: 'vean-ui', label: 'Vean UI' }]
      },
      { value: 'tasks', label: 'Tasks' }
    ]
  },
  { value: 'settings', label: 'Settings' }
];

/**
 * The sidebar only takes the columns a mode actually renders, so the resolver
 * has to answer per mode and per level: which parent is active decides whether
 * the level below it exists at all.
 */
describe('resolveSplitNavSidebarColumns', () => {
  it('takes the rail and the pane of the selected path for dual-vertical', () => {
    expect(resolveSplitNavSidebarColumns({ mode: 'dual-vertical', items, modelValue: 'vean-ui' })).toEqual({
      rail: true,
      pane: true
    });

    // `overview` is a leaf, so the pane below the rail has nothing to show.
    expect(resolveSplitNavSidebarColumns({ mode: 'dual-vertical', items, modelValue: 'overview' })).toEqual({
      rail: true,
      pane: false
    });
  });

  it('keeps only the rail in the sidebar of vertical-horizontal', () => {
    expect(resolveSplitNavSidebarColumns({ mode: 'vertical-horizontal', items, modelValue: 'vean-ui' })).toEqual({
      rail: true,
      pane: false
    });
  });

  it('takes the pane alone in the rail-less sidebar of horizontal-vertical', () => {
    expect(resolveSplitNavSidebarColumns({ mode: 'horizontal-vertical', items, modelValue: 'vean-ui' })).toEqual({
      rail: false,
      pane: true
    });

    expect(resolveSplitNavSidebarColumns({ mode: 'horizontal-vertical', items, modelValue: 'overview' })).toEqual({
      rail: false,
      pane: false
    });
  });

  describe('horizontal-dual-vertical', () => {
    it('reserves nothing for a first-level leaf', () => {
      expect(
        resolveSplitNavSidebarColumns({
          mode: 'horizontal-dual-vertical',
          items,
          modelValue: 'overview'
        })
      ).toEqual({ rail: false, pane: false });
    });

    it('takes the rail of the opened first-level menu, without its pane', () => {
      // Opening `workbench` shows its children in the rail; the pane below it
      // stays closed until one of them is opened.
      expect(
        resolveSplitNavSidebarColumns({
          mode: 'horizontal-dual-vertical',
          items,
          modelValue: 'overview',
          openPath: ['workbench']
        })
      ).toEqual({ rail: true, pane: false });
    });

    it('takes both columns once a rail parent is opened', () => {
      expect(
        resolveSplitNavSidebarColumns({
          mode: 'horizontal-dual-vertical',
          items,
          modelValue: 'overview',
          openPath: ['workbench', 'projects']
        })
      ).toEqual({ rail: true, pane: true });
    });

    it('falls back to the selected path once the open path resets', () => {
      // `SplitNavRoot` rebuilds its path on every model change, so the columns
      // have to hold up with an empty path as well.
      expect(
        resolveSplitNavSidebarColumns({
          mode: 'horizontal-dual-vertical',
          items,
          modelValue: 'vean-ui'
        })
      ).toEqual({ rail: true, pane: true });

      expect(
        resolveSplitNavSidebarColumns({
          mode: 'horizontal-dual-vertical',
          items,
          modelValue: 'tasks'
        })
      ).toEqual({
        rail: true,
        pane: false
      });
    });
  });

  it('counts only visible children', () => {
    const hiddenLevel: SplitNavOptionData[] = [
      {
        value: 'workbench',
        label: 'Workbench',
        children: [{ value: 'draft', label: 'Draft', hidden: true }]
      }
    ];

    expect(
      resolveSplitNavSidebarColumns({
        mode: 'dual-vertical',
        items: hiddenLevel,
        modelValue: 'workbench'
      })
    ).toEqual({ rail: true, pane: false });
  });

  it('flattens a group level like the rail it stands for', () => {
    const grouped: SplitNavOptionData[] = [
      {
        value: 'group',
        label: 'Group',
        isGroup: true,
        children: [{ value: 'overview', label: 'Overview' }]
      }
    ];

    // The group node is not a rail item: the selected leaf stands for itself, so
    // the pane below it stays empty.
    expect(
      resolveSplitNavSidebarColumns({
        mode: 'dual-vertical',
        items: grouped,
        modelValue: 'overview'
      })
    ).toEqual({
      rail: true,
      pane: false
    });
  });
});
