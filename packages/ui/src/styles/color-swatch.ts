// @unocss-include
import { scv } from '@soybeanjs/cva';
import type { VariantProps } from '@soybeanjs/cva';

export const colorSwatchVariants = scv({
  slots: {
    root: [
      'relative isolate inline-flex shrink-0 overflow-hidden border-2 border-transparent',
      'data-[no-color]:bg-muted/40'
    ],
    checker: `absolute inset-0 bg-[length:8px_8px] bg-[position:0_0,4px_4px]`,
    fill: 'absolute inset-0 bg-[--vean-color-swatch-color]'
  },
  variants: {
    size: {
      xs: {
        root: 'size-5 text-2xs'
      },
      sm: {
        root: 'size-5.5 text-xs'
      },
      md: {
        root: 'size-6 text-sm'
      },
      lg: {
        root: 'size-6.5 text-base'
      },
      xl: {
        root: 'size-7 text-lg'
      },
      '2xl': {
        root: 'size-8 text-xl'
      }
    },
    shape: {
      square: {
        root: 'rounded-md'
      },
      circle: {
        root: 'rounded-full'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    shape: 'square'
  }
});

type ColorSwatchVariants = VariantProps<typeof colorSwatchVariants>;

export type ColorSwatchShape = NonNullable<ColorSwatchVariants['shape']>;
