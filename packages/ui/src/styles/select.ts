// @unocss-include
import { scv } from '@soybeanjs/cva';
import type { VariantProps } from '@soybeanjs/cva';
import {
  fieldAffordanceIcon,
  fieldChrome,
  fieldClearReveal,
  fieldDisabled,
  fieldSize,
  fieldTriggerFocus
} from './_field';
import { overlayArrow, overlayMotion, overlayShadow, overlaySurface } from './_overlay';
import { miniButtonIconVariants } from './button';

export const selectVariants = scv({
  extendBase: props => ({
    clear: miniButtonIconVariants({ size: props.size, shape: 'circle' })
  }),
  slots: {
    trigger: [
      'group flex items-center justify-between w-full',
      ...fieldChrome,
      ...fieldTriggerFocus,
      ...fieldDisabled,
      'placeholder:text-muted-foreground data-[placeholder]:text-muted-foreground'
    ],
    triggerIcon: fieldAffordanceIcon,
    value: 'grow truncate text-start',
    clear: fieldClearReveal,
    positioner: '',
    popup: ['relative z-base', overlaySurface, overlayShadow, ...overlayMotion],
    viewport: '',
    group: '',
    groupLabel: `font-medium text-muted-foreground`,
    item: [
      `relative flex items-center w-full rounded-sm outline-none cursor-pointer select-none`,
      `focus:bg-accent focus:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`
    ],
    itemText: '',
    itemIndicator: `ms-auto shrink-0 text-muted-foreground`,
    separator: `h-px bg-border`,
    scrollUpButton: `flex items-center justify-center cursor-default`,
    scrollDownButton: `flex items-center justify-center cursor-default`,
    arrow: overlayArrow
  },
  variants: {
    size: {
      xs: {
        popup: 'max-h-70 text-2xs min-w-24',
        trigger: fieldSize.xs,
        viewport: 'p-0.75',
        item: 'gap-1 px-1 py-1',
        groupLabel: 'p-1 text-3xs',
        separator: '-mx-0.75 my-0.75',
        scrollUpButton: 'py-0.75',
        scrollDownButton: 'py-0.75',
        arrow: 'text-3xs'
      },
      sm: {
        popup: 'max-h-75 text-xs min-w-28',
        trigger: fieldSize.sm,
        viewport: 'p-0.875',
        item: 'gap-1.5 px-1.5 py-1',
        separator: '-mx-0.875 my-0.875',
        groupLabel: 'p-1.25 text-2xs',
        scrollUpButton: 'py-0.875',
        scrollDownButton: 'py-0.875',
        arrow: 'text-2xs'
      },
      md: {
        popup: 'max-h-80 text-sm min-w-32',
        trigger: fieldSize.md,
        viewport: 'p-1',
        item: 'gap-2 px-2 py-1.5',
        separator: '-mx-1 my-1',
        groupLabel: 'p-1.75 text-xs',
        scrollUpButton: 'py-1',
        scrollDownButton: 'py-1',
        arrow: 'text-xs'
      },
      lg: {
        popup: 'max-h-90 text-base min-w-36',
        trigger: fieldSize.lg,
        viewport: 'p-1.25',
        item: 'gap-2.5 px-2.5 py-1.5',
        separator: '-mx-1.25 my-1.25',
        groupLabel: 'p-2 text-sm',
        scrollUpButton: 'py-1.25',
        scrollDownButton: 'py-1.25',
        arrow: 'text-sm'
      },
      xl: {
        popup: 'max-h-100 text-lg min-w-40',
        trigger: fieldSize.xl,
        viewport: 'p-1.5',
        item: 'gap-3 px-3 py-2',
        separator: '-mx-1.5 my-1.5',
        groupLabel: 'p-2.5 text-base',
        scrollUpButton: 'py-1.5',
        scrollDownButton: 'py-1.5',
        arrow: 'text-base'
      },
      '2xl': {
        popup: 'max-h-115 text-xl min-w-44',
        trigger: fieldSize['2xl'],
        viewport: 'p-1.75',
        item: 'gap-3.5 px-3.5 py-2.5',
        separator: '-mx-1.75 my-1.75',
        groupLabel: 'p-3 text-lg',
        scrollUpButton: 'py-1.75',
        scrollDownButton: 'py-1.75',
        arrow: 'text-lg'
      }
    },
    position: {
      popper: {
        popup: `data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1`,
        viewport: `h-[--vean-select-trigger-height] w-full min-w-[--vean-select-trigger-width]`
      },
      'item-aligned': {}
    }
  },
  defaultVariants: {
    size: 'md',
    position: 'popper'
  }
});

type SelectVariants = VariantProps<typeof selectVariants>;

export type SelectPosition = NonNullable<SelectVariants['position']>;
