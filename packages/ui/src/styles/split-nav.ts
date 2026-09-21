// @unocss-include
import { scv } from '@soybeanjs/cva';
import type { ThemeSize } from '@/theme';

/**
 * Width of the first-level rail and the nested tree pane, in rem, per size.
 */
export interface SplitNavPaneMetric {
  /** First-level rail width. */
  rail: number;
  /** Nested vertical tree pane width. */
  tree: number;
}

/**
 * Rail / tree pane widths of `splitNavVariants`, per size.
 *
 * The recipe keeps the authoritative literal utility classes
 * (`[--vean-split-nav-first-level-width:5rem]`); these numbers exist so a
 * consumer that must size an outer container to the panes — `SAppShell`
 * aligning the layout sidebar — can do it without measuring the DOM, which
 * would be unavailable during SSR. The app-shell unit spec asserts the two
 * stay in sync.
 */
export const splitNavPaneMetrics: Record<ThemeSize, SplitNavPaneMetric> = {
  xs: { rail: 4, tree: 11.25 },
  sm: { rail: 4.5, tree: 13.125 },
  md: { rail: 5, tree: 15 },
  lg: { rail: 5.5, tree: 16.875 },
  xl: { rail: 6, tree: 18.75 },
  '2xl': { rail: 6.5, tree: 22.5 }
};

