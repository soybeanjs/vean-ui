// @unocss-include
import { scv } from '@soybeanjs/cva';

/**
 * Style recipe for `SAppShell`.
 *
 * `layout*` slots are not rendered by the shell itself: they are merged into
 * the `SLayout` `ui` map so the shell can theme regions it does not own the
 * markup of. Every other slot maps to a node the shell renders.
 *
 * Mode differences are expressed through the `data-mode` attribute on the
 * shell root (see the wrapper), so no mode variant is needed here.
 */
export const appShellVariants = scv({
  slots: {
    root: 'h-full',
    sidebar: 'flex flex-col w-full h-full min-h-0',
    logo: [
      'flex shrink-0 items-center h-[--vean-layout-header-height] px-[--sl-spacing] overflow-hidden',
      // Aligned to the sidebar's columns: the cells carry the width and the
      // centering, so the row contributes no gap or padding of its own.
      'data-[aligned=true]:gap-0 data-[aligned=true]:px-0',
      // A single-column sidebar brand mirrors a menu row: it takes the tree menu
      // root's own inset (`data-inset=menu`, sized per variant below) and lets the
      // mirrored item carry its padding, so the mark lands in the menu's icon
      // column — expanded, and once collapsed on the item's icon-width fold.
      'data-[aligned=true]:gap-0 data-[aligned=true]:px-0'
    ],
    // Both brand cells carry the row height themselves. Inside a brand region
    // that is the same token the region is tall, so the row is unchanged; in the
    // menu's `top-left` / `top-right` cells there is no region, and the cells are
    // what keeps the brand band as tall as the header it lines up with.
    logoMark: 'flex h-[--vean-layout-header-height] shrink-0 items-center justify-center',
    logoTitle: 'flex h-[--vean-layout-header-height] min-w-0 items-center justify-center',
    menuSidebar: 'flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden',
    // Mount target of the menu panes that teleport out of their renderer: it has
    // to stretch, or the pane inside it sizes to its content and the column
    // dividers stop where the items do.
    menuMount: 'flex-1 min-h-0 min-w-0 flex',
    trigger: 'shrink-0',
    triggerRow: 'flex shrink-0 items-stretch',
    // Empty cell: it only continues the rail's divider into the row.
    triggerRail: 'shrink-0 border-e border-sidebar-border',
    triggerCell: [
      'flex min-w-0 flex-1 items-center justify-end px-[--sl-spacing] pt-[--sl-half-spacing] pb-[--sl-spacing]',
      // A folded column is as wide as its icons: center there instead of hugging
      // an edge the trigger would run past.
      'data-[centered=true]:justify-center data-[centered=true]:px-0'
    ],
    header: 'flex items-center w-full h-full px-[--sl-spacing]',
    // The start region yields to the trailing one: its crumb is the only child that
    // may shrink, so a deep trail truncates instead of pushing the actions out.
    headerStart: 'flex items-center min-w-0',
    // A menu bar that does not fit is clipped instead of overlapping the
    // trailing actions; its flyouts are portaled, so clipping is safe.
    headerCenter: 'flex items-center min-w-0 flex-1 overflow-hidden',
    headerEnd: 'flex items-center min-w-0 shrink-0',
    // Phones have no room for a trail next to the trigger and the actions, and the
    // crumb would outrank both; the desktop header keeps it. A host that wants it
    // back passes `ui.breadcrumb` (e.g. `lt-md:flex`).
    breadcrumb: 'min-w-0 overflow-hidden group-data-[mobile=true]/layout:hidden',
    breadcrumbTrigger: 'inline-flex min-w-0 items-center [&>span]:truncate',
    breadcrumbTriggerIcon: 'shrink-0 opacity-70',
    tab: 'flex justify-between h-full',
    content: 'w-full',
    footer: 'flex items-center h-full w-full px-[--sl-spacing]',
    layoutHeader: 'border-b border-border',
    layoutTab: 'border-b border-border',
    layoutContent: '',
    layoutFooter: 'border-t border-border'
  },
  variants: {
    size: {
      // `logo` carries the mirrored menu row's inset: it equals the matching
      // `treeMenuVariants` root padding for the size, which is what puts the brand
      // mark in the menu's icon column. Keep the two in step.
      xs: {
        root: 'text-2xs',
        logo: 'gap-1.5 data-[inset=menu]:data-[placement=sidebar]:px-1.5 data-[inset=menu]:data-[placement=sidebar-bottom]:px-1.5',
        header: 'gap-1.5',
        headerStart: 'gap-1.5',
        headerCenter: 'gap-1.5',
        headerEnd: 'gap-1.5',
        breadcrumbTrigger: 'gap-0.75'
      },
      sm: {
        root: 'text-xs',
        logo: 'gap-1.75 data-[inset=menu]:data-[placement=sidebar]:px-1.75 data-[inset=menu]:data-[placement=sidebar-bottom]:px-1.75',
        header: 'gap-1.75',
        headerStart: 'gap-1.75',
        headerCenter: 'gap-1.75',
        headerEnd: 'gap-1.75',
        breadcrumbTrigger: 'gap-0.875'
      },
      md: {
        root: 'text-sm',
        logo: 'gap-2 data-[inset=menu]:data-[placement=sidebar]:px-2 data-[inset=menu]:data-[placement=sidebar-bottom]:px-2',
        header: 'gap-2',
        headerStart: 'gap-2',
        headerCenter: 'gap-2',
        headerEnd: 'gap-2',
        breadcrumbTrigger: 'gap-1'
      },
      lg: {
        root: 'text-base',
        logo: 'gap-2.25 data-[inset=menu]:data-[placement=sidebar]:px-2.25 data-[inset=menu]:data-[placement=sidebar-bottom]:px-2.25',
        header: 'gap-2.25',
        headerStart: 'gap-2.25',
        headerCenter: 'gap-2.25',
        headerEnd: 'gap-2.25',
        breadcrumbTrigger: 'gap-1.25'
      },
      xl: {
        root: 'text-lg',
        logo: 'gap-2.5 data-[inset=menu]:data-[placement=sidebar]:px-2.5 data-[inset=menu]:data-[placement=sidebar-bottom]:px-2.5',
        header: 'gap-2.5',
        headerStart: 'gap-2.5',
        headerCenter: 'gap-2.5',
        headerEnd: 'gap-2.5',
        breadcrumbTrigger: 'gap-1.5'
      },
      '2xl': {
        root: 'text-xl',
        logo: 'gap-3 data-[inset=menu]:data-[placement=sidebar]:px-3 data-[inset=menu]:data-[placement=sidebar-bottom]:px-3',
        header: 'gap-3',
        headerStart: 'gap-3',
        headerCenter: 'gap-3',
        headerEnd: 'gap-3',
        breadcrumbTrigger: 'gap-1.75'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
