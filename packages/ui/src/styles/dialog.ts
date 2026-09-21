// @unocss-include
import { scv } from '@soybeanjs/cva';
import { miniButtonVariants, miniButtonIconVariants } from './button';

export const dialogVariants = scv({
  extendBase: props => ({
    close: miniButtonIconVariants({ size: props.size }),
    fullscreen: miniButtonIconVariants({ size: props.size }),
    cancel: miniButtonVariants({ size: props.size, variant: 'pure' }),
    confirm: miniButtonVariants({ size: props.size })
  }),
  slots: {
    overlay: [
      // 遮罩 = 一个 token：通道在 `--mask`、浓度在 `--mask-alpha`（0.25 亮 / 0.30 暗），
      // 不再由每个模态各自写 `bg-black/25 dark:bg-black/30`
      `fixed inset-0 z-base bg-mask`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0`
    ],
    popup: [
      `group fixed start-1/2 top-1/2 z-base flex flex-col w-max lt-sm:w-full lt-sm:min-w-auto lt-sm:max-w-full border bg-popover shadow-lg outline-none duration-200 rounded-lg`,
      `-translate-x-1/2 -translate-y-1/2 [&[dir=rtl]]:translate-x-1/2`,
      `data-[dragging]:transition-none data-[dragging]:select-none`,
      // Always present so the fullscreen visuals respond to the Aria
      // `data-fullscreen` attribute in both controlled and uncontrolled modes.
      `data-[fullscreen]:w-screen data-[fullscreen]:h-screen`,
      `data-[fullscreen]:max-w-none data-[fullscreen]:rounded-none data-[fullscreen]:shadow-none`,
      // Pin the enter/exit animation's Y translate to the resting centered
      // value (-50%): without it the keyframe defaults Y to 0 and a fullscreen
      // surface slides half the viewport during the animation, which reads as
      // a flash when closing.
      `data-[fullscreen]:data-[state=open]:slide-in-from-top-1/2`,
      `data-[fullscreen]:data-[state=closed]:slide-out-to-top-1/2`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2`
    ],
    header: `flex flex-col lt-sm:text-center data-[draggable]:cursor-grab data-[draggable]:touch-none group-data-[dragging]:cursor-grabbing`,
    title: `flex items-center font-semibold leading-none tracking-tight m-0`,
    icon: 'group-data-[type=info]:text-info group-data-[type=success]:text-success group-data-[type=warning]:text-warning group-data-[type=error]:text-destructive',
    description: `text-muted-foreground m-0`,
    close: `absolute`,
    fullscreen: `absolute`,
    // `overscroll-behavior: contain` keeps a scroll that reaches the content's
    // edge from chaining to the page behind — the body is deliberately left
    // scrollable on iOS so the browser chrome does not re-appear mid-open.
    content: `grow overflow-auto [overscroll-behavior:contain]`,
    footer: `flex justify-end lt-sm:flex-col-reverse`,
    cancel: '',
    confirm: ''
  },
  variants: {
    size: {
      xs: {
        popup: `gap-y-1.5 min-w-xs max-w-3xl px-2 py-1.5 text-2xs`,
        header: 'gap-y-1.5',
        title: 'gap-x-1.5 text-xs',
        description: 'text-2xs',
        close: 'end-1.5 top-1.5',
        fullscreen: 'end-8 top-1.5',
        footer: 'gap-1.5'
      },
      sm: {
        popup: `gap-y-2 min-w-sm max-w-4xl px-3 py-2 text-xs`,
        header: 'gap-y-2',
        title: 'gap-x-1.75 text-sm',
        description: 'text-xs',
        close: 'end-1.75 top-1.75',
        fullscreen: 'end-8 top-1.75',
        footer: 'gap-2'
      },
      md: {
        popup: `gap-y-3 min-w-md max-w-5xl px-4 py-3 text-sm`,
        header: 'gap-y-3',
        title: 'gap-x-2 text-base',
        description: 'text-sm',
        close: 'end-2 top-2',
        fullscreen: 'end-10 top-2',
        footer: 'gap-3'
      },
      lg: {
        popup: `gap-y-4 min-w-lg max-w-6xl px-5 py-4 text-base`,
        header: 'gap-y-4',
        title: 'gap-x-2.5 text-lg',
        description: 'text-base',
        close: 'end-2.5 top-2.5',
        fullscreen: 'end-10 top-2.5',
        footer: 'gap-4'
      },
      xl: {
        popup: `gap-y-5 min-w-xl max-w-7xl px-6 py-5 text-lg`,
        header: 'gap-y-5',
        title: 'gap-x-3 text-xl',
        description: 'text-lg',
        close: 'end-3 top-3',
        fullscreen: 'end-12 top-3',
        footer: 'gap-5'
      },
      '2xl': {
        popup: `gap-y-6 min-w-2xl max-w-7xl px-7 py-6 text-xl`,
        header: 'gap-y-6',
        title: 'gap-x-3.5 text-2xl',
        description: 'text-xl',
        close: 'end-4 top-4',
        fullscreen: 'end-13 top-4',
        footer: 'gap-6'
      }
    },
    pure: {
      true: {
        popup: 'p-0 gap-0 border-none'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
