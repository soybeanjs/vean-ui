// @unocss-include
import { scv } from '@soybeanjs/cva';
import {
  fieldAffordanceIcon,
  fieldChrome,
  fieldClearReveal,
  fieldDisabled,
  fieldSize,
  fieldTriggerFocus
} from './_field';
import { overlayMotion, overlayShadow, overlaySurface } from './_overlay';
import { miniButtonIconVariants } from './button';

export const comboboxVariants = scv({
  extendBase: props => ({
    clear: miniButtonIconVariants({ size: props.size, shape: 'circle' }),
    cancel: miniButtonIconVariants({ size: props.size, shape: 'circle' })
  }),
  slots: {
    anchor: '',
    trigger: [
      'group flex w-full items-center justify-between',
      ...fieldChrome,
      ...fieldTriggerFocus,
      ...fieldDisabled,
      'data-[placeholder]:text-muted-foreground'
    ],
    triggerIcon: fieldAffordanceIcon,
    value: ['min-w-0 flex-1 truncate text-left', 'data-[placeholder]:text-muted-foreground'],
    clear: fieldClearReveal,
    cancel: 'shrink-0',
    positioner: '',
    popup: ['relative z-base w-[--vean-combobox-trigger-width]', overlaySurface, overlayShadow, ...overlayMotion],
    arrow: 'fill-popover',
    viewport: 'scrollbar-none overflow-x-hidden overflow-y-auto',
    inputRoot: 'group flex items-center border-b',
    inputControl: `flex w-full rounded-md bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed`,
    group: 'overflow-hidden text-foreground',
    groupLabel: 'font-medium text-muted-foreground',
    item: [
      'relative flex w-full cursor-default select-none items-center rounded-sm outline-none',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
    ],
    itemIndicator: 'ms-auto shrink-0 text-muted-foreground',
    empty: 'text-center text-muted-foreground',
    separator: 'h-px bg-border'
  },
  variants: {
    size: {
      xs: {
        empty: 'py-2',
        trigger: fieldSize.xs,
        popup: 'text-2xs min-w-24',
        inputRoot: 'gap-1 px-1.5 py-0.5',
        inputControl: 'h-6',
        viewport: 'max-h-70 p-0.75',
        groupLabel: 'p-1 text-3xs',
        item: 'gap-1 px-1 py-1',
        separator: '-mx-0.75 my-0.375'
      },
      sm: {
        empty: 'py-3',
        trigger: fieldSize.sm,
        popup: 'text-xs min-w-28',
        inputRoot: 'gap-1.5 px-2 py-0.625',
        inputControl: 'h-7',
        viewport: 'max-h-75 p-0.875',
        groupLabel: 'p-1.25 text-2xs',
        item: 'gap-1.5 px-1.5 py-1',
        separator: '-mx-0.875 my-0.4375'
      },
      md: {
        empty: 'py-4',
        trigger: fieldSize.md,
        popup: 'text-sm min-w-32',
        inputRoot: 'gap-2 px-2.5 py-0.75',
        inputControl: 'h-8',
        viewport: 'max-h-80 p-1',
        groupLabel: 'p-1.75 text-xs',
        item: 'gap-2 px-2 py-1.5',
        separator: '-mx-1 my-0.5'
      },
      lg: {
        empty: 'py-5',
        trigger: fieldSize.lg,
        popup: 'text-base min-w-36',
        inputRoot: 'gap-2.5 px-3 py-0.875',
        inputControl: 'h-9',
        viewport: 'max-h-90 p-1.25',
        groupLabel: 'p-2 text-sm',
        item: 'gap-2.5 px-2.5 py-1.5',
        separator: '-mx-1.25 my-0.625'
      },
      xl: {
        empty: 'py-6',
        trigger: fieldSize.xl,
        popup: 'text-lg min-w-40',
        inputRoot: 'gap-3 px-3.5 py-1',
        inputControl: 'h-10',
        viewport: 'max-h-100 p-1.5',
        groupLabel: 'p-2.5 text-base',
        item: 'gap-3 px-3 py-2',
        separator: '-mx-1.5 my-0.75'
      },
      '2xl': {
        empty: 'py-7',
        trigger: fieldSize['2xl'],
        popup: 'text-xl min-w-44',
        inputRoot: 'gap-3.5 px-4 py-1.25',
        inputControl: 'h-12',
        viewport: 'max-h-115 p-1.75',
        groupLabel: 'p-3 text-lg',
        item: 'gap-3.5 px-3.5 py-2.5',
        separator: '-mx-1.75 my-0.875'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
