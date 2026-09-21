// @unocss-include
import { scv } from '@soybeanjs/cva';
import { sheetVariants } from './sheet';

export const drawerVariants = scv({
  extend: [sheetVariants],
  slots: {
    handle: `mx-auto shrink-0 cursor-grab active:cursor-grabbing rounded-full bg-muted`,
    swipeArea: 'fixed z-40 touch-none',
    indent: [
      `relative transition-[transform,border-radius] duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]`,
      `data-[active]:translate-y-[calc(var(--vean-drawer-swipe-progress,0)*0.5rem_+_0.25rem)]`,
      `data-[active]:scale-[calc(1_-_var(--vean-drawer-swipe-progress,0)*0.05_-_0.02)]`,
      `data-[active]:rounded-b-2xl`
    ],
    indentBackground: 'fixed inset-0 z-40 bg-popover'
  },
  variants: {
    size: {
      xs: {
        handle: 'mt-0.625 h-1.5 w-20'
      },
      sm: {
        handle: 'mt-0.75 h-1.75 w-22'
      },
      md: {
        handle: 'mt-1 h-2 w-25'
      },
      lg: {
        handle: 'mt-1.25 h-2.5 w-30'
      },
      xl: {
        handle: 'mt-1.5 h-3 w-35'
      },
      '2xl': {
        handle: 'mt-1.75 h-3.5 w-40'
      }
    },
    side: {
      top: {
        swipeArea: 'inset-x-0 top-0 h-4'
      },
      bottom: {
        swipeArea: 'inset-x-0 bottom-0 h-4'
      },
      left: {
        swipeArea: 'inset-y-0 start-0 w-4'
      },
      right: {
        swipeArea: 'inset-y-0 end-0 w-4'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    side: 'bottom'
  }
});
