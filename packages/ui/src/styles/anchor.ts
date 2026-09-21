// @unocss-include
import { scv } from '@soybeanjs/cva';

export const anchorVariants = scv({
  slots: {
    root: 'relative flex flex-col',
    link: [
      'group inline-flex w-full items-center rounded-md text-muted-foreground outline-none transition-colors',
      'hover:bg-accent/60 hover:text-accent-foreground',
      'focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-card',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      'data-[state=active]:bg-accent data-[state=active]:text-foreground'
    ],
    sub: 'ms-4 flex flex-col border-s border-border/60 ps-3',
    item: 'flex flex-col',
    indicator: `shrink-0 rounded-full bg-primary opacity-0 transition-opacity group-data-[state=active]:opacity-100`,
    title: 'min-w-0 truncate'
  },
  variants: {
    color: {
      primary: {
        indicator: 'bg-primary',
        link: 'focus-visible:ring-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary'
      },
      destructive: {
        indicator: 'bg-destructive',
        link: 'focus-visible:ring-destructive/30 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive'
      },
      success: {
        indicator: 'bg-success',
        link: 'focus-visible:ring-success/30 data-[state=active]:bg-success/10 data-[state=active]:text-success'
      },
      warning: {
        indicator: 'bg-warning',
        link: 'focus-visible:ring-warning/30 data-[state=active]:bg-warning/10 data-[state=active]:text-warning'
      },
      info: {
        indicator: 'bg-info',
        link: 'focus-visible:ring-info/30 data-[state=active]:bg-info/10 data-[state=active]:text-info'
      },
      carbon: {
        indicator: 'bg-carbon',
        link: 'focus-visible:ring-carbon/30 data-[state=active]:bg-carbon/10 data-[state=active]:text-carbon'
      },
      secondary: {
        indicator: 'bg-secondary-foreground/50',
        link: 'focus-visible:ring-secondary-foreground/20 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground'
      },
      accent: {
        indicator: 'bg-accent-foreground/50',
        link: 'focus-visible:ring-accent-foreground/20 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground'
      }
    },
    orientation: {
      vertical: {},
      horizontal: {
        root: 'flex-row flex-wrap items-start',
        item: 'min-w-36 flex-1',
        sub: 'ms-0 mt-2 border-s-0 border-t ps-0 pt-2'
      }
    },
    size: {
      xs: {
        root: 'gap-0.5 text-2xs',
        link: 'gap-1 px-2 py-1.5 text-3xs',
        sub: 'gap-0.5',
        item: 'gap-0.5',
        indicator: 'size-1'
      },
      sm: {
        root: 'gap-0.75 text-xs',
        link: 'gap-1.5 px-2.5 py-1.5 text-2xs',
        sub: 'gap-0.75',
        item: 'gap-0.75',
        indicator: 'size-1.25'
      },
      md: {
        root: 'gap-1 text-sm',
        link: 'gap-2 px-3 py-2 text-xs',
        sub: 'gap-1',
        item: 'gap-1',
        indicator: 'size-1.5'
      },
      lg: {
        root: 'gap-1.25 text-base',
        link: 'gap-2.5 px-3.5 py-2.5 text-sm',
        sub: 'gap-1.25',
        item: 'gap-1.25',
        indicator: 'size-2'
      },
      xl: {
        root: 'gap-1.5 text-lg',
        link: 'gap-3 px-4 py-3 text-base',
        sub: 'gap-1.5',
        item: 'gap-1.5',
        indicator: 'size-2.25'
      },
      '2xl': {
        root: 'gap-2 text-xl',
        link: 'gap-3.5 px-4.5 py-3.5 text-lg',
        sub: 'gap-2',
        item: 'gap-2',
        indicator: 'size-2.5'
      }
    },
    sticky: {
      true: {
        root: 'sticky self-start top-[var(--vean-anchor-offset-top,0px)] max-h-[calc(100vh-var(--vean-anchor-offset-top,0px))] overflow-auto pe-1'
      },
      false: {}
    }
  },
  // A horizontal trail packs its links on one line, so its row rhythm follows the
  // link gap rather than the vertical list's tighter one.
  compoundVariants: [
    {
      orientation: 'horizontal',
      size: 'xs',
      class: { root: 'gap-1' }
    },
    {
      orientation: 'horizontal',
      size: 'sm',
      class: { root: 'gap-1.5' }
    },
    {
      orientation: 'horizontal',
      size: 'md',
      class: { root: 'gap-2' }
    },
    {
      orientation: 'horizontal',
      size: 'lg',
      class: { root: 'gap-2.5' }
    },
    {
      orientation: 'horizontal',
      size: 'xl',
      class: { root: 'gap-3' }
    },
    {
      orientation: 'horizontal',
      size: '2xl',
      class: { root: 'gap-3.5' }
    }
  ],
  defaultVariants: {
    color: 'primary',
    orientation: 'vertical',
    size: 'md',
    sticky: true
  }
});
