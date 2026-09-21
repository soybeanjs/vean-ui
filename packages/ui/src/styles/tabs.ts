// @unocss-include
import { scv } from '@soybeanjs/cva';
import type { VariantProps } from '@soybeanjs/cva';

export const tabsVariants = scv({
  slots: {
    root: `flex`,
    list: 'relative inline-flex justify-center items-center bg-muted text-muted-foreground',
    trigger: [
      `relative z-3 inline-flex items-center justify-center flex-1 whitespace-nowrap rounded-md font-medium transition-all-200`,
      `outline-none focus-visible:ring-3 focus-visible:ring-offset-card focus-visible:ring-primary/30`,
      `disabled:cursor-not-allowed disabled:opacity-50`
    ],
    indicator: `absolute top-0 start-0 z-2 transition-[width,height,transform] duration-300`,
    indicatorContent: `w-full h-full bg-card shadow`,
    content: `flex-grow self-stretch transition-all-150 outline-none focus-visible:ring-3 focus-visible:ring-offset-card focus-visible:ring-primary/30`
  },
  variants: {
    size: {
      xs: {
        root: 'text-2xs',
        list: `p-0.75`,
        trigger: `gap-1 px-1.5 py-0.75`
      },
      sm: {
        root: 'text-xs',
        list: `p-0.875`,
        trigger: `gap-1.5 px-2 py-1`
      },
      md: {
        root: 'text-sm',
        list: `p-1`,
        trigger: `gap-2 px-3 py-1`
      },
      lg: {
        root: 'text-base',
        list: `p-1.125`,
        trigger: `gap-2.5 px-4 py-1.125`
      },
      xl: {
        root: 'text-lg',
        list: `p-1.25`,
        trigger: `gap-3 px-5 py-1.25`
      },
      '2xl': {
        root: 'text-xl',
        list: `p-1.5`,
        trigger: `gap-4 px-6 py-1.5`
      }
    },
    orientation: {
      horizontal: {
        root: `flex-col`,
        indicator: `h-full w-[--vean-tabs-indicator-size] translate-x-[--vean-tabs-indicator-position] rtl:-translate-x-[--vean-tabs-indicator-position]`
      },
      vertical: {
        list: `flex-col items-stretch`,
        indicator: `w-full h-[--vean-tabs-indicator-size] translate-y-[--vean-tabs-indicator-position]`
      }
    },
    shape: {
      square: {
        list: 'rounded-md',
        indicatorContent: 'rounded-md'
      },
      rounded: {
        list: 'rounded-full',
        indicatorContent: 'rounded-full'
      }
    },
    fill: {
      full: {
        root: `items-stretch`
      },
      auto: {
        root: `items-start`
      }
    },
    enableIndicator: {
      false: {
        trigger: `data-[selected=true]:bg-card data-[selected=true]:text-foreground data-[selected=true]:shadow`
      }
    }
  },
  compoundVariants: [
    {
      size: 'xs',
      orientation: 'horizontal',
      class: {
        indicator: 'py-0.75',
        content: 'mt-1.5'
      }
    },
    {
      size: 'xs',
      orientation: 'vertical',
      class: {
        indicator: 'px-0.75',
        content: 'ms-1.5'
      }
    },
    {
      size: 'sm',
      orientation: 'horizontal',
      class: {
        indicator: 'py-1',
        content: 'mt-1.75'
      }
    },
    {
      size: 'sm',
      orientation: 'vertical',
      class: {
        indicator: 'px-1',
        content: 'ms-1.75'
      }
    },
    {
      size: 'md',
      orientation: 'horizontal',
      class: {
        indicator: 'py-1',
        content: 'mt-2'
      }
    },
    {
      size: 'md',
      orientation: 'vertical',
      class: {
        indicator: 'px-1',
        content: 'ms-2'
      }
    },
    {
      size: 'lg',
      orientation: 'horizontal',
      class: {
        indicator: 'py-1.125',
        content: 'mt-2.5'
      }
    },
    {
      size: 'lg',
      orientation: 'vertical',
      class: {
        indicator: 'px-1.125',
        content: 'ms-2.5'
      }
    },
    {
      size: 'xl',
      orientation: 'horizontal',
      class: {
        indicator: 'py-1.25',
        content: 'mt-3'
      }
    },
    {
      size: 'xl',
      orientation: 'vertical',
      class: {
        indicator: 'px-1.25',
        content: 'ms-3'
      }
    },
    {
      size: '2xl',
      orientation: 'horizontal',
      class: {
        indicator: 'py-1.5',
        content: 'mt-3.5'
      }
    },
    {
      size: '2xl',
      orientation: 'vertical',
      class: {
        indicator: 'px-1.5',
        content: 'ms-3.5'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
    shape: 'square',
    fill: 'auto',
    enableIndicator: true
  }
});

type TabsProps = VariantProps<typeof tabsVariants>;

export type TabsShape = NonNullable<TabsProps['shape']>;

export type TabsFill = NonNullable<TabsProps['fill']>;