export const splitNavVariants = scv({
  slots: {
    verticalPane: 'flex h-full min-h-0 min-w-0 w-fit',
    // The first-level rail's own column: it stacks the `top-left` cell onto the
    // rail, so a brand can head the items it belongs to.
    verticalRail: 'flex h-full min-h-0 shrink-0 flex-col',
    // The rail's height box. The rail itself is `shrink-0` — it keeps its column
    // width in the row layouts it is shared with — so it cannot take the cell's
    // height out of the column on its own; this box takes it instead, and the
    // rail fills what is left.
    verticalRailMenu: 'flex min-h-0 flex-1 flex-col',
    // Top cell of the rail column, on the rail's own width, so a brand in it sits
    // inside the rail's strip rather than beside it. The host's content carries
    // the row height; the divider beside it belongs to the pane.
    topLeft: 'flex shrink-0 items-center justify-center',
    // Top cell of the pane column: it only renders while that column does, and
    // inherits its width from it.
    topRight: 'flex min-w-0 shrink-0 items-center justify-center',
    // The first-level rail draws no divider of its own: the column that follows
    // it leads with one, so a lone rail (`vertical-horizontal`, and the
    // `dual-vertical` shapes while no pane is open) has no inner edge to leave
    // hanging over the sidebar.
    firstLevel: [
      'flex outline-none',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[--vean-split-nav-first-level-width] data-[orientation=vertical]:shrink-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:overflow-y-auto',
      'data-[orientation=horizontal]:h-fit data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center'
    ],
    firstLevelItem: [
      'group/split-nav-first-level-item flex cursor-pointer select-none rounded-sm outline-none',
      'data-[orientation=horizontal]:items-center',
      'data-[orientation=vertical]:h-auto data-[orientation=vertical]:min-w-0 data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-center data-[orientation=vertical]:justify-center data-[orientation=vertical]:overflow-hidden data-[orientation=vertical]:text-center',
      'data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary',
      'data-[child-selected]:text-primary',
      'data-[selected=false]:hover:bg-accent data-[selected=false]:focus:bg-accent',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
    ],
    firstLevelItemIcon: 'shrink-0',
    firstLevelItemLabel: [
      'min-w-0 truncate',
      'group-data-[orientation=vertical]/split-nav-first-level-item:block group-data-[orientation=vertical]/split-nav-first-level-item:w-full group-data-[orientation=vertical]/split-nav-first-level-item:px-0.5 group-data-[orientation=vertical]/split-nav-first-level-item:text-center group-data-[orientation=vertical]/split-nav-first-level-item:leading-none'
    ],
    subVertical: [
      'flex h-full min-h-0 shrink-0 flex-col overflow-hidden',
      'w-[--vean-split-nav-tree-width] data-[state=collapsed]:w-[--vean-split-nav-tree-collapsed-width]',
      'transition-[width]-200 ease-out',
      // The second column of a dual-vertical menu leads with the divider between
      // the two: it spans that column's whole height — the brand band above the
      // items included — and follows it while it folds. A lone pane
      // (`horizontal-vertical`) has no column to separate from, so its edge stays
      // the host's to draw.
      'data-[vean-split-nav-dual-vertical-pane]:border-s data-[vean-split-nav-dual-vertical-pane]:border-sidebar-border'
    ],
    subHorizontal: 'flex h-fit min-w-0 flex-1 items-center'
  },
  variants: {
    size: {
      xs: {
        subVertical: '[--vean-split-nav-tree-width:11.25rem]',
        firstLevel: [
          `[--vean-split-nav-first-level-width:4rem] text-2xs`,
          `data-[orientation=vertical]:text-3xs gap-0.625 data-[orientation=vertical]:p-0.625`,
          `data-[orientation=horizontal]:p-1`
        ],
        firstLevelItem: `gap-1 px-1 data-[orientation=horizontal]:h-6 data-[orientation=vertical]:gap-0.625 data-[orientation=vertical]:p-0.625`,
        firstLevelItemIcon: 'size-3.5'
      },
      sm: {
        subVertical: '[--vean-split-nav-tree-width:13.125rem]',
        firstLevel: [
          `[--vean-split-nav-first-level-width:4.5rem] text-xs`,
          `data-[orientation=vertical]:text-2xs gap-0.75 data-[orientation=vertical]:p-0.75`,
          `data-[orientation=horizontal]:p-1.5`
        ],
        firstLevelItem: `gap-1.5 px-1.5 data-[orientation=horizontal]:h-7 data-[orientation=vertical]:gap-0.75 data-[orientation=vertical]:p-0.75`,
        firstLevelItemIcon: 'size-4'
      },
      md: {
        subVertical: '[--vean-split-nav-tree-width:15rem]',
        firstLevel: [
          `[--vean-split-nav-first-level-width:5rem] text-sm`,
          `data-[orientation=vertical]:text-xs gap-1 data-[orientation=vertical]:p-1`,
          `data-[orientation=horizontal]:p-2`
        ],
        firstLevelItem: `gap-2 px-2 data-[orientation=horizontal]:h-8 data-[orientation=vertical]:gap-1 data-[orientation=vertical]:p-1`,
        firstLevelItemIcon: 'size-4.5'
      },
      lg: {
        subVertical: '[--vean-split-nav-tree-width:16.875rem]',
        firstLevel: [
          `[--vean-split-nav-first-level-width:5.5rem] text-base`,
          `data-[orientation=vertical]:text-sm gap-1.5 data-[orientation=vertical]:p-1.5`,
          `data-[orientation=horizontal]:p-2.5`
        ],
        firstLevelItem: `gap-2.5 px-2.5 data-[orientation=horizontal]:h-9 data-[orientation=vertical]:gap-1.5 data-[orientation=vertical]:p-1.5`,
        firstLevelItemIcon: 'size-5'
      },
      xl: {
        subVertical: '[--vean-split-nav-tree-width:18.75rem]',
        firstLevel: [
          `[--vean-split-nav-first-level-width:6rem] text-lg`,
          `data-[orientation=vertical]:text-base gap-2 data-[orientation=vertical]:p-2`,
          `data-[orientation=horizontal]:p-3`
        ],
        firstLevelItem: `gap-3 px-3 data-[orientation=horizontal]:h-10 data-[orientation=vertical]:gap-2 data-[orientation=vertical]:p-2`,
        firstLevelItemIcon: 'size-5.5'
      },
      '2xl': {
        subVertical: '[--vean-split-nav-tree-width:22.5rem]',
        firstLevel: [
          `[--vean-split-nav-first-level-width:6.5rem] text-xl`,
          `data-[orientation=vertical]:text-lg gap-2 data-[orientation=vertical]:p-2.5`,
          `data-[orientation=horizontal]:p-3.5`
        ],
        firstLevelItem: `gap-3.5 px-3.5 data-[orientation=horizontal]:h-11 data-[orientation=vertical]:gap-2.5 data-[orientation=vertical]:p-2.5`,
        firstLevelItemIcon: 'size-6'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
