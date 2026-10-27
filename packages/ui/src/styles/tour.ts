// @unocss-include
import { scv } from '@soybeanjs/cva';
import { overlayPopup } from './_overlay';
import { miniButtonIconVariants, miniButtonVariants } from './button';

export const tourVariants = scv({
  extendBase: props => ({
    close: miniButtonIconVariants({ size: props.size }),
    previous: miniButtonVariants({ size: props.size, variant: 'pure' }),
    next: miniButtonVariants({ size: props.size })
  }),
  slots: {
    mask: 'fixed inset-0 z-base h-screen w-screen fill-mask/50',
    positioner: 'z-base',
    popup: ['relative flex w-[32.5rem] max-w-[calc(100vw-2rem)] flex-col gap-4 p-4 text-sm', ...overlayPopup],
    // PopperArrow rotates the square with its placement, so these local edges always face the popup seam.
    arrow: [
      'pointer-events-none -z-1 w-3.5 h-1.75 bg-transparent [&>svg]:hidden',
      'before:pointer-events-none before:absolute before:-top-1.25 before:start-1/2 before:z-0 before:size-2.5 before:-translate-x-1/2 before:rotate-45 before:border before:border-border before:bg-popover before:content-empty',
      'before:border-t-transparent before:border-l-transparent'
    ],
    header: 'flex flex-col gap-2 pe-6',
    title: 'm-0 text-base font-normal leading-tight',
    description: 'm-0 text-muted-foreground',
    footer: 'flex items-center justify-between gap-3',
    indicators: 'flex flex-1 items-center gap-1.5',
    indicator: 'size-1.5 shrink-0 rounded-full bg-muted data-[active=true]:bg-primary',
    progress: 'sr-only',
    actions: 'flex items-center gap-2',
    previous: '',
    next: '',
    close: 'absolute end-2 top-2'
  },
  variants: {
    type: {
      default: {},
      primary: {
        popup: 'bg-primary text-primary-foreground',
        arrow: 'before:border-primary before:bg-primary',
        title: 'text-primary-foreground',
        description: 'text-primary-foreground/80',
        indicator: 'bg-primary-foreground/20 data-[active=true]:bg-primary-foreground',
        close: 'text-primary-foreground hover:text-primary-foreground',
        previous:
          'border-primary-foreground/30 bg-transparent text-primary-foreground data-[normal]:hover:bg-primary-foreground/10 data-[normal]:hover:text-primary-foreground data-[normal]:active:bg-primary-foreground/20',
        next: 'border-background bg-background text-primary hover:bg-background/90'
      }
    },
    size: {
      xs: { popup: 'gap-2 p-2 text-2xs', title: 'text-xs' },
      sm: { popup: 'gap-2.5 p-2.5 text-xs', title: 'text-sm' },
      md: { popup: 'gap-3 p-3 text-sm', title: 'text-base' },
      lg: { popup: 'gap-3.5 p-3.5 text-base', title: 'text-lg' },
      xl: { popup: 'gap-4 p-4 text-lg', title: 'text-xl' },
      '2xl': { popup: 'gap-5 p-5 text-xl', title: 'text-2xl' }
    }
  },
  defaultVariants: {
    type: 'default',
    size: 'md'
  }
});
