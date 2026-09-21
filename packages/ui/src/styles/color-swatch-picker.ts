// @unocss-include
import { scv, alias } from '@soybeanjs/cva';
import type { VariantProps } from '@soybeanjs/cva';
import { colorSwatchVariants } from './color-swatch';

export const colorSwatchPickerVariants = scv({
  extend: [
    alias(colorSwatchVariants, {
      root: 'swatchRoot',
      checker: 'swatchChecker',
      fill: 'swatchFill'
    })
  ],
  slots: {
    root: 'grid',
    item: [
      'group relative inline-flex items-center justify-center rounded-full outline-none transition-[transform,box-shadow] duration-150',
      'hover:scale-110 data-[disabled]:opacity-50'
    ],
    itemIndicator: `pointer-events-none absolute inset-0 flex justify-center items-center text-muted`,
    swatchRoot: 'group-data-[state=checked]:border-[--vean-color-swatch-color]',
    swatchChecker: '',
    swatchFill: 'transition-transform group-data-[state=checked]:scale-77'
  },
  variants: {
    size: {
      xs: {
        root: 'grid-cols-[repeat(auto-fill,minmax(1.25rem,1fr))] gap-1.5 text-2xs',
        itemIndicator: 'text-4xs'
      },
      sm: {
        root: 'grid-cols-[repeat(auto-fill,minmax(1.375rem,1fr))] gap-1.75 text-xs',
        itemIndicator: 'text-3xs'
      },
      md: {
        root: 'grid-cols-[repeat(auto-fill,minmax(1.5rem,1fr))] gap-2 text-sm',
        itemIndicator: 'text-2xs'
      },
      lg: {
        root: 'grid-cols-[repeat(auto-fill,minmax(1.625rem,1fr))] gap-2.5 text-base',
        itemIndicator: 'text-xs'
      },
      xl: {
        root: 'grid-cols-[repeat(auto-fill,minmax(1.75rem,1fr))] gap-3 text-lg',
        itemIndicator: 'text-sm'
      },
      '2xl': {
        root: 'grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-4 text-xl',
        itemIndicator: 'text-base'
      }
    },
    shape: {
      square: {
        item: 'rounded-md',
        swatchFill: 'group-data-[state=checked]:rounded-sm'
      },
      circle: {
        item: 'rounded-full',
        swatchFill: 'group-data-[state=checked]:rounded-full'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    shape: 'square'
  }
});

type ColorSwatchPickerVariants = VariantProps<typeof colorSwatchPickerVariants>;

export type ColorSwatchPickerShape = NonNullable<ColorSwatchPickerVariants['shape']>;
