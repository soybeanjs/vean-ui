// @unocss-include
import { scv } from '@soybeanjs/cva';
import {
  fieldAffordanceIcon,
  fieldChrome,
  fieldClearReveal,
  fieldDisabled,
  fieldNestedAction,
  fieldSize
} from './_field';
import { overlayMotion, overlayShadow, overlaySurface } from './_overlay';
import { miniButtonIconVariants } from './button';

export const autocompleteVariants = scv({
  extendBase: props => ({
    trigger: miniButtonIconVariants({ size: props.size }),
    cancel: miniButtonIconVariants({ size: props.size, shape: 'circle' })
  }),
  slots: {
    root: ['flex w-full flex-col', ...fieldDisabled],
    anchor: ['group flex w-full items-center', ...fieldChrome],
    inputRoot: 'flex min-w-0 grow items-center bg-transparent',
    inputControl:
      'min-w-0 grow h-full border-0 bg-transparent px-0 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    trigger: ['shrink-0', fieldNestedAction],
    triggerIcon: fieldAffordanceIcon,
    cancel: fieldClearReveal,
    popup: [
      'relative z-base min-w-[--vean-popper-anchor-width] overflow-hidden',
      overlaySurface,
      overlayShadow,
      ...overlayMotion
    ],
    viewport: 'overflow-y-auto overflow-x-hidden',
    empty: 'text-center text-muted-foreground',
    group: 'overflow-hidden',
    groupLabel: 'font-medium text-muted-foreground',
    item: [
      'relative flex w-full items-center rounded-sm outline-none select-none',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
    ],
    itemIndicator: 'ms-auto shrink-0 text-muted-foreground',
    separator: 'h-px bg-border'
  },
  variants: {
    size: {
      xs: {
        empty: 'py-4',
        anchor: fieldSize.xs,
        inputRoot: 'gap-1',
        popup: 'text-2xs',
        viewport: 'max-h-70 p-0.75',
        groupLabel: 'px-1 py-1 text-3xs',
        item: 'gap-1 px-1 py-1',
        separator: '-mx-0.75 my-0.75'
      },
      sm: {
        empty: 'py-5',
        anchor: fieldSize.sm,
        inputRoot: 'gap-1.5',
        popup: 'text-xs',
        viewport: 'max-h-75 p-0.875',
        groupLabel: 'px-1.5 py-1.25 text-2xs',
        item: 'gap-1.5 px-1.5 py-1.25',
        separator: '-mx-0.875 my-0.875'
      },
      md: {
        empty: 'py-6',
        anchor: fieldSize.md,
        inputRoot: 'gap-2',
        popup: 'text-sm',
        viewport: 'max-h-80 p-1',
        groupLabel: 'px-2 py-1.5 text-xs',
        item: 'gap-2 px-2 py-1.5',
        separator: '-mx-1 my-1'
      },
      lg: {
        empty: 'py-7',
        anchor: fieldSize.lg,
        inputRoot: 'gap-2.5',
        popup: 'text-base',
        viewport: 'max-h-90 p-1.25',
        groupLabel: 'px-2.5 py-1.75 text-sm',
        item: 'gap-2.5 px-2.5 py-1.75',
        separator: '-mx-1.25 my-1.25'
      },
      xl: {
        empty: 'py-8',
        anchor: fieldSize.xl,
        inputRoot: 'gap-3',
        popup: 'text-lg',
        viewport: 'max-h-100 p-1.5',
        groupLabel: 'px-3 py-2 text-base',
        item: 'gap-3 px-3 py-2',
        separator: '-mx-1.5 my-1.5'
      },
      '2xl': {
        empty: 'py-9',
        anchor: fieldSize['2xl'],
        inputRoot: 'gap-3.5',
        popup: 'text-xl',
        viewport: 'max-h-115 p-1.75',
        groupLabel: 'px-3.5 py-2.5 text-lg',
        item: 'gap-3.5 px-3.5 py-2.5',
        separator: '-mx-1.75 my-1.75'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
